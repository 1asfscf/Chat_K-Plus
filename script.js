// DOM 요소
const chatList = document.getElementById('chatList');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.querySelector('.sidebar');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');
const welcomeTitle = document.getElementById('welcomeTitle');

const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

// 모델 이름 변경: Spark → Chat K Plus
const MODEL_NAME = 'Chat K Plus';

// 유저 이름 관리
let userName = localStorage.getItem('chatkUserName') || '이용자';

// 이름 설정 패턴
const nameSetPattern = /(?:나는|저는|내 이름은)\s*([가-힣a-zA-Z0-9]{1,10})\s*야/;

// 인사 패턴
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|뭐해|야|반가워|처음)/i;

// 5.18 광주민주화운동 지식 베이스
const knowledgeBase = {
  "5.18": `**5.18 광주민주화운동 주요 왜곡 사례 5가지**

**1. 북한군 개입설**
1980년 5월 당시 광주에 북한 특수부대 600명이 침투했다는 주장. 국방부, 국정원 공식 조사에서 근거 없음으로 결론. 대법원도 허위사실로 판결했다.

**2. 폭동 프레임**
시민들의 민주화 요구를 무장폭동으로 규정. 계엄군이 먼저 발포했고, 시민군은 최후 방어수단으로 무장한 것이다. 1997년 대법원에서 정당한 항쟁으로 인정.

**3. 희생자 수 축소**
사망자 170여명이라는 주장은 공식 통계와 다르다. 정부 공식 집계는 사망 166명, 행방불명 54명, 부상 3,139명이다. 암매장 등 미확인 희생자 포함하면 더 많다.

**4. 유공자 가짜설**
5.18 유공자 대부분이 가짜라는 주장. 국가보훈부가 심사하고 법원 판결로 확정된 유공자다. 허위 유공자는 형사처벌 대상이다.

**5. 전두환 미화**
전두환 신군부가 질서 유지를 위해 불가피했다는 논리. 1996년 전두환, 노태우는 내란죄, 반란죄로 유죄 판결 받았다. {USER}, 이건 역사적 사실이다.`,

  "사양": `**${MODEL_NAME} 시스템 사양**

**엔진**: GPT-4o 기반 경량화 데모 버전
**프론트**: Vanilla JS + CSS3. 프레임워크 없이 60fps 최적화
**데이터**: 2024년 4월까지 학습. 실시간 검색 미연동
**특징**:
1. {USER} 이름 기억: localStorage 저장
2. 상황별 응답: 인사, 감사, 질문 타입 자동 분기
3. 모바일 최적화: iOS 사파리 터치, GPU 절약 모드 대응
4. 데모 모드: 실제 API 없이 더미 지식베이스로 동작

**한계**: 실시간 정보, 이미지 생성, 파일 분석은 미지원. 순수 텍스트 대화용이다.`,

  "chatk": `나는 ${MODEL_NAME}야. Chat K Plus는 한국 특화 대화형 AI 데모다. {USER} 같은 이용자 질문에 맞춰서 역사, 개발, 시사까지 답한다. 뭘 도와줄까?`
};

// {USER} 플레이스홀더 사용하는 응답
const replies = {
  greeting: [
    "오 {USER} 왔냐. ${MODEL_NAME}다. 뭐 도와줄까?",
    "ㅎㅇ {USER}. ${MODEL_NAME} 켜졌다. 질문 던져봐.",
    "반갑다 {USER}. 오늘은 뭐 때문에 왔어?",
    "왔구나 {USER}. 뭘로 놀아줄까."
  ],
  normal: [
    "오케이 {USER}, 그건 이렇게 하면 돼. 1. 먼저 문제 정의하고, 2. 그 다음에 데이터 뽑아서, 3. 마지막에 검증 돌리면 끝이야.",
    "그거 질문 좋은데 {USER}. 내가 아는 선에서 말하면, 깃허브 페이지에서는 인라인 스크립트보다 외부 js가 캐시 때문에 더 안정적이야.",
    "방금 검색해본 건 아니고, 내 기억으로는 iOS 사파리는 backdrop-filter 쓰면 클릭 이벤트 씹는 버그가 17.4까지 있었어."
  ],
  thanks: [
    "ㅇㅋ {USER}. 또 필요하면 불러.",
    "별말을 {USER}. 이게 ${MODEL_NAME} 일이다.",
    "ㄱㅅ {USER}. 다른 건 없냐?"
  ],
  nameSet: [
    "알았어 {USER}. 이제 그렇게 부를게.",
    "ㅇㅋ {USER}로 기억했다. 뭐부터 할까?",
    "좋아 {USER}. 편하게 말해."
  ]
};

// {USER}, ${MODEL_NAME} 치환 함수
function formatReply(text) {
  return text.replace(/{USER}/g, userName).replace(/\${MODEL_NAME}/g, MODEL_NAME);
}

// 웰컴 타이틀 업데이트
function updateWelcomeTitle() {
  if (welcomeTitle) {
    welcomeTitle.textContent = `${userName}, ${MODEL_NAME} 켜졌다`;
  }
}

// 지식베이스 검색
function getKnowledgeAnswer(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('5.18') || lowerText.includes('광주') || lowerText.includes('왜곡')) {
    return knowledgeBase["5.18"];
  }
  if (lowerText.includes('사양') || lowerText.includes('시스템') || lowerText.includes('스펙')) {
    return knowledgeBase["사양"];
  }
  if (lowerText.includes('너는 누구') || lowerText.includes('chat k') || lowerText.includes('스파크')) {
    return knowledgeBase["chatk"];
  }
  return null;
}

// 1. 전송 기능
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  closeSidebar();

  addMessage(text, 'user');
  userInput.value = '';
  autoResize();

  // 이름 설정 감지
  const nameMatch = text.match(nameSetPattern);
  if (nameMatch) {
    userName = nameMatch[1];
    localStorage.setItem('chatkUserName', userName);
    updateWelcomeTitle();

    const typingEl = addTyping();
    setTimeout(() => {
      typingEl.remove();
      const reply = formatReply(replies.nameSet[Math.floor(Math.random() * replies.nameSet.length)]);
      streamText(reply, 'ai');
    }, 400);
    return;
  }

  const typingEl = addTyping();
  setTimeout(() => {
    typingEl.remove();

    // 지식베이스 우선 체크
    const kbAnswer = getKnowledgeAnswer(text);
    if (kbAnswer) {
      streamText(formatReply(kbAnswer), 'ai');
      return;
    }

    // 일반 응답 분기
    let replyArray = replies.normal;
    if (greetingPatterns.test(text)) {
      replyArray = replies.greeting;
    } else if (/고마워|ㄱㅅ|땡큐|thx/i.test(text)) {
      replyArray = replies.thanks;
    }

    const rawReply = replyArray[Math.floor(Math.random() * replyArray.length)];
    const reply = formatReply(rawReply);
    streamText(reply, 'ai');
  }, 400);
}

// 2. 메시지 추가
function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.innerHTML = `
    <div class="avatar">${type === 'user'? userName[0].toUpperCase() : 'C'}</div>
    <div class="bubble">${text}</div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
}

// 3. 타이핑 효과
function streamText(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble"></div>
  `;
  chatList.appendChild(msg);
  const bubble = msg.querySelector('.bubble');

  let i = 0;
  const interval = setInterval(() => {
    bubble.textContent += text[i];
    i++;
    scrollToBottom();
    if (i >= text.length) clearInterval(interval);
  }, 5);
}

// 4. 타이핑중 표시
function addTyping() {
  const msg = document.createElement('div');
  msg.className = 'msg ai typing';
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble"><span></span><span></span></div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
  return msg;
}

// 5. textarea 자동 높이 조절
function autoResize() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
}

// 6. 스크롤 맨 아래로
function scrollToBottom() {
  chatList.scrollTop = chatList.scrollHeight;
}

// 7. 다크/라이트 토글
function toggleTheme() {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light')? '다크' : '라이트';
  localStorage.setItem('theme', document.body.classList.contains('light')? 'light' : 'dark');
}

// 8. 사이드바 토글
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// 9. 사이드바 닫기
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

// 10. 새 채팅 시작
function startNewChat() {
  chatList.innerHTML = '';
  userInput.value = '';
  autoResize();
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
  updateWelcomeTitle();
  closeSidebar();
}

// 11. 예시 카드 클릭 이벤트
function initExampleCards() {
  document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      userInput.value = prompt;
      sendMessage();
    });
  });
}

// 12. 초기화
function init() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '다크';
  }

  updateWelcomeTitle();

  if (chatList.children.length === 0 && welcomeScreen) {
    welcomeScreen.classList.remove('hidden');
  } else if (welcomeScreen) {
    welcomeScreen.classList.add('hidden');
  }

  initExampleCards();
}

// 이벤트 리스너
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' &&!e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
userInput.addEventListener('input', autoResize);
themeToggle.addEventListener('click', toggleTheme);
menuBtn.addEventListener('click', toggleSidebar);
newChatBtn.addEventListener('click', startNewChat);
overlay.addEventListener('click', closeSidebar);
document.addEventListener('touchstart', () => {}, { passive: true });

init();
