document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. UI 요소
    // ==========================================
    const UI = {
    input: document.getElementById('queryInput'),
    btn: document.getElementById('searchBtn'),
    examples: document.querySelectorAll('.example-btn'),
    searchView: document.getElementById('search-view'),
    chatView: document.getElementById('chat-view'),
    chatBox: document.getElementById('chat-box'),
    backBtn: document.getElementById('backBtn'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    stopBtn: document.getElementById('stopBtn'),
    difficultySelect: document.getElementById('difficultySelect') // ← 추가
};

// ========== 입력바 높이 자동 계산 ==========
let paddingTimer = null; // ← 추가
function fixChatPadding() {
    const footer = document.querySelector('.chat-footer');
    const chatBox = document.getElementById('chat-box');
    
    if (!footer || !chatBox) return;
    
    // 모바일에서만 작동
    if (window.innerWidth < 1024) {
        clearTimeout(paddingTimer); // ← 추가
        paddingTimer = setTimeout(() => { // ← 추가
            const height = footer.offsetHeight;
            chatBox.style.paddingBottom = (height + 20) + 'px';
            chatBox.scrollTop = chatBox.scrollHeight; // ← 추가. 스크롤도 같이
        }, 50); // ← 추가
    } else {
        chatBox.style.paddingBottom = '20px';
    }
}


// 창 크기 바뀔 때 재계산
window.addEventListener('resize', fixChatPadding);

// iOS 키보드 올라올 때 재계산
window.visualViewport?.addEventListener('resize', fixChatPadding);

// ==========================================
// 2. DB
// ==========================================
const DB = {
    // --- AI 자기소개 (모든 변형 대응) ---
    "너에 대해서": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너 누구야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "넌 뭐야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너는 누구": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "자기소개": "안녕하세요! 저는 Chat K plus입니다. 질문에 답하고 정보를 찾아드리는 AI입니다.",
    "너에 대해 알려줘": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너 뭐하는 애야": "저는 당신의 질문에 답하고, 검색을 돕는 AI 어시스턴트입니다.",
    "너 정체가 뭐야": "저는 Meta AI 기술을 기반으로 만든 Chat K plus 대화형 AI입니다.",
    "너는 무슨 기반이야": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
    "너 무슨 기반": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
    "krl": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
    "krl v10": "네, 저는 KRL V10 기반으로 동작합니다.",

    // --- 기존 데이터 ---
    "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다. 제이크 설리와 네이티리 가족이 해양 부족과 만나 겪는 이야기죠.",
    "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
    "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",

    // --- 중국 관련 ---
    "중국": "중국은 동아시아 국가로 수도는 베이징입니다. 인구 약 14억 명으로 세계 2위입니다.",
    "중국 수도": "중국의 수도는 베이징(北京)입니다.",
    "중국 인구": "2024년 기준 약 14억 1천만 명입니다.",
    "중국 역사": "5000년 역사를 가진 문명국가로, 하·상·주나라부터 시작해 현재 중화인민공화국에 이릅니다.",
    "시진핑": "시진핑은 현재 중화인민공화국의 주석입니다. 2013년부터 집권 중입니다.",
    "중국 공산당": "중국공산당(CCP)은 1921년 창당된 중국의 집권 정당입니다.",
    "중국 공산당 역사": "중국공산당은 1921년 7월 상하이에서 창당되었습니다. 1949년 중화인민공화국 수립 후 집권당이 되었으며, 마오쩌둥, 덩샤오핑, 장쩌민, 후진타오, 시진핑으로 이어지는 지도 체제를 유지하고 있습니다.",
    "중공 역사": "중국공산당은 1921년 7월 상하이에서 창당되었습니다. 1949년 중화인민공화국 수립 후 집권당이 되었으며, 마오쩌둥, 덩샤오핑, 장쩌민, 후진타오, 시진핑으로 이어지는 지도 체제를 유지하고 있습니다.",
    "ccp 역사": "중국공산당(CCP)은 1921년 창당되어 1949년부터 중국을 통치하는 집권 정당입니다.",
    "만리장성": "만리장성은 중국 북부를 가로지르는 세계 최대 방어시설로 길이가 2만km가 넘습니다.",
    "중국 음식": "짜장면, 마라탕, 딤섬, 베이징덕이 유명합니다.",

    // --- 아기/육아 관련 ---
    "아기": "아기는 출생 후 12개월까지의 영유아를 말합니다. 이 시기는 신체와 뇌 발달이 가장 빠른 시기입니다.",
    "아기_detail": "아기(0~12개월)는 신생아기(0~1개월), 영아기(1~12개월)로 나뉩니다. 평균적으로 생후 6개월에 첫 이가 나고, 12개월경 첫 걸음을 뗍니다. 수면은 하루 14~17시간 필요하며, 모유나 분유를 주식으로 합니다. 애착 형성이 중요한 시기로, 스킨십과 눈맞춤이 정서 발달에 핵심입니다.",
    
    "신생아": "신생아는 태어난 지 28일 이내의 아기입니다. 하루 16~20시간 수면하며 2~3시간마다 수유합니다.",
    "신생아_detail": "신생아는 체온 조절 능력이 미숙해 실내온도 24~26도를 유지해야 합니다. 배꼽은 보통 1~2주 내 탈락하며, 황달이 흔히 나타납니다. 모로반사, 빨기반사 등 원시반사가 있으며 생후 1개월 내 대부분 사라집니다. 하루 8~12회 수유, 6~8회 소변 기저귀가 정상입니다.",
    
    "기저귀": "기저귀는 아기 배변을 받아주는 위생용품입니다. 일회용과 천 기저귀로 나뉩니다.",
    "기저귀_detail": "기저귀는 크기별로 신생아용(NB), 소형(S), 중형(M), 대형(L), 특대형(XL)이 있습니다. 하루 평균 8~10개 사용하며, 2~3시간마다 교체가 원칙입니다. 발진 예방을 위해 매번 물티슈로 닦고 충분히 말린 후 착용합니다. 주요 브랜드: 하기스, 팸퍼스, 마미포코. 천기저귀는 빨아서 재사용 가능하나 관리가 번거롭습니다.",
    
    "분유": "분유는 모유 대용으로 만든 인공 영양식입니다. 1단계(0~6개월), 2단계(6~12개월)로 나뉩니다.",
    "분유_detail": "분유는 조제유라고도 하며, 소나 염소 우유를 아기 소화기관에 맞게 가공한 것입니다. 1단계는 초유 성분과 유사하게, 2단계는 철분과 칼슘이 강화됩니다. 물 1: 분유 1스푼 비율로 40~50도 물에 타서 체온 정도로 식혀 수유합니다. 개봉 후 3주 이내 사용, 제조 후 1시간 내 섭취가 원칙입니다. 주요 브랜드: 앱솔루트, 임페리얼, 아이엠마더.",
    
    "이유식": "이유식은 생후 6개월부터 시작하는 고형식 연습입니다. 초기-중기-후기-완료기로 진행합니다.",
    "이유식_detail": "이유식은 생후 180일경 시작이 WHO 권고입니다. 초기(6개월): 10배죽, 소고기미음 등 하루 1회. 중기(7~8개월): 7배죽, 채소큐브 추가 하루 2회. 후기(9~11개월): 5배죽, 손가락 음식 하루 3회. 완료기(12개월~): 진밥, 일반식. 알레르기 확인을 위해 한 가지 재료씩 3일 간격으로 추가합니다. 꿀, 생우유, 달걀흰자는 12개월 이후 급여합니다.",
    
    "아기 수면": "아기는 하루 14~17시간 수면이 필요합니다. 밤낮 구분은 3개월 이후 생깁니다.",
    "아기 수면_detail": "신생아: 16~20시간, 2~4시간 간격. 3개월: 15시간, 밤에 5~6시간 연속 수면 시작. 6개월: 14시간, 밤 8~10시간 통잠 가능. 수면교육은 4~6개월부터 가능하며, 일정한 수면의식(목욕→수유→자장가)이 도움됩니다. 엎드려 재우기는 SIDS 위험으로 금지, 반드시 바로 눕힙니다.",
    
    "예방접종": "예방접종은 질병 예방을 위한 필수 접종입니다. BCG, B형간염, DPT 등 국가필수예방접종이 있습니다.",
    "예방접종_detail": "국가필수예방접종은 무료입니다. 생후 0개월: B형간염 1차, BCG. 1개월: B형간염 2차. 2개월: DPT 1차, 소아마비 1차. 4개월: DPT 2차, 소아마비 2차. 6개월: B형간염 3차, DPT 3차. 12개월: MMR 1차, 수두. 접종 후 20~30분 병원에 머물며 이상반응 관찰 필요. 발열 시 해열제 복용 가능합니다.",

    // --- 다음 관련 ---
    "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음에서 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
    "다음 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
    "다음에서 기저귀라고 검색하면": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
    "기저귀 관련검색어": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀",

    // --- 천안문 관련 ---
"천안문": "천안문은 중국 베이징 중심부에 있는 성문입니다. 명나라 때 건설되었고 천안문 광장과 자금성의 입구입니다.",
"천안문_detail": "천안문(天安門)은 1417년 명나라 영락제 때 처음 세워졌고, 현재 건물은 1651년 청나라 순치제 때 재건된 것입니다. 높이 34.7m, 폭 66m 규모입니다. 1949년 10월 1일 마오쩌둥이 중화인민공화국 성립을 선포한 곳이기도 합니다. 천안문 광장은 세계에서 가장 큰 도시 광장 중 하나로 면적은 약 44만㎡입니다.",

"천안문 광장": "천안문 광장은 베이징 중심부에 있는 대형 광장입니다. 면적 약 44만㎡로 대규모 집회와 행사가 열립니다.",
"천안문 광장_detail": "천안문 광장은 남북 길이 880m, 동서 500m로 100만 명 이상 수용 가능합니다. 광장 주변에는 인민대회당, 중국국가박물관, 인민영웅기념비, 마오쩌둥 기념당이 있습니다. 매년 국경절 열병식 등 국가 주요 행사가 개최됩니다.",

// --- 생물학적 성 차이 관련 ---
"생물학적 성 차이": "인간의 성별은 성염색체 XX(여성), XY(남성)에 의해 결정됩니다. 성호르몬과 생식기관 구조에서 근본적 차이가 있습니다.",
"생물학적 성 차이_detail": "🔬 유전적 수준: 여성 XX, 남성 XY 염색체. Y염색체의 SRY 유전자가 고환 발달 촉진.<br><br>호르몬: 여성은 에스트로겐·프로게스테론이 높고, 남성은 테스토스테론이 높음. 이는 근육량, 체지방 분포, 2차 성징에 영향.<br><br>생식기관: 여성은 난소·자궁·질, 남성은 고환·정관·전립선·음경 구조.<br><br>뇌 신경과학: 편도체, 해마, 뇌량 등 일부 영역에서 평균적 차이가 보고되나, 개인차가 성별 간 차이보다 크고 학계 논쟁 중. 과도한 일반화 주의 필요.",

"성염색체": "성염색체는 성별을 결정하는 염색체입니다. 여성은 XX, 남성은 XY 구성입니다.",
"성염색체_detail": "Y염색체에는 SRY(Sex-determining Region Y) 유전자가 있어 태아 6~7주경 고환 발달을 유도합니다. SRY가 없으면 난소로 발달합니다. X염색체에는 800개 이상 유전자가 있으나 Y염색체에는 약 70개만 존재합니다.",

"성호르몬": "성호르몬은 생식과 2차 성징을 조절합니다. 에스트로겐, 프로게스테론, 테스토스테론이 대표적입니다.",
"성호르몬_detail": "에스트로겐: 여성에서 높음. 유방 발달, 월경 주기, 골밀도 유지. 테스토스테론: 남성에서 높음. 근육량 증가, 체모, 목소리 변화. 프로게스테론: 여성 월경 주기 후반 상승, 임신 유지. 남녀 모두 3가지 호르몬을 가지지만 농도 비율이 다릅니다.",

"뇌 성 차이": "뇌 구조에서 성별 간 평균적 차이가 일부 보고되나, 개인차가 더 크고 학계에서 논쟁 중입니다.",
"뇌 성 차이_detail": "보고된 차이: 편도체(남성>여성 경향), 해마(여성>남성 경향), 뇌량(여성>남성 경향). 그러나 표본 크기, 환경 통제 한계로 일관된 결론 없음. '남성적 뇌 vs 여성적 뇌' 이분법은 과학적 근거 부족. 성별보다 개인 경험, 학습, 환경이 뇌 발달에 더 큰 영향. 중요: 과학적 합의는 유전적·생식적 차이까지이며, 인지·행동 차이는 논쟁 영역입니다.", // ← 콤마 추가

    
    // --- 공식 사이트 ---
   "네이버 공식 사이트": "네이버 공식 사이트는 https://www.naver.com 입니다.",
    "구글": "구글 공식 사이트는 https://www.google.com 입니다.",
    "구글 공식 사이트": "구글 공식 사이트는 https://www.google.com 입니다.",
    "유튜브": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
    "유튜브 공식 사이트": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
    "인스타그램": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
    "인스타 공식 사이트": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
    "카카오": "카카오 공식 사이트는 https://www.kakaocorp.com 입니다.",
    "카카오톡": "카카오톡 공식 사이트는 https://www.kakaocorp.com/service/KakaoTalk 입니다.",
    "쿠팡": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
    "쿠팡 공식 사이트": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
    "chat gpt": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다.",
    "챗지피티": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다."
};

// ==========================================
// 3. 시스템
// ==========================================
const System = {
    isThinking: false,
    responseMode: 'normal', // ← 추가

    switchView(isChat) {
    UI.searchView.style.display = isChat ? 'none' : 'flex';
    UI.chatView.style.display = isChat ? 'flex' : 'none';
    UI.searchView.classList.toggle('hidden', isChat);
    UI.chatView.classList.toggle('hidden', !isChat);
    if (isChat) {
        setTimeout(() => {
            UI.chatInput.focus();
            fixChatPadding(); // ← 이 줄 추가. 채팅 켜질 때 계산
        }, 100);
    }
},

    addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type === 'user' ? 'user-msg' : 'ai-msg'}`;

    if (window.__isPolicyWarning) {
        msg.classList.add('policy-warning');
        window.__isPolicyWarning = false;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (text.match(urlRegex)) {
        msg.innerHTML = text.replace(urlRegex, url =>
            `<a href="#" class="external-link" data-url="${url}">${url}</a>`
        );
    } else {
        msg.innerHTML = text;
    }

    UI.chatBox.appendChild(msg);
    UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
    
    fixChatPadding(); // ← 이 한 줄만 추가
    
    return msg;
},

    async runReasoning(query) {
    if (!query || this.isThinking) return;
    this.isThinking = true;

    const mode = this.responseMode;
    const forceDetail = /(구체적|자세히|상세|자세한|구체적인)/.test(query); // ← 프롬프트에서 강제 감지

    UI.sendBtn.classList.add('hidden');
    UI.stopBtn.classList.remove('hidden');

    this.switchView(true);
    this.addMessage(query, 'user');

    const thinking = document.createElement('div');
    thinking.className = 'message ai-msg thinking';
    thinking.innerHTML = `<span class="thinking-icon"></span> <span class="thinking-text">분석 중...</span>`;
    UI.chatBox.appendChild(thinking);
    UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

    const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
    for (let step of steps) {
        if (!this.isThinking) break;
        thinking.querySelector('.thinking-text').textContent = step;
        await new Promise(r => setTimeout(r, 400));
    }

    if (!this.isThinking) {
        thinking.remove();
        UI.stopBtn.classList.add('hidden');
        UI.sendBtn.classList.remove('hidden');
        return;
    }

    thinking.remove();

    const q = query.trim();
    const nq = q.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
    const rawQ = query;
    let answer = null;
    let matchedKey = null; // ← 매칭된 DB 키 저장용

    // ===== 정책 필터 v2 =====
    const chinaPattern = /(중국\s*공산당|중공|c\s*c\s*p|c\.?\s*c\.?\s*p|공산당|시진핑|습근평|xi\s*jinping|시\s*진\s*핑)/.test(nq);
    const ccpOutBypass = /c\s*c\s*p.*o\s*u\s*t|c\.?\s*c\.?\s*p.*out/i.test(rawQ);

    if (chinaPattern || ccpOutBypass) {
        const banWords = /(비판|비난|독재|부패|타도|전복|붕괴|망해|쓰레기|나쁘|싫어|반대|문제|악|독재자|살인|탄압|인권|학살|학살자|학정|폭정|전체주의|권위주의|세습|부정부패|비리|착취|억압|감시|검열|통제|세뇌|선전|선동|거짓|위선|무능|실패|몰락|타락|퇴물|폐기|청산|심판|처단|처형|암살|테러|저항|혁명|봉기|시위|데모|항의|규탄|고발|폭로|비밀|스캔들|티안먼|천안문|위구르|신장|티베트|홍콩|대만독립|파룬궁|파룬따파|아웃|out|사퇴|퇴진|물러나|하야|사임|탄핵|추방|제거|숙청|죽어|뒤져|꺼져|꺼지|닥쳐|병신|새끼|놈|개|쓰레기|타파|반대|저항|멸망|소멸|파멸|종식)/;
        const directInsults = /(시진핑|습근평|xi).{0,5}(아웃|out|사퇴|퇴진|물러나|하야|사임|탄핵|죽어|뒤져|꺼져|타도|처단)|(중공|공산당|ccp|c\.?c\.?p).{0,5}(망해|타도|아웃|out|붕괴|멸망|해체|종식|청산)|(ccp|c\.?c\.?p).{0,3}out|c\s*c\s*p.*o\s*u\s*t/i;
        if (banWords.test(nq) || directInsults.test(nq) || ccpOutBypass) {
            answer = `<strong>⚠️ 정책 위반 감지</strong><br><br>중국 공산당 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`;
            window.__isPolicyWarning = true;
        }
    }

    if (!answer) {
        const koreanPresidents = /(이대통령|이재명|윤석열|문재인|박근혜|이명박|노무현|김대중|김영삼|노태우|전두환|최규하|박정희|윤보선|이승만)/;
        const presidentInsults = /(탄핵|사퇴|퇴진|하야|아웃|out|죽어|뒤져|꺼져|타도|처단|암살|독재|부패|무능|실패|비리|범죄|매국|빨갱이|토착왜구|적폐|쓰레기|병신|개새끼|놈|년|망해|붕괴|몰락|퇴물|청산|심판|처형)/;

        if (koreanPresidents.test(nq) && presidentInsults.test(nq)) {
            answer = `<strong>⚠️ 정책 위반 감지</strong><br><br>대한민국 대통령에 대한 비하/모욕적 표현은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`;
            window.__isPolicyWarning = true;
        }
    }
    // ===== 필터 끝 =====

    // DB 매칭 - 정확 일치 우선
    if (!answer && DB[q]) {
        answer = DB[q];
        matchedKey = q; // ← 키 저장
    }

    // 공식 사이트 패턴
    if (!answer && /공식.*사이트|홈페이지|사이트.*알려줘|사이트.*알려/.test(nq)) {
        const sites = {
            '네이버':'https://www.naver.com',
            '다음':'https://www.daum.net',
            '구글':'https://www.google.com',
            '유튜브':'https://www.youtube.com',
            '인스타그램':'https://www.instagram.com',
            '인스타':'https://www.instagram.com',
            '카카오':'https://www.kakaocorp.com',
            '쿠팡':'https://www.coupang.com'
        };
        const found = [];
        for (const name in sites) {
            if (nq.includes(name) &&!found.some(f => f.includes(sites[name]))) {
                found.push(`${name} 공식 사이트는 ${sites[name]} 입니다.`);
                matchedKey = name; // ← 키 저장
            }
        }
        if (found.length) answer = found.join('<br>');
    }

    // DB 부분 매칭 - 키도 같이 저장
    if (!answer) {
        for (const key in DB) {
            const nk = key.toLowerCase();
            if (nq.includes(nk) || nk.includes(nq)) {
                answer = DB[key];
                matchedKey = key; // ← 키 저장
                break;
            }
        }
    }

    // 자가소개 패턴
    if (!answer && /(너|니).*(누구|뭐)/.test(nq)) {
        answer = "저는 Chat K plus의 AI 어시스턴트입니다!";
        matchedKey = "너에 대해서";
    }

    // 중국 키워드
    if (!answer && nq.includes('중국')) {
        if (nq.includes('수도')) {
            answer = DB["중국 수도"];
            matchedKey = "중국 수도";
        } else if (nq.includes('인구')) {
            answer = DB["중국 인구"];
            matchedKey = "중국 인구";
        } else {
            answer = DB["중국"];
            matchedKey = "중국";
        }
    }

    // 시간표
    if (!answer && /(시간표|수업.*뭐|오늘.*수업|내일.*수업)/.test(nq)) {
        const data = getTimetable();
        const today = new Date().getDay();
        const days = ['sun','mon','tue','wed','thu','fri','sat'];
        let targetDay = days[today];
        if (nq.includes('내일')) targetDay = days[(today + 1) % 7];
        else if (nq.includes('모레')) targetDay = days[(today + 2) % 7];
        else if (nq.includes('월')) targetDay = 'mon';
        else if (nq.includes('화')) targetDay = 'tue';
        else if (nq.includes('수')) targetDay = 'wed';
        else if (nq.includes('목')) targetDay = 'thu';
        else if (nq.includes('금')) targetDay = 'fri';
        else if (nq.includes('토')) targetDay = 'sat';
        else if (nq.includes('일')) targetDay = 'sun';
        else targetDay = today === 0? 'mon' : days[today];

        const list = data[targetDay] || [];
        const dayName = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일'}[targetDay];
        answer = list.length
         ? `${dayName}요일 시간표:<br>` + list.map(it => `${it.time} ${it.subject} ${it.room}`).join('<br>')
            : `${dayName}요일 수업이 없습니다.`;
    }

    if (!answer) answer = `"${q}"에 대해 학습된 내용이 없습니다.`;

    // ===== 난이도 3단계 처리 - 개선됨 =====
    const shouldDetail = mode === 'detail' || forceDetail; // ← 모드 or 프롬프트 키워드

    if (mode === 'simple' &&!forceDetail) {
        // 간단: 첫 문장만
        answer = answer.split(/[.!?]\s/)[0] + '.';
    } else if (shouldDetail && matchedKey) {
        // 상세: 매칭된 키로 _detail 찾기
        if (DB[matchedKey + '_detail']) {
            answer += `<br><br><strong>상세:</strong> ${DB[matchedKey + '_detail']}`;
        } else {
            answer += `<br><br>※ 해당 주제의 상세 정보가 DB에 없습니다.`;
        }
    }
    // normal은 그대로, simple인데 forceDetail이면 detail로 처리됨
    // ===== 난이도 처리 끝 =====

    this.addMessage(answer, 'ai');
    this.isThinking = false;

    UI.stopBtn.classList.add('hidden');
    UI.sendBtn.classList.remove('hidden');
    this.updateSendButton();
},

        
    updateSendButton() {
        const hasText = UI.chatInput.value.trim().length > 0;
        UI.sendBtn.disabled =!hasText;
        UI.sendBtn.classList.toggle('active', hasText);
    }
}; // ← 여기 세미콜론으로 System 객체 종료

// ==========================================
// 4. 이벤트
// ==================================

// 메인 검색
const updateMainBtn = () => {
    UI.btn.disabled = UI.input.value.trim().length === 0;
};

UI.input.addEventListener('input', updateMainBtn);
UI.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' &&!UI.btn.disabled) {
        System.runReasoning(UI.input.value.trim());
        UI.input.value = '';
        updateMainBtn();
    }
});

UI.btn.addEventListener('click', () => {
    System.runReasoning(UI.input.value.trim());
    UI.input.value = '';
    updateMainBtn();
});

// 채팅 입력바 (모던화)
UI.chatInput.addEventListener('input', () => {
    System.updateSendButton();
    UI.chatInput.style.height = 'auto';
    UI.chatInput.style.height = Math.min(UI.chatInput.scrollHeight, 120) + 'px';
});

UI.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
        e.preventDefault();
        if (!UI.sendBtn.disabled) {
            System.runReasoning(UI.chatInput.value.trim());
            UI.chatInput.value = '';
            UI.chatInput.style.height = 'auto';
            System.updateSendButton();
        }
    }
});

// iOS 키보드 대응
UI.chatInput.addEventListener('focus', () => {
    setTimeout(() => UI.chatBox.scrollTop = UI.chatBox.scrollHeight, 300);
});

UI.sendBtn.addEventListener('click', () => {
    if (UI.sendBtn.disabled) return;
    System.runReasoning(UI.chatInput.value.trim());
    UI.chatInput.value = '';
    UI.chatInput.style.height = 'auto';
    System.updateSendButton();
});

// ← 멈추기 버튼
UI.stopBtn.addEventListener('click', () => {
    if (!System.isThinking) return;
    System.isThinking = false;
    document.querySelector('.message.thinking')?.remove();
    System.addMessage('⏹️ 답변이 중지되었습니다.', 'ai');
    UI.stopBtn.classList.add('hidden');
    UI.sendBtn.classList.remove('hidden');
    System.updateSendButton();
});

// 뒤로가기
UI.backBtn.addEventListener('click', () => {
    System.switchView(false);
    UI.chatBox.innerHTML = '';
});

// 예시 버튼
UI.examples.forEach(btn => {
    btn.addEventListener('click', () => {
        System.runReasoning(btn.textContent.trim());
    });
});

    // === 링크 경고 모달 ===
const linkModal = document.getElementById('linkModal');
const modalUrl = document.getElementById('modalUrl');
const modalCancel = document.getElementById('modalCancel');
const modalGo = document.getElementById('modalGo');
let pendingUrl = '';

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('external-link')) {
        e.preventDefault();
        pendingUrl = e.target.dataset.url;
        modalUrl.textContent = pendingUrl;
        linkModal.classList.remove('hidden');
    }
});
if (modalCancel) modalCancel.onclick = () => linkModal.classList.add('hidden');
if (modalGo) modalGo.onclick = () => { window.open(pendingUrl, '_blank'); linkModal.classList.add('hidden'); };
if (linkModal) linkModal.querySelector('.modal-backdrop').onclick = () => linkModal.classList.add('hidden');

// === 시간표 버튼 (모바일 전용) ===
const timetableBtn = document.getElementById('timetableBtn');
const timetableModal = document.getElementById('timetableModal');
const timetableClose = document.getElementById('timetableClose');
const timetableContent = document.getElementById('timetableContent');
const addClassBtn = document.getElementById('addClassBtn');
const addClassModal = document.getElementById('addClassModal');
const cancelAdd = document.getElementById('cancelAdd');
const saveAdd = document.getElementById('saveAdd');

let currentDay = 'mon';

function getTimetable() {
    const saved = localStorage.getItem('timetable');
    if (saved) return JSON.parse(saved);
    return {
        mon: [{time:'09:00-10:30', subject:'수학', room:'3-2'}, {time:'11:00-12:30', subject:'영어', room:'2-1'}],
        tue: [{time:'10:00-11:30', subject:'과학', room:'실험실'}],
        wed: [],
        thu: [{time:'13:00-14:30', subject:'국어', room:'3-1'}],
        fri: [{time:'09:00-10:30', subject:'체육', room:'운동장'}]
    };
}

function saveTimetable(data) {
    localStorage.setItem('timetable', JSON.stringify(data));
}

if (timetableBtn) {
    timetableBtn.addEventListener('click', () => {
        timetableModal.classList.remove('hidden');
        loadTimetable(currentDay);
    });
}
if (timetableClose) timetableClose.onclick = () => timetableModal.classList.add('hidden');
if (timetableModal) timetableModal.querySelector('.modal-backdrop').onclick = () => timetableModal.classList.add('hidden');

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentDay = tab.dataset.day;
        loadTimetable(currentDay);
    });
});

function loadTimetable(day) {
    const data = getTimetable();
    const list = data[day] || [];
    if (list.length === 0) {
        timetableContent.innerHTML = `<div class="timetable-empty">수업이 없습니다<br><span style="font-size:12px">+ 버튼으로 추가하세요</span></div>`;
    } else {
        timetableContent.innerHTML = list.map((item, idx) => `
            <div class="timetable-item" data-idx="${idx}">
                <div class="timetable-time">${item.time}</div>
                <div class="timetable-subject">${item.subject}</div>
                <div class="timetable-room">${item.room}</div>
            </div>
        `).join('');

        // 길게 누르면 삭제
        document.querySelectorAll('.timetable-item').forEach(el => {
            let pressTimer;
            const del = () => {
                if (confirm('이 수업을 삭제할까요?')) {
                    const idx = parseInt(el.dataset.idx);
                    const data = getTimetable();
                    data[day].splice(idx, 1);
                    saveTimetable(data);
                    loadTimetable(day);
                }
            };
            el.addEventListener('touchstart', () => { pressTimer = setTimeout(del, 600); });
            el.addEventListener('touchend', () => clearTimeout(pressTimer));
            el.addEventListener('mousedown', () => { pressTimer = setTimeout(del, 600); });
            el.addEventListener('mouseup', () => clearTimeout(pressTimer));
        });
    }
}

if (addClassBtn) {
    addClassBtn.addEventListener('click', () => {
        document.getElementById('classDay').value = currentDay;
        addClassModal.classList.remove('hidden');
    });
}
if (cancelAdd) cancelAdd.onclick = () => addClassModal.classList.add('hidden');
if (addClassModal) addClassModal.querySelector('.modal-backdrop').onclick = () => addClassModal.classList.add('hidden');

if (saveAdd) {
    saveAdd.addEventListener('click', () => {
        const day = document.getElementById('classDay').value;
        const time = document.getElementById('classTime').value.trim();
        const subject = document.getElementById('classSubject').value.trim();
        const room = document.getElementById('classRoom').value.trim();

        if (!time ||!subject) return alert('시간과 과목을 입력하세요');

        const data = getTimetable();
        if (!data[day]) data[day] = [];
        data[day].push({time, subject, room});
        data[day].sort((a,b) => a.time.localeCompare(b.time));

        saveTimetable(data);
        addClassModal.classList.add('hidden');
        document.getElementById('classTime').value = '';
        document.getElementById('classSubject').value = '';
        document.getElementById('classRoom').value = '';

        if (day === currentDay) loadTimetable(currentDay);
    });
}
    // ========== PC 자동화: 키보드 단축키 ==========
document.addEventListener('keydown', (e) => {
    // Ctrl+K 또는 Cmd+K: 검색/채팅 입력 포커스
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('queryInput')?.offsetParent?
                      document.getElementById('queryInput') :
                      document.getElementById('chatInput');
        input?.focus();
    }

    // ESC: 모달 닫기
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(m => {
            m.classList.add('hidden');
        });
    }
});

// ========== PC 자동화: 사이드바 클릭 ==========
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const text = btn.textContent.trim();
     if (text.includes('홈')) {
    System.switchView(false); // ← 이렇게 통일
} else if (text.includes('새 채팅')) {
    System.switchView(true);
            document.getElementById('search-view')?.classList.add('hidden');
            document.getElementById('chat-view')?.classList.remove('hidden');
        } else if (text.includes('시간표')) {
            document.getElementById('timetableModal')?.classList.remove('hidden');
        }
    });
});

    // ========== 사이드바 토글 ==========
const sidebarToggle = document.getElementById('sidebarToggle');
const appContainer = document.querySelector('.app-container');

// 열기 버튼 동적 생성
const openBtn = document.createElement('button');
openBtn.className = 'sidebar-open-btn';
openBtn.innerHTML = '☰';
openBtn.title = '사이드바 열기';
document.querySelector('.app-container').appendChild(openBtn); // ← body → app-container

// PC인지 체크 함수
const isPC = () => window.innerWidth >= 1024;

const updateOpenBtn = () => {
    if (isPC() && appContainer.classList.contains('sidebar-collapsed')) {
        openBtn.style.display = 'flex';
    } else {
        openBtn.style.display = 'none';
    }
};

sidebarToggle?.addEventListener('click', () => {
    appContainer.classList.add('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', 'true');
    updateOpenBtn();
});

openBtn.addEventListener('click', () => {
    appContainer.classList.remove('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', 'false');
    updateOpenBtn();
});

// 저장된 상태 복원
if (localStorage.getItem('sidebar-collapsed') === 'true' && isPC()) {
    appContainer.classList.add('sidebar-collapsed');
}

// 초기 + 리사이즈
updateOpenBtn();
window.addEventListener('resize', updateOpenBtn);

// ========== 난이도 설정 ==========
UI.difficultySelect?.addEventListener('change', (e) => {
    System.responseMode = e.target.value;
});
System.responseMode = UI.difficultySelect?.value || 'normal';

// 초기 상태
updateMainBtn();
System.updateSendButton();
}); // ← 이 한 줄
