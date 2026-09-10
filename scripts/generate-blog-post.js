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

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;

    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.
정보: ${JSON.stringify(latestItem, null, 2)}
아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---
(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
