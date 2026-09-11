const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // [1단계] 최신 데이터 확인
    const cityInfoPath = path.resolve(__dirname, '../public/data/city-info.json');
    if (!fs.existsSync(cityInfoPath)) {
      console.error('오류: public/data/city-info.json 파일을 찾을 수 없습니다.');
      process.exit(1);
    }

    const fileContent = fs.readFileSync(cityInfoPath, 'utf-8');
    const cityInfo = JSON.parse(fileContent);
    const items = Array.isArray(cityInfo) ? cityInfo : (cityInfo.items || []);

    if (items.length === 0) {
      console.log('데이터가 없습니다');
      process.exit(0);
    }

    const latestItem = items[items.length - 1];
    const targetName = (latestItem.name || '').trim();

    if (!targetName) {
      console.error('오류: 최신 데이터의 name 항목이 비어 있습니다.');
      process.exit(1);
    }

    const postsDir = path.resolve(__dirname, '../src/content/posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
    let alreadyExists = false;

    for (const file of postFiles) {
      const existingContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      if (existingContent.includes(targetName)) {
        alreadyExists = true;
        break;
      }
    }

    if (alreadyExists) {
      console.log('이미 작성된 글입니다');
      process.exit(0);
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
      process.exit(1);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    // 한국 표준시(KST, UTC+9) 기준 오늘 날짜 구하기
    const now = new Date();
    const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const today = kstDate.toISOString().split('T')[0];

    const prompt = `너는 동대문구 생활 정보 포털의 친절하고 전문적인 공식 블로그 에디터야.
아래 정부 지원금 및 복지 혜택 공공데이터를 바탕으로, 동대문구민과 서울시민이 쉽게 이해하고 바로 신청할 수 있는 정성스러운 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

[작성 가이드라인]
1. 제목: 클릭하고 싶고 친근한 제목 (예: "놓치면 손해! 동대문구민을 위한 OO 지원금 총정리")
2. 말투: 동네 이웃에게 상냥하게 설명해 주는 따뜻하고 신뢰감 있는 블로그 톤 (해요체)
3. 본문 구성:
   - 도입부: 이 지원금이 왜 필요한지, 어떤 혜택인지 따뜻한 인사말과 함께 소개
   - 1. 누가 받을 수 있나요? (지원 대상 및 자격 요건을 알기 쉽게 정리)
   - 2. 이 혜택을 꼭 챙겨야 하는 이유 3가지 (주민 입장에서의 실질적인 장점)
   - 3. 지원 혜택 및 금액 (얼마나, 어떻게 받는지)
   - 4. 신청 방법 및 신청 경로 안내 (온라인/방문 신청 방법 친절 안내)
4. 분량: 800자 이상의 충실하고 알찬 본문

반드시 아래 형식으로만 출력해줘 (다른 서두나 말머리 텍스트 없이):
---
title: (친근하고 유익한 제목)
date: ${today}
summary: (동대문구민을 위한 한 줄 요약)
category: 정보
tags: [동대문구, 지원금, 복지혜택, 관련키워드]
---
(본문 마크다운 내용)

마지막 줄에 반드시 FILENAME: ${today}-keyword 형식으로 파일명을 출력해줘. 키워드는 영문 소문자 단어 1~2개로.`;

    const response = await fetch(endpoint, {
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API 요청 실패 (상태 코드: ${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API로부터 응답 텍스트를 받지 못했습니다.');
    }

    // [3단계] 파일 저장 및 분리 처리
    let cleanedText = rawText.trim();
    cleanedText = cleanedText.replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // FILENAME 줄 분리
    const lines = cleanedText.split('\n');
    let extractedFilename = null;
    const contentLines = [];

    for (const line of lines) {
      const match = line.match(/^FILENAME\s*:\s*(.+)$/i);
      if (match) {
        extractedFilename = match[1].trim();
      } else {
        contentLines.push(line);
      }
    }

    let postBody = contentLines.join('\n').trim();

    // frontmatter delimiter (---) 확인 및 보정
    if (!postBody.startsWith('---')) {
      if (postBody.startsWith('title:')) {
        const parts = postBody.split('\n');
        const tagsIndex = parts.findIndex((p) => p.trim().startsWith('tags:'));
        if (tagsIndex !== -1) {
          parts.splice(0, 0, '---');
          parts.splice(tagsIndex + 2, 0, '---');
          postBody = parts.join('\n');
        } else {
          postBody = `---\n${postBody}\n---`;
        }
      }
    } else {
      const secondDash = postBody.indexOf('---', 3);
      if (secondDash === -1) {
        const parts = postBody.split('\n');
        const tagsIndex = parts.findIndex((p) => p.trim().startsWith('tags:'));
        if (tagsIndex !== -1) {
          parts.splice(tagsIndex + 1, 0, '---');
          postBody = parts.join('\n');
        }
      }
    }

    // 파일명 결정
    let finalFileName = extractedFilename;
    if (!finalFileName) {
      finalFileName = `${today}-service.md`;
    }

    if (!finalFileName.endsWith('.md')) {
      finalFileName += '.md';
    }

    // 파일명에 유효하지 않은 특수문자 제거
    finalFileName = finalFileName.replace(/[^a-zA-Z0-9._-]/g, '');

    // 중복 파일명 방지
    let targetFilePath = path.join(postsDir, finalFileName);
    if (fs.existsSync(targetFilePath)) {
      const base = finalFileName.replace(/\.md$/, '');
      finalFileName = `${base}-${Date.now()}.md`;
      targetFilePath = path.join(postsDir, finalFileName);
    }

    fs.writeFileSync(targetFilePath, postBody + '\n', 'utf-8');
    console.log(`블로그 글 생성 완료: ${finalFileName}`);
  } catch (error) {
    console.error('오류 발생:', error.message);
    process.exit(1);
  }
}

main();
