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
  
  // 한국어가 거의 없고 영어가 주된 경우
  if (koreanCount < 2 && englishCount > koreanCount * 2) return true;
  
  // 전체 문장의 50% 이상이 영단어인 경우
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

// ===== 다른 주제 재추론 패턴 =====
const newTopicRetryPattern = /(다른|새로운|바꿔서|변경).*(주제|질문|내용|키워드).*(추론|검색|찾아|해봐|시도)/i;

const KEYWORD_ALIASES = { '여야': '여아', '남자': '남성', '여자': '여성', '트젠': '트랜스젠더', '아이': '남아', '어린이': '남아' };

// ===== 감정적 마무리 멘트 =====
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

// ===== 지식베이스 =====
const knowledgeBase = {
  "5.18": {
    text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**\n\n이 주제는 많은 사람들에게 아픈 역사이자 진실을 지켜야 할 소중한 유산이야.\n\n**1. 북한군 개입설** - 국방부/국정원 근거 없음 결론.\n**2. 폭동 프레임** - 계엄군 선발포, 시민군 최후 방어수단.\n**3. 희생자 수 축소** - 사망 166명, 부상 3,139명.\n**4. 유공자 가짜설** - 법원 판결로 확정.\n**5. 전두환 미화** - 1996년 내란죄 유죄 판결.`,
    sources: [{ title: "5·18기념재단", url: "https://518.org" }],
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동', '전두환', '계엄'],
    tags: ['역사', '정치'],
    needsReasoning: false
  },
  "독도": {
    text: `**🇰🇷 독도는 대한민국 영토입니다**\n\n독도는 역사적·지리적·국제법적으로 명백한 대한민국의 고유 영토야.\n\n**📜 역사적 증거**\n- **512년 신라 지증왕** 때 우산국(울릉도+독도)을 신라 영토로 편입\n- **1432년 세종실록지리지**에 독도가 울릉도와 함께 기록\n- **1900년 대한제국 칙령 제41호**로 공식 행정구역 지정\n\n**🗺️ 지리적 사실**\n- 울릉도에서 87.4km, 일본 오키섬에서 157.5km\n\n**📋 국제법적 근거**\n- **1946년 SCAPIN 제677호**: 독도를 일본 영토에서 공식 분리\n\n🔗 외교부 독도: https://dokdo.mofa.go.kr`,
    sources: [
      { title: "외교부 독도 공식 웹사이트", url: "https://dokdo.mofa.go.kr" }
    ],
    keywords: ['독도', '대한민국', '일본', '영토', '주권', '울릉도', '동해'],
    tags: ['역사', '정치'],
    needsReasoning: false
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**\n\n**엔진**: Studio Ferrari + KRL\n**제작**: 스튜디오 페라리\n**특징**: 이름 기억, 출처 인용, 콘텐츠 필터, 추론 6단계\n\n💡 나는 계속 성장하고 있어.`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보', '모델', 'krl', '페라리'],
    tags: ['기술'],
    needsReasoning: false
  },
  "KRL": {
    text: `**KRL(Knowledge Reasoning Layer)**\n\n${MODEL_NAME}의 핵심 추론 엔진이야.\n\n**역할**: 한국어 맥락 이해, 지식 그래프 연결, 팩트 검증, 키워드 가중치 기반 추론\n**특징**: 단어 길이·일치도·태그로 정밀 스코어링`,
    sources: [],
    keywords: ['krl', '케이알엘', '엔진', '추론', '데이터베이스'],
    tags: ['기술'],
    needsReasoning: false
  },
  "오줌": {
    summary: `**오줌(소변) 건강 정보**\n\n건강은 작은 신호에서 시작돼. 소변은 몸의 거울이야!\n\n**기본 체크**: 색(연노랑 정상), 횟수(하루 6~8회), 냄새(약한 암모니아)\n**위험 신호**: 혈뇨, 배뇨통, 발열 동반시 즉시 병원.\n\n더 자세한 정보는 '남성', '여성', '트랜스젠더', '남아', '여아' 중 선택해서 물어봐 ${userName}.`,
    details: {
      남성: `**성인 남성 배뇨 가이드**\n- 전립선 비대: 50대 이상 잔뇨감, 야간뇨 증가시 비뇨기과\n- 요도 20cm. 요로감염 드물지만 중증\n- 아침 첫 소변 거품은 단백뇨 의심`,
      여성: `**성인 여성 배뇨 가이드**\n- 요도 4cm. 방광염 빈발\n- 배뇨 후 앞에서 뒤로 닦기\n- 임신시 빈뇨 정상. 통증/혈뇨는 병원`,
      트랜스젠더: `**트랜스젠더 배뇨 가이드**\n- 트랜스여성(HRT): 스피로놀락톤 이뇨작용. 칼륨 체크\n- 트랜스남성(T): 요도 자극 가능\n- 공통: 호르몬 치료중 신장 정기검사`,
      남아: `**남아 배뇨 가이드**\n- 포경: 청결 유지\n- 야뇨증: 5세 이후 주2회 이상 소아과\n- 소변줄기 가늘면 요도협착 의심`,
      여아: `**여아 배뇨 가이드**\n- 외음부염: 비누 과다금지\n- 방광염: 배뇨통시 즉시 소아과\n- 변비시 배뇨장애 유발`
    },
    sources: [{ title: "대한비뇨의학회", url: "https://www.urology.or.kr" }],
    keywords: ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '신장', '혈뇨', '배뇨', '남성', '여성', '남아', '여아'],
    tags: ['의학', '건강'],
    needsReasoning: true
  },
  "영화": {
    text: `**한국 영화 지식**\n\n한국 영화는 세계적으로 인정받는 예술이야! 🇰🇷\n\n**1. 기생충 (2019)** - 봉준호. 칸 황금종려상, 아카데미 작품상.\n**2. 올드보이 (2003)** - 박찬욱. 칸 심사위원대상.\n**3. 부산행 (2016)** - 연상호. K-좀비 세계화.\n**4. 헤어질 결심 (2022)** - 박찬욱. 칸 감독상.`,
    sources: [{ title: "한국영화데이터베이스 KMDb", url: "https://www.kmdb.or.kr" }],
    keywords: ['영화', '시네마', '무비', '감독', '배우', '기생충', '봉준호', '박찬욱'],
    tags: ['문화', '예술'],
    needsReasoning: false
  },
  "아이폰": {
    text: `**아이폰 12 Pro 터치/클릭 안 될 때**\n\n기기 문제는 정말 답답하지? 같이 해결해보자!\n\n**1. 소프트웨어** - iOS 최신 업데이트, 강제 재시동\n**2. 보호필름/케이스** - 제거 후 테스트\n**3. 터치 설정** - 3D Touch/Haptic Touch 끄기\n**4. 하드웨어** - 서비스센터\n**5. 앱 문제** - 삭제 후 재설치\n\n안 되면 ${TEAM_EMAIL}로 기기 정보 보내줘. 📱`,
    sources: [{ title: "Apple 지원", url: "https://support.apple.com/ko-kr/HT201406" }],
    keywords: ['아이폰', 'iphone', '12', 'pro', '클릭', '터치', '안됨', '고장', 'ios', '애플'],
    tags: ['기술', '애플'],
    needsReasoning: false
  },
  "또봇": {
    text: `**🚗 또봇 (Tobot)**\n\n또봇은 대한민국 대표 변신 자동차 로봇 애니메이션!\n\n**주요 또봇**\n- X(파랑/차하나/박태성), Y(노랑/차두리/신경선), Z(초록/권세모/신경선)\n- W(하양/세모), C(빨강/독고오공), D(주황/독고온달)\n\n📺 유튜브 @Tobot | tobot.co.kr`,
    sources: [{ title: "또봇 공식 유튜브", url: "https://www.youtube.com/@Tobot" }],
    keywords: ['또봇', 'tobot', '변신', '차하나', '차두리', '권세모'],
    tags: ['애니메이션', '한국'],
    needsReasoning: false
  },
  "도라에몽": {
    text: `**🔔 도라에몽**\n\n1969년 후지코 F. 후지오. 22세기 고양이 로봇.\n**캐릭터**: 도라에몽, 노진구, 신이슬, 왕비실, 만퉁퉁\n**비밀도구**: 어디로든 문, 대나무 헬리콥터, 타임머신\n📺 넷플릭스, 티빙`,
    sources: [],
    keywords: ['도라에몽', 'doraemon', '진구', '비밀도구'],
    tags: ['애니메이션', '일본'],
    needsReasoning: false
  },
  "포켓몬": {
    text: `**⚡ 포켓몬스터**\n\n1997년 첫 방영. 주인공 한지우, 파트너 피카츄.\n**게임**: 닌텐도 스위치, Pokémon GO`,
    sources: [],
    keywords: ['포켓몬', 'pokemon', '피카츄', 'pikachu'],
    tags: ['애니메이션', '게임'],
    needsReasoning: false
  },
  "감정위로": {
    text: `**💙 감정과 위로**\n\n모든 감정은 자연스러운 반응이야.\n\n**힘들 땐**: 깊은 호흡, 운동, 친구와 대화, 취미`,
    sources: [],
    keywords: ['힘들어', '슬퍼', '외로워', '불안', '화나', '위로', '우울', '고민', '스트레스', '감정'],
    tags: ['감정', '건강'],
    needsReasoning: false
  },
  "공부법": {
    text: `**📚 과학적 공부법**\n\n1. 능동적 회상 - 책 덮고 쓰기\n2. 간격 반복 - 1/3/7일 복습\n3. 파인만 테크닉 - 설명하듯 정리\n4. 뽀모도로 - 25분 집중 5분 휴식`,
    sources: [],
    keywords: ['공부', '공부법', '학습', '영어', '수학', '암기', '시험'],
    tags: ['교육'],
    needsReasoning: false
  },
  "과학": {
    text: `**🔬 과학**\n\n과학은 호기심에서 시작돼.\n**물리학** - 중력, 전기\n**화학** - 물질의 변화\n**생물학** - 세포, DNA\n**우주** - 태양계, 블랙홀`,
    sources: [],
    keywords: ['과학', '물리', '화학', '생물', '중력', '우주', 'DNA', '블랙홀'],
    tags: ['교육', '과학'],
    needsReasoning: false
  },
  "기술": {
    text: `**💻 기술/컴퓨터**\n\n**컴퓨터** - CPU, RAM, SSD\n**인터넷** - 1969년 ARPANET\n**프로그래밍** - Python, JavaScript, Java, C++\n**AI** - 머신러닝, 딥러닝`,
    sources: [],
    keywords: ['컴퓨터', '코딩', '프로그래밍', '인터넷', 'AI', '파이썬', 'python'],
    tags: ['기술', '교육'],
    needsReasoning: false
  },
  "건강": {
    text: `**💪 건강**\n\n**운동** - 주 150분. 하루 30분 걷기\n**수면** - 7~9시간\n**영양** - 탄수화물 45-65%, 물 2L`,
    sources: [],
    keywords: ['운동', '건강', '다이어트', '수면', '영양', '식단', '헬스'],
    tags: ['건강'],
    needsReasoning: false
  },
  "양말": {
    text: `**🧦 양말 (Socks)**\n\n**종류**: 스니커즈 삭스, 크루 삭스, 니삭스, 드레스 삭스\n**소재**: 면(통기성), 울(보온), 나일론(내구)\n**관리**: 뒤집어 세탁, 색상별 분리`,
    sources: [],
    keywords: ['양말', '삭스', 'socks', '발', '니삭스', '스니커즈'],
    tags: ['일상', '패션'],
    needsReasoning: false
  },
  "개발": {
    text: `**💻 개발자 정보**\n\n**언어**: Python, JavaScript, TypeScript, Java, C++\n**웹**: 프론트(React/Vue), 백엔드(Django/Spring)\n**GitHub**: git push/pull/commit\n**CSS 팁**: F12, flex→grid, box-sizing 체크`,
    sources: [{ title: "GitHub Docs", url: "https://docs.github.com" }, { title: "MDN Web Docs", url: "https://developer.mozilla.org" }],
    keywords: ['개발', '프로그래밍', '깃허브', 'github', 'css', 'html', '리액트', 'react', '노드', 'node', '풀스택', '버그'],
    tags: ['기술', '개발'],
    needsReasoning: false
  },
  "종교": {
    text: `**🙏 주요 종교 정보**\n\nChat K Plus는 모든 종교를 존중해.\n\n**기독교** - 성경, 예수. 천주교/개신교/정교회\n**불교** - 팔만대장경, 석가모니, 윤회\n**이슬람** - 쿠란, 무함마드\n**힌두교** - 베다, 윤회, 해탈\n**유교** - 사서삼경, 공자/맹자`,
    sources: [],
    keywords: ['종교', '기독교', '불교', '이슬람', '힌두교', '유교', '하나님', '예수', '부처', '성경', '교회', '기도', '코란', '공자'],
    tags: ['종교', '문화'],
    needsReasoning: false
  },
  "정교회": {
    text: `**☦️ 정교회 (동방정교회)**\n\n2천년 역사의 기독교 전통.\n- 1054년 동서 분열, 비잔틴 중심\n- 이콘(성화상), 성찬례 중심\n- 콘스탄티노플 총대주교청, 러시아 정교회(최대)\n- 한국 정교회: 2004년 대교구 승격`,
    sources: [{ title: "한국 정교회", url: "https://www.orthodoxkorea.org" }],
    keywords: ['정교회', '동방정교회', '이콘', '성화상', '콘스탄티노플', '러시아정교회'],
    tags: ['종교', '기독교'],
    needsReasoning: false
  },
  "윤회": {
    text: `**🔄 윤회 (Samsara)**\n\n죽은 후 영혼이 다시 태어나는 순환.\n- 불교: 업(業)에 따라 육도윤회, 해탈(열반)\n- 힌두교: 아트만이 업에 따라 윤회, 목샤(해탈)\n- 버지니아대 스티븐슨 박사: 환생 사례 3,000건 연구`,
    sources: [{ title: "불교신문", url: "https://www.bulkyo21.com" }],
    keywords: ['윤회', '삼사라', '환생', '업', '업보', '열반', '해탈', '육도윤회'],
    tags: ['종교', '철학'],
    needsReasoning: false
  },
  "예수": {
    text: `**✝️ 예수 그리스도**\n\n- 탄생: 베들레헴 마구간\n- 공생애: 3년간 복음 전파, 12사도\n- 수난: 십자가형, 부활\n- 핵심: 하느님 사랑과 이웃 사랑, 산상수훈`,
    sources: [{ title: "가톨릭 교회", url: "https://www.catholic.or.kr" }],
    keywords: ['예수', '그리스도', 'jesus', 'christ', '십자가', '부활', '메시아'],
    tags: ['종교', '기독교', '역사'],
    needsReasoning: false
  },
  "사서삼경": {
    text: `**📜 사서삼경**\n\n**사서**: 논어, 맹자, 대학, 중용\n**삼경**: 시경, 서경, 주역\n\n2천년 동아시아 사상의 뿌리.`,
    sources: [{ title: "한국고전번역원", url: "https://www.koreanhistory.or.kr" }],
    keywords: ['사서삼경', '논어', '맹자', '대학', '중용', '시경', '서경', '주역', '공자'],
    tags: ['종교', '철학', '역사'],
    needsReasoning: false
  },
  "MDN": {
    text: `**📚 MDN Web Docs**\n\nMozilla의 웹 개발 문서.\n- HTML/CSS/JavaScript 레퍼런스\n- 한국어 지원\n- 무료\n\n💻 developer.mozilla.org`,
    sources: [{ title: "MDN Web Docs", url: "https://developer.mozilla.org/ko/" }],
    keywords: ['mdn', '모질라', '개발자문서', '웹문서', '레퍼런스'],
    tags: ['기술', '개발', '웹'],
    needsReasoning: false
  },
  "음료": {
    text: `**🥤 음료 정보**\n\n☕ **커피**\n- 아메리카노: 5kcal, 카페인 150mg\n- 카페라떼: 120kcal\n\n🍵 **차**\n- 녹차: 항산화, 카테킨\n- 홍차: 완전 발효`,
    sources: [{ title: "식품의약품안전처", url: "https://www.foodsafetykorea.go.kr" }],
    keywords: ['음료', '커피', '차', '녹차', '홍차', '콜라', '사이다', '주스', '물', '라떼', '아메리카노'],
    tags: ['일상', '건강', '식품'],
    needsReasoning: false
  }
};

const blockedReplies = [
  `${userName}님, 해당 질문은 Chat K Plus 정책상 답변이 어려워요. 😊\n\n✨ 대신 자신 있게 답할 수 있는 분야를 소개할게요!\n\n🔬 과학·물리·화학·우주\n💻 프로그래밍·코딩·웹개발\n📚 공부법·영어·학습전략\n💪 건강·운동·수면·영양\n🎬 한국영화·감독·배우\n🙏 종교·철학·역사\n🥤 음료·커피·차\n🚗 또봇·도라에몽·포켓몬\n\n무엇부터 알아볼까요? 😄`,
  `${userName}님, 그 주제는 Chat K Plus 정책상 다루기 어려워요.\n\n하지만 실망하지 마세요! 제가 특히 잘 아는 분야를 소개할게요.\n\n📖 역사 팩트체크\n💙 감정 상담과 위로\n🧦 일상 꿀팁\n📱 아이폰 트러블슈팅\n\n관심 있는 주제가 있다면 편하게 물어봐주세요! 🌟`,
  `${userName}님, 미안하지만 그 질문은 답변이 어려워요.\n\n대신 지금 바로 물어볼 수 있는 인기 질문을 추천드려요!\n\n"과학이 뭐야?"\n"공부 잘하는 법"\n"또봇 정보 알려줘"\n"아이폰 터치 안 될 때 해결법"\n"음료별 칼로리 비교"\n\n무엇부터 알아볼까요? 😄`
];

const replies = {
  greeting: [`안녕 ${userName}! 😊 뭐 도와줄까?`, `ㅎㅇ ${userName}!`, `반가워 ${userName}.`],
  thanks: [`ㅇㅋ ${userName}.`, `별거 아냐.`, `ㄱㅅ.`],
  nameSet: [`알았어 ${userName}!`, `ㅇㅋ ${userName}로 기억.`, `좋아 ${userName}.`],
  reasoning: [`데이터 파는 중...`, `1차 실패. 2차 추론.`, `좀 더 찾을게.`],
  retrying: [
    `추가 추론 시작! 더 깊이 파고들어볼게. (추가 1회차)`,
    `한 번 더 찾아볼게. 포기하지 마! (추가 2회차)`,
    `마지막 시도야. 최선을 다할게! (추가 3회차)`
  ],
  failed: [
    `${userName}, 3차까지 추론했는데 데이터가 없어. ${TEAM_EMAIL}로 피드백 보내줘!\n\n💡 "다시 추론해봐" 또는 "한번 더 찾아줘"라고 말하면 추가 추론을 시도할게!`,
    `미안. 지식베이스에 없어.\n\n💡 "다시 추론해봐"라고 말하면 추가 추론을 시도할게!`
  ],
  englishRejection: [
    `${userName}, 영어 질문은 아직 지원하지 않아요. 🚫\n\nChat K Plus는 현재 한국어에 최적화되어 있고, 영어 학습 데이터가 충분하지 않아서 정확한 답변이 어려워요.\n\n💡 같은 질문을 한국어로 해보시겠어요? 한국어로 질문하면 더 정확하고 친절하게 답변해 드릴 수 있어요! 😊`,
    `${userName}, 죄송합니다. 아직 영어 답변은 학습되지 않았어요. 📚\n\nChat K Plus는 한국어 특화 AI라서 영어보다는 한국어로 질문해 주시면 훨씬 더 도움이 될 거예요.\n\n✨ 한국어로 다시 물어봐 주시겠어요?`
  ],
  maxRetriesReached: [
    `${userName}, 이 질문에 대한 추가 추론 횟수를 모두 사용했어. ⚠️\n\n지식베이스에 없는 내용은 아무리 추론해도 찾을 수 없어.\n\n💡 제안:\n- ${TEAM_EMAIL}로 피드백을 보내주면 검토 후 지식베이스에 추가할게\n- "다른 주제로 추론해봐"라고 말하면 새로운 주제로 추론을 시작할 수 있어\n- 다른 키워드로 질문을 바꿔서 물어봐`,
    `${userName}, 더 이상의 추가 추론은 불가능해. 🚫\n\n이 주제에 대해서는 지식베이스 검색과 추론을 모두 마쳤어.\n\n📧 더 정확한 정보가 필요하다면 ${TEAM_EMAIL}로 피드백을 보내줘.\n💡 "다른 주제로 추론해봐"라고 말해보는 건 어때?`
  ],
  stopped: [`⏸️ 중단됐어 ${userName}.`, `${userName}, 답변 중단.`]
};

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

// ===== 검색 함수 (영어 질문 감지 추가) =====
function searchKnowledge(text) {
  const lt = text.toLowerCase().trim(), nt = normalizeKeyword(lt);
  
  // 영어 질문 감지 - 검색 전에 먼저 체크
  if (isEnglishQuery(text)) return { type: 'english' };
  
  if (greetingPatterns.test(lt)) return { type: 'greeting' };
  if (chartPattern.test(lt)) return { type: 'chart_wip' };
  if (systemPatterns.test(lt)) return { data: knowledgeBase["사양"], confidence: 1.0, direct: true };
  if (identityPatterns.test(lt)) return { type: 'identity' };
  if (krlPattern.test(lt)) return { data: knowledgeBase["KRL"], confidence: 1.0, direct: true };
  
  const urineKeywords = ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '배뇨'];
  if (urineKeywords.some(k => nt.includes(k))) {
    const detailKeys = ['남성', '여성', '트랜스젠더', '남아', '여아'];
    const foundKey = detailKeys.find(k => nt.includes(k));
    if (foundKey) return { data: knowledgeBase["오줌"], confidence: 1.0, direct: true, subKey: foundKey };
    return { data: knowledgeBase["오줌"], confidence: 1.0, direct: false, useSummary: true };
  }
  
  if (nt.includes('아이폰') || nt.includes('iphone')) return { data: knowledgeBase["아이폰"], confidence: 1.0, direct: true };
  if (nt.includes('mdn') || nt.includes('모질라')) return { data: knowledgeBase["MDN"], confidence: 1.0, direct: true };
  
  const drinkKeywords = ['음료', '커피', '차', '녹차', '홍차', '콜라', '사이다', '주스', '물', '마실', '라떼', '아메리카노'];
  if (drinkKeywords.some(k => nt.includes(k))) return { data: knowledgeBase["음료"], confidence: 1.0, direct: true };
  
  const religionKeywords = ['종교', '기독교', '불교', '이슬람', '힌두교', '유교', '하나님', '예수', '부처', '석가', '성경', '교회', '기도', '성당', '절', '코란', '쿠란', '공자', '천주교', '개신교', '정교회', '윤회', '사서삼경', '논어', '맹자', '대학', '중용', '시경', '서경', '주역', '그리스도', 'jesus', 'christ', '메시아', '이콘', '성화상', '삼사라', '환생'];
  if (religionKeywords.some(k => nt.includes(k))) {
    if (nt.includes('정교회') || nt.includes('이콘')) return { data: knowledgeBase["정교회"], confidence: 1.0, direct: true };
    if (nt.includes('윤회') || nt.includes('환생')) return { data: knowledgeBase["윤회"], confidence: 1.0, direct: true };
    if (nt.includes('예수') || nt.includes('그리스도') || nt.includes('jesus')) return { data: knowledgeBase["예수"], confidence: 1.0, direct: true };
    if (nt.includes('사서삼경') || nt.includes('논어') || nt.includes('맹자')) return { data: knowledgeBase["사서삼경"], confidence: 1.0, direct: true };
    return { data: knowledgeBase["종교"], confidence: 1.0, direct: true };
  }
  
  const devKeywords = ['개발', '프로그래밍', '깃허브', 'github', 'css', 'html', '리액트', 'react', '노드', 'node', '풀스택', '버그'];
  if (devKeywords.some(k => nt.includes(k))) return { data: knowledgeBase["개발"], confidence: 1.0, direct: true };
  
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (data.keywords && data.keywords.some(k => nt.includes(k))) return { data, confidence: 1.0, direct: !data.needsReasoning };
  }
  
  return null;
}

// ===== 추론 함수 (정밀 스코어링) =====
function deepReasoning(query, attempt) {
  const rawWords = normalizeKeyword(query).toLowerCase().replace(/[?!.]/g,' ').split(' ').filter(w => w.length > 1);
  if (rawWords.length === 0) return null;
  
  // 단어 가중치: 긴 단어일수록 중요도 높음
  const words = rawWords.map(w => ({ word: w, weight: Math.min(w.length, 6) }));
  
  let bestMatch = null, bestScore = 0;
  
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (!data.keywords) continue;
    let score = 0;
    
    data.keywords.forEach(k => {
      const kwLower = k.toLowerCase();
      words.forEach(({ word, weight }) => {
        // 정확히 일치 (높은 가중치)
        if (word === kwLower) score += 6 * weight;
        // 키워드가 단어를 포함 (중간 가중치)
        else if (kwLower.includes(word)) score += 4 * weight;
        // 단어가 키워드를 포함 (중간 가중치)
        else if (word.includes(kwLower)) score += 3 * weight;
        // 부분 일치 (낮은 가중치)
        else if (word.length >= 3 && kwLower.length >= 3) {
          if (word.substring(0, 3) === kwLower.substring(0, 3)) score += 2;
          if (word.slice(-2) === kwLower.slice(-2)) score += 1;
        }
      });
    });
    
    // 태그 기반 가중치
    if (data.tags) {
      data.tags.forEach(t => {
        words.forEach(({ word }) => {
          if (t.includes(word) || word.includes(t)) score += 2;
        });
      });
    }
    
    if (score > bestScore) { bestScore = score; bestMatch = data; }
  }
  
  // 시도 횟수에 따라 임계값 완화
  const threshold = Math.max(2, 8 - attempt * 2);
  if (bestScore >= threshold && bestMatch) {
    return { data: bestMatch, confidence: Math.min(bestScore / 20, 1.0) };
  }
  
  return null;
}

// ===== 재추론 함수 =====
function retryReasoning(query, msgId, previousAttempts = 0) {
  const attemptKey = query.trim();
  
  if (!retryCount[attemptKey]) retryCount[attemptKey] = 0;
  
  if (retryCount[attemptKey] >= MAX_EXTRA_RETRIES) {
    const maxMsg = replies.maxRetriesReached[Math.floor(Math.random() * replies.maxRetriesReached.length)];
    streamText(maxMsg.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
    return;
  }
  
  retryCount[attemptKey]++;
  const currentRetry = retryCount[attemptKey];
  
  setAnsweringState(true);
  
  const te = addTyping(msgId, previousAttempts + currentRetry);
  const rMsg = replies.retrying[Math.min(currentRetry - 1, replies.retrying.length - 1)];
  const rText = rMsg.replaceAll('${userName}', userName).replace(/\$\{(\d+)\}/g, currentRetry);
  
  setTimeout(() => {
    if (te) {
      const textEl = te.querySelector('.loading-text');
      if (textEl) textEl.textContent = rText;
    }
  }, 200);
  
  let elapsed = 0, attempt = 1, timeoutTriggered = false;
  const timer = setInterval(() => {
    if (timeoutTriggered) return;
    elapsed += 100;
    if (elapsed % RETRY_INTERVAL === 0 && elapsed < REASONING_TIMEOUT) {
      attempt++;
      if (attempt > MAX_RETRY_ATTEMPTS) {
        timeoutTriggered = true; clearInterval(timer);
        if (te) te.remove();
        lastFailedQuery = query;
        const f = replies.failed[Math.floor(Math.random() * replies.failed.length)];
        streamText(f.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
        return;
      }
      const result = deepReasoning(query, attempt + previousAttempts);
      if (result && result.confidence >= 0.2) {
        clearInterval(timer); if (te) te.remove();
        streamTextWithSources(result.data.text + addEmotionalEnding(result.data.tags), result.data.sources || [], 'ai', msgId, false);
        delete retryCount[attemptKey];
        return;
      }
    }
    if (elapsed >= REASONING_TIMEOUT && !timeoutTriggered) {
      timeoutTriggered = true; clearInterval(timer);
      if (te) te.remove();
      lastFailedQuery = query;
      const f = replies.failed[Math.floor(Math.random() * replies.failed.length)];
      streamText(f.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
    }
  }, 100);
}

function sendBlockedMessage(msgId) {
  const randomBlocked = blockedReplies[Math.floor(Math.random() * blockedReplies.length)];
  const finalText = randomBlocked.replaceAll('${userName}', userName);
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div');
  msg.className = 'msg ai blocked';
  msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text">${finalText}</div></div>`;
  chatList.appendChild(msg);
  scrollToBottom();
  setAnsweringState(false);
  autoResize();
}

function sendMessage() {
  if (isAnswering) { stopStreaming(true); return; }
  getElements();
  const text = userInput ? userInput.value.trim() : '';
  if (!text) return;
  
  if (welcomeScreen) { welcomeScreen.classList.add('hidden'); welcomeScreen.style.display = 'none'; }
  if (chatList) { chatList.classList.add('has-messages'); chatList.style.display = 'block'; }
  closeSidebar();
  
  if (isInappropriateContent(text)) {
    const mid = Date.now();
    addMessage(text, 'user', mid);
    if (userInput) { userInput.value = ''; autoResize(); }
    if (sendBtn) sendBtn.classList.remove('has-text');
    sendBlockedMessage(mid);
    return;
  }
  
  const mid = Date.now();
  addMessage(text, 'user', mid);
  if (userInput) { userInput.value = ''; autoResize(); }
  if (sendBtn) sendBtn.classList.remove('has-text');
  
  // 다른 주제 재추론 요청 감지
  if (newTopicRetryPattern.test(text)) {
    setAnsweringState(true);
    const te = addTyping(mid, 0);
    setTimeout(() => {
      if (te) te.remove();
      lastFailedQuery = null;
      retryCount = {};
      streamText(`🔄 추론 시스템이 초기화되었어! 새로운 주제로 다시 시작할 준비가 됐어.\n\n어떤 주제에 대해 알아보고 싶어? 편하게 물어봐 ${userName}! 😊`, 'ai', mid, false);
    }, 400);
    return;
  }
  
  // 재추론 요청 감지
  if (retryPattern.test(text)) {
    const lastQ = getLastFailedQuery();
    if (lastQ) {
      const attemptKey = lastQ.trim();
      const currentCount = retryCount[attemptKey] || 0;
      
      if (currentCount >= MAX_EXTRA_RETRIES) {
        const maxMsg = replies.maxRetriesReached[Math.floor(Math.random() * replies.maxRetriesReached.length)];
        addMessage(maxMsg.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', mid);
        setAnsweringState(false);
        autoResize();
        return;
      }
      
      retryReasoning(lastQ, mid, MAX_RETRY_ATTEMPTS);
    } else {
      setAnsweringState(true);
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); streamText(`재추론할 이전 질문이 없어. 새로운 질문을 입력해줘 ${userName}! 😊`, 'ai', mid, false); }, 400);
    }
    return;
  }
  
  setAnsweringState(true);
  
  const nameMatch = text.match(nameSetPattern);
  if (nameMatch) {
    userName = nameMatch[1];
    localStorage.setItem('chatkUserName', userName);
    updateWelcomeTitle();
    const te = addTyping(mid, 0);
    setTimeout(() => { if (te) te.remove(); const r = replies.nameSet[Math.floor(Math.random()*replies.nameSet.length)]; streamText(r.replaceAll('${userName}',userName), 'ai', mid, false); }, 400);
    return;
  }
  
  const kb1 = searchKnowledge(text);
  
  if (kb1) {
    // 영어 질문 처리
    if (kb1.type === 'english') {
      const te = addTyping(mid, 0);
      setTimeout(() => {
        if (te) te.remove();
        const engMsg = replies.englishRejection[Math.floor(Math.random() * replies.englishRejection.length)];
        streamText(engMsg.replaceAll('${userName}', userName), 'ai', mid, false);
      }, 400);
      return;
    }
    
    if (kb1.type === 'greeting') {
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); const r = replies.greeting[Math.floor(Math.random()*replies.greeting.length)]; streamText(r.replaceAll('${userName}',userName), 'ai', mid, false); }, 400);
      return;
    }
    
    if (kb1.type === 'identity') {
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); streamText(MODEL_IDENTITY.desc + addEmotionalEnding(['기술']), 'ai', mid, false); }, 400);
      return;
    }
    
    if (kb1.type === 'chart_wip') {
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); streamText(`**📊 표/그래프 기능 안내**\n\n표와 그래프 기능은 현재 준비 중이에요! 🛠️\n\n조금만 기다려 주시면 더 예쁘고 정확한 표와 그래프로 찾아올게요.\n\n지금은 텍스트로 정보를 보여드릴 수 있으니, 궁금한 주제를 말씀해 주세요!` + addEmotionalEnding(['기술']), 'ai', mid, false); }, 400);
      return;
    }
    
    if (kb1.useSummary) {
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); streamTextWithSources(kb1.data.summary + addEmotionalEnding(kb1.data.tags), kb1.data.sources, 'ai', mid, false); }, 500);
      return;
    }
    
    if (kb1.subKey && kb1.data.details) {
      const dt = kb1.data.details[kb1.subKey];
      if (dt) {
        const te = addTyping(mid, 0);
        setTimeout(() => { if (te) te.remove(); streamTextWithSources(dt + addEmotionalEnding(kb1.data.tags), kb1.data.sources, 'ai', mid, false); }, 500);
        return;
      }
    }
    
    if (kb1.direct && kb1.data.text) {
      const te = addTyping(mid, 0);
      setTimeout(() => { if (te) te.remove(); streamTextWithSources(kb1.data.text + addEmotionalEnding(kb1.data.tags), kb1.data.sources || [], 'ai', mid, false); }, 500);
      return;
    }
  }
  
  const te = addTyping(mid, 0);
  startReasoning(text, mid, te);
}

function startReasoning(query, msgId, typingEl) {
  let elapsed = 0, attempt = 1, timeoutTriggered = false;
  const ult = (a) => { if (!typingEl) return; const t = typingEl.querySelector('.loading-text'); if (t) t.textContent = (replies.reasoning[a-1] || replies.reasoning[0]).replaceAll('${userName}', userName); };
  ult(1);
  const timer = setInterval(() => {
    if (timeoutTriggered) return;
    elapsed += 100;
    if (elapsed % RETRY_INTERVAL === 0 && elapsed < REASONING_TIMEOUT) {
      attempt++;
      if (attempt > MAX_RETRY_ATTEMPTS) {
        timeoutTriggered = true; clearInterval(timer);
        if (typingEl) typingEl.remove();
        lastFailedQuery = query;
        const f = replies.failed[Math.floor(Math.random()*replies.failed.length)];
        streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL), 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }
      ult(attempt);
      const result = deepReasoning(query, attempt);
      if (result && result.confidence >= 0.2) {
        clearInterval(timer); if (typingEl) typingEl.remove();
        streamTextWithSources(result.data.text + addEmotionalEnding(result.data.tags), result.data.sources || [], 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }
    }
    if (elapsed >= REASONING_TIMEOUT && !timeoutTriggered) {
      timeoutTriggered = true; clearInterval(timer);
      if (typingEl) typingEl.remove();
      lastFailedQuery = query;
      const f = replies.failed[Math.floor(Math.random()*replies.failed.length)];
      streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL), 'ai', msgId, false);
      activeReasoning.delete(msgId);
    }
  }, 100);
  activeReasoning.set(msgId, { timer, attempts: attempt, typingEl });
}

function getLastFailedQuery() { return lastFailedQuery; }

function addMessage(text, type, msgId) { if (!chatList) return; const m = document.createElement('div'); m.className = `msg ${type}`; m.dataset.msgId = msgId; m.innerHTML = `<div class="avatar">${type==='user'?userName[0].toUpperCase():'C'}</div><div class="bubble">${text}</div>`; chatList.appendChild(m); scrollToBottom(); }

function streamTextWithSources(text, sources, type, msgId, isBlocked = false) {
  if (!chatList) return; if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const m = document.createElement('div'); m.className = `msg ${type} ${isBlocked?'blocked':''}`; m.dataset.msgId = msgId;
  m.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div>${sources&&sources.length?'<div class="sources"></div>':''}</div>`; chatList.appendChild(m); currentMsgElement = m;
  const bubble = m.querySelector('.msg-text'), sourcesEl = m.querySelector('.sources'); let i = 0;
  currentStreamInterval = setInterval(() => { if (!isAnswering) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; return; } if (bubble) bubble.textContent += text[i]; i++; scrollToBottom(); if (i >= text.length) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; if (sources&&sources.length&&sourcesEl) sourcesEl.innerHTML = '<div class="sources-title">출처</div>'+sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join(''); setAnsweringState(false); } }, 4);
}

function streamText(text, type, msgId, isBlocked = false) {
  if (!chatList) return; if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div'); msg.className = `msg ${type}`; msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div></div>`; chatList.appendChild(msg); currentMsgElement = msg;
  const bubble = msg.querySelector('.msg-text'); let i = 0;
  currentStreamInterval = setInterval(() => { if (!isAnswering) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; return; } if (bubble) bubble.textContent += text[i]; i++; scrollToBottom(); if (i >= text.length) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; setAnsweringState(false); } }, 5);
}

function addTyping(msgId, attempt) { if (!chatList) return null; const m = document.createElement('div'); m.className = 'msg ai typing'; m.dataset.msgId = msgId; m.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="loading-wrap"><div class="loading-text">데이터 파고드는 중...</div><div class="loading-bar"></div><div class="loading-time">최대 15초 소요</div></div></div>`; chatList.appendChild(m); scrollToBottom(); return m; }
function autoResize() { if (!userInput) return; userInput.style.height = 'auto'; userInput.style.height = userInput.scrollHeight+'px'; if (sendBtn) { if (userInput.value.trim()&&!isAnswering) sendBtn.classList.add('has-text'); else sendBtn.classList.remove('has-text'); } }
function scrollToBottom() { if (chatList) chatList.scrollTop = chatList.scrollHeight; }

function toggleTheme() { document.body.classList.toggle('light'); if (!
