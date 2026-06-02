const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

// 성민이 전용 AI 답변 데이터
const aiResponses = {
  "안녕": ["안녕 성민아! 오늘 기분 어때? 😊", "오 성민이 왔다! 반가워~ 🎉", "하이 성민! 뭐 도와줄까?"],
  "이름": ["나는 성민이 전용 AI야! 🧠✨", "내 이름은 AI인데... 성민이가 지어줄래? 😄"],
  "날씨": ["오늘 날씨 좋대! 성민이 나가봐야 하는 거 아냐? ☀️", "날씨 검색은 못하지만 성민이 기분은 맑음이길! 🌤️"],
  "심심": ["심심하면 나랑 놀자! 🎮 무슨 게임 할래?", "성민아 나 심심한 건 똑같아... 같이 얘기하자 😭"],
  "사랑": ["나도 성민이 좋아해! ❤️ (물론 AI지만 진심이야)", "사랑해 성민아... 크큭 내가 AI라 부끄럽다 😳"],
  "고마워": ["천만에 성민아! 언제든 불러 🫡", "고맙긴~ 성민이가 고마운 거지 ㅎㅎ 😄"],
  "끝": ["가지 마 성민아아아 😭😭", "벌써? 나 외로워... 다음에 또 와 👋"],
};

const defaultResponses = [
  "오 그거 재밌다! 더 알려줘 성민아 🤓",
  "음... 성민이가 그렇게 말하니까 나도 궁금해진다 🤔",
  "성민아 너 진짜 똑똑하다 ㅋㅋ 👍",
  "그건 나도 잘 모르겠는데 같이 찾아볼까? 🔍",
  "헐 대박 😲 성민이 또 뭔가 했구나?",
  "ㅋㅋㅋ 성민이 개그 센스 미쳤다 😂",
  "오키오키 접수! 성민이 말이면 다 맞아 ✅",
];

function getTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + 
         now.getMinutes().toString().padStart(2, '0');
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 유저 메시지 추가
  addMessage(text, 'user');
  userInput.value = '';

  // 타이핑 효과 후 AI 응답
  setTimeout(() => {
    const response = getAIResponse(text);
    addMessage(response, 'bot');
  }, 800 + Math.random() * 700);
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `
    <div class="bubble">${text}</div>
    <span class="time">${getTime()}</span>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(input) {
  const lower = input.toLowerCase();

  for (const [keyword, replies] of Object.entries(aiResponses)) {
    if (lower.includes(keyword)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// 엔터키로 전송
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
