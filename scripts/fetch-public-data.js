const fs = require('fs');
const path = require('path');

async function main() {
  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!publicDataApiKey) {
    console.error('오류: PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const endpoint = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
  const queryParams = new URLSearchParams({
    page: '1',
    perPage: '20',
    returnType: 'JSON',
    serviceKey: publicDataApiKey
  });

  const apiUrl = `${endpoint}?${queryParams.toString()}`;

  let apiData;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`공공데이터 API 요청 실패 (상태 코드: ${response.status})`);
    }

    apiData = await response.json();
  } catch (error) {
    console.error('공공데이터 가져오기 중 오류 발생:', error.message);
    process.exit(1);
  }

  const rawList = Array.isArray(apiData)
    ? apiData
    : (apiData.data || apiData.items || []);

  if (!rawList || rawList.length === 0) {
    console.log('새로운 데이터가 없습니다');
    process.exit(0);
  }

  // 필터링: 서비스명, 서비스목적요약, 지원대상, 소관기관명 검사
  function hasKeyword(item, keyword) {
    const fields = [
      item['서비스명'],
      item['서비스목적요약'],
      item['지원대상'],
      item['소관기관명']
    ];
    return fields.some((val) => typeof val === 'string' && val.includes(keyword));
  }

  let candidates = rawList;
  const dongdaemunItems = candidates.filter((item) => hasKeyword(item, '동대문'));

  if (dongdaemunItems.length > 0) {
    candidates = dongdaemunItems;
  } else {
    const seoulItems = candidates.filter((item) => hasKeyword(item, '서울'));
    if (seoulItems.length > 0) {
      candidates = seoulItems;
    }
  }

  // [2단계] 기존 데이터와 비교
  const cityInfoPath = path.resolve(__dirname, '../public/data/city-info.json');
  let originalFileContent;
  let cityInfo;

  try {
    originalFileContent = fs.readFileSync(cityInfoPath, 'utf-8');
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

  const newItems = candidates.filter((item) => {
    const name = (item['서비스명'] || item.name || '').trim();
    return name && !existingNames.has(name);
  });

  if (newItems.length === 0) {
    console.log('새로운 데이터가 없습니다');
    process.exit(0);
  }

  const targetItem = newItems[0];

  // [3단계] Gemini AI로 새 항목 1개만 가공
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(targetItem, null, 2)}`;

  let processedItem;
  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패 (${geminiResponse.status}): ${errorText}`);
    }

    const geminiResult = await geminiResponse.json();
    const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Gemini API로부터 올바른 텍스트 응답을 받지 못했습니다.');
    }

    // 마크다운 코드블록 제거 및 JSON 파싱
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
    // 에러 발생 시 기존 city-info.json 유지
    process.exit(1);
  }

  // [4단계] 기존 데이터에 추가
  try {
    if (!processedItem || typeof processedItem !== 'object') {
      throw new Error('가공된 데이터가 유효한 객체가 아닙니다.');
    }

    // url / link 필드 상호 호환 유지
    if (!processedItem.url && processedItem.link) {
      processedItem.url = processedItem.link;
    }
    if (!processedItem.link && processedItem.url) {
      processedItem.link = processedItem.url;
    }

    if (Array.isArray(cityInfo)) {
      cityInfo.push(processedItem);
    } else if (cityInfo && Array.isArray(cityInfo.items)) {
      cityInfo.items.push(processedItem);
    } else {
      throw new Error('city-info.json의 데이터 형식이 올바르지 않습니다.');
    }

    fs.writeFileSync(cityInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');
    console.log(`성공적으로 추가되었습니다: ${processedItem.name}`);
  } catch (error) {
    console.error('city-info.json 저장 중 오류 발생:', error.message);
    // 에러 발생 시 기존 내용 유지
    process.exit(1);
  }
}

main();
