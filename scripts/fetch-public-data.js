const fs = require('fs');
const path = require('path');

// [제외 키워드] 도심/일반 구민과 전혀 무관한 특수 산업 및 직종
const EXCLUDED_KEYWORDS = [
  '어업', '어선', '원양', '해양', '선박', '수산물', '항만', '양식장',
  '광산', '광업', '탄광', '농약', '농경지', '가축', '축산', '도축',
  '방위산업', '수출지원', '산림조합', '임업'
];

// [타 지역 키워드] 서울/동대문 언급 없이 타 지역 주민만 대상으로 하는 경우 배제
const OTHER_REGIONS = [
  '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원',
  '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

// [생활 밀착형 키워드] 동대문구민과 서울시민이 실생활에서 돈 받고 혜택받는 핵심 분야
const LIFE_KEYWORDS = [
  '청년', '주거', '월세', '전세', '보증금', '주택', '출산', '임신', '양육',
  '육아', '아동', '어린이', '유아', '보육', '어르신', '노인', '기초연금',
  '취업', '일자리', '구직', '소상공인', '자영업', '근로', '장려금', '생계',
  '생활안정', '에너지', '난방비', '장학금', '교육비', '학비', '돌봄',
  '장애인', '한부모', '다자녀', '바우처', '건강검진', '의료비'
];

// 3단계 필터링 채점 함수
function evaluateItem(item) {
  const text = [
    item['서비스명'],
    item['서비스목적요약'],
    item['지원대상'],
    item['소관기관명'],
    item['부서명']
  ].filter(Boolean).join(' ');

  // 1. 제외 키워드 검사 (어선, 광산 등 탈락)
  if (EXCLUDED_KEYWORDS.some((kw) => text.includes(kw))) {
    return null;
  }

  // 2. 타 지역 전용 검사 (서울/동대문/전국 언급 없을 시 탈락)
  const mentionsSeoulOrDongdaemun = text.includes('서울') || text.includes('동대문');
  const mentionsOtherRegion = OTHER_REGIONS.some((r) => text.includes(r));
  if (mentionsOtherRegion && !mentionsSeoulOrDongdaemun) {
    return null;
  }

  // 3. 1순위: 동대문구 전용
  if (text.includes('동대문')) {
    return { item, tier: 1, reason: '동대문구 전용 혜택' };
  }

  // 4. 2순위: 서울시 지원 혜택
  if (text.includes('서울')) {
    return { item, tier: 2, reason: '서울시민 지원 혜택' };
  }

  // 5. 3순위: 전국 실생활 밀착형 복지 (청년, 주거, 출산, 어르신 등)
  const matchedKeywords = LIFE_KEYWORDS.filter((kw) => text.includes(kw));
  if (matchedKeywords.length > 0) {
    return {
      item,
      tier: 3,
      reason: `실생활 복지 (${matchedKeywords.slice(0, 2).join(', ')})`
    };
  }

  return null;
}

async function main() {
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!publicDataApiKey) {
    console.error('오류: PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const cityInfoPath = path.resolve(__dirname, '../public/data/city-info.json');
  let cityInfo;
  try {
    const originalFileContent = fs.readFileSync(cityInfoPath, 'utf-8');
    cityInfo = JSON.parse(originalFileContent);
  } catch (error) {
    console.error('기존 city-info.json 파일을 읽는 중 오류 발생:', error.message);
    process.exit(1);
  }

  const existingItems = Array.isArray(cityInfo) ? cityInfo : (cityInfo.items || []);
  const existingNames = new Set(
    existingItems
      .map((item) => (item.name || item['서비스명'] || '').trim())
      .filter(Boolean)
  );

  // [책장 넘기기] 마지막으로 확인했던 페이지 번호부터 탐색 시작 (기본값: 1페이지)
  let startPage = (cityInfo && cityInfo.lastPageChecked) ? Number(cityInfo.lastPageChecked) : 1;
  if (isNaN(startPage) || startPage < 1) startPage = 1;

  const endpoint = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
  let targetCandidate = null;
  let targetTierInfo = null;
  let matchedPage = startPage;

  // 최대 5페이지까지 서가를 넘기며 가장 적합한 혜택 탐색
  const maxPagesToSearch = 5;
  for (let p = 0; p < maxPagesToSearch; p++) {
    const currentPage = startPage + p;
    const queryParams = new URLSearchParams({
      page: String(currentPage),
      perPage: '50',
      returnType: 'JSON',
      serviceKey: publicDataApiKey
    });

    try {
      const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        console.warn(`페이지 ${currentPage} 요청 응답 이상 (${response.status})`);
        continue;
      }

      const apiData = await response.json();
      const rawList = Array.isArray(apiData)
        ? apiData
        : (apiData.data || apiData.items || []);

      if (!rawList || rawList.length === 0) {
        // 더 이상 데이터가 없으면 처음 페이지(1)로 순환
        startPage = 1;
        break;
      }

      // 3단계 필터링 및 기존 등록 여부 검사
      const evaluated = rawList
        .map(evaluateItem)
        .filter(Boolean)
        .filter((entry) => {
          const name = (entry.item['서비스명'] || entry.item.name || '').trim();
          return name && !existingNames.has(name);
        });

      if (evaluated.length > 0) {
        // 1순위(동대문) > 2순위(서울) > 3순위(전국 실생활) 순으로 정렬
        evaluated.sort((a, b) => a.tier - b.tier);
        targetCandidate = evaluated[0].item;
        targetTierInfo = evaluated[0];
        matchedPage = currentPage;
        break;
      }
    } catch (err) {
      console.warn(`페이지 ${currentPage} 탐색 중 오류:`, err.message);
    }
  }

  // [품질 안심 브레이크] 5페이지를 돌았는데도 적합한 지원금이 없으면 무리해서 쓰지 않고 대기
  if (!targetCandidate) {
    const nextPage = (startPage + maxPagesToSearch > 200) ? 1 : (startPage + maxPagesToSearch);
    cityInfo.lastPageChecked = nextPage;
    fs.writeFileSync(cityInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');
    console.log(`오늘은 적합한 실생활 지원금을 찾지 못하여 건너뜁니다. (다음 탐색 페이지: ${nextPage})`);
    process.exit(0);
  }

  console.log(`선정된 지원금: [Tier ${targetTierInfo.tier} | ${targetTierInfo.reason}] ${targetCandidate['서비스명']} (발견 페이지: ${matchedPage})`);

  // [Gemini AI] 선정된 알짜 지원금을 사이트 규격에 맞게 JSON 변환
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const prompt = `너는 동대문구 생활 정보 포털의 공공데이터 가공 전문가야.
아래 공공데이터 1건을 분석해서 동대문구민과 서울시민이 알기 쉬운 JSON 객체로 변환해줘. 형식:
{
  "id": 숫자 또는 고유문자열,
  "name": "서비스명",
  "category": "혜택",
  "categoryLabel": "지원금/혜택",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "location": "신청장소 또는 소관기관명",
  "target": "지원대상 (동대문구민이 이해하기 쉽게 요약)",
  "summary": "한 줄 핵심 요약",
  "link": "상세조회URL",
  "badge": "핵심 혜택 배지 문구 (예: 최대 50만원, 교통비 지원 등)"
}
startDate가 없으면 오늘 날짜, endDate가 없으면 "상시"로 넣어.
반드시 순수 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(targetCandidate, null, 2)}`;

  let processedItem;
  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패 (${geminiResponse.status}): ${errorText}`);
    }

    const geminiResult = await geminiResponse.json();
    const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error('올바른 응답을 받지 못했습니다.');

    let cleanedText = responseText.trim();
    cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    processedItem = JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini AI 가공 중 오류 발생:', error.message);
    process.exit(1);
  }

  // 데이터 저장 및 페이지 인덱스 업데이트
  try {
    if (!processedItem.url && processedItem.link) processedItem.url = processedItem.link;
    if (!processedItem.link && processedItem.url) processedItem.link = processedItem.url;

    const today = new Date().toISOString().split('T')[0];
    if (Array.isArray(cityInfo)) {
      cityInfo.push(processedItem);
    } else if (cityInfo && Array.isArray(cityInfo.items)) {
      cityInfo.items.push(processedItem);
      cityInfo.lastUpdated = today;
      // 다음 날은 현재 발견된 페이지 다음부터 탐색하도록 책장 위치 기록
      cityInfo.lastPageChecked = matchedPage + 1;
    }

    fs.writeFileSync(cityInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');

    const localInfoPath = path.resolve(__dirname, '../public/data/local-info.json');
    try {
      fs.writeFileSync(localInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');
    } catch (e) {
      // ignore
    }

    console.log(`성공적으로 추가되었습니다: ${processedItem.name} (다음 탐색 페이지: ${cityInfo.lastPageChecked})`);
  } catch (error) {
    console.error('데이터 저장 중 오류 발생:', error.message);
    process.exit(1);
  }
}

main();
