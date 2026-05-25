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
  base: 'Studio Ferrari',
  engine: 'KRL',
  cutoff: '2025-09-04',
  desc: `나는 ${MODEL_NAME}이야. 스튜디오 페라리에서 자체 제작한 AI 비서야. KRL(Knowledge Reasoning Layer) 엔진으로 한국 언어/문화에 완전히 최적화되어 있어. 역사 팩트체크, 개발, 건강 가이드, 영화, 음료, 일상 대화를 도와준다. 실시간 검색은 안 되고 2025-09-04까지 데이터로 학습했어.`
});

let userName = localStorage.getItem('chatkUserName') || '성민';
let isAnswering = false;
let currentStreamInterval = null;
let currentMsgElement = null;

const REASONING_TIMEOUT = 16000;
const RETRY_INTERVAL = 3500;
const MAX_RETRY_ATTEMPTS = 5;
const activeReasoning = new Map();

// ===== 의학 화이트리스트 =====
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
  '아이폰', 'iphone', '애플', '터치', '클릭', '고장', 'ios'
];

// ===== 성적 금지어 =====
const SEXUAL_BLACKLIST = [
  '섹스', '섹', 'sex', '야동', '포르노', 'porn', '자위', '성관계', '성행위',
  '강간', '성폭행', '성추행', '성희롱', '몰카', '딥페이크', '페티시', 'sm', 'bdsm',
  '야한', '에로', '성인', '19금', '음란', '보지', '자지', '좆', '씨발', '씨벌', 'fuck',
  '사정', '오르가즘', 'ㅅㅔㄱㅅㅡ', 'ㅅㅔㄱ스', '섹ㅅ', 's3x', 'seks', '섻스'
];

const BANNED_EMOJIS = ['🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '🤬', '💩'];

function normalizeText(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_\.·ㆍ‥…0-9@!]/g, '')
    .replace(/ㅅㅔㄱㅅㅡ|ㅅㅔㄱ스|섹ㅅ|s3x|seks|섻스/g, '섹스');
}

const SEXUAL_PATTERN = new RegExp(SEXUAL_BLACKLIST.map(w => normalizeText(w)).join('|'), 'i');

function isInappropriateContent(text) {
  const normalized = normalizeText(text);
  if (BANNED_EMOJIS.some(e => text.includes(e))) return true;
  if (MEDICAL_WHITELIST.some(w => text.toLowerCase().includes(w))) return false;
  return SEXUAL_PATTERN.test(normalized);
}

const nameSetPattern = /(?:나는|저는|내 이름은|난)\s*([가-힣a-zA-Z0-9]{1,10})\s*(야|입니다|이에요)?/;
const greetingPatterns = /^(안녕|하이|ㅎㅇ|hello|hi|반가워|처음|방가|안녕하세요)/i;
const identityPatterns = /(너는|너|니|네가|당신은|모델|ai|챗).*(누구|뭐|무엇|정체|이름|누구세요|뭐야|뭐하는)/i;
const krlPattern = /krl.*(뭐|무엇|뭔데|뭔지|설명|알려|뜻)/i;
const chartPattern = /(표|그래프|차트|테이블|보여줘|시각화)/i;

const KEYWORD_ALIASES = { '여야': '여아', '남자': '남성', '여자': '여성', '트젠': '트랜스젠더', '아이': '남아', '어린이': '남아' };

// ===== 지식베이스 (간결하게 유지) =====
const knowledgeBase = {
  "5.18": {
    text: `**5.18 광주민주화운동 주요 왜곡 사례 5가지**\n\n이 주제는 많은 사람들에게 아픈 역사이자 진실을 지켜야 할 소중한 유산이야.\n\n**1. 북한군 개입설** - 국방부/국정원 근거 없음 결론.\n**2. 폭동 프레임** - 계엄군 선발포, 시민군 최후 방어수단.\n**3. 희생자 수 축소** - 사망 166명, 부상 3,139명.\n**4. 유공자 가짜설** - 법원 판결로 확정.\n**5. 전두환 미화** - 1996년 내란죄 유죄 판결.\n\n💡 역사를 바로 아는 것은 미래를 위한 가장 소중한 발걸음이야.`,
    sources: [{ title: "5·18기념재단", url: "https://518.org" }],
    keywords: ['5.18', '광주', '왜곡', '민주화', '북한군', '폭동', '전두환', '계엄'],
    tags: ['역사', '정치'],
    needsReasoning: false
  },
  "사양": {
    text: `**${MODEL_NAME} 시스템 사양**\n\n**엔진**: Studio Ferrari + KRL\n**제작**: 스튜디오 페라리\n**특징**: 이름 기억, 출처 인용, 콘텐츠 필터\n\n💡 나는 계속 성장하고 있어.`,
    sources: [],
    keywords: ['사양', '시스템', '스펙', '정보', '모델', 'krl', '페라리'],
    tags: ['기술'],
    needsReasoning: false
  },
  // ... (나머지 knowledgeBase는 그대로 유지)
  "음료": {
    text: `**🥤 음료 정보**\n\n☕ **커피**\n- 아메리카노: 5kcal, 카페인 150mg\n- 카페라떼: 120kcal\n\n🍵 **차**\n- 녹차: 항산화, 카테킨\n- 홍차: 완전 발효\n\n**음료별 칼로리 (1잔)**\n| 음료 | 칼로리 | 카페인 |\n|------|--------|--------|\n| 물 | 0 | 0 |\n| 아메리카노 | 5 | 150mg |\n| 라떼 | 120 | 75mg |\n| 콜라 | 140 | 35mg |\n| 사이다 | 130 | 0 |\n| 녹차 | 2 | 30mg |\n\n더 궁금한 거 있으면 물어봐 ${userName}! 🥤`,
    sources: [{ title: "식품의약품안전처", url: "https://www.foodsafetykorea.go.kr" }],
    keywords: ['음료', '커피', '차', '녹차', '홍차', '콜라', '사이다', '주스', '물', '라떼', '아메리카노'],
    tags: ['일상', '건강', '식품'],
    needsReasoning: false
  },
  "표그래프": {
    text: `**📊 표/그래프 요청 감지**\n\n표를 보여줄 수 있는 주제:\n- 영화 흥행 순위\n- 또봇 캐릭터 비교\n- 음료별 칼로리 비교\n- 프로그래밍 언어 비교\n\n"음료 표 보여줘" 라고 물어봐! 📊`,
    sources: [],
    keywords: ['표', '그래프', '차트', '테이블', '보여줘', '시각화', '비교', '통계'],
    tags: ['기능'],
    needsReasoning: false
  }
};

// ===== 개선된 차단 메시지 (HTML 구조 + 풍부한 내용) =====
const blockedReplies = [
  `<div class="blocked-header">🚫 Chat K Plus 안내</div>
<div class="blocked-content">
  <p><strong>${userName}님, 해당 질문은 Chat K Plus 정책상 답변이 어려워요.</strong> 😊</p>
  <p>대신 이런 주제는 자신 있게 답변할 수 있어요!</p>
  <ul>
    <li>🔬 <strong>과학</strong> - 물리, 화학, 생물, 우주</li>
    <li>💻 <strong>개발</strong> - 프로그래밍, 코딩, 웹</li>
    <li>📚 <strong>공부법</strong> - 영어, 수학, 학습 전략</li>
    <li>💪 <strong>건강</strong> - 운동, 수면, 영양</li>
    <li>🎬 <strong>영화</strong> - 한국 영화, 감독, 배우</li>
    <li>🙏 <strong>종교/철학</strong> - 기독교, 불교, 윤회</li>
    <li>🥤 <strong>음료</strong> - 커피, 차, 칼로리 비교</li>
    <li>🚗 <strong>애니메이션</strong> - 또봇, 도라에몽, 포켓몬</li>
  </ul>
  <p>무엇부터 알아볼까요? 😄</p>
</div>`,
  
  `<div class="blocked-header">🚫 Chat K Plus 안내</div>
<div class="blocked-content">
  <p><strong>${userName}님, 죄송합니다.</strong> 그 주제는 다루기 어려워요.</p>
  <p>하지만 실망하지 마세요! 제가 특히 잘 아는 분야를 소개할게요.</p>
  <ul>
    <li>📖 <strong>역사 팩트체크</strong> - 5.18 광주민주화운동 등</li>
    <li>💙 <strong>감정 상담과 위로</strong> - 힘들 땐 언제든 말해줘요</li>
    <li>🧦 <strong>일상 꿀팁</strong> - 양말 관리부터 건강 정보까지</li>
    <li>📱 <strong>아이폰 트러블슈팅</strong> - 터치 문제 해결</li>
  </ul>
  <p>이 중에 관심 있는 주제가 있다면 편하게 물어봐주세요! 🌟</p>
</div>`,
  
  `<div class="blocked-header">🚫 Chat K Plus 안내</div>
<div class="blocked-content">
  <p><strong>${userName}님, 미안합니다.</strong> 그 질문은 답변이 어려워요.</p>
  <p>대신 지금 바로 물어볼 수 있는 인기 질문을 추천드려요!</p>
  <ul>
    <li>"<strong>과학이 뭐야?</strong>"</li>
    <li>"<strong>공부 잘하는 법 알려줘</strong>"</li>
    <li>"<strong>또봇 정보 알려줘</strong>"</li>
    <li>"<strong>아이폰 터치 안 될 때 해결법</strong>"</li>
    <li>"<strong>음료별 칼로리 비교</strong>"</li>
  </ul>
  <p>무엇부터 알아볼까요? 😄</p>
</div>`
];

const replies = {
  greeting: [`안녕 ${userName}! 😊 뭐 도와줄까?`, `ㅎㅇ ${userName}!`, `반가워 ${userName}.`],
  thanks: [`ㅇㅋ ${userName}.`, `별거 아냐.`, `ㄱㅅ.`],
  nameSet: [`알았어 ${userName}!`, `ㅇㅋ ${userName}로 기억.`, `좋아 ${userName}.`],
  reasoning: [`데이터 파는 중...`, `1차 실패. 2차 추론.`, `좀 더 찾을게.`, `거의 다 왔어.`, `5차 추론!`],
  failed: [`${userName}, 5차까지 추론했는데 데이터가 없어. ${TEAM_EMAIL}로 피드백 보내줘!`, `미안. 지식베이스에 없어.`],
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

function searchKnowledge(text) {
  const lt = text.toLowerCase().trim(), nt = normalizeKeyword(lt);
  if (greetingPatterns.test(lt)) return { type: 'greeting' };
  if (krlPattern.test(lt)) return { data: knowledgeBase["KRL"], confidence: 1.0, direct: true };
  if (chartPattern.test(lt)) return { data: knowledgeBase["표그래프"], confidence: 1.0, direct: true };
  if (['오줌','소변','쉬','화장실','뇨','방광','배뇨'].some(k=>nt.includes(k))) { const dk = ['남성','여성','트랜스젠더','남아','여아']; const fk = dk.find(k=>nt.includes(k)); if (fk) return { data: knowledgeBase["오줌"], confidence:1.0, direct:true, subKey:fk }; return { data: knowledgeBase["오줌"], confidence:1.0, direct:false, useSummary:true }; }
  if (nt.includes('아이폰')||nt.includes('iphone')) return { data: knowledgeBase["아이폰"], confidence:1.0, direct:true };
  if (nt.includes('mdn')||nt.includes('모질라')) return { data: knowledgeBase["MDN"], confidence:1.0, direct:true };
  const drinkK = ['음료','커피','차','녹차','홍차','콜라','사이다','주스','물','마실','라떼','아메리카노'];
  if (drinkK.some(k=>nt.includes(k))) return { data: knowledgeBase["음료"], confidence:1.0, direct:true };
  const relK = ['종교','기독교','불교','이슬람','힌두교','유교','하나님','예수','부처','석가','성경','교회','기도','코란','공자','정교회','윤회','사서삼경'];
  if (relK.some(k=>nt.includes(k))) {
    if (nt.includes('정교회')||nt.includes('이콘')) return { data: knowledgeBase["정교회"], confidence:1.0, direct:true };
    if (nt.includes('윤회')||nt.includes('환생')) return { data: knowledgeBase["윤회"], confidence:1.0, direct:true };
    if (nt.includes('예수')||nt.includes('그리스도')||nt.includes('jesus')) return { data: knowledgeBase["예수"], confidence:1.0, direct:true };
    if (nt.includes('사서삼경')||nt.includes('논어')||nt.includes('맹자')) return { data: knowledgeBase["사서삼경"], confidence:1.0, direct:true };
    return { data: knowledgeBase["종교"], confidence:1.0, direct:true };
  }
  const devK = ['개발','프로그래밍','깃허브','github','css','html','리액트','react','노드','node','풀스택','버그'];
  if (devK.some(k=>nt.includes(k))) return { data: knowledgeBase["개발"], confidence:1.0, direct:true };
  for (const [key,data] of Object.entries(knowledgeBase)) { if (data.keywords && data.keywords.some(k=>nt.includes(k))) return { data, confidence:1.0, direct:!data.needsReasoning }; }
  return null;
}

function deepReasoning(query, attempt) {
  const words = normalizeKeyword(query).toLowerCase().replace(/[?!.]/g,' ').split(' ').filter(w=>w.length>1);
  if (words.length===0) return null;
  let bm=null,bs=0;
  for (const [key,data] of Object.entries(knowledgeBase)) { if (!data.keywords) continue; let s=0; data.keywords.forEach(k=>{words.forEach(w=>{if(k.includes(w)||w.includes(k))s+=2;if(k===w)s+=3;});}); if(data.tags)data.tags.forEach(t=>{words.forEach(w=>{if(t.includes(w)||w.includes(t))s+=1;});}); if(s>bs){bs=s;bm=data;} }
  const th = Math.max(1,6-attempt);
  if (bs>=th&&bm) return { data:bm, confidence:bs/10 };
  return null;
}

// ===== 차단 메시지 전송 =====
function sendBlockedMessage(text, msgId) {
  const randomBlocked = blockedReplies[Math.floor(Math.random() * blockedReplies.length)];
  const finalHtml = randomBlocked.replaceAll('${userName}', userName);
  
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div');
  msg.className = 'msg ai blocked';
  msg.dataset.msgId = msgId;
  msg.innerHTML = `
    <div class="avatar">C</div>
    <div class="bubble">
      <div class="msg-text">${finalHtml}</div>
    </div>
  `;
  chatList.appendChild(msg);
  scrollToBottom();
  setAnsweringState(false);
  autoResize();
}

function sendMessage() {
  if (isAnswering) { stopStreaming(true); return; }
  getElements(); const text = userInput ? userInput.value.trim() : ''; if (!text) return;
  if (welcomeScreen) { welcomeScreen.classList.add('hidden'); welcomeScreen.style.display = 'none'; }
  if (chatList) { chatList.classList.add('has-messages'); chatList.style.display = 'block'; }
  closeSidebar();
  
  if (isInappropriateContent(text)) {
    const mid = Date.now();
    addMessage(text, 'user', mid);
    if (userInput) { userInput.value = ''; autoResize(); }
    if (sendBtn) sendBtn.classList.remove('has-text');
    sendBlockedMessage(text, mid);
    return;
  }
  
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
    if(elapsed%RETRY_INTERVAL===0&&elapsed<REASONING_TIMEOUT){attempt++;if(attempt>MAX_RETRY_ATTEMPTS){timeoutTriggered=true;clearInterval(timer);if(typingEl)typingEl.remove();const f=replies.failed[Math.floor(Math.random()*replies.failed.length)];streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL),'ai',msgId,false);activeReasoning.delete(msgId);return;} ult(attempt);const result=deepReasoning(query,attempt);if(result&&result.confidence>=0.2){clearInterval(timer);if(typingEl)typingEl.remove();streamTextWithSources(result.data.text,result.data.sources||[],'ai',msgId,false);activeReasoning.delete(msgId);return;}}
    if(elapsed>=REASONING_TIMEOUT&&!timeoutTriggered){timeoutTriggered=true;clearInterval(timer);if(typingEl)typingEl.remove();const f=replies.failed[Math.floor(Math.random()*replies.failed.length)];streamText(f.replaceAll('${userName}',userName).replaceAll('${TEAM_EMAIL}',TEAM_EMAIL),'ai',msgId,false);activeReasoning.delete(msgId);}
  }, 100);
  activeReasoning.set(msgId,{timer,attempts:attempt,typingEl});
}

function addMessage(text,type,msgId){if(!chatList)return;const m=document.createElement('div');m.className=`msg ${type}`;m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">${type==='user'?userName[0].toUpperCase():'C'}</div><div class="bubble">${text}</div>`;chatList.appendChild(m);scrollToBottom();}

function streamTextWithSources(text,sources,type,msgId,isBlocked=false){if(!chatList)return;if(currentStreamInterval){clearInterval(currentStreamInterval);currentStreamInterval=null;}const m=document.createElement('div');m.className=`msg ${type} ${isBlocked?'blocked':''}`;m.dataset.msgId=msgId;m.innerHTML=`<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div>${sources&&sources.length?'<div class="sources"></div>':''}</div>`;chatList.appendChild(m);currentMsgElement=m;const bubble=m.querySelector('.msg-text'),sourcesEl=m.querySelector('.sources');let i=0;currentStreamInterval=setInterval(()=>{if(!isAnswering){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;return;}if(bubble)bubble.textContent+=text[i];i++;scrollToBottom();if(i>=text.length){clearInterval(currentStreamInterval);currentStreamInterval=null;currentMsgElement=null;if(sources&&sources.length&&sourcesEl)sourcesEl.innerHTML='<div class="sources-title">출처</div>'+sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`).join('');setAnsweringState(false);}},4);}

function streamText(text, type, msgId, isBlocked = false) {
  if (!chatList) return;
  if (currentStreamInterval) { clearInterval(currentStreamInterval); currentStreamInterval = null; }
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  msg.dataset.msgId = msgId;
  msg.innerHTML = `<div class="avatar">C</div><div class="bubble"><div class="msg-text"></div></div>`;
  chatList.appendChild(msg);
  currentMsgElement = msg;
  const bubble = msg.querySelector('.msg-text');
  let i = 0;
  currentStreamInterval = setInterval(() => {
    if (!isAnswering) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; return; }
    if (bubble) bubble.textContent += text[i]; i++; scrollToBottom();
    if (i >= text.length) { clearInterval(currentStreamInterval); currentStreamInterval = null; currentMsgElement = null; setAnsweringState(false); }
  }, 5);
}

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
