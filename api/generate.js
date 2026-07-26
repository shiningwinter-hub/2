export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ message: "타이머 시간 동안 정말 잘 집중해주셨네요! 대체로 조용한 환경이었어요. 덕분에 잘 잤습니다 🐰✨" });
  }

  const prompt = `너는 푹 자고 일어난 동물이야. 사용자가 미션을 성공적으로 마쳤어. 짧고 귀엽게 칭찬하는 일기를 한국어로 2문장 이내로 작성해줘. 이모지도 꼭 사용해줘.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const message = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error: '오류 발생' });
  }
}
