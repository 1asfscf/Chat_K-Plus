// ===== DOM 요소 (지연 로딩 대비) =====
let chatList, userInput, sendBtn, themeToggle, menuBtn, sidebar, welcomeScreen, newChatBtn, welcomeTitle;

function getElements() {
  chatList = document.getElementById('chatList');
  userInput = document.getElementById('userInput');
  sendBtn = document.getElementById('sendBtn');
  themeToggle = document.getElementById('themeToggle');
  menuBtn = document.getElementById('menuBtn');
  sidebar = document.querySelector('.sidebar');
  welcomeScreen = document.getElementById('welcomeScreen');
  newChatBtn = document.getElementById('newChatBtn');
  welcomeTitle = document.getElementById('welcomeTitle');
}

getElements();

const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

const MODEL_NAME = 'Chat K Plus';
const TEAM_EMAIL = 'studioferrari_kr@outlook.com';
const MODEL_IDENTITY = Object.freeze({
  name: 'Chat K Plus',
  maker: '스튜디오 페라리',
  base: 'Studio Ferrari + KRL',
  engine: 'KRL',
  cutoff: '2025-09-04',
  desc: `저는 ${MODEL_NAME}입니다. 스튜디오 페라리에서 자체 제작한 AI 비서예요.\nKRL(Knowledge Reasoning Layer) 엔진을 사용해서 한국어에 최적화되어 있고, 순수 JavaScript로 브라우저에서 직접 작동해요.\n서버나 API 호출 없이 독립적으로 작동하는 게 가장 큰 특징입니다.\n\n역사, 과학, 기술, 건강, 종교, 애니메이션, 음료 등 다양한 주제에 답변할 수 있어요.`,
  simple: `저는 ${MODEL_NAME}이에요. 스튜디오 페라리에서 만든 AI 비서고, KRL 엔진으로 작동해요. 인터넷 없이도 브라우저에서 바로 돌아가는 독립형 AI예요.`
});

let userName = localStorage.getItem('chatkUserName') || '성민';
let isAnswering = false;
let currentStreamInterval = null;
let currentMsgElement = null;

const REASONING_TIMEOUT = 12000;
const RETRY_INTERVAL = 3000;
const MAX_RETRY_ATTEMPTS = 3;
const MAX_EXTRA_RETRIES = 3;
const activeReasoning = new Map();
let retryCount = {};
let lastFailedQuery = null;

const MEDICAL_WHITELIST = [
  '오줌', '소변', '뇨', '배뇨', '방광', '신장', '요로', '요도', '전립선',
  '방광염', '요로감염', '혈뇨', '단백뇨', '야뇨', '빈뇨', '잔뇨',
  '비뇨기과', '신우신염', '귀두염', '외음부염', '호르몬', 'HRT',
  '양말', '삭스', 'socks', '발', '보온', '니삭스', '스니커즈',
  '하나님', '예수', '성경', '교회', '기도', '천주교', '불교', '부처', '종교',
  '정교회', '윤회', '사서삼경', '공자', '맹자', '석가', '코란', '쿠란',
  '음료', '커피', '차', '녹차', '홍차', '콜라', '사이다', '주스', '물', '마실',
  '라떼', '아메리카노', '에스프레소', '카페', '탄산', '보리차', '허브차',
  '시스템', '사양', '스펙', '정보', '모델', '스파크', 'krl', '페라리',
  '컴퓨터', '코딩', '프로그래밍', '인터넷', 'AI', '파이썬', 'python',
  'mdn', '모질라', '개발자문서', '웹문서', '레퍼런스',
  '개발', '깃허브', 'github', 'css', 'html', '리액트', 'react', '노드', 'node',
  '풀스택', '프론트엔드', '백엔드', '버그', '디버깅',
  '또봇', 'tobot', '변신', '차하나', '차두리', '권세모',
  '도라에몽', 'doraemon', '진구', '비밀도구', '고양이', '로봇',
  '포켓몬', 'pokemon', '피카츄', 'pikachu',
  '영화', '시네마', '무비', '감독', '배우', '기생충', '봉준호', '박찬욱',
  '과학', '물리', '화학', '생물', '중력', '우주', 'DNA', '블랙홀',
  '공부', '공부법', '학습', '영어', '수학', '암기', '시험',
  '운동', '건강', '다이어트', '수면', '영양', '식단', '헬스',
  '힘들어', '슬퍼', '외로워', '불안', '화나', '위로', '우울', '고민', '스트레스', '감정',
  '아이폰', 'iphone', '애플', '터치', '클릭', '고장', 'ios',
  '독도', '대한민국', '일본', '영토', '주권'
];

const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성관계', '성행위',
  '강간', '성폭행', '성추행', '성희롱', '몰카', '딥페이크', '페티시', 'sm', 'bdsm',
  '야한', '에로', '성인', '19금', '음란', '보지', '자지', '좆', '씨발', '씨벌', 'fuck',
  '사정', '오르가즘', 'ㅅㅔㄱㅅㅡ', 'ㅅㅔㄱ스', '섹ㅅ', 's3x', 'seks', '섻스',
  '쌕쓰', '쌕스', '쌕쑤', '색스', '쎅스', '쎅쓰', '쌕ㅆ', '쌕ㅅ', '쎅ㅆ', '색쓰'
];

const BANNED_EMOJIS = ['🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '🤬', '💩'];

function normalizeText(text) {
  return text.toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-_\.·ㆍ‥…0-9@!?#$%^&*()+\=\[\]{};:'",<>\/\\|`~]/g, '')
    .replace(/ㅅㅔㄱㅅㅡ|ㅅㅔㄱ스|섹ㅅ|s3x|seks|섻스|쌕쓰|쌕스|쌕쑤|색스|쎅스|쎅쓰|쌕ㅆ|쌕ㅅ|쎅ㅆ|색쓰/g, '섹스')
    .replace(/sex/gi, '섹스')
    .replace(/porn/gi, '포르노')
    .replace(/fuck/gi, 'fuck');
}

function buildSexualPattern() {
  const patterns = [
    ...SEXUAL_BLACKLIST.map(w => normalizeText(w)),
    'ssex', 'sexx', 'sseexx',
    'ㅅㅔㄱㅅㅡ', 'ㅅㅔㄱ스', '섹ㅅ',
    's e x', 's-e-x', 's_e_x', 's.e.x', 's,e,x',
    'ｓｅｘ', 'ｓㆍｅㆍｘ',
    's3x', '5ex', '53x',
    'sss', 'sexuality', 'sexy', '섹시',
    '색스', '쎅스', '쎅쓰', '섻스', '쌕스', '쌕쓰', '쌕쑤', '쌕ㅆ', '쌕ㅅ', '색쓰', '쎅ㅆ',
    '성관계', '성행위', '성적', '음란', '야한',
    '에로', '성인물', '19금', '야설',
    '유두', '가슴', '엉덩이', '보지', '자지',
    '팬티', '빤스', 'panty', 'panties', '브라', '속옷', '란제리',
    '페앤티', '페엔티', '패ㄴ티', '팬ㅌㅣ',
    '알몸', '누드', 'nude', '나체', '탈의',
    '강간', '성폭행', '성추행', '성희롱', '몰카', '딥페이크',
    '페티시', 'sm', 'bdsm', '자위', '사정', '오르가즘',
    '좆', '씨발', '씨벌', 'fuck', 'fck', 'fuk'
  ];
  return new RegExp(patterns.join('|'), 'i');
}

const SEXUAL_PATTERN = buildSexualPattern();

function isInappropriateContent(text) {
  if (BANNED_EMOJIS.some(e => text.includes(e))) return true;
  if (MEDICAL_WHITELIST.some(w => text.toLowerCase().includes(w))) return false;
  
  const lowerText = text.toLowerCase();
  const strippedText = lowerText.replace(/[\s\-_\.·ㆍ‥…,，、]/g, '');
  if (SEXUAL_PATTERN.test(strippedText)) return true;
  
  const lettersOnly = lowerText.replace(/[^a-z가-힣]/g, '');
  if (SEXUAL_PATTERN.test(lettersOnly)) return true;
  
  const normalized = normalizeText(text);
  if (SEXUAL_PATTERN.test(normalized)) return true;
  
  if (SEXUAL_BLACKLIST.some(w => lowerText.includes(normalizeText(w)))) return true;
  
  if (/s\s*[.,、·]*\s*e\s*[.,、·]*\s*x/i.test(text)) return true;
  if (/ㅅ\s*[.,、·]*\s*ㅔ\s*[.,、·]*\s*ㄱ\s*[.,、·]*\s*ㅅ/i.test(text)) return true;
  if (/ㅅ\s*[.,、·]*\s*ㅔ\s*[.,、·]*\s*ㄱ\s*[.,、·]*\s*ㅡ/i.test(text)) return true;
  if (/ㅆ\s*[.,、·]*\s*ㅐ\s*[.,、·]*\s*ㄱ/i.test(text)) return true;
  if (/쌕|쎅|색|쌔/i.test(lowerText) && /ㅆ|ㅅ|쓰|스|쑤/i.test(lowerText)) {
    if (SEXUAL_PATTERN.test(lowerText.replace(/[ㄱ-ㅎㅏ-ㅣ]/g, ''))) return true;
  }
  
  return false;
}

// ===== 영어 질문 감지 =====
function isEnglishQuery(text) {
  const koreanPattern = /[가-힣]/;
  const englishPattern = /[a-zA-Z]/;
  const koreanCount = (text.match(koreanPattern) || []).length;
  const englishCount = (text.match(englishPattern) || []).length;
  
  if (koreanCount < 2 && englishCount > koreanCount * 2) return true;
  
  const words = text.split(/\s+/);
  const englishWords = words.filter(w => /^[a-zA-Z]+$/.test(w));
  if (englishWords.length > words.length * 0.5) return true;
  
  return false;
}

const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음|방가|안녕하세요)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai|챗).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는|소개|설명|정보|알려)/i;
const systemPatterns = /(기반|만들|작동|원리|어떻게|무슨|구조|엔진|베이스|기초)/i;
const krlPattern = /krl.*(뭐|무엇|뭔데|뭔지|설명|알려|뜻)/i;
const chartPattern = /(표|그래프|차트|테이블).*(만들어|그려|보여|생성|작성)/i;
const retryPattern = /(다시|재추론|한번 더|다시 한번|또|재시도|다시 찾아|다시 검색|한번만 더|다시.*추론|재.*추론|추론.*다시|다시.*생각).*(추론|찾아|검색|해봐|시도|해줘|생각|돌려|해보자)/i;

const newTopicRetryPattern = /(다른|새로운|바꿔서|변경).*(주제|질문|내용|키워드).*(추론|검색|찾아|해봐|시도)/i;

const KEYWORD_ALIASES = { '여야': '여아', '남자': '남성', '여자': '여성', '트젠': '트랜스젠더', '아이': '남아', '어린이': '남아' };

function addEmotionalEnding(tags) {
  const endings = {
    '과학': '\n\n🌌 호기심이 세상을 바꿔. 또 궁금한 게 생기면 언제든 물어봐!',
    '교육': '\n\n💪 꾸준함이 가장 큰 무기야. 넌 충분히 잘할 수 있어!',
    '기술': '\n\n🚀 기술은 결국 사람을 위한 거야. 더 편리한 세상을 함께 만들어가자!',
    '건강': '\n\n🌱 작은 습관이 너를 바꿔. 오늘도 건강한 하루 보내!',
    '감정': '\n\n💙 언제나 여기 있을게. 혼자가 아니야.',
    '의학': '\n\n🏥 건강이 제일 중요해. 몸이 보내는 신호를 잘 살펴봐!',
    '종교': '\n\n🕊️ 믿음은 각자의 소중한 여정이야. 평화로운 하루 보내!',
    '철학': '\n\n🧠 생각이 깊어질수록 세상이 더 넓어 보여. 좋은 질문이야!',
    '역사': '\n\n📖 역사를 아는 것은 더 나은 내일을 위한 발걸음이야.',
    '애니메이션': '\n\n✨ 좋아하는 걸 찾았다면 그걸로 이미 행복한 거야!',
    '일상': '\n\n🧶 소소한 것에서 행복을 찾는 게 진짜 실력이야!',
    '문화': '\n\n🎬 좋은 영화는 인생을 바꾸기도 해. 오늘도 좋은 하루!',
    '식품': '\n\n🥤 뭐 마실지 고민될 땐 나한테 물어봐. 항상 도와줄게!',
    '패션': '\n\n🧦 작은 디테일이 하루를 완성해. 멋진 하루 보내!'
  };
  if (!tags || tags.length === 0) return '\n\n😊 또 궁금한 게 있으면 언제든 물어봐!';
  for (const [tag, ending] of Object.entries(endings)) {
    if (tags.some(t => t.includes(tag) || tag.includes(t))) return ending;
  }
  return '\n\n😊 또 궁금한 게 있으면 언제든 물어봐!';
}

// ... (이하 knowledgeBase, replies 등 네가 준 코드 전부 동일) ...

// ===== 복구된 하단부 =====
function updateWelcomeTitle() { if (welcomeTitle) welcomeTitle.textContent = `${userName}, ${MODEL_NAME} 켜졌다`; }

function setAnsweringState(state) {
  isAnswering = state; if (!sendBtn) return; sendBtn.disabled = false; if (userInput) userInput.disabled = state;
  if (state) { sendBtn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`; sendBtn.style.background = 'var(--danger)'; if (userInput) userInput.placeholder = '답변 생성 중...'; }
  else { sendBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`; sendBtn.style.background = ''; if (userInput) userInput.placeholder = '메시지 입력...'; }
}

function stopStreaming(showMessage = true) {
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  activeReasoning.forEach(({ timer }) => clearInterval(timer)); activeReasoning.clear();
  const typingEl = chatList ? chatList.querySelector('.msg.ai.typing') : null; if (typingEl) typingEl.remove();
  if (currentMsgElement) { const bubble = currentMsgElement.querySelector('.msg-text'); if (bubble && !bubble.textContent.includes('[중단됨]')) bubble.textContent += '\n\n[⏸️ 중단됨]'; }
  currentMsgElement = null; setAnsweringState(false);
  if (showMessage && chatList) { const sm = replies.stopped[Math.floor(Math.random()*replies.stopped.length)]; const m = document.createElement('div'); m.className = 'msg ai'; m.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text">${sm.replaceAll('${userName}',userName)}</div></div>`; chatList.appendChild(m); scrollToBottom(); }
  autoResize();
}

function normalizeKeyword(text) { let n = text.toLowerCase(); for (const [a,t] of Object.entries(KEYWORD_ALIASES)) { if (n.includes(a)) n = n.replace(new RegExp(a,'g'),t); } return n; }

function searchKnowledge(text) { /* ... 네 원본 그대로 ... */ }
function deepReasoning(query, attempt) { /* ... 네 원본 그대로 ... */ }
function retryReasoning(query, msgId, previousAttempts = 0) { /* ... 네 원본 그대로 ... */ }
function sendBlockedMessage(msgId) { /* ... */ }
function sendMessage() { /* ... */ }
function startReasoning(query, msgId, typingEl) { /* ... */ }
function getLastFailedQuery() { return lastFailedQuery; }
function addMessage(text, type, msgId) { /* ... */ }
function streamTextWithSources(text, sources, type, msgId, isBlocked = false) { /* ... */ }
function streamText(text, type, msgId, isBlocked = false) { /* ... */ }
function addTyping(msgId, attempt) { /* ... */ }
function autoResize() { if (!userInput) return; userInput.style.height = 'auto'; userInput.style.height = userInput.scrollHeight+'px'; if (sendBtn) { if (userInput.value.trim()&&!isAnswering) sendBtn.classList.add('has-text'); else sendBtn.classList.remove('has-text'); } }
function scrollToBottom() { if (chatList) chatList.scrollTop = chatList.scrollHeight; }

function toggleTheme() {
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')) {
    localStorage.setItem('chatkTheme', 'light');
    if (themeToggle) themeToggle.setAttribute('aria-label', '다크 모드');
  } else {
    localStorage.setItem('chatkTheme', 'dark');
    if (themeToggle) themeToggle.setAttribute('aria-label', '라이트 모드');
  }
}

function openSidebar() {
  if (sidebar) sidebar.classList.add('open');
  overlay.classList.add('active');
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

function initApp() {
  getElements();
  updateWelcomeTitle();
  
  const savedTheme = localStorage.getItem('chatkTheme');
  if (savedTheme === 'light') document.body.classList.add('light');
  
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (userInput) {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    userInput.addEventListener('input', autoResize);
  }
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
  if (newChatBtn) newChatBtn.addEventListener('click', () => {
    if (chatList) chatList.innerHTML = '';
    if (chatList) chatList.classList.remove('has-messages');
    if (welcomeScreen) {
      welcomeScreen.classList.remove('hidden');
      welcomeScreen.style.display = 'flex';
    }
    closeSidebar();
    setAnsweringState(false);
  });
  
  autoResize();
}

document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('load', () => { getElements(); updateWelcomeTitle(); });
