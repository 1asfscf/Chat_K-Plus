// DOM 요소
const chatList = document.getElementById('chatList');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.querySelector('.sidebar');

// 자연스러운 더미 응답 3종
const dummyReplies = [
  "오케이 성민아, 그건 이렇게 하면 돼. 1. 먼저 문제 정의하고, 2. 그 다음에 데이터 뽑아서, 3. 마지막에 검증 돌리면 끝이야.",
  "그거 질문 좋은데. 내가 아는 선에서 말하면, 깃허브 페이지에서는 인라인 스크립트보다 외부 js가 캐시 때문에 더 안정적이야.",
  "방금 검색해본 건 아니고, 내 기억으로는 iOS 사파리는 backdrop-filter 쓰면 클릭 이벤트 씹는 버그가 17.4까지 있었어."
];

// 1. 전송 기능
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  autoResize();

  // 더미 AI 응답
  const typingEl = addTyping();
  setTimeout(() => {
    typingEl.remove();
    const reply = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];
    streamText(reply, 'ai');
  }, 400);
}

// 2. 메시지 추가
function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.innerHTML = `
    <div class="avatar">${type === 'user'? 'U' : 'S'}</div>
    <div class="bubble">${text}</div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
}

// 3. 타이핑 효과 - 랙 없애려고 5ms로 수정
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
  }, 5); // 25ms → 5ms로 랙 제거
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

// 8. 모바일 사이드바 토글
function toggleSidebar() {
  sidebar.classList.toggle('open');
}

// 9. 초기화 - 저장된 테마 불러오기
function init() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '다크';
  }
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

// iOS 300ms 딜레이 제거
document.addEventListener('touchstart', () => {}, { passive: true });

init();
