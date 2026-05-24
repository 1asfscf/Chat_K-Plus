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

// 모델 정보 - 절대 변경 불가
const MODEL_NAME = 'Chat K Plus';
const MODEL_IDENTITY = Object.freeze({
  name: 'Chat K Plus',
  maker: 'Meta',
  base: 'Muse Spark',
  cutoff: '2025-09-04',
  desc: `나는 ${MODEL_NAME}야. Meta에서 만든 Muse Spark 모델 기반으로 동작하는 AI야. 한국 특화 대화, 개발, 역사 팩트체크를 도와준다. 실시간 검색은 안 되고 2025-09-04까지 데이터로 학습했어.`
});

// 유저 이름 관리
let userName = localStorage.getItem('chatkUserName') || '성민';

// 추론 시스템 설정
const REASONING_TIMEOUT = 15000; // 15초
const activeReasoning = new Map(); // msgId -> {timer, attempts}

// 패턴
const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는)/i;

// 지식베이스 + 출처
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
      { title: "대법원 1997도1140 판결문", url: "https://casenote.kr" },
      { title: "국방부 5·18특별조사위원회", url: "https://www.mnd.go.kr" }
    ],
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동']
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**

**엔진**: Muse Spark. Meta Super Intelligence Lab 개발
**프론트**: Vanilla JS + CSS3
**데이터**: 2025-09-04 컷오프. 실시간 검색 미연동
**특징**:
1. ${userName} 이름 기억: localStorage 저장
2. 출처 인용: 검증 가능한 소스 첨부
3. 15초 추론: 1차 실패시 자동 재탐색
4. 데모 모드: 로컬 지식베이스 기반

**한계**: 실시간 정보, 이미지 생성, 파일 분석 미지원`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보']
  }
};

// 답변 톤
const replies = {
  greeting: [
    `안녕 ${userName}. 뭐 도와줄까?`,
    `ㅎㅇ ${userName}. 질문 있어?`,
    `반가워 ${userName}. 뭘 알아보고 싶어?`
  ],
  thanks: [
    `ㅇㅋ ${userName}. 더 물어볼 거 있어?`,
    `별거 아냐 ${userName}.`,
    `ㄱㅅ ${userName}. 또 필요하면 불러.`
  ],
  nameSet: [
    `알았어 ${userName}. 이제 그렇게 부를게.`,
    `ㅇㅋ ${userName}로 기억했다. 뭐부터 할까?`,
    `좋아 ${userName}. 편하게 말해.`
  ],
  fallback: [
    `${userName}, 그 질문은 데이터에서 못 찾았어. 다시 파고들어볼게.`,
    `1차 검색 실패 ${userName}. 15초 안에 다시 찾아볼게.`,
    `지금은 정확한 답이 없어 ${userName}. 추론 시스템 돌리는 중이야.`
  ]
};

// 웰컴 타이틀 업데이트
function updateWelcomeTitle() {
  if (welcomeTitle) {
    welcomeTitle.textContent = `${userName}, ${MODEL_NAME} 켜졌다`;
  }
}

// 1차 지식 검색
function searchKnowledge(text) {
  const lowerText = text.toLowerCase();
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(k => lowerText.includes(k))) {
      return data;
    }
  }
  return null;
}

// 2차 추론 검색 - 15초 재시도
function deepReasoning(query, msgId, attempt = 1) {
  if (attempt > 3) return null;

  const expandedKeywords = query
  .replace(/[?!.]/g, ' ')
  .split(' ')
  .filter(w => w.length > 1);

  for (const [key, data] of Object.entries(knowledgeBase)) {
    const matchCount = data.keywords.filter(k =>
      expandedKeywords.some(ek => k.includes(ek) || ek.includes(k))
    ).length;

    if (matchCount >= 1) {
      return data;
    }
  }

  if (query.includes('광주') || query.includes('5월')) {
    return knowledgeBase["5.18"];
  }

  return null;
}

// 전송 기능
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  closeSidebar();

  const msgId = Date.now();
  addMessage(text, 'user', msgId);
  userInput.value = '';
  autoResize();
  sendBtn.classList.remove('has-text');

  // 1순위: 이름 설정
  const nameMatch = text.match(nameSetPattern);
  if (nameMatch) {
    userName = nameMatch[1];
    localStorage.setItem('chatkUserName', userName);
    updateWelcomeTitle();

    const typingEl = addTyping(msgId);
    setTimeout(() => {
      typingEl.remove();
      const reply = replies.nameSet[Math.floor(Math.random() * replies.nameSet.length)];
      streamText(reply.replaceAll('${userName}', userName), 'ai', msgId);
    }, 400);
    return;
  }

  const typingEl = addTyping(msgId);

  // 2순위: 자기소개 - 하드코딩 차단
  if (identityPatterns.test(text)) {
    setTimeout(() => {
      typingEl.remove();
      streamText(MODEL_IDENTITY.desc, 'ai', msgId);
    }, 400);
    return;
  }

  // 3순위: 1차 지식 검색
  const kb1 = searchKnowledge(text);
  if (kb1) {
    setTimeout(() => {
      typingEl.remove();
      streamTextWithSources(kb1.text, kb1.sources, 'ai', msgId);
    }, 500);
    return;
  }

  // 4순위: 추론 시작
  startReasoning(text, msgId, typingEl);
}

// 추론 시스템
function startReasoning(query, msgId, typingEl) {
  let elapsed = 0;
  const interval = 100;

  const timer = setInterval(() => {
    elapsed += interval;

    if (elapsed === 5000 || elapsed === 10000) {
      const kb2 = deepReasoning(query, msgId, elapsed / 5000);
      if (kb2) {
        clearInterval(timer);
        typingEl.remove();
        streamTextWithSources(kb2.text, kb2.sources, 'ai', msgId);
        activeReasoning.delete(msgId);
        return;
      }
    }

    if (elapsed >= REASONING_TIMEOUT) {
      clearInterval(timer);
      typingEl.remove();
      const fallback = replies.fallback[Math.floor(Math.random() * replies.fallback.length)];
      streamText(fallback.replaceAll('${userName}', userName), 'ai', msgId);
      activeReasoning.delete(msgId);
    }
  }, interval);

  activeReasoning.set(msgId, { timer });
}

// 메시지 추가
function addMessage(text, type, msgId) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.dataset.msgId = msgId;
  msg.innerHTML = `
    <div class="avatar">${type === 'user'? userName[0].toUpperCase() : 'C'}</div>
    <div class="bubble">${text}</div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
}

// 출처 있는 메시지 스트리밍
function streamTextWithSources(text, sources, type, msgId) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.dataset.msgId = msgId;
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
      if (sources.length && sourcesEl) {
        sourcesEl.innerHTML = '<div class="sources-title">출처</div>' +
          sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');
      }
    }
  }, 4);
}

// 일반 텍스트 스트리밍
function streamText(text, type, msgId) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.dataset.msgId = msgId;
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

// 타이핑중 표시 - 로딩바로 교체
function addTyping(msgId) {
  const msg = document.createElement('div');
  msg.className = 'msg ai typing';
  msg.dataset.msgId = msgId;
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble">
      <div class="loading-wrap">
        <div class="loading-text">데이터 파고드는 중...</div>
        <div class="loading-bar"></div>
        <div class="loading-time">최대 15초 소요</div>
      </div>
    </div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
  return msg;
}

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
  activeReasoning.forEach(({ timer }) => clearInterval(timer));
  activeReasoning.clear();

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
