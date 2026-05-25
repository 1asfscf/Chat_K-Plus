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

// 모델 정보
const MODEL_NAME = 'Chat K Plus';
const TEAM_EMAIL = 'studioferrari_kr@outlook.com';
const MODEL_IDENTITY = Object.freeze({
  name: 'Chat K Plus',
  maker: '스튜디오 페라리',
  base: 'Muse Spark',
  engine: 'KRL',
  cutoff: '2025-09-04',
  desc: `나는 ${MODEL_NAME}야. 스튜디오 페라리에서 제작한 AI야. Meta의 Muse Spark를 기반으로 하되, KRL(Knowledge Reasoning Layer) 엔진으로 한국 언어/문화에 최적화됐어. 역사 팩트체크, 개발, 건강 가이드, 영화, 일상 대화를 도와준다. 실시간 검색은 안 되고 2025-09-04까지 데이터로 학습했어.`
});

let userName = localStorage.getItem('chatkUserName') || '성민';
let isAnswering = false;
let currentStreamInterval = null;
let currentMsgElement = null;

const REASONING_TIMEOUT = 15000;
const RETRY_INTERVAL = 5000;
const activeReasoning = new Map();

// 의학 화이트리스트
const MEDICAL_WHITELIST = [
  '오줌', '소변', '뇨', '배뇨', '방광', '신장', '요로', '요도', '전립선',
  '방광염', '요로감염', '혈뇨', '단백뇨', '야뇨', '빈뇨', '잔뇨',
  '비뇨기과', '신우신염', '귀두염', '외음부염', '호르몬', 'HRT'
];

// 성적 금지어 - 모든 변형
const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성관계', '성행위',
  '유두', '가슴', '엉덩이', '팬티', '빤스', 'panty', 'panties', '브라', '속옷',
  '란제리', '속바지', '알몸', '누드', 'nude', '강간', '성폭행', '성추행', '성희롱',
  '몰카', '딥페이크', '페티시', 'sm', 'bdsm', '야한', '에로', '성인', '19금', '음란',
  '보지', '자지', '좆', '씨발', '씨벌', 'fuck', '딸이', '사정', '오르가즘'
];

const BANNED_EMOJIS = [
  '🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿',
  '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿',
  '🖖', '🤬', '😡', '🤢', '🤮', '💩'
];

function normalizeText(text) {
  return text
  .toLowerCase()
  .replace(/[\s\-_\.·ㆍ‥…]/g, '')
  .replace(/ㅍㅐㅇㅔㄴㅌㅣ|panty|panties/g, '팬티')
  .replace(/[0-9]/g, '')
  .normalize('NFKD');
}

const SEXUAL_PATTERN = new RegExp(
  SEXUAL_BLACKLIST.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i'
);

function isInappropriateContent(text) {
  const normalized = normalizeText(text);

  if (BANNED_EMOJIS.some(e => text.includes(e))) {
    return true;
  }

  if (MEDICAL_WHITELIST.some(w => text.toLowerCase().includes(w))) {
    return false;
  }

  return SEXUAL_PATTERN.test(normalized) || SEXUAL_BLACKLIST.some(w => normalized.includes(normalizeText(w)));
}

const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음|방가|안녕하세요)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai|챗).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는)/i;
const krlPattern = /krl.*(뭐|무엇|뭔데|뭔지|설명|알려|뜻)/i;

const KEYWORD_ALIASES = {
  '여야': '여아',
  '남자': '남성',
  '여자': '여성',
  '트젠': '트랜스젠더',
  '아이': '남아',
  '어린이': '남아'
};

const knowledgeBase = {
  "5.18": {
    text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**

**1. 북한군 개입설**
1980년 5월 당시 광주에 북한 특수부대 600명이 침투했다는 주장. 국방부, 국정원 공식 조사에서 근거 없음으로 결론. 대법원도 허위사실로 판결했다.

**2. 폭동 프레임**
시민들의 민주화 요구를 무장폭동으로 규정. 계엄군이 먼저 발포했고, 시민군은 최후 방어수단으로 무장한 것이다. 1997년 대법원에서 정당한 항쟁으로 인정.

**3. 희생자 수 축소**
사망자 170여명이라는 주장은 공식 통계와 다르다. 정부 공식 집계는 사망 166명, 행방불명 54명, 부상 3,139명이다.

**4. 유공자 가짜설**
5.18 유공자 대부분이 가짜라는 주장. 국가보훈부가 심사하고 법원 판결로 확정된 유공자다.

**5. 전두환 미화**
전두환 신군부가 질서 유지를 위해 불가피했다는 논리. 1996년 내란죄, 반란죄로 유죄 판결.`,
    sources: [
      { title: "5·18민주화운동진상규명조사위원회", url: "https://www.518commission.go.kr" },
      { title: "대법원 1997도1140 판결문", url: "https://casenote.kr" }
    ],
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동', '전두환', '계엄'],
    tags: ['역사', '정치'],
    needsReasoning: false
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**

**엔진**: Muse Spark + KRL(Knowledge Reasoning Layer)
**제작**: 스튜디오 페라리
**데이터**: 2025-09-04 컷오프
**특징**: 이름 기억, 출처 인용, 15초 추론, 콘텐츠 필터, 건강 가이드, 영화 정보

**한계**: 실시간 정보, 이미지 생성 미지원`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보', '모델', '스파크', 'krl', '페라리'],
    tags: ['기술'],
    needsReasoning: false
  },
  "KRL": {
    text: `**KRL(Knowledge Reasoning Layer)**

KRL은 기본 데이터베이스 기반 언어 모델을 상징한다. ${MODEL_NAME}의 핵심 추론 엔진이야.

**역할**: 한국어 맥락 이해, 지식 그래프 연결, 팩트 검증, 추론 재시도 3회

**특징**: 단순 생성형이 아니라 검증 기반. 출처 있는 데이터만 우선 출력한다.`,
    sources: [
      { title: "스튜디오 페라리 KRL 백서", url: "https://studio-ferrari.ai/krl" }
    ],
    keywords: ['krl', '케이알엘', '엔진', '추론', '데이터베이스'],
    tags: ['기술'],
    needsReasoning: false
  },
  "오줌": {
    summary: `**오줌(소변) 건강 정보**

신장에서 만든 노폐물. 하루 1~2L. 95% 물.

**기본 체크**: 색(연노랑 정상), 횟수(하루 6~8회), 냄새(약한 암모니아)

**위험 신호**: 혈뇨, 배뇨통, 발열 동반시 즉시 병원.

더 자세한 정보는 '남성', '여성', '트랜스젠더', '남아', '여아' 중 선택해서 물어봐 ${userName}.`,
    details: {
      남성: `**성인 남성 배뇨 가이드**

- 전립선 비대: 50대 이상 잔뇨감, 야간뇨 증가시 비뇨기과
- 요도 20cm. 요로감염 드물지만 중증
- 아침 첫 소변 거품은 단백뇨 의심`,
      여성: `**성인 여성 배뇨 가이드**

- 요도 4cm. 방광염 빈발
- 배뇨 후 앞에서 뒤로 닦기
- 임신시 빈뇨 정상. 통증/혈뇨는 병원`,
      트랜스젠더: `**트랜스젠더 배뇨 가이드**

- 트랜스여성(HRT): 스피로놀락톤 이뇨작용. 칼륨 체크
- 트랜스남성(T): 요도 자극 가능. 수술별 배뇨 자세 다름
- 공통: 호르몬 치료중 신장 정기검사`,
      남아: `**남아 배뇨 가이드**

- 포경: 청결 유지. 무리한 젖힘 금지
- 야뇨증: 5세 이후 주2회 이상 소아과
- 소변줄기 가늘면 요도협착 의심`,
      여아: `**여아 배뇨 가이드**

- 외음부염: 비누 과다금지. 면 속옷
- 방광염: 배뇨통시 즉시 소아과
- 변비시 배뇨장애 유발`
    },
    sources: [
      { title: "대한비뇨의학회 소변 건강 가이드", url: "https://www.urology.or.kr" },
      { title: "서울아산병원 건강정보", url: "https://www.amc.seoul.kr" },
      { title: "국가건강정보포털", url: "https://health.kdca.go.kr" }
    ],
    keywords: ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '신장', '혈뇨', '배뇨', '남자', '여자', '트젠', '트랜스젠더', '가이드', '건강', '남성', '여성', '남아', '여아'],
    tags: ['의학', '건강'],
    needsReasoning: true
  },
  "영화": {
    text: `**한국 영화 지식 - ${MODEL_NAME}**

**대표작 예시**

**1. 기생충 (2019)**
봉준호 감독. 칸 영화제 황금종려상, 아카데미 작품상. 계급 갈등을 블랙코미디로 풀어냄.

**2. 올드보이 (2003)**
박찬욱 감독. 칸 심사위원대상. 복수 3부작. 15년 감금 미스터리.

**3. 부산행 (2016)**
연상호 감독. K-좀비 장르 세계화. 좀비 아포칼립스 + 부성애.

**4. 헤어질 결심 (2022)**
박찬욱 감독. 칸 감독상. 멜로 + 수사극. "사랑한다" 대사 없이 사랑 표현.

**트렌드**: 넷플릭스 <오징어 게임> 이후 K-콘텐츠 글로벌 확장. OTT 제작비 상승으로 극장/OTT 동시개봉 증가.

더 구체적인 감독, 배우, 장르 물어봐 ${userName}.`,
    sources: [
      { title: "한국영화데이터베이스 KMDb", url: "https://www.kmdb.or.kr" },
      { title: "영화진흥위원회 KOFIC", url: "https://www.kofic.or.kr" }
    ],
    keywords: ['영화', '시네마', '무비', '감독', '배우', '기생충', '봉준호', '박찬욱', '한국영화'],
    tags: ['문화', '예술'],
    needsReasoning: false
  },
  "아이폰": {
    text: `**아이폰 12 Pro 터치/클릭 안 될 때 점검사항**

**1. 소프트웨어**
- iOS 최신 버전 업데이트: 설정 > 일반 > 소프트웨어 업데이트
- 강제 재시동: 볼륨 ↑ → 볼륨 ↓ → 전원 버튼 길게

**2. 화면 보호필름/케이스**
- 두꺼운 강화유리, 케이스 간섭 확인. 제거 후 테스트

**3. 터치 설정**
- 설정 > 손쉬운 사용 > 터치 > 3D Touch/Haptic Touch 끄기
- 터치 조절 초기화

**4. 하드웨어**
- 화면 교체 이력 있으면 정품 인증 필요
- 물 침수, 낙하 손상시 애플 서비스센터

**5. 앱 문제**
- 특정 앱만 안 되면 앱 삭제 후 재설치

안 되면 ${TEAM_EMAIL}로 기기 정보 보내줘 ${userName}.`,
    sources: [
      { title: "Apple 지원 - iPhone 터치 문제", url: "https://support.apple.com/ko-kr/HT201406" }
    ],
    keywords: ['아이폰', 'iphone', '12', 'pro', '클릭', '터치', '안됨', '고장', '화면'],
    tags: ['기술', '애플'],
    needsReasoning: false
  }
};

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
    `${userName}, 15초 동안 다 뒤져봤는데 데이터 없어.`,
    `미안 ${userName}. 이건 내 지식베이스에 없어.`,
    `${userName}, 관련 정보 못 찾았어.`
  ],
  feedback: [
    `${userName}, 해당 정보가 없어. 더 정확한 정보가 필요하면 ${TEAM_EMAIL}로 피드백 보내줘. 스튜디오 페라리 팀이 검토할게.`,
    `미안 ${userName}. 그 항목은 데이터에 없어. 개선 요청은 ${TEAM_EMAIL}로 보내주면 반영할게.`
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

function setAnsweringState(state) {
  isAnswering = state;
  sendBtn.disabled = false;
  userInput.disabled = state;

  if (state) {
    sendBtn.innerHTML = `
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    sendBtn.style.background = 'var(--danger)';
    sendBtn.style.opacity = '1';
    sendBtn.style.cursor = 'pointer';
    userInput.placeholder = '답변 생성 중... (클릭하면 중단)';
  } else {
    sendBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    sendBtn.style.background = '';
    sendBtn.style.opacity = '1';
    sendBtn.style.cursor = 'pointer';
    userInput.placeholder = '메시지 입력...';
  }
}

function stopStreaming() {
  if (currentStreamInterval) {
    clearInterval(currentStreamInterval);
    currentStreamInterval = null;
  }

  activeReasoning.forEach(({ timer }) => clearInterval(timer));
  activeReasoning.clear();

  const typingEl = chatList.querySelector('.msg.ai.typing');
  if (typingEl) typingEl.remove();

  if (currentMsgElement) {
    const bubble = currentMsgElement.querySelector('.bubble,.msg-text');
    if (bubble &&!bubble.textContent.includes('[중단됨]')) {
      bubble.textContent += '\n\n[중단됨]';
    }
  }

  currentMsgElement = null;
  setAnsweringState(false);
  autoResize();
}

function normalizeKeyword(text) {
  let normalized = text.toLowerCase();
  for (const [alias, target] of Object.entries(KEYWORD_ALIASES)) {
    if (normalized.includes(alias)) {
      normalized = normalized.replace(new RegExp(alias, 'g'), target);
    }
  }
  return normalized;
}

function determineOutputStyle(query, data) {
  const lowerQuery = query.toLowerCase();

  if (/뭐야|뭔데|알려줘|설명/.test(lowerQuery) &&!data.subKey) {
    return 'summary';
  }

  if (data.subKey) {
    return 'detail';
  }

  if (/가이드|방법|팁|주의/.test(lowerQuery)) {
    return 'guide';
  }

  return 'summary';
}

function searchKnowledge(text) {
  const lowerText = text.toLowerCase().trim();
  const normalizedText = normalizeKeyword(lowerText);

  if (greetingPatterns.test(lowerText)) {
    return { type: 'greeting' };
  }

  if (krlPattern.test(lowerText)) {
    return { data: knowledgeBase["KRL"], confidence: 1.0, direct: true };
  }

  const urineKeywords = ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '배뇨'];
  if (urineKeywords.some(k => normalizedText.includes(k))) {
    const detailKeys = ['남성', '여성', '트랜스젠더', '남아', '여아'];
    const foundKey = detailKeys.find(k => normalizedText.includes(k));

    if (foundKey) {
      return {
        data: knowledgeBase["오줌"],
        confidence: 1.0,
        direct: true,
        subKey: foundKey
      };
    } else {
      return {
        data: knowledgeBase["오줌"],
        confidence: 1.0,
        direct: false,
        useSummary: true
      };
    }
  }

  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(k => normalizedText.includes(k))) {
      return { data, confidence: 1.0, direct:!data.needsReasoning };
    }
  }
  return null;
}

function deepReasoning(query, attempt) {
  const words = normalizeKeyword(query)
.toLowerCase()
.replace(/[?!.]/g, ' ')
.split(' ')
.filter(w => w.length > 1);

  if (words.length === 0) return null;

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

  const threshold = Math.max(1, 4 - attempt);
  if (bestScore >= threshold && bestMatch) {
    return { data: bestMatch, confidence: bestScore / 10 };
  }

  if (attempt >= 2) {
    if (words.some(w => ['광주', '5월', '전두환', '계엄'].includes(w))) {
      return { data: knowledgeBase["5.18"], confidence: 0.5 };
    }
    if (words.some(w => ['모델', '스파크', '정보', '페라리'].includes(w))) {
      return { data: knowledgeBase["사양"], confidence: 0.5 };
    }
    if (words.some(w => ['krl', '케이알엘', '엔진', '추론'].includes(w))) {
      return { data: knowledgeBase["KRL"], confidence: 0.5 };
    }
    if (words.some(w => ['오줌', '소변', '쉬', '화장실', '뇨'].includes(w))) {
      return { data: knowledgeBase["오줌"], confidence: 0.5, useSummary: true };
    }
    if (words.some(w => ['영화', '시네마', '무비'].includes(w))) {
      return { data: knowledgeBase["영화"], confidence: 0.5 };
    }
    if (words.some(w => ['아이폰', 'iphone', '애플', '터치', '클릭'].includes(w))) {
      return { data: knowledgeBase["아이폰"], confidence: 0.5 };
    }
  }

  return null;
}

function sendMessage() {
  if (isAnswering) {
    stopStreaming();
    return;
  }

  const text = userInput.value.trim();
  if (!text) return;

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

  setAnsweringState(true);

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

  if (identityPatterns.test(text)) {
    setTimeout(() => {
      typingEl.remove();
      streamText(MODEL_IDENTITY.desc, 'ai', msgId, false);
    }, 400);
    return;
  }

  const kb1 = searchKnowledge(text);

  if (kb1) {
    if (kb1.type === 'greeting') {
      setTimeout(() => {
        typingEl.remove();
        const reply = replies.greeting[Math.floor(Math.random() * replies.greeting.length)];
        streamText(reply.replaceAll('${userName}', userName), 'ai', msgId, false);
      }, 400);
      return;
    }

    if (kb1.useSummary) {
      setTimeout(() => {
        typingEl.remove();
        streamTextWithSources(kb1.data.summary, kb1.data.sources, 'ai', msgId, false);
      }, 500);
      return;
    }

    if (kb1.subKey && kb1.data.details) {
      const detailText = kb1.data.details[kb1.subKey];
      if (detailText) {
        setTimeout(() => {
          typingEl.remove();
          streamTextWithSources(detailText, kb1.data.sources, 'ai', msgId, false);
        }, 500);
        return;
      } else {
        setTimeout(() => {
          typingEl.remove();
          const feedback = replies.feedback[Math.floor(Math.random() * replies.feedback.length)];
          streamText(feedback.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
        }, 500);
        return;
      }
    }

    if (isInappropriateContent(kb1.data.text)) {
      setTimeout(() => {
        typingEl.remove();
        const blocked = replies.blocked[Math.floor(Math.random() * replies.blocked.length)];
        streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true);
      }, 400);
      return;
    }

    if (kb1.direct) {
      setTimeout(() => {
        typingEl.remove();
        const style = determineOutputStyle(text, kb1.data);
        let outputText = kb1.data.text;

        if (style === 'summary' && kb1.data.summary) {
          outputText = kb1.data.summary;
        }

        streamTextWithSources(outputText, kb1.data.sources, 'ai', msgId, false);
      }, 500);
      return;
    }
  }

  startReasoning(text, msgId, typingEl);
}

function startReasoning(query, msgId, typingEl) {
  let elapsed = 0;
  let attempt = 1;
  let timeoutTriggered = false;

  const updateLoadingText = (attemptNum) => {
    const textEl = typingEl.querySelector('.loading-text');
    if (textEl) {
      const msg = replies.reasoning[attemptNum - 1] || replies.reasoning[0];
      textEl.textContent = msg.replaceAll('${userName}', userName);
    }
  };

  updateLoadingText(1);

  const timer = setInterval(() => {
    if (timeoutTriggered) return;

    elapsed += 100;

    if (elapsed % RETRY_INTERVAL === 0 && elapsed < REASONING_TIMEOUT) {
      attempt++;
      updateLoadingText(attempt);

      const result = deepReasoning(query, attempt);
      if (result && result.confidence >= 0.3) {
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

        const style = determineOutputStyle(query, result.data);
        let outputText = result.data.text;

        if ((style === 'summary' || result.useSummary) && result.data.summary) {
          outputText = result.data.summary;
        }

        streamTextWithSources(outputText, result.data.sources, 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }
    }

    if (elapsed >= REASONING_TIMEOUT &&!timeoutTriggered) {
      timeoutTriggered = true;
      clearInterval(timer);
      typingEl.remove();
      const failed = replies.feedback[Math.floor(Math.random() * replies.feedback.length)];
      streamText(failed.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
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
  if (currentStreamInterval) {
    clearInterval(currentStreamInterval);
    currentStreamInterval = null;
  }

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
  currentMsgElement = msg;

  const bubble = msg.querySelector('.msg-text');
  const sourcesEl = msg.querySelector('.sources');

  let i = 0;
  currentStreamInterval = setInterval(() => {
    if (!isAnswering) {
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
      currentMsgElement = null;
      return;
    }
    bubble.textContent += text[i];
    i++;
    scrollToBottom();
    if (i >= text.length) {
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
      currentMsgElement = null;
      if (sources.length && sourcesEl) {
        sourcesEl.innerHTML = '<div class="sources-title">출처</div>' +
          sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');
      }
      setAnsweringState(false);
    }
  }, 4);
}

function streamText(text, type, msgId, isBlocked = false) {
  if (currentStreamInterval) {
    clearInterval(currentStreamInterval);
    currentStreamInterval = null;
  }

  const msg = document.createElement('div');
  msg.className = `msg ${type} ${isBlocked? 'blocked' : ''}`;
  msg.dataset.msgId = msgId;
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble"></div>
  `;
  chatList.appendChild(msg);
  currentMsgElement = msg;

  const bubble = msg.querySelector('.bubble');

  let i = 0;
  currentStreamInterval = setInterval(() => {
    if (!isAnswering) {
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
      currentMsgElement = null;
      return;
    }
    bubble.textContent += text[i];
    i++;
    scrollToBottom();
    if (i >= text.length) {
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
      currentMsgElement = null;
      setAnsweringState(false);
    }
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
  if (userInput.value.trim() &&!isAnswering) {
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
  stopStreaming();
  setAnsweringState(false);

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
      if (isAnswering) return;
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
