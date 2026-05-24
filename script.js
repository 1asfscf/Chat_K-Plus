// DOM 요소
const chatList = document.getElementById('chatList');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.querySelector('.sidebar');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');

const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

// 유저 이름 관리 - localStorage 저장
let userName = localStorage.getItem('sparkUserName') || '이용자';

// 이름 설정 패턴: 나는 철수야, 저는 민수야, 내 이름은 영희야
const nameSetPattern = /(?:나는|저는|내 이름은)\s*([가-힣a-zA-Z0-9]{1,10})\s*야/;

// 인사 패턴
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|뭐해|야|반가워|처음)/i;

// {USER} 플레이스홀더 사용하는 응답
const replies = {
  greeting: [
    "오 {USER} 왔냐. 뭐 도와줄까?",
    "ㅎㅇ {USER}. 불꽃 켜졌다. 질문 던져봐.",
    "반갑다 {USER}. 오늘은 뭐 때문에 왔어?",
    "왔구나 {USER}. 심심했냐? 뭘로 놀아줄까."
  ],
  normal: [
    "오케이 {USER}, 그건 이렇게 하면 돼. 1. 먼저 문제 정의하고, 2. 그 다음에 데이터 뽑아서, 3. 마지막에 검증 돌리면 끝이야.",
    "그거 질문 좋은데 {USER}. 내가 아는 선에서 말하면, 깃허브 페이지에서는 인라인 스크립트보다 외부 js가 캐시 때문에 더 안정적이야.",
    "방금 검색해본 건 아니고, 내 기억으로는 iOS 사파리는 backdrop-filter 쓰면 클릭 이벤트 씹는 버그가 17.4까지 있었어."
  ],
  thanks: [
    "ㅇㅋ {USER}. 또 필요하면 불러.",
    "별말을 {USER}. 이게 Spark 일이다.",
    "ㄱㅅ {USER}. 다른 건 없냐?"
  ],
  nameSet: [
    "알았어 {USER}. 이제 그렇게 부를게.",
    "ㅇㅋ {USER}로 기억했다. 뭐부터 할까?",
    "좋아 {USER}. 편하게 말해."
  ]
};

// {USER} 치환 함수
function formatReply(text) {
  return text.replace(/{USER}/g, userName);
}

// 1. 전송 기능 - 이름 설정 로직 추가
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  closeSidebar();

  addMessage(text, 'user');
  userInput.value = '';
  autoResize();

  // 이름 설정 감지: "나는 철수야"
  const nameMatch = text.match(nameSetPattern);
  if (nameMatch) {
    userName = nameMatch[1];
    localStorage.setItem('sparkUserName', userName);

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

    let replyArray = replies.normal;
    if (greetingPatterns.test(text)) {
      replyArray = replies.greeting;
    } else if (/고마워|ㄱㅅ|땡큐|thx/i.test(text)) {
      replyArray = replies.thanks;
    }

    const rawReply = replyArray[Math.floor(Math.random() * replyArray.length)];
    const reply = formatReply(rawReply); // {USER} 치환
    streamText(reply, 'ai');
  }, 400);
}

// 2. 메시지 추가
function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.innerHTML = `
    <div class="avatar">${type === 'user'? userName[0] : 'S'}</div>
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
    <div class="avatar">S</div>
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
    <div class="avatar">S</div>
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

// 10. 새 채팅 시작 - 이름은 유지
function startNewChat() {
  chatList.innerHTML = '';
  userInput.value = '';
  autoResize();
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
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
