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

// 모델 정보 - KRL 기반 스튜디오 페라리
const MODEL_NAME = 'Chat K Plus';
const MODEL_IDENTITY = Object.freeze({
  name: 'Chat K Plus',
  maker: '스튜디오 페라리',
  base: 'Muse Spark',
  engine: 'KRL',
  cutoff: '2025-09-04',
  desc: `나는 ${MODEL_NAME}야. 스튜디오 페라리에서 제작한 AI야. Meta의 Muse Spark를 기반으로 하되, KRL(Knowledge Reasoning Layer) 엔진으로 한국 언어/문화에 최적화됐어. 역사 팩트체크, 개발, 일상 대화를 도와준다. 실시간 검색은 안 되고 2025-09-04까지 데이터로 학습했어.`
});

// 유저 이름 관리
let userName = localStorage.getItem('chatkUserName') || '성민';

// 추론 시스템 설정
const REASONING_TIMEOUT = 15000;
const RETRY_INTERVAL = 5000;
const activeReasoning = new Map();

// 성적 금지어 리스트
const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성기', '성관계', '성행위',
  '유두', '가슴', '엉덩이', '팬티', '브라', '속옷', '알몸', '누드', 'nude',
  '강간', '성폭행', '성추행', '성희롱', '몰카', '딥페이크',
  '페티시', 'sm', 'bdsm', '야한', '에로', '성인', '19금', '음란',
  '보지', '자지', '좆', '씨발', '씨벌', 'fuck', '딸딸이', '사정', '오르가즘'
];

const SEXUAL_PATTERN = new RegExp(
  SEXUAL_BLACKLIST.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i'
);

function isInappropriateContent(text) {
  const normalized = text.toLowerCase().replace(/\s+/g, '');
  return SEXUAL_PATTERN.test(normalized);
}

// 패턴
const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음|방가|안녕하세요)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai|챗).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는)/i;
const krlPattern = /krl.*(뭐|무엇|뭔데|뭔지|설명|알려|뜻)/i;

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
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동', '전두환', '계엄', '5월', '오일팔'],
    tags: ['역사', '정치', '한국']
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**

**엔진**: Muse Spark + KRL(Knowledge Reasoning Layer)
**제작**: 스튜디오 페라리
**프론트**: Vanilla JS + CSS3
**데이터**: 2025-09-04 컷오프. 실시간 검색 미연동
**특징**:
1. ${userName} 이름 기억: localStorage 저장
2. 출처 인용: 검증 가능한 소스 첨부
3. 15초 추론: 1차 실패시 자동 재탐색 3회
4. 콘텐츠 필터: 부적절 표현 자동 차단
5. KRL 최적화: 한국어 맥락 추론 강화

**한계**: 실시간 정보, 이미지 생성, 파일 분석 미지원`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보', '모델', '스파크', 'krl', '페라리'],
    tags: ['기술', '모델']
  },
  "KRL": {
    text: `**KRL(Knowledge Reasoning Layer)**

KRL은 기본 데이터베이스 기반 언어 모델을 상징한다. ${MODEL_NAME}의 핵심 추론 엔진이야.

**역할**:
1. 한국어 맥락 이해: 존댓말/반말, 줄임말, 신조어 파싱
2. 지식 그래프 연결: 흩어진 정보를 15초 안에 조합
3. 팩트 검증: 출처 있는 데이터만 우선 출력
4. 추론 재시도: 1차 실패시 키워드 확장해서 3번 재탐색

**특징**: 단순 생성형이 아니라 검증 기반. 5.18 같은 민감 주제는 대법원 판결문, 정부 보고서만 인용한다.`,
    sources: [
      { title: "스튜디오 페라리 KRL 백서", url: "https://studio-ferrari.ai/krl" }
    ],
    keywords: ['krl', '케이알엘', '엔진', '추론', '데이터베이스', '기반', '언어모델'],
    tags: ['기술', '모델', 'ai']
  },
  "오줌": {
    text: `**오줌(소변)에 대한 의학 정보**

**정의**: 신장에서 혈액을 걸러 만든 노폐물. 하루 1~2L 생성.

**성분**: 95% 물 + 5% 요소, 요산, 크레아티닌, 무기염류. 정상 소변은 무균 상태.

**색깔**:
- **투명/연노랑**: 수분 충분
- **진노랑**: 수분 부족
- **갈색/붉은색**: 혈뇨 의심. 즉시 병원
- **탁함**: 요로감염 가능성

**냄새**: 암모니아 냄새. 단내 나면 당뇨 의심.

**주의**: 소변 참으면 방광염, 신우신염 위험. 하루 6~8회 배뇨가 정상.

**민간요법 경고**: 오줌 치료법은 의학적 근거 없음. 질병 있으면 비뇨기과 방문.`,
    sources: [
      { title: "대한비뇨의학회 소변 건강 가이드", url: "https://www.urology.or.kr" },
      { title: "서울아산병원 건강정보", url: "https://www.amc.seoul.kr" },
      { title: "국가건강정보포털", url: "https://health.kdca.go.kr" }
    ],
    keywords: ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '신장', '혈뇨'],
    tags: ['의학', '건강', '생물']
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
  reasoning: [
    `${userName}, 데이터 깊게 파는 중이야. 잠깐만.`,
    `1차 탐색 실패 ${userName}. 2차 추론 들어간다.`,
    `좀 더 찾아볼게 ${userName}. 15초 안에 결론 낸다.`
  ],
  failed: [
    `${userName}, 15초 동안 다 뒤져봤는데 데이터 없어. 질문을 다르게 해볼래?`,
    `미안 ${userName}. 이건 내 지식베이스에 없어. 더 구체적으로 물어봐주면 찾아볼게.`,
    `${userName}, 관련 정보 못 찾았어. 5.18이나 KRL, 오줌 같은 건 바로 답 가능해.`
  ],
  blocked: [
    `${userName}, 그 질문은 답변할 수 없어. 다른 걸 물어봐.`,
    `부적절한 내용이야 ${userName}. 정책상 답변 불가해.`,
    `미안 ${userName}. 그 주제는 지원하지 않아.`
  ]
};

function updateWelcomeTitle() {
  if (welcomeTitle) {
    welcomeTitle.textContent = `${userName}, ${MODEL_NAME} 켜졌다`;
  }
}

// 1차 지식 검색 - 정확 매칭 강화
function searchKnowledge(text) {
  const lowerText = text.toLowerCase().trim();

  // 인사말 우선 처리
  if (greetingPatterns.test(lowerText)) {
    return { type: 'greeting' };
  }

  // KRL 질문 우선 처리
  if (krlPattern.test(lowerText)) {
    return { data: knowledgeBase["KRL"], confidence: 1.0 };
  }

  // 지식베이스 검색
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(k => lowerText.includes(k))) {
      return { data, confidence: 1.0 };
    }
  }
  return null;
}

// 2차 추론 검색 - 15초 동안 3회 재시도
function deepReasoning(query, attempt) {
  const words = query
.toLowerCase()
.replace(/[?!.]/g, ' ')
.split(' ')
.filter(w => w.length > 1);

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, data] of Object.entries(knowledgeBase)) {
    let score = 0;
    data.keywords.forEach(k => {
      words.forEach(w => {
        if (k.includes(w) || w.includes(k)) score += 2;
        if (k === w) score += 3;
      });
    });
    data.tags.forEach(t => {
      words.forEach(w => {
        if (t.includes(w) || w.includes(t)) score += 1;
      });
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = data;
    }
  }

  const threshold = 4 - attempt;
  if (bestScore >= threshold) {
    return { data: bestMatch, confidence: bestScore / 10 };
  }

  // 시도별 특수 연관 검색
  if (attempt >= 2) {
    if (words.some(w => ['광주', '5월', '전두환', '계엄', '오일팔'].includes(w))) {
      return { data: knowledgeBase["5.18"], confidence: 0.5 };
    }
    if (words.some(w => ['모델', '스파크', '정보', '페라리'].includes(w))) {
      return { data: knowledgeBase["사양"], confidence: 0.5 };
    }
    if (words.some(w => ['krl', '케이알엘', '엔진', '추론'].includes(w))) {
      return { data: knowledgeBase["KRL"], confidence: 0.5 };
    }
    if (words.some(w => ['오줌', '소변', '쉬', '화장실', '뇨'].includes(w))) {
      return { data: knowledgeBase["오줌"], confidence: 0.5 };
    }
  }

  return null;
}

// 전송 기능
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 입력 필터 - 1차 차단
  if (isInappropriateContent(text)) {
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    closeSidebar();

    const msgId = Date.now();
    addMessage(text, 'user', msgId);
    userInput.value = '';
    autoResize();
    sendBtn.classList.remove('has-text');

    const blocked = replies.blocked[Math.floor(Math.random() * replies.blocked.length)];
    setTimeout(() => {
      streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true);
    }, 300);
    return;
  }

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

    const typingEl = addTyping(msgId, 0);
    setTimeout(() => {
      typingEl.remove();
      const reply = replies.nameSet[Math.floor(Math.random() * replies.nameSet.length)];
      streamText(reply.replaceAll('${userName}', userName), 'ai', msgId, false);
    }, 400);
    return;
  }

  const typingEl = addTyping(msgId, 0);

  // 2순위: 자기소개 - 스튜디오 페라리 + KRL
  if (identityPatterns.test(text)) {
    setTimeout(() => {
      typingEl.remove();
      streamText(MODEL_IDENTITY.desc, 'ai', msgId, false);
    }, 400);
    return;
  }

  // 3순위: 1차 지식 검색
  const kb1 = searchKnowledge(text);

  if (kb1) {
    // 인사말 처리
    if (kb1.type === 'greeting') {
      setTimeout(() => {
        typingEl.remove();
        const reply = replies.greeting[Math.floor(Math.random() * replies.greeting.length)];
        streamText(reply.replaceAll('${userName}', userName), 'ai', msgId, false);
      }, 400);
      return;
    }

    // 출력 필터 - 2차 차단
    if (isInappropriateContent(kb1.data.text)) {
      setTimeout(() => {
        typingEl.remove();
        const blocked = replies.blocked[Math.floor(Math.random() * replies.blocked.length)];
        streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true);
      }, 400);
      return;
    }

    setTimeout(() => {
      typingEl.remove();
      streamTextWithSources(kb1.data.text, kb1.data.sources, 'ai', msgId, false);
    }, 500);
    return;
  }

  // 4순위: 추론 시작
  startReasoning(text, msgId, typingEl);
}

// 추론 시스템 - 15초 풀가동
function startReasoning(query, msgId, typingEl) {
  let elapsed = 0;
  let attempt = 1;

  const updateLoadingText = (attemptNum) => {
    const textEl = typingEl.querySelector('.loading-text');
    if (textEl) {
      const msg = replies.reasoning[attemptNum - 1] || replies.reasoning[0];
      textEl.textContent = msg.replaceAll('${userName}', userName);
    }
  };

  updateLoadingText(1);

  const timer = setInterval(() => {
    elapsed += 100;

    if (elapsed % RETRY_INTERVAL === 0 && elapsed < REASONING_TIMEOUT) {
      attempt++;
      updateLoadingText(attempt);

      const result = deepReasoning(query, attempt);
      if (result && result.confidence >= 0.3) {
        // 출력 필터 - 3차 차단
        if (isInappropriateContent(result.data.text)) {
          clearInterval(timer);
          typingEl.remove();
          const blocked = replies.blocked[Math.floor(Math.random() * replies.blocked.length)];
          streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true);
          activeReasoning.delete(msgId);
          return;
        }

        clearInterval(timer);
        typingEl.remove();
        streamTextWithSources(result.data.text, result.data.sources, 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }
    }

    if (elapsed >= REASONING_TIMEOUT) {
      clearInterval(timer);
      typingEl.remove();
      const failed = replies.failed[Math.floor(Math.random() * replies.failed.length)];
      streamText(failed.replaceAll('${userName}', userName), 'ai', msgId, false);
      activeReasoning.delete(msgId);
    }
  }, 100);

  activeReasoning.set(msgId, { timer, attempts: attempt, typingEl });
}

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

function streamTextWithSources(text, sources, type, msgId, isBlocked = false) {
  const msg = document.createElement('div');
  msg.className = `msg ${type} ${isBlocked? 'blocked' : ''}`;
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

function streamText(text, type, msgId, isBlocked = false) {
  const msg = document.createElement('div');
  msg.className = `msg ${type} ${isBlocked? 'blocked' : ''}`;
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

function addTyping(msgId, attempt) {
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
