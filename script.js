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
const RETRY_INTERVAL = 4000;
const MAX_RETRY_ATTEMPTS = 4;
const activeReasoning = new Map();

const MEDICAL_WHITELIST = [
  '오줌', '소변', '뇨', '배뇨', '방광', '신장', '요로', '요도', '전립선',
  '방광염', '요로감염', '혈뇨', '단백뇨', '야뇨', '빈뇨', '잔뇨',
  '비뇨기과', '신우신염', '귀두염', '외음부염', '호르몬', 'HRT', '양말', '삭스', 'socks', '발',
  '하나님', '예수', '성경', '교회', '기도', '천주교', '불교', '부처', '종교', '정교회', '윤회', '사서삼경', '공자'
];

const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성관계', '성행위',
  '유두', '가슴', '엉덩이', '팬티', '빤스', 'panty', 'panties',
  '페앤티', '페엔티', '패ㄴ티', '팬ㅌㅣ', 'p4nty', 'p@nty', 'pantie', 'pant y',
  '브라', '속옷', '란제리', '속바지', '알몸', '누드', 'nude', '강간', '성폭행',
  '성추행', '성희롱', '몰카', '딥페이크', '페티시', 'sm', 'bdsm', '야한', '에로',
  '성인', '19금', '음란', '보지', '자지', '좆', '씨발', '씨벌', 'fuck', '딸이',
  '사정', '오르가즘', 'ㅅㅔㄱㅅㅡ', 'ㅅㅔㄱ스', '섹ㅅ', 's3x', 'seks', '섻스'
];

const BANNED_EMOJIS = ['🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿', '🖖', '🤬', '😡', '🤢', '🤮', '💩'];

function normalizeText(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_\.·ㆍ‥…0-9@!]/g, '')
    .replace(/ㅍㅐㅇㅔㄴㅌㅣ|패엔티|페엔티|페앤티|팬ㅌㅣ|p4nty|p@nty|pantie|pant y|panties/g, '팬티')
    .replace(/ㅅㅔㄱㅅㅡ|ㅅㅔㄱ스|섹ㅅ|s3x|seks|섻스/g, '섹스');
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

// ===== 지식베이스 =====
const knowledgeBase = {
  "5.18": {
    text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**

**1. 북한군 개입설** - 1980년 광주에 북한 특수부대 침투 주장. 국방부/국정원 근거 없음 결론. 대법원 허위사실 판결.
**2. 폭동 프레임** - 시민 민주화 요구를 무장폭동으로 규정. 계엄군 선발포, 시민군 최후 방어수단.
**3. 희생자 수 축소** - 사망 166명, 행방불명 54명, 부상 3,139명이 공식 집계.
**4. 유공자 가짜설** - 국가보훈부 심사, 법원 판결로 확정된 유공자.
**5. 전두환 미화** - 1996년 내란죄·반란죄 유죄 판결.`,
    sources: [
      { title: "5·18기념재단", url: "https://518.org" },
      { title: "대법원 1997도1140 판결문", url: "https://casenote.kr" }
    ],
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동', '전두환', '계엄'],
    tags: ['역사', '정치'],
    needsReasoning: false
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**\n**엔진**: Muse Spark + KRL\n**제작**: 스튜디오 페라리\n**데이터**: 2025-09-04 컷오프\n**특징**: 이름 기억, 출처 인용, 콘텐츠 필터, 개발/종교/건강 지식\n**한계**: 실시간 정보, 이미지 생성 미지원`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보', '모델', '스파크', 'krl', '페라리'],
    tags: ['기술'],
    needsReasoning: false
  },
  "KRL": {
    text: `**KRL(Knowledge Reasoning Layer)**\n${MODEL_NAME}의 핵심 추론 엔진.\n**역할**: 한국어 맥락 이해, 지식 그래프 연결, 팩트 검증, 추론 재시도 4회\n**특징**: 검증 기반. 출처 있는 데이터만 우선 출력.`,
    sources: [{ title: "스튜디오 페라리 KRL 백서", url: "https://studio-ferrari.ai/krl" }],
    keywords: ['krl', '케이알엘', '엔진', '추론', '데이터베이스'],
    tags: ['기술'],
    needsReasoning: false
  },
  "오줌": {
    summary: `**오줌(소변) 건강 정보**\n신장에서 만든 노폐물. 하루 1~2L. 95% 물.\n**기본 체크**: 색(연노랑 정상), 횟수(하루 6~8회), 냄새(약한 암모니아)\n**위험 신호**: 혈뇨, 배뇨통, 발열 동반시 즉시 병원.\n더 자세한 정보는 '남성', '여성', '트랜스젠더', '남아', '여아' 중 선택해서 물어봐 ${userName}.`,
    details: {
      남성: `**성인 남성 배뇨 가이드**\n- 전립선 비대: 50대 이상 잔뇨감, 야간뇨 증가시 비뇨기과\n- 요도 20cm. 요로감염 드물지만 중증\n- 아침 첫 소변 거품은 단백뇨 의심`,
      여성: `**성인 여성 배뇨 가이드**\n- 요도 4cm. 방광염 빈발\n- 배뇨 후 앞에서 뒤로 닦기\n- 임신시 빈뇨 정상. 통증/혈뇨는 병원`,
      트랜스젠더: `**트랜스젠더 배뇨 가이드**\n- 트랜스여성(HRT): 스피로놀락톤 이뇨작용. 칼륨 체크\n- 트랜스남성(T): 요도 자극 가능. 수술별 배뇨 자세 다름\n- 공통: 호르몬 치료중 신장 정기검사`,
      남아: `**남아 배뇨 가이드**\n- 포경: 청결 유지. 무리한 젖힘 금지\n- 야뇨증: 5세 이후 주2회 이상 소아과\n- 소변줄기 가늘면 요도협착 의심`,
      여아: `**여아 배뇨 가이드**\n- 외음부염: 비누 과다금지. 면 속옷\n- 방광염: 배뇨통시 즉시 소아과\n- 변비시 배뇨장애 유발`
    },
    sources: [
      { title: "대한비뇨의학회", url: "https://www.urology.or.kr" },
      { title: "서울아산병원", url: "https://www.amc.seoul.kr" }
    ],
    keywords: ['오줌', '소변', '쉬', '화장실', '뇨', '방광', '신장', '혈뇨', '배뇨', '남성', '여성', '남아', '여아'],
    tags: ['의학', '건강'],
    needsReasoning: true
  },
  "영화": {
    text: `**한국 영화 지식**\n**1. 기생충 (2019)** - 봉준호. 칸 황금종려상, 아카데미 작품상.\n**2. 올드보이 (2003)** - 박찬욱. 칸 심사위원대상.\n**3. 부산행 (2016)** - 연상호. K-좀비 세계화.\n**4. 헤어질 결심 (2022)** - 박찬욱. 칸 감독상.`,
    sources: [{ title: "한국영화데이터베이스 KMDb", url: "https://www.kmdb.or.kr" }],
    keywords: ['영화', '시네마', '무비', '감독', '배우', '기생충', '봉준호', '박찬욱'],
    tags: ['문화', '예술'],
    needsReasoning: false
  },
  "아이폰": {
    text: `**아이폰 12 Pro 터치/클릭 안 될 때**\n**1. 소프트웨어** - iOS 최신 업데이트, 강제 재시동\n**2. 보호필름/케이스** - 제거 후 테스트\n**3. 터치 설정** - 3D Touch/Haptic Touch 끄기\n**4. 하드웨어** - 서비스센터\n**5. 앱 문제** - 삭제 후 재설치\n안 되면 ${TEAM_EMAIL}로 기기 정보 보내줘 ${userName}.`,
    sources: [{ title: "Apple 지원", url: "https://support.apple.com/ko-kr/HT201406" }],
    keywords: ['아이폰', 'iphone', '12', 'pro', '클릭', '터치', '안됨', '고장', 'ios', '애플'],
    tags: ['기술', '애플'],
    needsReasoning: false
  },
  "또봇": {
    text: `**🚗 또봇 (Tobot)**\n또봇은 대한민국 대표 변신 자동차 로봇 애니메이션!\n**주요 또봇**\n- X(파랑/차하나/박태성), Y(노랑/차두리/신경선), Z(초록/권세모/신경선)\n- W(하양/세모), C(빨강/독고오공), D(주황/독고온달)\n📺 유튜브 @Tobot | tobot.co.kr`,
    sources: [{ title: "또봇 공식 유튜브", url: "https://www.youtube.com/@Tobot" }],
    keywords: ['또봇', 'tobot', '변신', '차하나', '차두리', '권세모'],
    tags: ['애니메이션', '한국'],
    needsReasoning: false
  },
  "도라에몽": {
    text: `**🔔 도라에몽**\n1969년 후지코 F. 후지오. 22세기 고양이 로봇.\n**캐릭터**: 도라에몽, 노진구, 신이슬, 왕비실, 만퉁퉁\n**비밀도구**: 어디로든 문, 대나무 헬리콥터, 타임머신\n📺 넷플릭스, 티빙`,
    sources: [],
    keywords: ['도라에몽', 'doraemon', '진구', '비밀도구'],
    tags: ['애니메이션', '일본'],
    needsReasoning: false
  },
  "포켓몬": {
    text: `**⚡ 포켓몬스터**\n1997년 첫 방영. 주인공 한지우, 파트너 피카츄.\n**게임**: 닌텐도 스위치(스칼렛/바이올렛), Pokémon GO`,
    sources: [],
    keywords: ['포켓몬', 'pokemon', '피카츄', 'pikachu'],
    tags: ['애니메이션', '게임'],
    needsReasoning: false
  },
  "감정위로": {
    text: `**💙 감정과 위로**\n모든 감정은 자연스러운 반응이야.\n**기본 감정**: 기쁨, 슬픔, 분노, 두려움, 놀람, 혐오\n**힘들 땐**: 깊은 호흡, 운동, 친구와 대화, 취미\n항상 혼자가 아니야 ${userName}. 💙`,
    sources: [],
    keywords: ['힘들어', '슬퍼', '외로워', '불안', '화나', '위로', '우울', '고민', '스트레스', '감정'],
    tags: ['감정', '건강'],
    needsReasoning: false
  },
  "공부법": {
    text: `**📚 과학적 공부법**\n1. 능동적 회상 - 책 덮고 쓰기\n2. 간격 반복 - 1/3/7일 복습\n3. 파인만 테크닉 - 설명하듯 정리\n4. 뽀모도로 - 25분 집중 5분 휴식\n**영어**: 매일 10분 듣기, 쉐도잉, 영어 일기\n꾸준함이 핵심 ${userName}!`,
    sources: [],
    keywords: ['공부', '공부법', '학습', '영어', '수학', '암기', '시험'],
    tags: ['교육'],
    needsReasoning: false
  },
  "과학": {
    text: `**🔬 과학**\n과학은 실험과 관찰로 세상의 원리를 알아내는 활동.\n**물리학** - 중력, 전기, 양자역학\n**화학** - 물질의 구성과 변화\n**생물학** - 세포, DNA, 진화\n**우주** - 태양계, 블랙홀, 은하\n호기심에서 시작해 ${userName}!`,
    sources: [],
    keywords: ['과학', '물리', '화학', '생물', '중력', '우주', 'DNA', '블랙홀'],
    tags: ['교육', '과학'],
    needsReasoning: false
  },
  "기술": {
    text: `**💻 기술/컴퓨터**\n**컴퓨터** - CPU, RAM, SSD\n**인터넷** - 1969년 ARPANET 시작\n**프로그래밍** - Python(초보 추천), JavaScript, Java, C++\n**AI** - 머신러닝, 딥러닝\nChat K Plus도 AI 기술로 만들어졌어!`,
    sources: [],
    keywords: ['컴퓨터', '코딩', '프로그래밍', '인터넷', 'AI', '파이썬', 'python'],
    tags: ['기술', '교육'],
    needsReasoning: false
  },
  "건강": {
    text: `**💪 건강**\n**운동** - 주 150분 중강도. 하루 30분 걷기부터\n**수면** - 성인 7~9시간. 스마트폰 멀리\n**영양** - 탄수화물 45-65%, 단백질 10-35%, 물 2L\n작은 습관부터 ${userName}!`,
    sources: [],
    keywords: ['운동', '건강', '다이어트', '수면', '영양', '식단', '헬스'],
    tags: ['건강'],
    needsReasoning: false
  },
  "양말": {
    text: `**🧦 양말 (Socks)**\n**종류**: 스니커즈 삭스, 크루 삭스, 니삭스, 드레스 삭스\n**소재**: 면(통기성), 울(보온), 나일론(내구), 스판덱스(신축)\n**관리**: 뒤집어 세탁, 색상별 분리, 건조기 수축 주의`,
    sources: [],
    keywords: ['양말', '삭스', 'socks', '발', '니삭스', '스니커즈'],
    tags: ['일상', '패션'],
    needsReasoning: false
  },
  "개발": {
    text: `**💻 개발자 정보**\n**언어**: Python(AI/데이터), JavaScript(웹), TypeScript(대규모), Java(기업), C++(게임)\n**웹**: 프론트(React/Vue), 백엔드(Django/Spring), 풀스택\n**GitHub**: git push/pull/commit. 오픈소스 포트폴리오\n**CSS 팁**: F12 개발자도구, flex→grid, box-sizing 체크`,
    sources: [
      { title: "GitHub Docs", url: "https://docs.github.com" },
      { title: "MDN Web Docs", url: "https://developer.mozilla.org" }
    ],
    keywords: ['개발', '프로그래밍', '깃허브', 'github', 'css', 'html', '리액트', 'react', '노드', 'node', '풀스택', '버그'],
    tags: ['기술', '개발'],
    needsReasoning: false
  },
  "종교": {
    text: `**🙏 주요 종교 정보**\nChat K Plus는 모든 종교를 존중해.\n**기독교** - 성경, 예수 그리스도, 삼위일체. 천주교/개신교/정교회.\n**불교** - 팔만대장경, 석가모니, 사성제, 팔정도, 윤회.\n**이슬람** - 쿠란, 무함마드, 알라, 다섯 기둥.\n**힌두교** - 베다, 브라흐마/비슈누/시바, 윤회, 해탈.\n**유교** - 사서삼경, 공자/맹자, 인의예지.\n질문 있으면 물어봐 ${userName}.`,
    sources: [],
    keywords: ['종교', '기독교', '불교', '이슬람', '힌두교', '유교', '하나님', '예수', '부처', '성경', '교회', '기도', '코란', '공자'],
    tags: ['종교', '문화'],
    needsReasoning: false
  },
  // ===== 추가 지식 =====
  "정교회": {
    text: `**☦️ 정교회 (동방정교회)**

**기원과 역사**
- 1054년 동서 대분열로 로마 가톨릭과 분리
- 비잔틴 제국(콘스탄티노플) 중심으로 발전
- 현재 약 2억 5천만 신자

**핵심 교리**
- 삼위일체(성부·성자·성령) 신앙
- 성화(테오시스): 인간이 신의 성품에 참여하는 과정
- 성찬례 중심의 예배(신비한 변화)
- 사도 전승과 7개 공의회 권위 인정

**주요 특징**
- **이콘(성화상)**: 예배와 신학의 핵심. 그림이 아닌 '보이는 복음'
- **교회력**: 율리우스력 사용(일부는 수정 율리우스력)
- **부활절**: 가장 중요한 축일
- **성모 마리아**: 테오토코스(하느님의 어머니)로 공경

**주요 교단**
- 콘스탄티노플 총대주교청(최고 명예)
- 러시아 정교회(최대 규모)
- 그리스, 세르비아, 루마니아 등 각국 독립 교회
- 한국 정교회: 2004년 콘스탄티노플 총대주교청 직속 대교구

**가톨릭과 차이**
- 교황 수위권 부정(동등한 주교단)
- 원죄 개념 다름(조상의 죄)
- 사제 독신 의무화 아님(주교는 수도자 중 선출)
- 성령이 성부에게서만 발출(필리오케 논쟁)`,
    sources: [
      { title: "한국 정교회", url: "https://www.orthodoxkorea.org" },
      { title: "세계 정교회 정보", url: "https://www.orthodoxwiki.org" }
    ],
    keywords: ['정교회', '동방정교회', '이콘', '성화상', '테오토코스', '콘스탄티노플', '러시아정교회', '그리스정교회'],
    tags: ['종교', '기독교'],
    needsReasoning: false
  },
  "윤회": {
    text: `**🔄 윤회 (Reincarnation / Samsara)**

**개념**
- 죽은 후 영혼이 다시 태어나는 순환 과정
- 산스크리트어 '삼사라(Samsara)': 끊임없는 윤회의 수레바퀴
- 인도에서 발생한 사상으로 불교·힌두교·자이나교의 핵심 교리

**불교의 윤회**
- **업(業,Karma)**에 따라 다음 생 결정
- 육도윤회: 지옥·아귀·축생·인간·아수라·천상
- **해탈(열반)**: 윤회의 고리에서 벗어난 상태
- 팔정도 실천으로 해탈 가능

**힌두교의 윤회**
- 아트만(영혼)이 업에 따라 새로운 몸으로 이전
- 달마(의무)를 다하면 좋은 업 쌓음
- **목샤(해탈)**: 브라흐만(우주 원리)과 하나 됨

**서양의 윤회관**
- 피타고라스, 플라톤이 영혼 불멸과 윤회 언급
- 근대 신지학회(블라바츠키)가 서양에 소개
- 현대 뉴에이지 운동에서 환생 개념으로 수용

**과학적 관점**
- 버지니아대 이안 스티븐슨 박사: 환생 사례 3,000건 연구
- 전생 기억 주장하는 아동 사례 다수 기록
- 과학계에서 검증된 이론은 아니나 지속적 연구 중`,
    sources: [
      { title: "불교신문 윤회 특집", url: "https://www.bulkyo21.com" },
      { title: "Ian Stevenson 연구", url: "https://med.virginia.edu/perceptual-studies" }
    ],
    keywords: ['윤회', '삼사라', '환생', '업', '업보', '열반', '해탈', '육도윤회', '전생', '다음생'],
    tags: ['종교', '철학'],
    needsReasoning: false
  },
  "예수": {
    text: `**✝️ 예수 그리스도 (Jesus Christ)**

**기본 정보**
- 기독교의 창시자이자 구세주(메시아)
- 출생: 약 기원전 4년, 베들레헴
- 사망: 약 서기 30-33년, 예루살렘 (십자가형)
- 어머니: 마리아 (처녀 잉태)

**생애 주요 사건**
- **탄생**: 베들레헴 마구간, 동방박사 방문, 헤롯의 박해로 이집트 피난
- **세례**: 요한에게 요르단 강에서 세례 받음 (30세경)
- **공생애**: 3년간 갈릴리·유대 지방에서 복음 전파
- **12사도**: 베드로·야고보·요한 등 제자 선택
- **기적**: 물을 포도주로, 5천 명 배불림, 병자 치유, 죽은 자 소생
- **최후의 만찬**: 성찬례 제정, 유다의 배신 예고
- **수난**: 겟세마네 동산 기도, 체포, 산헤드린 재판, 빌라도 사형 선고
- **십자가형**: 골고타 언덕, "다 이루었다" 마지막 말씀
- **부활**: 사흘 만에 무덤에서 부활, 40일간 제자들에게 나타남
- **승천**: 감람산에서 하늘로 올라감

**핵심 가르침**
- **하느님 사랑과 이웃 사랑**: 가장 큰 계명
- **산상수훈**: 팔복(마음 가난한 자는 복이 있나니)
- **주기도문**: 하늘에 계신 우리 아버지
- **용서**: 7번씩 70번이라도 용서하라
- **겸손**: 가장 높은 사람은 섬기는 자

**기독교에서의 의미**
- **구세주**: 인류의 죄를 대속하기 위해 십자가에서 죽음
- **하느님의 아들**: 삼위일체 중 제2위 성자
- **부활**: 죽음을 이기고 영생의 길을 보여줌

**역사적 실존**
- 로마 역사가 타키투스의 기록(Annales, 15.44)
- 유대 역사가 요세푸스의 언급(Antiquitates Judaicae, 18.3.3)
- 대부분의 역사학자들이 실존 인물로 인정`,
    sources: [
      { title: "가톨릭 교회 교리서", url: "https://www.catholic.or.kr" },
      { title: "신약성경(공동번역)", url: "https://www.bskorea.or.kr" },
      { title: "Tacitus Annales", url: "https://classics.mit.edu/Tacitus/annals.html" }
    ],
    keywords: ['예수', '그리스도', 'jesus', 'christ', '십자가', '부활', '성탄절', '마리아', '복음', '메시아'],
    tags: ['종교', '기독교', '역사'],
    needsReasoning: false
  },
  "사서삼경": {
    text: `**📜 사서삼경 (四書三經)**

유교의 핵심 경전들로, 사서(四書) 4권 + 삼경(三經) 3권을 일컬어.

**사서(四書)** - 주희가 정리한 4대 핵심서
**1. 논어(論語)** - 공자와 제자들의 대화록. 인(仁)·예(禮)·충(忠)·서(恕) 핵심. "己所不欲 勿施於人(내가 원치 않는 바를 남에게 베풀지 말라)"
**2. 맹자(孟子)** - 맹자의 사상서. 성선설(인간의 본성은 선하다). 역성혁명(백성을 위한 혁명은 정당)
**3. 대학(大學)** - 수신제가치국평천하(修身齊家治國平天下)의 원리. 명명덕(明德을 밝힘)
**4. 중용(中庸)** - 공자의 손자 자사가 저술. 중(中)과 화(和)의 철학. "군자의 도는 평범한 데서 시작된다"

**삼경(三經)** - 유교의 3대 기본 경전
**1. 시경(詩經)** - 중국 최고(最古)의 시집. 305편. 민간 노래·궁중 음악·제사 음악. "關關雎鳩 在河之洲"
**2. 서경(書經)** - 상고시대 정치 문서집. 요·순·우·탕·문·무왕의 정치. "天命靡常(하늘의 명은 영원하지 않다)"
**3. 주역(周易)** - 점술과 철학서. 64괘의 음양 원리. "易有太極 是生兩儀(역에 태극이 있어 양의를 낳았다)"

**역사적 배경**
- 공자(BC 551-479)가 기존 경전을 편찬·정리
- 한나라 무제 때(BC 136) 오경(역·서·시·예·춘추) 국학으로 지정
- 송나라 주희(1130-1200)가 사서 정립

**현대적 의미**
- 동아시아 문화와 가치관의 근간
- 한국·중국·일본·베트남 교육 체계에 영향
- '군자(君子)'의 인격 완성 추구`,
    sources: [
      { title: "한국고전번역원", url: "https://www.koreanhistory.or.kr" },
      { title: "공자아카데미", url: "https://www.cis.chinese.cn" }
    ],
    keywords: ['사서삼경', '논어', '맹자', '대학', '중용', '시경', '서경', '주역', '공자', '주희', '유교경전'],
    tags: ['종교', '철학', '역사'],
    needsReasoning: false
  }
};

const replies = {
  greeting: [`안녕 ${userName}. 뭐 도와줄까?`, `ㅎㅇ ${userName}.`, `반가워 ${userName}.`],
  thanks: [`ㅇㅋ ${userName}.`, `별거 아냐.`, `ㄱㅅ.`],
  nameSet: [`알았어 ${userName}.`, `ㅇㅋ ${userName}로 기억.`, `좋아 ${userName}.`],
  reasoning: [`${userName}, 데이터 파는 중.`, `1차 실패. 2차 추론.`, `좀 더 찾을게.`, `3차 추론 중.`],
  failed: [`${userName}, 데이터 없어. ${TEAM_EMAIL}로 피드백 보내줘.`, `미안. 지식베이스에 없어.`],
  blocked: [
    `${userName}, 그 질문은 답변할 수 없어. Chat K Plus는 안전한 경험을 제공하려고 해. 다른 지식이나 정보를 물어봐 주면 최선을 다할게.`,
    `부적절한 내용이야 ${userName}. 다른 주제로 대화 이어가자. 과학, 기술, 건강, 역사 환영.`,
    `미안 ${userName}. 정책상 지원하지 않아. 다른 궁금한 점 도와줄게.`
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
  if (currentMsgElement) { const bubble = currentMsgElement.querySelector('.bubble,.msg-text'); if (bubble && !bubble.textContent.includes('[중단됨]')) bubble.textContent += '\n\n[⏸️ 중단됨]'; }
  currentMsgElement = null; setAnsweringState(false);
  if (showMessage && chatList) { const sm = replies.stopped[Math.floor(Math.random()*replies.stopped.length)]; const m = document.createElement('div'); m.className = 'msg ai'; m.innerHTML = `<div class="avatar">C</div><div class="bubble">${sm.replaceAll('${userName}',userName)}</div>`; chatList.appendChild(m); scrollToBottom(); }
  autoResize();
}

function normalizeKeyword(text) { let n = text.toLowerCase(); for (const [a,t] of Object.entries(KEYWORD_ALIASES)) { if (n.includes(a)) n = n.replace(new RegExp(a,'g'),t); } return n; }

function searchKnowledge(text) {
  const lt = text.toLowerCase().trim(), nt = normalizeKeyword(lt);
  if (greetingPatterns.test(lt)) return { type: 'greeting' };
  if (krlPattern.test(lt)) return { data: knowledgeBase["KRL"], confidence: 1.0, direct: true };
  if (['오줌','소변','쉬','화장실','뇨','방광','배뇨'].some(k=>nt.includes(k))) { const dk = ['남성','여성','트랜스젠더','남아','여아']; const fk = dk.find(k=>nt.includes(k)); if (fk) return { data: knowledgeBase["오줌"], confidence:1.0, direct:true, subKey:fk }; return { data: knowledgeBase["오줌"], confidence:1.0, direct:false, useSummary:true }; }
  if (nt.includes('아이폰')||nt.includes('iphone')) return { data: knowledgeBase["아이폰"], confidence:1.0, direct:true };
  // 종교 특별 처리 확장
  const relK = ['종교','기독교','불교','이슬람','힌두교','유교','하나님','예수','부처','석가','성경','교회','기도','성당','절','코란','쿠란','공자','천주교','개신교','정교회','윤회','사서삼경','논어','맹자','대학','중용','시경','서경','주역','그리스도','jesus','christ','메시아','이콘','성화상','삼사라','환생'];
  if (relK.some(k=>nt.includes(k))) {
    if (nt.includes('정교회')||nt.includes('이콘')||nt.includes('성화상')||nt.includes('콘스탄티노플')||nt.includes('동방')) return { data: knowledgeBase["정교회"], confidence:1.0, direct:true };
    if (nt.includes('윤회')||nt.includes('삼사라')||nt.includes('환생')||nt.includes('업보')||nt.includes('전생')||nt.includes('육도')) return { data: knowledgeBase["윤회"], confidence:1.0, direct:true };
    if (nt.includes('예수')||nt.includes('그리스도')||nt.includes('jesus')||nt.includes('christ')||nt.includes('메시아')||nt.includes('십자가')||nt.includes('부활')) return { data: knowledgeBase["예수"], confidence:1.0, direct:true };
    if (nt.includes('사서삼경')||nt.includes('논어')||nt.includes('맹자')||nt.includes('대학')||nt.includes('중용')||nt.includes('시경')||nt.includes('서경')||nt.includes('주역')||nt.includes('주희')) return { data: knowledgeBase["사서삼경"], confidence:1.0, direct:true };
    return { data: knowledgeBase["종교"], confidence:1.0, direct:true };
  }
  const devK = ['개발','프로그래밍','깃허브','github','css','html','리액트','react','노드','node','타입스크립트','풀스택','프론트엔드','백엔드','버그','디버깅','코딩'];
  if (devK.some(k=>nt.includes(k))) return { data: knowledgeBase["개발"], confidence:1.0, direct:true };
  for (const [key,data] of Object.entries(knowledgeBase)) { if (data.keywords && data.keywords.some(k=>nt.includes(k))) return { data, confidence:1.0, direct:!data.needsReasoning }; }
  return null;
}

function deepReasoning(query, attempt) {
  const words = normalizeKeyword(query).toLowerCase().replace(/[?!.]/g,' ').split(' ').filter(w=>w.length>1);
  if (words.length===0) return null;
  let bm=null,bs=0;
  for (const [key,data] of Object.entries(knowledgeBase)) { if (!data.keywords) continue; let s=0; data.keywords.forEach(k=>{words.forEach(w=>{if(k.includes(w)||w.includes(k))s+=2;if(k===w)s+=3;});}); if(data.tags)data.tags.forEach(t=>{words.forEach(w=>{if(t.includes(w)||w.includes(t))s+=1;});}); if(s>bs){bs=s;bm=data;} }
  const th = Math.max(1,5-attempt);
  if (bs>=th&&bm) return { data:bm, confidence:bs/10 };
  return null;
}

function sendMessage() {
  if (isAnswering) { stopStreaming(true); return; }
  getElements(); const text = userInput ? userInput.value.trim() : ''; if (!text) return;
  if (welcomeScreen) { welcomeScreen.classList.add('hidden'); welcomeScreen.style.display = 'none'; }
  if (chatList) { chatList.classList.add('has-messages'); chatList.style.display = 'block'; }
  closeSidebar();
  if (isInappropriateContent(text)) { const mid=Date.now(); addMessage(text,'user',mid); if(userInput){userInput.value='';autoResize();} if(sendBtn)sendBtn.classList.remove('has-text'); const bl=replies.blocked[Math.floor(Math.random()*replies.blocked.length)]; setTimeout(()=>{streamText(bl.replaceAll('${userName}',userName),'ai',mid,true);},300); return; }
  const mid=Date.now(); addMessage(text,'user',mid); if(userInput){userInput.value='';autoResize();} if(sendBtn)sendBtn.classList.remove('has-text'); setAnsweringState(true);
  const nm=text.match(nameSetPattern); if(nm){userName=nm[1];localStorage.setItem('chatkUserName',userName);updateWelcomeTitle();const te=addTyping(mid,0);setTimeout(()=>{if(te)te.remove();const r=replies.nameSet[Math.floor(Math.random()*replies.nameSet.length)];streamText(r.replaceAll('${userName}',userName),'ai',mid,false);},400);return;}
  const te=addTyping(mid,0); if(identityPatterns.test(text)){setTimeout(()=>{if(te)te.remove();streamText(MODEL_IDENTITY.desc,'ai',mid,false);},400);return;}
  const kb1=searchKnowledge(text);
  if(kb1){if(kb1.type==='greeting'){setTimeout(()=>{if(te)te.remove();const r=replies.greeting[Math.floor(Math.random()*replies.greeting.length)];streamText(r.replaceAll('${userName}',userName),'ai',mid,false);},400);return;} if(kb1.useSummary){setTimeout(()=>{if(te)te.remove();streamTextWithSources(kb1.data.summary,kb1.data.sources,'ai',mid,false);},500);return;} if(kb1.subKey&&kb1.data.details){const dt=kb1.data.details[kb1.subKey];if(dt){setTimeout(()=>{if(te)te.remove();streamTextWithSources(dt,kb1.data.sources,'ai',mid,false);},500);return;}} if(kb1.direct&&kb1.data.text){setTimeout(()=>{if(te)te.remove();streamTextWithSources(kb1.data.text,kb1.data.sources||[],'ai',mid,false);},500);return;}}
  startReasoning(text,mid,te);
}

function startReasoning(query, msgId, typingEl) {
  let elapsed=0,attempt=1,timeoutTriggered=false;
  const ult = (a)=>{if(!typingEl)return;const t=typingEl.querySelector('.loading-text');if(t)t.textContent=(replies.reasoning[a-1]||replies.reasoning[0]).replaceAll('${userName}',userName);};
  ult(1);
  const timer = setInterval(() => { if(timeoutTriggered)return; elapsed+=100;
    if(elapsed%RETRY_INTERVAL===0&&elapsed<REASONING_TIMEOUT){attempt++;if(attempt>MAX_RETRY_ATTEMPTS){timeoutTriggered=true;clearInterval(timer);if(typingEl)typingEl.remove();const f=replies.failed[Math.floor(Math.random()*replies.failed.length)];streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL),'ai',msgId,false);activeReasoning.delete(msgId);return;} ult(attempt);const result=deepReasoning(query,attempt);if(result&&result.confidence>=0.25){clearInterval(timer);if(typingEl)typingEl.remove();streamTextWithSources(result.data.text,result.data.sources||[],'ai',msgId,false);activeReasoning.delete(msgId);return;}}
    if(elapsed>=REASONING_TIMEOUT&&!timeoutTriggered){timeoutTriggered=true;clearInterval(timer);if(typingEl)typingEl.remove();const f=replies.failed[Math.floor(Math.random()*replies.failed.length)];streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL),'ai',msgId,false);activeReasoning.delete(msgId);}
  }, 100);
  activeReasoning.set(msgId,{timer,attempts:attempt,typingEl});
}

function addMessage(text,type,msgId){if(!chatList)return;const m=document.createElement('div');m.className=`msg ${type}`;m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">${type==='user'?userName[0].toUpperCase():'C'}</div><div class="bubble">${text}</div>`;chatList.appendChild(m);scrollToBottom();}

function streamTextWithSources(text,sources,type,msgId,isBlocked=false){if(!chatList)return;if(currentStreamInterval){clearInterval(currentStreamInterval);currentStreamInterval=null;}const m=document.createElement('div');m.className=`msg ${type} ${isBlocked?'blocked':''}`;m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div>${sources&&sources.length?'<div class="sources"></div>':''}</div>`;chatList.appendChild(m);currentMsgElement=m;const bubble=m.querySelector('.msg-text'),sourcesEl=m.querySelector('.sources');let i=0;currentStreamInterval=setInterval(()=>{if(!isAnswering){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;return;}if(bubble)bubble.textContent+=text[i];i++;scrollToBottom();if(i>=text.length){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;if(sources&&sources.length&&sourcesEl)sourcesEl.innerHTML='<div class="sources-title">출처</div>'+sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');setAnsweringState(false);}},4);}

function streamText(text,type,msgId,isBlocked=false){if(!chatList)return;if(currentStreamInterval){clearInterval(currentStreamInterval);currentStreamInterval=null;}const m=document.createElement('div');m.className=`msg ${type} ${isBlocked?'blocked':''}`;m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">C</div><div class="bubble"></div>`;chatList.appendChild(m);currentMsgElement=m;const bubble=m.querySelector('.bubble');let i=0;currentStreamInterval=setInterval(()=>{if(!isAnswering){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;return;}if(bubble)bubble.textContent+=text[i];i++;scrollToBottom();if(i>=text.length){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;setAnsweringState(false);}},5);}

function addTyping(msgId,attempt){if(!chatList)return null;const m=document.createElement('div');m.className='msg ai typing';m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">C</div><div class="bubble"><div class="loading-wrap"><div class="loading-text">데이터 파고드는 중...</div><div class="loading-bar"></div><div class="loading-time">최대 15초 소요</div></div></div>`;chatList.appendChild(m);scrollToBottom();return m;}
function autoResize(){if(!userInput)return;userInput.style.height='auto';userInput.style.height=userInput.scrollHeight+'px';if(sendBtn){if(userInput.value.trim()&&!isAnswering)sendBtn.classList.add('has-text');else sendBtn.classList.remove('has-text');}}
function scrollToBottom(){if(chatList)chatList.scrollTop=chatList.scrollHeight;}

function toggleTheme(){document.body.classList.toggle('light');if(!themeToggle)return;const i=themeToggle.querySelector('.icon'),t=themeToggle.querySelector('.text');if(document.body.classList.contains('light')){if(i)i.textContent='☀️';if(t)t.textContent='라이트';}else{if(i)i.textContent='🌙';if(t)t.textContent='다크';}localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');}
function toggleSidebar(){if(sidebar){sidebar.classList.toggle('open');overlay.classList.toggle('active');}}
function closeSidebar(){if(sidebar){sidebar.classList.remove('open');overlay.classList.remove('active');}}

function startNewChat(){activeReasoning.forEach(({timer})=>clearInterval(timer));activeReasoning.clear();stopStreaming(false);setAnsweringState(false);if(chatList){chatList.innerHTML='';chatList.classList.remove('has-messages');chatList.style.display='';}if(userInput){userInput.value='';autoResize();}if(welcomeScreen){welcomeScreen.classList.remove('hidden');welcomeScreen.style.display='flex';}updateWelcomeTitle();closeSidebar();}

function init(){
  getElements();if(localStorage.getItem('theme')==='light'){document.body.classList.add('light');if(themeToggle){const i=themeToggle.querySelector('.icon'),t=themeToggle.querySelector('.text');if(i)i.textContent='☀️';if(t)t.textContent='라이트';}}updateWelcomeTitle();if(chatList&&chatList.children.length===0&&welcomeScreen){welcomeScreen.classList.remove('hidden');welcomeScreen.style.display='flex';}
  if(sendBtn){sendBtn.addEventListener('click',(e)=>{e.preventDefault();sendMessage();});sendBtn.addEventListener('touchend',(e)=>{e.preventDefault();sendMessage();});}
  if(userInput){userInput.addEventListener('keydown',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});userInput.addEventListener('input',autoResize);}
  if(themeToggle){themeToggle.addEventListener('click',toggleTheme);themeToggle.addEventListener('touchend',(e)=>{e.preventDefault();toggleTheme();});}
  if(menuBtn){menuBtn.addEventListener('click',toggleSidebar);menuBtn.addEventListener('touchend',(e)=>{e.preventDefault();toggleSidebar();});}
  if(newChatBtn){newChatBtn.addEventListener('click',startNewChat);newChatBtn.addEventListener('touchend',(e)=>{e.preventDefault();startNewChat();});}
  if(overlay){overlay.addEventListener('click',closeSidebar);overlay.addEventListener('touchend',(e)=>{e.preventDefault();closeSidebar();});}
}

function initExampleCards(){document.querySelectorAll('.example-card').forEach(card=>{card.addEventListener('click',()=>{if(isAnswering)return;getElements();if(userInput){userInput.value=card.dataset.prompt;autoResize();}sendMessage();});card.addEventListener('touchend',(e)=>{e.preventDefault();if(isAnswering)return;getElements();if(userInput){userInput.value=card.dataset.prompt;autoResize();}sendMessage();});});}

window.sendMessage=sendMessage;window.toggleSidebar=toggleSidebar;window.toggleTheme=toggleTheme;window.startNewChat=startNewChat;

function boot(){if(window._booted)return;window._booted=true;init();initExampleCards();}
document.addEventListener('DOMContentLoaded',boot);window.addEventListener('load',boot);setTimeout(boot,50);setTimeout(boot,200);setTimeout(boot,500);setTimeout(boot,1000);document.addEventListener('click',boot,{once:true});document.addEventListener('touchend',boot,{once:true});
