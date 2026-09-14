const fs = require('fs');
const path = require('path');

// [안전장치] Gemini API 호출 및 자동 재시도 함수
async function callGeminiWithRetry(prompt, apiKey, maxRetries = 5, initialDelay = 3000) {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let currentModelIndex = 0;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const model = models[currentModelIndex];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        const isTemporary = [429, 500, 502, 503, 504].includes(response.status);
        if (isTemporary && attempt < maxRetries) {
          console.warn(`[Gemini AI ${model}] 축제 수집 중 일시적 과부하 (${response.status}). ${delay / 1000}초 후 재시도... (${attempt}/${maxRetries})`);
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
          if (attempt >= 2 && currentModelIndex < models.length - 1) {
            currentModelIndex++;
          }
          continue;
        }
        throw new Error(`Gemini API 호출 실패 (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        if (attempt < maxRetries) {
          console.warn(`[Gemini AI] 응답이 비어 있어 재시도합니다... (${attempt}/${maxRetries})`);
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
          continue;
        }
        throw new Error('Gemini API로부터 올바른 응답을 받지 못했습니다.');
      }

      return text;
    } catch (err) {
      if (attempt < maxRetries && (err.message.includes('fetch failed') || err.message.includes('network') || err.message.includes('ECONNRESET') || err.message.includes('ETIMEDOUT'))) {
        console.warn(`[네트워크 지연] 축제 수집 재시도 중: ${err.message}`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
}

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.log('[축제 자동화] GEMINI_API_KEY가 없어 기존 축제 목록을 유지합니다.');
    process.exit(0);
  }

  const cityInfoPath = path.resolve(__dirname, '../public/data/city-info.json');
  let cityInfo;
  try {
    const raw = fs.readFileSync(cityInfoPath, 'utf-8');
    cityInfo = JSON.parse(raw);
  } catch (err) {
    console.error('city-info.json 읽기 실패:', err.message);
    process.exit(1);
  }

  const items = Array.isArray(cityInfo) ? cityInfo : (cityInfo.items || []);

  // 한국 표준시(KST) 오늘 날짜 구하기
  const now = new Date();
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayStr = kstDate.toISOString().split('T')[0];
  const todayMs = new Date(todayStr).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // 기존 행사와 혜택 분리
  const currentEvents = items.filter((it) => it.category === 'event');
  const otherItems = items.filter((it) => it.category !== 'event');

  // 종료 후 3일 이상 지난 구형 행사는 제외하고, 진행 중이거나 앞으로 열릴 행사만 필터링
  const activeEvents = currentEvents.filter((ev) => {
    if (!ev.endDate || ev.endDate === '상시') return true;
    const endMs = new Date(ev.endDate).getTime();
    return (todayMs - endMs) <= (3 * oneDayMs); // 종료 후 3일까지는 '종료' 상태로 안내 후 정리
  });

  console.log(`[축제 자동화] 현재 활성 행사 수: ${activeEvents.length}개 (기준일: ${todayStr})`);

  // 활성 행사가 3개 이상으로 충분하면 추가 수집 없이 정리된 목록 저장
  if (activeEvents.length >= 4) {
    console.log('[축제 자동화] 활성 행사가 충분하여 기존 일정을 유지합니다.');
    items.length = 0;
    items.push(...activeEvents, ...otherItems);
    fs.writeFileSync(cityInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');
    process.exit(0);
  }

  // 행사가 부족한 경우 Gemini AI를 통해 동대문구 및 서울 동북권의 최신 축제 보충
  console.log('[축제 자동화] 새로운 최신 문화 축제를 탐색하여 보충합니다...');

  const existingNames = new Set(items.map((it) => (it.name || '').trim()));
  const existingNamesList = Array.from(existingNames).join(', ');

  const prompt = `너는 서울시 동대문구 생활 정보 포털의 문화행사 전문 큐레이터야.
오늘 날짜 기준은 [${todayStr}]이야.

현재 동대문구 및 인근 서울 동북권(성동구, 중랑구, 종로구, 중구 등)에서
지금 진행 중이거나 앞으로 1~2달 이내에 열릴 예정인 대표 시민 축제, 문화 예술 행사, 가족 참여 페스티벌 중 가장 가치 있는 최신 축제 2~3개를 추천해줘.

[이미 등록되어 제외할 축제 목록]:
${existingNamesList}

[필수 조건]:
1. 동대문구 관내 행사(배봉산, 장한로, 중랑천, 답십리 등)를 최우선으로 선별.
2. 관내 행사가 부족할 경우 인근 자치구의 유명 무료/저렴한 서울시민 축제(청계천, DDP, 서울숲, 뚝섬 등)로 선별.
3. 종료일(endDate)이 오늘(${todayStr})보다 미래인 행사만 선정.
4. 반드시 아래 JSON 배열 형식으로만 응답할 것 (마크다운 백틱 없이 순수 JSON만 출력).

[형식]:
[
  {
    "id": "event-auto-${Date.now()}-1",
    "name": "행사/축제명",
    "category": "event",
    "categoryLabel": "행사/축제",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "location": "구체적인 행사 장소",
    "target": "참여 대상 (예: 동대문구민, 어린이 가족 누구나)",
    "summary": "한 줄 핵심 요약 (구민 눈높이)",
    "detail": "상세 행사 프로그램, 볼거리, 즐길거리 및 준비물 팁",
    "badge": "핵심 배지 (예: 무료입장, 가을축제, D-Day 등)",
    "url": "공식 안내 또는 동대문구청 홈페이지 URL"
  }
]`;

  try {
    const rawResponse = await callGeminiWithRetry(prompt, geminiApiKey);
    let cleaned = rawResponse.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket >= firstBracket) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }

    const newEvents = JSON.parse(cleaned);
    if (Array.isArray(newEvents) && newEvents.length > 0) {
      let addedCount = 0;
      for (const ev of newEvents) {
        if (!existingNames.has((ev.name || '').trim())) {
          ev.category = 'event';
          ev.categoryLabel = '행사/축제';
          activeEvents.push(ev);
          existingNames.add(ev.name.trim());
          addedCount++;
          console.log(`[축제 추가] 새로운 행사 등록: ${ev.name} (${ev.startDate} ~ ${ev.endDate})`);
        }
      }

      // 시작일 빠른 순으로 정렬
      activeEvents.sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));

      // 합치기
      const updatedItems = [...activeEvents, ...otherItems];
      if (Array.isArray(cityInfo)) {
        cityInfo = updatedItems;
      } else {
        cityInfo.items = updatedItems;
      }

      fs.writeFileSync(cityInfoPath, JSON.stringify(cityInfo, null, 2) + '\n', 'utf-8');
      console.log(`[축제 자동화 완료] 총 ${addedCount}개의 최신 축제가 새롭게 등록되었습니다!`);
    } else {
      console.log('[축제 자동화] 추가할 새 행사가 없거나 형식이 올바르지 않아 기존 목록을 유지합니다.');
    }
  } catch (err) {
    console.error('[축제 자동화 오류]:', err.message);
    // 오류가 나도 사이트 배포가 중단되지 않도록 조용히 종료
    process.exit(0);
  }
}

main();
