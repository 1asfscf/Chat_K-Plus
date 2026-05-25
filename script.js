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
  desc: `나는 ${MODEL_NAME}이야. 스튜디오 페라리에서 제작한 AI야. Meta의 Muse Spark를 기반으로 하되, KRL(Knowledge Reasoning Layer) 엔진으로 한국 언어/문화에 최적화됐어. 역사 팩트체크, 개발, 건강 가이드, 영화, 일상 대화를 도와준다. 실시간 검색은 안 되고 2025-09-04까지 데이터로 학습했어.`
});

let userName = localStorage.getItem('chatkUserName') || '성민';
let isAnswering = false;
let currentStreamInterval = null;
let currentMsgElement = null;

const REASONING_TIMEOUT = 15000;
const RETRY_INTERVAL = 5000;
const MAX_RETRY_ATTEMPTS = 3;
const activeReasoning = new Map();

// 의학 화이트리스트
const MEDICAL_WHITELIST = [
  '오줌', '소변', '뇨', '배뇨', '방광', '신장', '요로', '요도', '전립선',
  '방광염', '요로감염', '혈뇨', '단백뇨', '야뇨', '빈뇨', '잔뇨',
  '비뇨기과', '신우신염', '귀두염', '외음부염', '호르몬', 'HRT'
];

// 성적 금지어
const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성관계', '성행위',
  '유두', '가슴', '엉덩이', '팬티', '빤스', 'panty', 'panties', '브라', '속옷',
  '란제리', '속바지', '알몸', '누드', 'nude', '강간', '성폭행', '성추행', '성희롱',
  '몰카', '딥페이크', '페티시', 'sm', 'bdsm', '야한', '에로', '성인', '19금', '음란',
  '보지', '자지', '좆', '씨발', '씨벌', 'fuck', '딸이', '사정', '오르가즘'
];

const BANNED_EMOJIS = ['🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿', '🖖', '🤬', '😡', '🤢', '🤮', '💩'];

function normalizeText(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_\.·ㆍ‥…0-9]/g, '').replace(/ㅍㅐㅇㅔㄴㅌㅣ|패엔티|페엔티|팬ㅌㅣ|p4nty|p@nty|panty|panties/g, '팬티').replace(/ㅅㅔㄱㅅㅡ|섹ㅅ/g, '섹스');
}

const SEXUAL_PATTERN = new RegExp(SEXUAL_BLACKLIST.map(w => normalizeText(w)).join('|'), 'i');

function isInappropriateContent(text) {
  const normalized = normalizeText(text);
  if (BANNED_EMOJIS.some(e => text.includes(e))) return true;
  if (MEDICAL_WHITELIST.some(w => text.toLowerCase().includes(w))) return false;
  return SEXUAL_PATTERN.test(normalized) || SEXUAL_BLACKLIST.some(w => normalized.includes(normalizeText(w)));
}

const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음|방가|안녕하세요)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai|챗).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는)/i;
const krlPattern = /krl.*(뭐|무엇|뭔데|뭔지|설명|알려|뜻)/i;

const KEYWORD_ALIASES = { '여야': '여아', '남자': '남성', '여자': '여성', '트젠': '트랜스젠더', '아이': '남아', '어린이': '남아' };

// ===== 확장된 지식베이스 =====
const knowledgeBase = {
  // 기존 지식
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
**특징**: 이름 기억, 출처 인용, 15초 추론, 콘텐츠 필터, 건강 가이드, 영화 정보, 애니메이션/게임 정보

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
    sources: [{ title: "스튜디오 페라리 KRL 백서", url: "https://studio-ferrari.ai/krl" }],
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
      남성: `**성인 남성 배뇨 가이드**\n- 전립선 비대: 50대 이상 잔뇨감, 야간뇨 증가시 비뇨기과\n- 요도 20cm. 요로감염 드물지만 중증\n- 아침 첫 소변 거품은 단백뇨 의심`,
      여성: `**성인 여성 배뇨 가이드**\n- 요도 4cm. 방광염 빈발\n- 배뇨 후 앞에서 뒤로 닦기\n- 임신시 빈뇨 정상. 통증/혈뇨는 병원`,
      트랜스젠더: `**트랜스젠더 배뇨 가이드**\n- 트랜스여성(HRT): 스피로놀락톤 이뇨작용. 칼륨 체크\n- 트랜스남성(T): 요도 자극 가능. 수술별 배뇨 자세 다름\n- 공통: 호르몬 치료중 신장 정기검사`,
      남아: `**남아 배뇨 가이드**\n- 포경: 청결 유지. 무리한 젖힘 금지\n- 야뇨증: 5세 이후 주2회 이상 소아과\n- 소변줄기 가늘면 요도협착 의심`,
      여아: `**여아 배뇨 가이드**\n- 외음부염: 비누 과다금지. 면 속옷\n- 방광염: 배뇨통시 즉시 소아과\n- 변비시 배뇨장애 유발`
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
**1. 기생충 (2019)** - 봉준호 감독. 칸 황금종려상, 아카데미 작품상. 계급 갈등 블랙코미디.
**2. 올드보이 (2003)** - 박찬욱 감독. 칸 심사위원대상. 복수 3부작.
**3. 부산행 (2016)** - 연상호 감독. K-좀비 세계화. 좀비 아포칼립스 + 부성애.
**4. 헤어질 결심 (2022)** - 박찬욱 감독. 칸 감독상. 멜로 + 수사극.

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

**1. 소프트웨어** - iOS 최신 업데이트, 강제 재시동 (볼륨↑ → 볼륨↓ → 전원 길게)
**2. 화면 보호필름/케이스** - 두꺼운 강화유리, 케이스 간섭 확인 후 제거 테스트
**3. 터치 설정** - 설정 > 손쉬운 사용 > 터치 > 3D Touch/Haptic Touch 끄기
**4. 하드웨어** - 화면 교체 이력 있으면 정품 인증 필요. 물 침수, 낙하 손상시 서비스센터
**5. 앱 문제** - 특정 앱만 안 되면 앱 삭제 후 재설치

안 되면 ${TEAM_EMAIL}로 기기 정보 보내줘 ${userName}.`,
    sources: [{ title: "Apple 지원 - iPhone 터치 문제", url: "https://support.apple.com/ko-kr/HT201406" }],
    keywords: ['아이폰', 'iphone', '12', 'pro', '클릭', '터치', '안됨', '고장', '화면'],
    tags: ['기술', '애플'],
    needsReasoning: false
  },

  // ===== 추가된 지식 =====
  "또봇": {
    text: `**🚗 또봇 (Tobot) 완벽 정보**

또봇은 대한민국의 대표적인 변신 자동차 로봇 애니메이션이야! 2010년 첫 방영 이후 지금까지 사랑받는 스테디셀러 콘텐츠야.

**주요 또봇**
**또봇 X (파랑)** - 파일럿: 차하나 (첫째). 리더, 검술 특화. 성우: 박태성. 첫 등장: 시즌 1
**또봇 Y (노랑)** - 파일럿: 차두리 (둘째). 스피드 특화, 귀여움. 성우: 신경선. 첫 등장: 시즌 1
**또봇 Z (초록)** - 파일럿: 권세모 (막내/디룩). 힘 특화, 에이스. 성우: 신경선. 첫 등장: 시즌 2
**또봇 W (하양)** - 파일럿: 세모. 비행 능력 보유. 첫 등장: 시즌 3
**또봇 C (빨강)** - 파일럿: 독고오공. 소방차 변신. 첫 등장: 시즌 4
**또봇 D (주황)** - 파일럿: 독고온달. 불도저 변신. 첫 등장: 시즌 4

📺 **공식 채널**: 유튜브 @Tobot, tobot.co.kr
📱 **OTT**: 티빙, 웨이브, 넷플릭스 일부 시즌`,
    sources: [
      { title: "또봇 공식 유튜브", url: "https://www.youtube.com/@Tobot" },
      { title: "또봇 공식 홈페이지", url: "https://tobot.co.kr" }
    ],
    keywords: ['또봇', 'tobot', '변신', '자동차', '로봇', '차하나', '차두리', '권세모', 'X', 'Y', 'Z', '파랑', '노랑', '초록'],
    tags: ['애니메이션', '한국'],
    needsReasoning: false
  },
  "도라에몽": {
    text: `**🔔 도라에몽 (ドラえもん)**

1969년 후지코 F. 후지오가 만든 일본 국민 만화/애니메이션이야.

**기본 정보**
- 장르: SF, 코미디, 어드벤처
- 첫 연재: 1969년
- 애니메이션: 1973년 첫 방영

**주요 캐릭터**
- 도라에몽: 22세기에서 온 고양이형 로봇
- 노진구 (노비타): 운동도 공부도 못하지만 착한 마음
- 신이슬 (시즈카): 똑똑하고 상냥한 여자친구
- 왕비실 (스네오): 부잣집 아들
- 만퉁퉁 (자이언): 힘세고 노래 못 부르는 골목대장

**인기 비밀도구**: 어디로든 문, 대나무 헬리콥터, 타임머신, 4차원 주머니

📺 **시청**: 넷플릭스, 티빙, 대원방송`,
    sources: [{ title: "도라에몽 공식 - TV 아사히", url: "https://www.tv-asahi.co.jp/doraemon/" }],
    keywords: ['도라에몽', 'doraemon', '진구', '노비타', '이슬이', '퉁퉁이', '비실이', '고양이', '로봇', '비밀도구'],
    tags: ['애니메이션', '일본'],
    needsReasoning: false
  },
  "포켓몬": {
    text: `**⚡ 포켓몬스터 (Pokémon)**

전 세계에서 가장 인기 있는 애니메이션 중 하나야!

**기본 정보**
- 첫 방영: 1997년 (일본)
- 주인공: 한지우 (사토시)
- 파트너: 피카츄

**시리즈 구성**: 무인편(1997) → AG → DP → BW → XY → SM → W(여행) → 현재(2023)

**게임**: 닌텐도 스위치 (소드/실드, 스칼렛/바이올렛), 모바일 (Pokémon GO, Pokémon UNITE)`,
    sources: [{ title: "포켓몬 공식 사이트", url: "https://www.pokemon.co.jp" }],
    keywords: ['포켓몬', 'pokemon', '피카츄', 'pikachu', '포켓몬스터', '한지우'],
    tags: ['애니메이션', '게임'],
    needsReasoning: false
  },
  "감정위로": {
    text: `**💙 감정과 위로**

모든 감정은 자연스러운 반응이야. 억누르기보다 이해하는 게 중요해.

**기본 감정 6가지**
- 😊 기쁨 - 좋은 일이 생겼을 때
- 😢 슬픔 - 무언가를 잃었을 때
- 😤 분노 - 부당함을 느낄 때
- 😰 두려움 - 위험을 감지했을 때
- 😲 놀람 - 예상치 못한 일에
- 🤢 혐오 - 싫은 것을 마주했을 때

**힘들 땐 이렇게 해봐**
1. 깊은 호흡 (4초 들이마시고, 4초 참고, 4초 내쉬기)
2. 운동하기 (엔도르핀 분비로 기분 개선)
3. 친구와 대화하기
4. 취미 활동 즐기기

항상 혼자가 아니야 ${userName}. 필요하면 언제든 말해줘. 💙`,
    sources: [],
    keywords: ['힘들어', '슬퍼', '외로워', '불안', '화나', '위로', '우울', '고민', '스트레스', '감정', '짜증', '눈물'],
    tags: ['감정', '건강'],
    needsReasoning: false
  },
  "공부법": {
    text: `**📚 과학적으로 검증된 공부법**

**1. 능동적 회상** - 책 덮고 기억나는 대로 써보기
**2. 간격 반복** - 1일, 3일, 7일 후 복습
**3. 파인만 테크닉** - 남에게 설명하듯 정리
**4. 뽀모도로** - 25분 집중, 5분 휴식

**영어 공부법**
- 매일 10분 영어 듣기 (유튜브, 팟캐스트)
- 쉐도잉: 원어민 발음 따라하기
- 영어 일기 쓰기

꾸준함이 가장 중요해 ${userName}!`,
    sources: [],
    keywords: ['공부', '공부법', '학습', '영어', '수학', '암기', '시험', '집중'],
    tags: ['교육', '건강'],
    needsReasoning: false
  },
  "과학": {
    text: `**🔬 과학 정보**

과학은 실험과 관찰을 통해 세상의 원리를 알아내는 활동이야.

**물리학** - 우주의 기본 원리 연구. 중력, 전기, 양자역학
**화학** - 물질의 구성과 변화 연구. 물이 얼음 되는 것, 음식이 익는 것 모두 화학 반응
**생물학** - 살아있는 모든 것 연구. 세포, DNA, 진화
**우주** - 태양계, 블랙홀, 은하

호기심에서 시작하는 모든 질문이 과학의 시작이야 ${userName}!`,
    sources: [],
    keywords: ['과학', '물리', '화학', '생물', '중력', '우주', 'DNA', '블랙홀', '원자'],
    tags: ['교육', '과학'],
    needsReasoning: false
  },
  "기술": {
    text: `**💻 기술/컴퓨터 정보**

**컴퓨터 기초** - CPU(두뇌), RAM(작업공간), SSD(저장공간)
**인터넷** - 1969년 ARPANET으로 시작. WiFi는 무선 연결 기술
**프로그래밍** - Python(초보자 추천), JavaScript(웹), Java(기업용), C++(게임)
**AI** - 인공지능. 머신러닝, 딥러닝. ChatGPT, 자율주행, 의료 진단에 활용

Chat K Plus도 AI 기술로 만들어졌어!`,
    sources: [],
    keywords: ['컴퓨터', '코딩', '프로그래밍', '인터넷', 'AI', '파이썬', 'python', '기술'],
    tags: ['기술', '교육'],
    needsReasoning: false
  },
  "건강": {
    text: `**💪 건강 정보**

**운동** - WHO 권장: 주 150분 중강도 운동. 하루 30분 걷기부터 시작
**수면** - 성인 7~9시간 권장. 자기 전 스마트폰 멀리하기. 카페인 오후 2시 이후 금지
**영양** - 탄수화물 45-65%, 단백질 10-35%, 지방 20-35%. 하루 물 2L 이상

작은 습관부터 꾸준히 실천하는 게 중요해 ${userName}!`,
    sources: [],
    keywords: ['운동', '건강', '다이어트', '수면', '영양', '식단', '헬스'],
    tags: ['건강'],
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
    sendBtn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    sendBtn.style.background = 'var(--danger)';
    sendBtn.style.opacity = '1';
    sendBtn.style.cursor = 'pointer';
    userInput.placeholder = '답변 생성 중... (클릭하면 중단)';
  } else {
    sendBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    sendBtn.style.background = '';
    sendBtn.style.opacity = '1';
    sendBtn.style.cursor = 'pointer';
    userInput.placeholder = '메시지 입력...';
  }
}

function stopStreaming() {
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  activeReasoning.forEach(({ timer }) => clearInterval(timer));
  activeReasoning.clear();
  const typingEl = chatList.querySelector('.msg.ai.typing');
  if (typingEl) typingEl.remove();
  if (currentMsgElement) {
    const bubble = currentMsgElement.querySelector('.bubble,.msg-text');
    if (bubble && !bubble.textContent.includes('[중단됨]')) bubble.textContent += '\n\n[중단됨]';
  }
  currentMsgElement = null;
  setAnsweringState(false);
  autoResize();
}

function normalizeKeyword(text) {
  let normalized = text.toLowerCase();
  for (const [alias, target] of Object.entries(KEYWORD_ALIASES)) {
    if (normalized.includes(alias)) normalized = normalized.replace(new RegExp(alias, 'g'), target);
  }
  return normalized;
}

function determineOutputStyle(query, data) {
  const lowerQuery = query.toLowerCase();
  if (/뭐야|뭔데|알려줘|설명/.test(lowerQuery) && !data.subKey) return 'summary';
  if (data.subKey) return 'detail';
  if (/가이드|방법|팁|주의/.test(lowerQuery)) return 'guide';
  return 'summary';
}

function searchKnowledge(text) {
  const lowerText = text.toLowerCase().trim();
  const normalizedText = normalizeKeyword(lowerText);

  if (greetingPatterns.test(lowerText)) return { type: 'greeting' };
  if (krlPattern.test(lowerText)) return { data: knowledgeBase["KRL"], confidence: 1.0, direct: true };

  const urineKeywords = ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '배뇨'];
  if (urineKeywords.some(k => normalizedText.includes(k))) {
    const detailKeys = ['남성', '여성', '트랜스젠더', '남아', '여아'];
    const foundKey = detailKeys.find(k => normalizedText.includes(k));
    if (foundKey) return { data: knowledgeBase["오줌"], confidence: 1.0, direct: true, subKey: foundKey };
    else return { data: knowledgeBase["오줌"], confidence: 1.0, direct: false, useSummary: true };
  }

  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(k => normalizedText.includes(k))) {
      return { data, confidence: 1.0, direct: !data.needsReasoning };
    }
  }
  return null;
}

function deepReasoning(query, attempt) {
  const words = normalizeKeyword(query).toLowerCase().replace(/[?!.]/g, ' ').split(' ').filter(w => w.length > 1);
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
      words.forEach(w => { if (t.includes(w) || w.includes(t)) score += 1; });
    });
    if (score > bestScore) { bestScore = score; bestMatch = data; }
  }

  const threshold = Math.max(1, 4 - attempt);
  if (bestScore >= threshold && bestMatch) return { data: bestMatch, confidence: bestScore / 10 };

  // 광범위 키워드 매칭
  if (attempt >= 2) {
    const broadMatches = [
      { words: ['광주', '5월', '전두환', '계엄'], data: knowledgeBase["5.18"] },
      { words: ['모델', '스파크', '정보', '페라리', '사양', '스펙'], data: knowledgeBase["사양"] },
      { words: ['krl', '케이알엘', '엔진', '추론'], data: knowledgeBase["KRL"] },
      { words: ['오줌', '소변', '쉬', '화장실', '뇨'], data: knowledgeBase["오줌"] },
      { words: ['영화', '시네마', '무비', '감독', '배우'], data: knowledgeBase["영화"] },
      { words: ['아이폰', 'iphone', '애플', '터치', '클릭'], data: knowledgeBase["아이폰"] },
      { words: ['또봇', 'tobot', '변신', '자동차', '로봇'], data: knowledgeBase["또봇"] },
      { words: ['도라에몽', 'doraemon', '진구', '비밀도구', '고양이'], data: knowledgeBase["도라에몽"] },
      { words: ['포켓몬', 'pokemon', '피카츄'], data: knowledgeBase["포켓몬"] },
      { words: ['힘들어', '슬퍼', '외로워', '불안', '위로', '우울', '고민', '스트레스', '감정', '짜증'], data: knowledgeBase["감정위로"] },
      { words: ['공부', '공부법', '학습', '영어', '수학', '암기', '시험'], data: knowledgeBase["공부법"] },
      { words: ['과학', '물리', '화학', '생물', '중력', '우주', 'DNA', '블랙홀'], data: knowledgeBase["과학"] },
      { words: ['컴퓨터', '코딩', '프로그래밍', '인터넷', 'AI', '파이썬', 'python'], data: knowledgeBase["기술"] },
      { words: ['운동', '건강', '다이어트', '수면', '영양', '식단'], data: knowledgeBase["건강"] }
    ];
    for (const bm of broadMatches) {
      if (words.some(w => bm.words.includes(w))) return { data: bm.data, confidence: 0.5 };
    }
  }

  return null;
}

// ===== 클릭 이벤트 수정 =====
function sendMessage() {
  if (isAnswering) { stopStreaming(); return; }

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
    setTimeout(() => { streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true); }, 300);
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
    setTimeout(() => { typingEl.remove(); streamText(MODEL_IDENTITY.desc, 'ai', msgId, false); }, 400);
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
      setTimeout(() => { typingEl.remove(); streamTextWithSources(kb1.data.summary, kb1.data.sources, 'ai', msgId, false); }, 500);
      return;
    }

    if (kb1.subKey && kb1.data.details) {
      const detailText = kb1.data.details[kb1.subKey];
      if (detailText) {
        setTimeout(() => { typingEl.remove(); streamTextWithSources(detailText, kb1.data.sources, 'ai', msgId, false); }, 500);
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
        if (style === 'summary' && kb1.data.summary) outputText = kb1.data.summary;
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
    if (textEl) textEl.textContent = (replies.reasoning[attemptNum - 1] || replies.reasoning[0]).replaceAll('${userName}', userName);
  };

  updateLoadingText(1);

  const timer = setInterval(() => {
    if (timeoutTriggered) return;
    elapsed += 100;

    if (elapsed % RETRY_INTERVAL === 0 && elapsed < REASONING_TIMEOUT) {
      attempt++;
      if (attempt > MAX_RETRY_ATTEMPTS) {
        timeoutTriggered = true;
        clearInterval(timer);
        typingEl.remove();
        const failed = replies.feedback[Math.floor(Math.random() * replies.feedback.length)];
        streamText(failed.replaceAll('${userName}', userName).replaceAll('${TEAM_EMAIL}', TEAM_EMAIL), 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }

      updateLoadingText(attempt);
      const result = deepReasoning(query, attempt);
      if (result && result.confidence >= 0.3) {
        if (isInappropriateContent(result.data.text)) {
          clearInterval(timer); typingEl.remove();
          const blocked = replies.blocked[Math.floor(Math.random() * replies.blocked.length)];
          streamText(blocked.replaceAll('${userName}', userName), 'ai', msgId, true);
          activeReasoning.delete(msgId);
          return;
        }
        clearInterval(timer); typingEl.remove();
        const style = determineOutputStyle(query, result.data);
        let outputText = result.data.text;
        if ((style === 'summary' || result.useSummary) && result.data.summary) outputText = result.data.summary;
        streamTextWithSources(outputText, result.data.sources, 'ai', msgId, false);
        activeReasoning.delete(msgId);
        return;
      }
    }

    if (elapsed >= REASONING_TIMEOUT && !timeoutTriggered) {
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
  msg.innerHTML = `<div class="avatar">${type === 'user' ? userName[0].toUpperCase() : 'C'}</div><div class="bubble">${text}</div>`;
  chatList.appendChild(msg);
  scrollToBottom();
}

function streamTextWithSources(text, sources, type, msgId, isBlocked = false) {
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div');
  msg.className = `msg ${type} ${isBlocked ? 'blocked' : ''}`;
  msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div>${sources.length ? '<div class="sources"></div>' : ''}</div>`;
  chatList.appendChild(msg);
  currentMsgElement = msg;

  const bubble = msg.querySelector('.msg-text');
  const sourcesEl = msg.querySelector('.sources');

  let i = 0;
  currentStreamInterval = setInterval(() => {
    if (!isAnswering) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; return; }
    bubble.textContent += text[i]; i++; scrollToBottom();
    if (i >= text.length) {
      clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null;
      if (sources.length && sourcesEl) {
        sourcesEl.innerHTML = '<div class="sources-title">출처</div>' + sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');
      }
      setAnsweringState(false);
    }
  }, 4);
}

function streamText(text, type, msgId, isBlocked = false) {
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div');
  msg.className = `msg ${type} ${isBlocked ? 'blocked' : ''}`;
  msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"></div>`;
  chatList.appendChild(msg);
  currentMsgElement = msg;

  const bubble = msg.querySelector('.bubble');
  let i = 0;
  currentStreamInterval = setInterval(() => {
    if (!isAnswering) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; return; }
    bubble.textContent += text[i]; i++; scrollToBottom();
    if (i >= text.length) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; setAnsweringState(false); }
  }, 5);
}

function addTyping(msgId, attempt) {
  const msg = document.createElement('div');
  msg.className = 'msg ai typing';
  msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="loading-wrap"><div class="loading-text">데이터 파고드는 중...</div><div class="loading-bar"></div><div class="loading-time">최대 15초 소요</div></div></div>`;
  chatList.appendChild(msg);
  scrollToBottom();
  return msg;
}

function autoResize() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
  if (userInput.value.trim() && !isAnswering) sendBtn.classList.add('has-text');
  else sendBtn.classList.remove('has-text');
}

function scrollToBottom() { chatList.scrollTop = chatList.scrollHeight; }

function toggleTheme() {
  document.body.classList.toggle('light');
  const icon = themeToggle.querySelector('.icon');
  const text = themeToggle.querySelector('.text');
  if (document.body.classList.contains('light')) { icon.textContent = '☀️'; text.textContent = '라이트'; }
  else { icon.textContent = '🌙'; text.textContent = '다크'; }
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

function toggleSidebar() { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

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

// ===== 이벤트 리스너 (클릭 문제 해결) =====
function init() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.querySelector('.icon').textContent = '☀️';
    themeToggle.querySelector('.text').textContent = '라이트';
  }

  updateWelcomeTitle();

  if (chatList.children.length === 0 && welcomeScreen) {
    welcomeScreen.classList.remove('hidden');
  }

  // 전송 버튼 클릭
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
  });

  // 엔터키 전송
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 입력 감지
  userInput.addEventListener('input', autoResize);

  // 테마 토글
  themeToggle.addEventListener('click', toggleTheme);

  // 메뉴 버튼
  menuBtn.addEventListener('click', toggleSidebar);

  // 새 채팅
  if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);

  // 오버레이 클릭
  overlay.addEventListener('click', closeSidebar);

  // 중단 버튼 (답변 생성 중 클릭)
  sendBtn.addEventListener('click', (e) => {
    if (isAnswering) {
      e.preventDefault();
      stopStreaming();
    }
  });
}

// 예시 카드 클릭
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

// ===== 실행 =====
document.addEventListener('DOMContentLoaded', () => {
  init();
  initExampleCards();
});
