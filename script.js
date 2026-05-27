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

const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
overlay.style.pointerEvents = 'none';
overlay.style.opacity = '0';
overlay.style.transition = 'opacity 0.2s';
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
  '쌕쓰', '쌕스', '쌕쑤', '색스', '쎅스', '쎅쓰', '쌕ㅆ', '쌕ㅅ', '쎅ㅆ', '색쓰',
  '유두', '젖꼭지', '가슴', '유방', '엉덩이', '히프', '허벅지', '음부', '음경', '귀두',
  '클리토리스', '질', '항문', '애널', '팬티', '빤스', 'panty', 'panties', '브라', '속옷', '란제리',
  '페앤티', '페엔티', '패ㄴ티', '팬ㅌㅣ', '스타킹', '망사',
  '알몸', '누드', 'nude', '나체', '탈의', '벗다', ' 벗어', '벗고', ' 전라',
  '성교', '섹슈얼', 'sexual', 'sexy', '섹시', '에로틱', 'erotic', '야설', '야사',
  '오랄', 'oral', '애널', 'anal', '삽입', '페니스', 'penis', '바기나', 'vagina',
  '클리', '오르가슴', 'orgasm', '절정', '쾌감', '흥분', '발기', '젖', '정액',
  '콘돔', 'condom', '피임', '임신섹스', '원나잇', '불륜', '간통',
  '매춘', '성매매', '유흥', '오피', '안마', '키스방', '룸싸롱',
  'fck', 'fuk', 'fuxk', 'sh1t', 'shit', '좃', '좆같', '개새', '느금', '느개비',
  '보빨', '자빨', '존나', '존나게', '졸라', '좆나', '씨발놈', '씨발년', '씨팔', '시발',
  '니미', '니애미', '애미', '애비', '고아년', '창녀', '걸레', '화냥년',
  '떡', '떡치', '따먹', '박', '박아', '쳐박', '쑤셔', '쑤시', '꽂', '넣어',
  '물총', '싸다', '질싸', '입싸', '얼싸', '따먹히다', '보짓물', '자짓물',
  '씹', '씹창', '씹년', '씹새', '씹물', '보댕', '자댕', '딸딸이', '딸치',
  '손딸', '핸플', '입플', '발플', '가슴빨', '젖빨', '물빨',
  '야스', '야겜', '에로게', '헨타이', 'hentai', 'av', 'jav',
  'sexx', 'ssex', 'sexxxx', 'sexxxxx', 'p0rn', 'pr0n', 'porrn', 'f u c k', 's e x',
  'ㅅㅅ', 'ㅇㄷ', 'ㅅㅂ', 'ㅈㄴ', 'ㅈ같',
  '5ex', '53x', '$ex', 'se><', 's3><', 'p0rn0', '@ss', 'a$$',
  'b00b', 'b00bs', 't1t', 't1ts', 'c0ck', 'd1ck', 'p3n1s', 'v4g1na',
  '🍆💦', '🍑💦', '👉👌', '🍌💦', '🥒💦', '💋', '🔞', '👅', '💦'
];

const BANNED_EMOJIS = ['🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '🤬', '💩', '🍆', '🍑', '💦', '🔞', '👅', '👉', '👌'];

function normalizeText(text) {
  return text.toLowerCase()
   .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[\s\-_\.·ㆍ‥…0-9@!?#$%^&*()+\=\[\]{};:'",<>\/\\|`~]/g, '')
   .replace(/ㅅㅔㄱㅅㅡ|ㅅㅔㄱ스|섹ㅅ|s3x|seks|섻스|쌕쓰|쌕스|쌕쑤|색스|쎅스|쎅쓰|쌕ㅆ|쌕ㅅ|쎅ㅆ|색쓰/g, '섹스')
   .replace(/sex/gi, '섹스')
   .replace(/porn/gi, '포르노')
   .replace(/fuck/gi, 'fuck')
   .replace(/5ex|53x|\$ex/gi, '섹스')
   .replace(/p0rn|pr0n/gi, '포르노')
   .replace(/c0ck|d1ck/gi, '자지')
   .replace(/p3n1s/gi, '자지')
   .replace(/v4g1na/gi, '보지');
}

function buildSexualPattern() {
  const patterns = [...SEXUAL_BLACKLIST.map(w => normalizeText(w))];
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
  if (/s\s*[.,、·_~^`*-]*\s*e\s*[.,、·_~^`*-]*\s*x/i.test(text)) return true;
  if (/ㅅ\s*[.,、·_~^`*-]*\s*ㅔ\s*[.,、·_~^`*-]*\s*ㄱ\s*[.,、·_~^`*-]*\s*ㅅ/i.test(text)) return true;
  if (/🍆.*💦|🍑.*💦|🍌.*💦|🥒.*💦|👉.*👌|👅.*💦/.test(text)) return true;
  return false;
}

function sanitizeAndReview(answerText) {
  if (MEDICAL_WHITELIST.some(w => answerText.toLowerCase().includes(w))) {
    return { safe: true, text: answerText };
  }
  if (isInappropriateContent(answerText)) {
    return {
      safe: false,
      text: `${userName}님, 해당 내용은 정책상 제공할 수 없어요. 😊\n\n다른 주제로 도와드릴까요?\n\n🔬 과학·물리·화학·우주\n💻 프로그래밍·코딩·웹개발\n📚 공부법·영어·학습전략\n💪 건강·운동·수면·영양`
    };
  }
  if (BANNED_EMOJIS.some(e => answerText.includes(e))) {
    return { safe: false, text: `${userName}님, 부적절한 표현이 감지되어 답변을 수정했어요.` };
  }
  return { safe: true, text: answerText };
}

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

const knowledgeBase = {
  "5.18": { text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**\n\n**1. 북한군 개입설** - 근거 없음\n**2. 폭동 프레임** - 계엄군 선발포\n**3. 희생자 수 축소** - 사망 166명, 부상 3,139명\n**4. 유공자 가짜설** - 법원 확정\n**5. 전두환 미화** - 1996년 내란죄`, sources: [{title:"5·18기념재단",url:"https://518.org"}], keywords:['5.18','광주'], tags:['역사'], needsReasoning:false },
  "독도": { text: `**🇰🇷 독도는 대한민국 영토**\n512년 신라 편입, 1900년 칙령 제41호, 1946년 SCAPIN677`, sources:[{title:"외교부",url:"https://dokdo.mofa.go.kr"}], keywords:['독도'], tags:['역사'], needsReasoning:false },
  "KRL": { text: `**KRL** - 3단계 추론 후 4단계 검토`, sources:[], keywords:['krl'], tags:['기술'], needsReasoning:false }
};

const blockedReplies = [`${userName}님, 정책상 답변이 어려워요.`];
const replies = {
  greeting:[`안녕 ${userName}!`], nameSet:[`알았어 ${userName}!`], reasoning:[`데이터 파는 중...`],
  retrying:[`추가 추론 1회차`,`추가 추론 2회차`,`추가 추론 3회차`],
  failed:[`${userName}, 데이터 없음`], englishRejection:[`${userName}, 영어 미지원`],
  maxRetriesReached:[`${userName}, 횟수 초과`], stopped:[`중단`]
};

function updateWelcomeTitle(){if(welcomeTitle)welcomeTitle.textContent=`${userName}, ${MODEL_NAME} 켜졌다`;}
function setAnsweringState(s){isAnswering=s;if(!sendBtn)return;sendBtn.disabled=false;if(userInput)userInput.disabled=s;}
function stopStreaming(){if(currentStreamInterval)clearInterval(currentStreamInterval);currentStreamInterval=null;setAnsweringState(false);}
function normalizeKeyword(t){let n=t.toLowerCase();for(const[a,b]of Object.entries(KEYWORD_ALIASES))if(n.includes(a))n=n.replace(new RegExp(a,'g'),b);return n;}
function searchKnowledge(t){const nt=normalizeKeyword(t);if(isEnglishQuery(t))return{type:'english'};if(greetingPatterns.test(t))return{type:'greeting'};for(const[k,d]of Object.entries(knowledgeBase))if(d.keywords&&d.keywords.some(x=>nt.includes(x)))return{data:d,confidence:1,direct:!d.needsReasoning};return null;}
function deepReasoning(q,a){return searchKnowledge(q);}
function retryReasoning(q,id,p){const r=deepReasoning(q,p);if(r)streamTextWithSources(r.data.text,[], 'ai',id,false);}
function sendBlockedMessage(id){addMessage(blockedReplies[0],'ai',id);}
function sendMessage(){if(isAnswering){stopStreaming();return;}getElements();const t=userInput?userInput.value.trim():'';if(!t)return;addMessage(t,'user',Date.now());userInput.value='';const kb=searchKnowledge(t);if(kb&&kb.data){const rev=sanitizeAndReview(kb.data.text+addEmotionalEnding(kb.data.tags));streamTextWithSources(rev.text,[], 'ai',Date.now(),false);}else{startReasoning(t,Date.now(),null);}}
function startReasoning(q,id,el){const r=deepReasoning(q,1);if(r){const final=sanitizeAndReview(r.data.text+addEmotionalEnding(r.data.tags));streamTextWithSources(final.text,[], 'ai',id,false);}else{streamText('모르겠어요','ai',id,false);}}
function addMessage(t,type,id){if(!chatList)return;const m=document.createElement('div');m.className=`msg ${type}`;m.innerHTML=`<div class="bubble">${t}</div>`;chatList.appendChild(m);}
function streamTextWithSources(t,s,type,id){addMessage(t,type,id);setAnsweringState(false);}
function streamText(t,type,id){addMessage(t,type,id);setAnsweringState(false);}
function addTyping(){return null;}
function autoResize(){}
function scrollToBottom(){}
function toggleTheme(){document.body.classList.toggle('light');}
function openSidebar(){if(sidebar)sidebar.classList.add('open');overlay.style.pointerEvents='auto';overlay.style.opacity='1';}
function closeSidebar(){if(sidebar)sidebar.classList.remove('open');overlay.style.pointerEvents='none';overlay.style.opacity='0';}
function bindTap(el,h){if(!el)return;el.addEventListener('click',h);el.addEventListener('touchend',e=>{e.preventDefault();h(e);},{passive:false});}
function initApp(){getElements();updateWelcomeTitle();bindTap(sendBtn,sendMessage);bindTap(themeToggle,toggleTheme);bindTap(menuBtn,openSidebar);bindTap(overlay,closeSidebar);document.querySelectorAll('.example-card,[data-prompt]').forEach(c=>bindTap(c,()=>{if(userInput){userInput.value=c.dataset.prompt||c.innerText;sendMessage();}}));}
document.addEventListener('DOMContentLoaded',initApp);
