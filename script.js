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

// 모델 이름
const MODEL_NAME = 'Chat K Plus';

// 유저 이름 관리
let userName = localStorage.getItem('chatkUserName') || '성민';

// 이름 설정 패턴
const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;

// 인사 패턴
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|뭐해|야|반가워|처음)/i;

// 5.18 지식베이스 + 출처
const knowledgeBase = {
  "5.18": {
    text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**

**1. 북한군 개입설**
1980년 5월 당시 광주에 북한 특수부대 600명이 침투했다는 주장. 국방부, 국정원 공식 조사에서 근거 없음으로 결론. 대법원도 허위사실로 판결했다.

**2. 폭동 프레임**
시민들의 민주화 요구를 무장폭동으로 규정. 계엄군이 먼저 발포했고, 시민군은 최후 방어수단으로 무장한 것이다. 1997년 대법원에서 정당한 항쟁으로 인정.

**3. 희생자 수 축소**
사망자 170여명이라는 주장은 공식 통계와 다르다. 정부 공식 집계는 사망 166명, 행방불명 54명, 부상 3,139명이다. 암매장 등 미확인 희생자 포함하면 더 많다.

**4. 유공자 가짜설**
5.18 유공자 대부분이 가짜라는 주장. 국가보훈부가 심사하고 법원 판결로 확정된 유공자다. 허위 유공자는 형사처벌 대상이다.

**5. 전두환 미화**
전두환 신군부가 질서 유지를 위해 불가피했다는 논리. 1996년 전두환, 노태우는 내란죄, 반란죄로 유죄 판결 받았다.`,
    sources: [
      { title: "5·18민주화운동진상규명조사위원회 보고서", url: "https://www.518commission.go.kr" },
      { title: "대법원 1997도1140 판결", url: "https://casenote.kr" },
      { title: "국방부 5·18특별조사위원회", url: "https://www.mnd.go.kr" }
    ]
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**

**엔진**: GPT-4o 기반 경량화 데모
**프론트**: Vanilla JS + CSS3. 프레임워크 없이 60fps 최적화
**데이터**: 2024년 4월 학습 기준. 실시간 검색 미연동
**특징**:
1. ${userName} 이름 기억: localStorage 저장
2. 출처 인용: 주요 팩트에 검증 가능한 소스 첨부
3. 모바일 최적화: iOS 사파리 터치 대응, GPU 절약
4. 데모 모드: 실제 API 없이 로컬 지식베이스 동작

**한계**: 실시간 정보, 이미지 생성, 파일 분석 미지원`,
    sources: []
  }
};

// 답변 스타일 정리
const replies = {
  greeting: [
    `${userName} 왔어? ${MODEL_NAME}이야. 뭐 물어볼래?`,
    `ㅎㅇ ${userName}. ${MODEL_NAME} 켜졌다. 질문해봐.`,
    `반갑다 ${userName}. 오늘은 뭘로 도와줄까?`
  ],
  thanks: [
    `ㅇㅋ ${userName}. 더 필요하면 말해.`,
    `별거 아니야 ${userName}. 이게 내 일이지.`,
    `ㄱㅅ ${userName}. 다른 거 없어?`
  ],
  nameSet: [
    `알았어 ${userName}. 이제 그렇게 부를게.`,
    `ㅇㅋ ${userName}로 저장했다. 뭐부터 할까?`,
    `좋아 ${userName}. 편하게 질문해.`
  ],
  normal: [
    `${userName}, 그건 이렇게 접근하면 돼. 핵심만 말하면 ${MODEL_NAME}는 구조화해서 답한다.`,
    `질문 좋다 ${userName}. 내가 아는 선에서 정리해줄게.`,
    `${userName}, 그 부분은 팩트체크가 중요해. 출처 확인하고 말해줄게.`
  ]
};

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
  return null;
}

// 전송 기능
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  closeSidebar();

  addMessage(text, 'user');
  userInput.value = '';
  autoResize();
  sendBtn.classList.remove('has-text');

  // 이름 설정 감지
  const nameMatch = text.match(nameSetPattern);
  if (nameMatch) {
    userName = nameMatch[1];
    localStorage.setItem('chatkUserName', userName);
    updateWelcomeTitle();

    const typingEl = addTyping();
    setTimeout(() => {
      typingEl.remove();
      const reply = replies.nameSet[Math.floor(Math.random() * replies.nameSet.length)];
      streamText(reply.replaceAll('${userName}', userName), 'ai');
    }, 400);
    return;
  }

  const typingEl = addTyping();
  setTimeout(() => {
    typingEl.remove();

    // 지식베이스 우선
    const kb = getKnowledgeAnswer(text);
    if (kb) {
      streamTextWithSources(kb.text, kb.sources, 'ai');
      return;
    }

    // 일반 응답
    let replyArray = replies.normal;
    if (greetingPatterns.test(text)) {
      replyArray = replies.greeting;
    } else if (/고마워|ㄱㅅ|땡큐|thx/i.test(text)) {
      replyArray = replies.thanks;
    }

    const rawReply = replyArray[Math.floor(Math.random() * replyArray.length)];
    streamText(rawReply.replaceAll('${userName}', userName), 'ai');
  }, 500);
}

// 메시지 추가
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

// 출처 있는 메시지 스트리밍
function streamTextWithSources(text, sources, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble">
      <div class="msg-text"></div>
      ${sources.length? '<div class="sources"></div>' : ''}
    </div>
  `;
  chatList.appendChild(msg);
  const bubble = msg.querySelector('.msg-text');
  const sourcesEl = msg.querySelector('.sources');

  let i = 0;
  const interval = setInterval(() => {
    bubble.textContent += text[i];
    i++;
    scrollToBottom();
    if (i >= text.length) {
      clearInterval(interval);
      // 출처 렌더링
      if (sources.length && sourcesEl) {
        sourcesEl.innerHTML = '<div class="sources-title">출처</div>' +
          sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');
      }
    }
  }, 4);
}

// 일반 텍스트 스트리밍
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

// 타이핑중 표시
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

// textarea 자동 높이 + 버튼 활성화
function autoResize() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
  if (userInput.value.trim()) {
    sendBtn.classList.add('has-text');
  } else {
    sendBtn.classList.remove('has-text');
  }
}

function scrollToBottom() {
  chatList.scrollTop = chatList.scrollHeight;
}

// 테마 토글
function toggleTheme() {
  document.body.classList.toggle('light');
  const icon = themeToggle.querySelector('.icon');
  const text = themeToggle.querySelector('.text');
  if (document.body.classList.contains('light')) {
    icon.textContent = '☀️';
    text.textContent = '라이트';
  } else {
    icon.textContent = '🌙';
    text.textContent = '다크';
  }
  localStorage.setItem('theme', document.body.classList.contains('light')? 'light' : 'dark');
}

function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

function startNewChat() {
  chatList.innerHTML = '';
  userInput.value = '';
  autoResize();
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
  updateWelcomeTitle();
  closeSidebar();
}

function initExampleCards() {
  document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      userInput.value = prompt;
      autoResize();
      sendMessage();
    });
  });
}

function init() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    const icon = themeToggle.querySelector('.icon');
    const text = themeToggle.querySelector('.text');
    icon.textContent = '☀️';
    text.textContent = '라이트';
  }

  updateWelcomeTitle();

  if (chatList.children.length === 0 && welcomeScreen) {
    welcomeScreen.classList.remove('hidden');
  } else if (welcomeScreen) {
    welcomeScreen.classList.add('hidden');
  }

  initExampleCards();
}

// 이벤트
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

init();
