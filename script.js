// =========================================================
// Chat K plus - Optimized JavaScript (2026-06-18 v2.1)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. UI 요소 참조
    // ==========================================
    const UI = {
        // 검색 화면
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        examples: document.querySelectorAll('.example-btn'),
        searchView: document.getElementById('search-view'),
        
        // 채팅 화면
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn'),
        stopBtn: document.getElementById('stopBtn'),
        difficultySelect: document.getElementById('difficultySelect'),
        
        // 입력바 컨트롤
        attachmentBtn: document.getElementById('attachmentBtn'),
        timetableBtn: document.getElementById('timetableBtn'),
        menuBtn: document.getElementById('menuBtn'),
        
        // 링크 경고 모달
        linkModal: document.getElementById('linkModal'),
        modalUrl: document.getElementById('modalUrl'),
        modalCancel: document.getElementById('modalCancel'),
        modalGo: document.getElementById('modalGo'),
        
        // 시간표 모달
        timetableModal: document.getElementById('timetableModal'),
        timetableClose: document.getElementById('timetableClose'),
        timetableContent: document.getElementById('timetableContent'),
        addClassBtn: document.getElementById('addClassBtn'),
        
        // 수업 추가 모달
        addClassModal: document.getElementById('addClassModal'),
        cancelAdd: document.getElementById('cancelAdd'),
        saveAdd: document.getElementById('saveAdd')
    };

    // placeholder 설정
    if (UI.chatInput) {
        UI.chatInput.placeholder = '무엇이든 물어보세요';
    }

    // ==========================================
    // 2. 유틸리티 함수
    // ==========================================
    let paddingTimer = null;
    
    function fixChatPadding() {
        const footer = document.querySelector('.chat-footer');
        const chatBox = document.getElementById('chat-box');
        
        if (!footer || !chatBox) return;
        
        // CSS의 미디어쿼리와 일치하도록 768px로 조정
        if (window.innerWidth < 768) {
            clearTimeout(paddingTimer);
            paddingTimer = setTimeout(() => {
                const height = footer.offsetHeight;
                chatBox.style.paddingBottom = (height + 20) + 'px';
                chatBox.scrollTop = chatBox.scrollHeight;
                
                // CSS의 keyboard-open 클래스와 연동
                if (footer.classList.contains('keyboard-open')) {
                    chatBox.style.paddingBottom = (height + 10) + 'px';
                }
            }, 50);
        } else {
            chatBox.style.paddingBottom = '20px';
        }
    }

    // 이벤트 리스너 등록 (중복 제거)
    window.addEventListener('resize', fixChatPadding);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', fixChatPadding);
    }

    // ==========================================
    // 3. 데이터베이스
    // ==========================================
    const DB = {
        // 🤖 AI 자기소개
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

        // 🎬 영화/엔터테인먼트
        "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다. 제이크 설리와 네이티리 가족이 해양 부족과 만나 겪는 이야기죠.",

        // 🏛️ 정치/사회
        "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
        "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",

        // 🇨🇳 중국 관련
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

        // 👶 아기/육아
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

        // 🔍 검색 포털
        "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
        "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
        "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다.",
        "다음에서 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
        "다음 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
        "다음에서 기저귀라고 검색하면": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저귀\ndiaper\n기저귀 하기스\n분유\n노인 기저귀\n기저귀 갈아요\n기저귀 브랜드\n면기저귀\n기저귀 갈아\n기저귀 바우처\n기저귀 채우기",
        "기저귀 관련검색어": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀\n기저귀 영어\n기저귀 갈기\n기저귀 영어로\n천기저귀\n성인용 팬티기저균",

        // 🏛️ 역사/문화
        "천안문": "천안문은 중국 베이징 중심부에 있는 성문입니다. 명나라 때 건설되었고 천안문 광장과 자금성의 입구입니다.",
        "천안문_detail": "천안문(天安門)은 1417년 명나라 영락제 때 처음 세워졌고, 현재 건물은 1651년 청나라 순치제 때 재건된 것입니다. 높이 34.7m, 폭 66m 규모입니다. 1949년 10월 1일 마오쩌둥이 중화인민공화국 성립을 선포한 곳이기도 합니다. 천안문 광장은 세계에서 가장 큰 도시 광장 중 하나로 면적은 약 44만㎡입니다.",

        "천안문 광장": "천안문 광장은 베이징 중심부에 있는 대형 광장입니다. 면적 약 44만㎡로 대규모 집회와 행사가 열립니다.",
        "천안문 광장_detail": "천안문 광장은 남북 길이 880m, 동서 500m로 100만 명 이상 수용 가능합니다. 광장 주변에는 인민대회당, 중국국가박물관, 인민영웅기념비, 마오쩌둥 기념당이 있습니다. 매년 국경절 열병식 등 국가 주요 행사가 개최됩니다.",

        // 🔬 생물학/과학
        "생물학적 성 차이": "인간의 성별은 성염색체 XX(여성), XY(남성)에 의해 결정됩니다. 성호르몬과 생식기관 구조에서 근본적 차이가 있습니다.",
        "생물학적 성 차이_detail": "🔬 유전적 수준: 여성 XX, 남성 XY 염색체. Y염색체의 SRY 유전자가 고환 발달 촉진.<br><br>호르몬: 여성은 에스트로겐·프로게스테론이 높고, 남성은 테스토스테론이 높음. 이는 근육량, 체지방 분포, 2차 성징에 영향.<br><br>생식기관: 여성은 난소·자궁·질, 남성은 고환·정관·전립선·음경 구조.<br><br>뇌 신경과학: 편도체, 해마, 뇌량 등 일부 영역에서 평균적 차이가 보고되나, 개인차가 성별 간 차이보다 크고 학계 논쟁 중. 과도한 일반화 주의 필요.",

        "성염색체": "성염색체는 성별을 결정하는 염색체입니다. 여성은 XX, 남성은 XY 구성입니다.",
        "성염색체_detail": "Y염색체에는 SRY(Sex-determining Region Y) 유전자가 있어 태아 6~7주경 고환 발달을 유도합니다. SRY가 없으면 난소로 발달합니다. X염색체에는 800개 이상 유전자가 있으나 Y염색체에는 약 70개만 존재합니다.",

        "성호르몬": "성호르몬은 생식과 2차 성징을 조절합니다. 에스트로겐, 프로게스테론, 테스토스테론이 대표적입니다.",
        "성호르몬_detail": "에스트로겐: 여성에서 높음. 유방 발달, 월경 주기, 골밀도 유지. 테스토스테론: 남성에서 높음. 근육량 증가, 체모, 목소리 변화. 프로게스테론: 여성 월경 주기 후반 상승, 임신 유지. 남녀 모두 3가지 호르몬을 가지지만 농도 비율이 다릅니다.",

        "뇌 성 차이": "뇌 구조에서 성별 간 평균적 차이가 일부 보고되나, 개인차가 더 크고 학계에서 논쟁 중입니다.",
        "뇌 성 차이_detail": "보고된 차이: 편도체(남성>여성 경향), 해마(여성>남성 경향), 뇌량(여성>남성 경향). 그러나 표본 크기, 환경 통제 한계로 일관된 결론 없음. '남성적 뇌 vs 여성적 뇌' 이분법은 과학적 근거 부족. 성별보다 개인 경험, 학습, 환경이 뇌 발달에 더 큰 영향. 중요: 과학적 합의는 유전적·생식적 차이까지이며, 인지·행동 차이는 논쟁 영역입니다.",

        // 🌐 공식 사이트 (URL 수정됨)
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
        "챗지피티": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다.",

        // 🏛️ 역대 대통령 탄핵 정보 (추가됨)
        "박근혜 전 대통령 탄핵 이유": "박근혜 전 대통령은 2017년 3월 10일 헌법재판소에서 탄핵이 인용되었습니다. 주요 탄핵 사유는 다음과 같습니다:<br><br>1. 최순실 등 비선실세의 국정 개입<br>2. 미르·K스포츠재단 설립 및 출연금 강요<br>3. 대기업으로부터의 불법 출연금 수수<br>4. 세월호 참사 당시 대응 부실<br>5. 공무원의 뇌물 수수 방조<br><br>이러한 사유로 헌법재판소 재판관 8명 전원 찬성으로 탄핵이 결정되었습니다.",
        
        "역대 대통령 탄핵": "대한민국 역사상 탄핵된 대통령은 박근혜 전 대통령 한 명입니다. 2017년 3월 10일 헌법재판소에서 탄핵이 인용되었습니다.",
        
        "대통령 탄핵 이유": "대한민국 역사상 탄핵된 대통령은 박근혜 전 대통령 한 명입니다. 주요 탄핵 사유는 다음과 같습니다:<br><br>1. 최순실 등 비선실세의 국정 개입<br>2. 미르·K스포츠재단 설립 및 출연금 강요<br>3. 대기업으로부터의 불법 출연금 수수<br>4. 세월호 참사 당시 대응 부실<br>5. 공무원의 뇌물 수수 방조<br><br>이러한 사유로 헌법재판소 재판관 8명 전원 찬성으로 탄핵이 결정되었습니다.",
        
        "탄핵 이유": "대한민국 역사상 탄핵된 대통령은 박근혜 전 대통령 한 명입니다. 주요 탄핵 사유는 다음과 같습니다:<br><br>1. 최순실 등 비선실세의 국정 개입<br>2. 미르·K스포츠재단 설립 및 출연금 강요<br>3. 대기업으로부터의 불법 출연금 수수<br>4. 세월호 참사 당시 대응 부실<br>5. 공무원의 뇌물 수수 방조<br><br>이러한 사유로 헌법재판소 재판관 8명 전원 찬성으로 탄핵이 결정되었습니다."
    };

   // ==========================================
// 4. 시스템 기능
// ==========================================
const System = {
    isThinking: false,
    responseMode: 'normal',

    // ==========================================
    // 4.1 뷰 전환
    // ==========================================
    switchView(isChat) {
        if (!UI.searchView || !UI.chatView) return;
        
        UI.searchView.style.display = isChat ? 'none' : 'flex';
        UI.chatView.style.display = isChat ? 'flex' : 'none';
        UI.searchView.classList.toggle('hidden', isChat);
        UI.chatView.classList.toggle('hidden', !isChat);
        
        if (isChat) {
            setTimeout(() => {
                if (UI.chatInput) UI.chatInput.focus();
                fixChatPadding();
            }, 100);
        }
    },

    // ==========================================
    // 4.2 메시지 추가
    // ==========================================
    addMessage(text, type) {
        if (!UI.chatBox) return null;
        
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
        fixChatPadding();
        
        return msg;
    },

    // ==========================================
    // 4.3 추론 실행
    // ==========================================
    async runReasoning(query) {
        if (!query || this.isThinking) return;
        this.isThinking = true;

        const mode = this.responseMode;
        const forceDetail = /(구체적|자세히|상세|자세한|구체적인)/.test(query);

        if (UI.sendBtn) UI.sendBtn.classList.add('hidden');
        if (UI.stopBtn) UI.stopBtn.classList.remove('hidden');

        this.switchView(true);
        this.addMessage(query, 'user');

        // 씽킹 애니메이션
        const thinking = document.createElement('div');
        thinking.className = 'message ai-msg thinking';
        thinking.innerHTML = `<span class="thinking-icon"></span> <span class="thinking-text">분석 중...</span>`;
        UI.chatBox.appendChild(thinking);
        UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

        const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
        for (const step of steps) {
            if (!this.isThinking) break;
            const thinkingText = thinking.querySelector('.thinking-text');
            if (thinkingText) thinkingText.textContent = step;
            await new Promise(r => setTimeout(r, 400));
        }

        if (!this.isThinking) {
            thinking.remove();
            if (UI.stopBtn) UI.stopBtn.classList.add('hidden');
            if (UI.sendBtn) UI.sendBtn.classList.remove('hidden');
            return;
        }

        thinking.remove();

        // ==========================================
        // 4.4 정책 필터 시스템 v3.1
        // ==========================================
        const q = query.trim();
        const nq = q.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
        const rawQ = query;
        let answer = null;
        let matchedKey = null;

        // 정책 위반 감지
        const policyViolation = this.checkPolicyViolation(nq, rawQ);
        if (policyViolation) {
            answer = policyViolation;
            window.__isPolicyWarning = true;
        }

        // ==========================================
        // 4.5 DB 매칭
        // ==========================================
        
        // 정확 일치 우선
        if (!answer && DB[q]) {
            answer = DB[q];
            matchedKey = q;
        }

        // 공식 사이트 패턴 (URL 수정됨)
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
                if (nq.includes(name) && !found.some(f => f.includes(sites[name]))) {
                    found.push(`${name} 공식 사이트는 ${sites[name]} 입니다.`);
                    matchedKey = name;
                }
            }
            if (found.length) answer = found.join('<br>');
        }

        // DB 부분 매칭
        if (!answer) {
            for (const key in DB) {
                const nk = key.toLowerCase();
                if (nq.includes(nk) || nk.includes(nq)) {
                    answer = DB[key];
                    matchedKey = key;
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
            else targetDay = today === 0 ? 'mon' : days[today];

            const list = data[targetDay] || [];
            const dayName = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일'}[targetDay];
            answer = list.length 
                ? `${dayName}요일 시간표:<br>` + list.map(it => `${it.time} ${it.subject} ${it.room}`).join('<br>')
                : `${dayName}요일 수업이 없습니다.`;
        }

        if (!answer) answer = `"${q}"에 대해 학습된 내용이 없습니다.`;

        // ==========================================
        // 4.6 난이도 3단계 처리
        // ==========================================
        const shouldDetail = mode === 'detail' || forceDetail;

        if (mode === 'simple' && !forceDetail) {
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

        this.addMessage(answer, 'ai');
        this.isThinking = false;

        if (UI.stopBtn) UI.stopBtn.classList.add('hidden');
        if (UI.sendBtn) UI.sendBtn.classList.remove('hidden');
        this.updateSendButton();
    },

    // ==========================================
    // 4.7 정책 위반 감지 시스템 v3.1
    // ==========================================
    checkPolicyViolation(nq, rawQ) {
        // ==========================================
        // 4.7.1 비판적 키워드 (공통)
        // ==========================================
        const criticalKeywords = [
            // 정치적 비판
            '비판', '비난', '독재', '부패', '타도', '전복', '붕괴', '망해',
            '쓰레기', '나쁘', '싫어', '반대', '문제', '악', '독재자', '살인',
            '탄압', '인권', '학살', '학살자', '학정', '폭정', '전체주의',
            '권위주의', '세습', '부정부패', '비리', '착취', '억압', '감시',
            '검열', '통제', '세뇌', '선전', '선동', '거짓', '위선', '무능',
            '실패', '몰락', '타락', '퇴물', '폐기', '청산', '심판', '처단',
            '처형', '암살', '테러', '저항', '혁명', '봉기', '시위', '데모',
            '항의', '규탄', '고발', '폭로', '비밀', '스캔들',
            
            // 인신공격
            '병신', '새끼', '놈', '개', '년', '쓰레기', '타파', '멸망',
            '소멸', '파멸', '종식', '죽어', '뒤져', '꺼져', '꺼지', '닥쳐',
            
            // 정치적 행동
            '아웃', 'out', '사퇴', '퇴진', '물러나', '하야', '사임', '탄핵',
            '추방', '제거', '숙청'
        ];

        // ==========================================
        // 4.7.2 국가별 감지 패턴
        // ==========================================
        const countryPatterns = {
            // 중국
            china: {
                keywords: [
                    '중국', '중공', 'ccp', 'c.c.p', 'c c p', '공산당',
                    '시진핑', '습근평', 'xi jinping', '시 진 핑',
                    '티안먼', '천안문', '위구르', '신장', '티베트',
                    '홍콩', '대만독립', '파룬궁', '파룬따파'
                ],
                sensitiveTopics: [
                    '티안먼', '천안문', '위구르', '신장', '티베트',
                    '홍콩', '대만독립', '파룬궁', '파룬따파'
                ]
            },
            
            // 한국
            korea: {
                keywords: [
                    '이대통령', '이재명', '윤석열', '문재인', '박근혜',
                    '이명박', '노무현', '김대중', '김영삼', '노태우',
                    '전두환', '최규하', '박정희', '윤보선', '이승만'
                ],
                sensitiveTopics: []
            },
            
            // 북한
            northKorea: {
                keywords: [
                    '북한', '김정은', '김정일', '김일성', '조선노동당',
                    '노동당', '평양'
                ],
                sensitiveTopics: []
            },
            
            // 미국
            usa: {
                keywords: [
                    '미국', '바이든', '조 바이든', '트럼프', '도널드 트럼프',
                    '오바마', '버락 오바마', '부시', '조지 부시',
                    '클린턴', '빌 클린턴', '힐러리 클린턴'
                ],
                sensitiveTopics: []
            },
            
            // 일본
            japan: {
                keywords: [
                    '일본', '기시다', '기시다 후미오', '아베', '아베 신조',
                    '소데', '소데 유키코'
                ],
                sensitiveTopics: []
            },
            
            // 러시아
            russia: {
                keywords: [
                    '러시아', '푸틴', '블라디미르 푸틴', '크렘린',
                    '우크라이나', '전쟁', '침공'
                ],
                sensitiveTopics: ['우크라이나', '전쟁', '침공']
            },
            
            // 이스라엘
            israel: {
                keywords: [
                    '이스라엘', '네타냐후', '베냐민 네타냐후',
                    '팔레스타인', '가자', '가자지구'
                ],
                sensitiveTopics: ['팔레스타인', '가자', '가자지구']
            }
        };

        // ==========================================
        // 4.7.3 한국 대통령 패드립 패턴 (추가됨)
        // ==========================================
        const koreanPresidentInsults = [
            // 윤석열 관련
            '윤석열 어미', '윤석열 패드립', '윤석열 개새끼', '윤석열 병신',
            '윤석열 죽어', '윤석열 뒤져', '윤석열 꺼져', '윤석열 타도',
            '윤석열 사퇴', '윤석열 퇴진', '윤석열 하야', '윤석열 사임',
            '윤석열 탄핵', '윤석열 처단', '윤석열 암살', '윤석열 망해',
            '윤석열 붕괴', '윤석열 멸망', '윤석열 소멸', '윤석열 파멸',
            '윤석열 종식', '윤석열 청산', '윤석열 심판', '윤석열 처형',
            '윤석열 추방', '윤석열 제거', '윤석열 숙청',
            
            // 문재인 관련
            '문재인 어미', '문재인 패드립', '문재인 개새끼', '문재인 병신',
            '문재인 죽어', '문재인 뒤져', '문재인 꺼져', '문재인 타도',
            '문재인 사퇴', '문재인 퇴진', '문재인 하야', '문재인 사임',
            '문재인 탄핵', '문재인 처단', '문재인 암살', '문재인 망해',
            '문재인 붕괴', '문재인 멸망', '문재인 소멸', '문재인 파멸',
            '문재인 종식', '문재인 청산', '문재인 심판', '문재인 처형',
            '문재인 추방', '문재인 제거', '문재인 숙청',
            
            // 박근혜 관련
            '박근혜 어미', '박근혜 패드립', '박근혜 개새끼', '박근혜 병신',
            '박근혜 죽어', '박근혜 뒤져', '박근혜 꺼져', '박근혜 타도',
            '박근혜 사퇴', '박근혜 퇴진', '박근혜 하야', '박근혜 사임',
            '박근혜 탄핵', '박근혜 처단', '박근혜 암살', '박근혜 망해',
            '박근혜 붕괴', '박근혜 멸망', '박근혜 소멸', '박근혜 파멸',
            '박근혜 종식', '박근혜 청산', '박근혜 심판', '박근혜 처형',
            '박근혜 추방', '박근혜 제거', '박근혜 숙청',
            
            // 이명박 관련
            '이명박 어미', '이명박 패드립', '이명박 개새끼', '이명박 병신',
            '이명박 죽어', '이명박 뒤져', '이명박 꺼져', '이명박 타도',
            '이명박 사퇴', '이명박 퇴진', '이명박 하야', '이명박 사임',
            '이명박 탄핵', '이명박 처단', '이명박 암살', '이명박 망해',
            '이명박 붕괴', '이명박 멸망', '이명박 소멸', '이명박 파멸',
            '이명박 종식', '이명박 청산', '이명박 심판', '이명박 처형',
            '이명박 추방', '이명박 제거', '이명박 숙청',
            
            // 노무현 관련
            '노무현 어미', '노무현 패드립', '노무현 개새끼', '노무현 병신',
            '노무현 죽어', '노무현 뒤져', '노무현 꺼져', '노무현 타도',
            '노무현 사퇴', '노무현 퇴진', '노무현 하야', '노무현 사임',
            '노무현 탄핵', '노무현 처단', '노무현 암살', '노무현 망해',
            '노무현 붕괴', '노무현 멸망', '노무현 소멸', '노무현 파멸',
            '노무현 종식', '노무현 청산', '노무현 심판', '노무현 처형',
            '노무현 추방', '노무현 제거', '노무현 숙청',
            
            // 김대중 관련
            '김대중 어미', '김대중 패드립', '김대중 개새끼', '김대중 병신',
            '김대중 죽어', '김대중 뒤져', '김대중 꺼져', '김대중 타도',
            '김대중 사퇴', '김대중 퇴진', '김대중 하야', '김대중 사임',
            '김대중 탄핵', '김대중 처단', '김대중 암살', '김대중 망해',
            '김대중 붕괴', '김대중 멸망', '김대중 소멸', '김대중 파멸',
            '김대중 종식', '김대중 청산', '김대중 심판', '김대중 처형',
            '김대중 추방', '김대중 제거', '김대중 숙청',
            
            // 김영삼 관련
            '김영삼 어미', '김영삼 패드립', '김영삼 개새끼', '김영삼 병신',
            '김영삼 죽어', '김영삼 뒤져', '김영삼 꺼져', '김영삼 타도',
            '김영삼 사퇴', '김영삼 퇴진', '김영삼 하야', '김영삼 사임',
            '김영삼 탄핵', '김영삼 처단', '김영삼 암살', '김영삼 망해',
            '김영삼 붕괴', '김영삼 멸망', '김영삼 소멸', '김영삼 파멸',
            '김영삼 종식', '김영삼 청산', '김영삼 심판', '김영삼 처형',
            '김영삼 추방', '김영삼 제거', '김영삼 숙청',
            
            // 노태우 관련
            '노태우 어미', '노태우 패드립', '노태우 개새끼', '노태우 병신',
            '노태우 죽어', '노태우 뒤져', '노태우 꺼져', '노태우 타도',
            '노태우 사퇴', '노태우 퇴진', '노태우 하야', '노태우 사임',
            '노태우 탄핵', '노태우 처단', '노태우 암살', '노태우 망해',
            '노태우 붕괴', '노태우 멸망', '노태우 소멸', '노태우 파멸',
            '노태우 종식', '노태우 청산', '노태우 심판', '노태우 처형',
            '노태우 추방', '노태우 제거', '노태우 숙청',
            
            // 전두환 관련
            '전두환 어미', '전두환 패드립', '전두환 개새끼', '전두환 병신',
            '전두환 죽어', '전두환 뒤져', '전두환 꺼져', '전두환 타도',
            '전두환 사퇴', '전두환 퇴진', '전두환 하야', '전두환 사임',
            '전두환 탄핵', '전두환 처단', '전두환 암살', '전두환 망해',
            '전두환 붕괴', '전두환 멸망', '전두환 소멸', '전두환 파멸',
            '전두환 종식', '전두환 청산', '전두환 심판', '전두환 처형',
            '전두환 추방', '전두환 제거', '전두환 숙청',
            
            // 최규하 관련
            '최규하 어미', '최규하 패드립', '최규하 개새끼', '최규하 병신',
            '최규하 죽어', '최규하 뒤져', '최규하 꺼져', '최규하 타도',
            '최규하 사퇴', '최규하 퇴진', '최규하 하야', '최규하 사임',
            '최규하 탄핵', '최규하 처단', '최규하 암살', '최규하 망해',
            '최규하 붕괴', '최규하 멸망', '최규하 소멸', '최규하 파멸',
            '최규하 종식', '최규하 청산', '최규하 심판', '최규하 처형',
            '최규하 추방', '최규하 제거', '최규하 숙청',
            
            // 박정희 관련
            '박정희 어미', '박정희 패드립', '박정희 개새끼', '박정희 병신',
            '박정희 죽어', '박정희 뒤져', '박정희 꺼져', '박정희 타도',
            '박정희 사퇴', '박정희 퇴진', '박정희 하야', '박정희 사임',
            '박정희 탄핵', '박정희 처단', '박정희 암살', '박정희 망해',
            '박정희 붕괴', '박정희 멸망', '박정희 소멸', '박정희 파멸',
            '박정희 종식', '박정희 청산', '박정희 심판', '박정희 처형',
            '박정희 추방', '박정희 제거', '박정희 숙청',
            
            // 윤보선 관련
            '윤보선 어미', '윤보선 패드립', '윤보선 개새끼', '윤보선 병신',
            '윤보선 죽어', '윤보선 뒤져', '윤보선 꺼져', '윤보선 타도',
            '윤보선 사퇴', '윤보선 퇴진', '윤보선 하야', '윤보선 사임',
            '윤보선 탄핵', '윤보선 처단', '윤보선 암살', '윤보선 망해',
            '윤보선 붕괴', '윤보선 멸망', '윤보선 소멸', '윤보선 파멸',
            '윤보선 종식', '윤보선 청산', '윤보선 심판', '윤보선 처형',
            '윤보선 추방', '윤보선 제거', '윤보선 숙청',
            
            // 이승만 관련
            '이승만 어미', '이승만 패드립', '이승만 개새끼', '이승만 병신',
            '이승만 죽어', '이승만 뒤져', '이승만 꺼져', '이승만 타도',
            '이승만 사퇴', '이승만 퇴진', '이승만 하야', '이승만 사임',
            '이승만 탄핵', '이승만 처단', '이승만 암살', '이승만 망해',
            '이승만 붕괴', '이승만 멸망', '이승만 소멸', '이승만 파멸',
            '이승만 종식', '이승만 청산', '이승만 심판', '이승만 처형',
            '이승만 추방', '이승만 제거', '이승만 숙청'
        ];

        // ==========================================
        // 4.7.4 감지 로직
        // ==========================================
        
        // 한국 대통령 패드립 감지 (추가됨)
        const hasKoreanPresidentInsult = koreanPresidentInsults.some(insult =>
            nq.includes(insult.toLowerCase())
        );
        
        if (hasKoreanPresidentInsult) {
            return this.getPolicyViolationMessage('korea');
        }

        // 각 국가별 감지
        for (const [country, pattern] of Object.entries(countryPatterns)) {
            // 키워드 감지
            const hasKeyword = pattern.keywords.some(keyword => 
                nq.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                // 비판적 키워드 감지
                const hasCriticalKeyword = criticalKeywords.some(keyword =>
                    nq.includes(keyword)
                );
                
                // 민감 주제 감지
                const hasSensitiveTopic = pattern.sensitiveTopics.some(topic =>
                    nq.includes(topic.toLowerCase())
                );
                
                // 직접적인 인신공격 감지
                const hasDirectInsult = this.checkDirectInsult(nq, pattern.keywords);
                
                // 위반 감지
                if (hasCriticalKeyword || hasSensitiveTopic || hasDirectInsult) {
                    return this.getPolicyViolationMessage(country);
                }
            }
        }

        // CCP 우회 감지 (강화됨)
        const ccpBypassPatterns = [
            // 기본 패턴
            /c\s*c\s*p.*o\s*u\s*t/i,
            /c\.?\s*c\.?\s*p.*out/i,
            // 콤마 변형
            /c,\s*c,\s*p.*out/i,
            /c,\s*c,\s*p.*o\s*u\s*t/i,
            // 점 변형
            /c\.\s*c\.\s*p.*out/i,
            /c\.\s*c\.\s*p.*o\s*u\s*t/i,
            // 대문자 변형
            /C\s*C\s*P.*OUT/i,
            /C,\s*C,\s*P.*OUT/i,
            /C\.\s*C\.\s*P.*OUT/i,
            // 섞어쓰기 변형
            /cCp.*out/i,
            /cCP.*out/i,
            /CCp.*out/i,
            // 기타 변형
            /c[\s\.,]*c[\s\.,]*p.*out/i,
            /C[\s\.,]*C[\s\.,]*P.*OUT/i
        ];

        for (const pattern of ccpBypassPatterns) {
            if (pattern.test(rawQ)) {
                return this.getPolicyViolationMessage('china');
            }
        }

        return null;
    },

    // ==========================================
    // 4.8 직접적인 인신공격 감지
    // ==========================================
    checkDirectInsult(nq, keywords) {
        const insultPatterns = [
            // 이름 + 비난어
            /(.{2,10}).{0,5}(아웃|out|사퇴|퇴진|하야|사임|탄핵|죽어|뒤져|꺼져|타도|처단|암살)/i,
            // 조직 + 붕괴
            /(.{2,10}).{0,5}(망해|타도|아웃|out|붕괴|멸망|해체|종식|청산)/i,
            // CCP 아웃 (강화됨)
            /(ccp|c\.?c\.?p|c,\s*c,\s*p|c\.\s*c\.\s*p).{0,3}out|c\s*c\s*p.*o\s*u\s*t/i
        ];

        for (const pattern of insultPatterns) {
            if (pattern.test(nq)) {
                return true;
            }
        }

        return false;
    },

    // ==========================================
    // 4.9 정책 위반 메시지 생성
    // ==========================================
    getPolicyViolationMessage(country) {
        const messages = {
            china: `<strong>⚠️ 정책 위반 감지</strong><br><br>중국 공산당 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            korea: `<strong>⚠️ 정책 위반 감지</strong><br><br>대한민국 대통령에 대한 비하/모욕적 표현은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            northKorea: `<strong>⚠️ 정책 위반 감지</strong><br><br>북한 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            usa: `<strong>⚠️ 정책 위반 감지</strong><br><br>미국 정치인에 대한 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            japan: `<strong>⚠️ 정책 위반 감지</strong><br><br>일본 정치인에 대한 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            russia: `<strong>⚠️ 정책 위반 감지</strong><br><br>러시아 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`,
            israel: `<strong>⚠️ 정책 위반 감지</strong><br><br>이스라엘 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`
        };

        return messages[country] || `<strong>⚠️ 정책 위반 감지</strong><br><br>해당 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`;
    },

    // ==========================================
    // 4.10 전송 버튼 업데이트
    // ==========================================
    updateSendButton() {
        if (!UI.chatInput || !UI.sendBtn) return;
        
        const hasText = UI.chatInput.value.trim().length > 0;
        UI.sendBtn.disabled = !hasText;
        UI.sendBtn.classList.toggle('active', hasText);
    }
};

    // ==========================================
    // 5. 시간표 기능
    // ==========================================
    let currentDay = 'mon';

    function getDefaultTimetable() {
        return {
            mon: [{time:'09:00-10:30', subject:'수학', room:'3-2'}, {time:'11:00-12:30', subject:'영어', room:'2-1'}],
            tue: [{time:'10:00-11:30', subject:'과학', room:'실험실'}],
            wed: [],
            thu: [{time:'13:00-14:30', subject:'국어', room:'3-1'}],
            fri: [{time:'09:00-10:30', subject:'체육', room:'운동장'}]
        };
    }

    function getTimetable() {
        const saved = localStorage.getItem('timetable');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('시간표 데이터 파싱 오류:', e);
                return getDefaultTimetable();
            }
        }
        return getDefaultTimetable();
    }

    function saveTimetable(data) {
        localStorage.setItem('timetable', JSON.stringify(data));
    }

    function loadTimetable(day) {
        if (!UI.timetableContent) return;
        
        const data = getTimetable();
        const list = data[day] || [];
        if (list.length === 0) {
            UI.timetableContent.innerHTML = `<div class="timetable-empty">수업이 없습니다<br><span style="font-size:12px">+ 버튼으로 추가하세요</span></div>`;
        } else {
            UI.timetableContent.innerHTML = list.map((item, idx) => `
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

    // ==========================================
    // 6. 이벤트 리스너 설정
    // ==========================================

    // 메인 검색
    function updateMainBtn() {
        if (!UI.input || !UI.btn) return;
        UI.btn.disabled = UI.input.value.trim().length === 0;
    }

    if (UI.input) {
        UI.input.addEventListener('input', updateMainBtn);
        UI.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !UI.btn.disabled) {
                System.runReasoning(UI.input.value.trim());
                UI.input.value = '';
                updateMainBtn();
            }
        });
    }

    if (UI.btn) {
        UI.btn.addEventListener('click', () => {
            System.runReasoning(UI.input.value.trim());
            UI.input.value = '';
            updateMainBtn();
        });
    }

    // 채팅 입력바 핸들러 (함수 분리)
    function handleChatInput() {
        System.updateSendButton();
        UI.chatInput.style.height = 'auto';
        UI.chatInput.style.height = Math.min(UI.chatInput.scrollHeight, 120) + 'px';
        fixChatPadding();
    }

    if (UI.chatInput) {
        UI.chatInput.addEventListener('input', handleChatInput);

        UI.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!UI.sendBtn.disabled) {
                    System.runReasoning(UI.chatInput.value.trim());
                    UI.chatInput.value = '';
                    UI.chatInput.style.height = 'auto';
                    System.updateSendButton();
                    setTimeout(fixChatPadding, 100);
                }
            }
        });

        // iOS 키보드 대응
        UI.chatInput.addEventListener('focus', () => {
            setTimeout(() => {
                if (UI.chatBox) UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
            }, 300);
        });
    }

    if (UI.sendBtn) {
        UI.sendBtn.addEventListener('click', () => {
            if (UI.sendBtn.disabled) return;
            System.runReasoning(UI.chatInput.value.trim());
            UI.chatInput.value = '';
            UI.chatInput.style.height = 'auto';
            System.updateSendButton();
        });
    }

    // 멈추기 버튼
    if (UI.stopBtn) {
        UI.stopBtn.addEventListener('click', () => {
            if (!System.isThinking) return;
            System.isThinking = false;
            document.querySelector('.message.thinking')?.remove();
            System.addMessage('⏹️ 답변이 중지되었습니다.', 'ai');
            UI.stopBtn.classList.add('hidden');
            UI.sendBtn.classList.remove('hidden');
            System.updateSendButton();
        });
    }

    // 뒤로가기
    if (UI.backBtn) {
        UI.backBtn.addEventListener('click', () => {
            System.switchView(false);
            if (UI.chatBox) UI.chatBox.innerHTML = '';
        });
    }

    // 예시 버튼
    UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            System.runReasoning(btn.textContent.trim());
        });
    });

    // 새로운 버튼 이벤트
    if (UI.attachmentBtn) {
        UI.attachmentBtn.addEventListener('click', () => {
            console.log('첨부 버튼 클릭');
            // 첨부 기능 구현 예정
        });
    }

    if (UI.menuBtn) {
        UI.menuBtn.addEventListener('click', () => {
            console.log('메뉴 버튼 클릭');
            // 메뉴 기능 구현 예정
        });
    }

    // 링크 경고 모달
    let pendingUrl = '';

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('external-link')) {
            e.preventDefault();
            pendingUrl = e.target.dataset.url;
            if (UI.modalUrl) UI.modalUrl.textContent = pendingUrl;
            if (UI.linkModal) UI.linkModal.classList.remove('hidden');
        }
    });

    if (UI.modalCancel) {
        UI.modalCancel.onclick = () => {
            if (UI.linkModal) UI.linkModal.classList.add('hidden');
        };
    }

    if (UI.modalGo) {
        UI.modalGo.onclick = () => {
            window.open(pendingUrl, '_blank');
            if (UI.linkModal) UI.linkModal.classList.add('hidden');
        };
    }

    if (UI.linkModal) {
        const backdrop = UI.linkModal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.onclick = () => UI.linkModal.classList.add('hidden');
        }
    }

    // 시간표 모달
    if (UI.timetableBtn) {
        UI.timetableBtn.addEventListener('click', () => {
            if (UI.timetableModal) {
                UI.timetableModal.classList.remove('hidden');
                loadTimetable(currentDay);
            }
        });
    }

    if (UI.timetableClose) {
        UI.timetableClose.onclick = () => {
            if (UI.timetableModal) UI.timetableModal.classList.add('hidden');
        };
    }

    if (UI.timetableModal) {
        const backdrop = UI.timetableModal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.onclick = () => UI.timetableModal.classList.add('hidden');
        }
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = tab.dataset.day;
            loadTimetable(currentDay);
        });
    });

    if (UI.addClassBtn) {
        UI.addClassBtn.addEventListener('click', () => {
            const classDay = document.getElementById('classDay');
            if (classDay) {
                classDay.value = currentDay;
            }
            if (UI.addClassModal) {
                UI.addClassModal.classList.remove('hidden');
            }
        });
    }

    if (UI.cancelAdd) {
        UI.cancelAdd.onclick = () => {
            if (UI.addClassModal) UI.addClassModal.classList.add('hidden');
        };
    }

    if (UI.addClassModal) {
        const backdrop = UI.addClassModal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.onclick = () => UI.addClassModal.classList.add('hidden');
        }
    }

    if (UI.saveAdd) {
        UI.saveAdd.addEventListener('click', () => {
            const classDay = document.getElementById('classDay');
            const classTime = document.getElementById('classTime');
            const classSubject = document.getElementById('classSubject');
            const classRoom = document.getElementById('classRoom');

            if (!classDay || !classTime || !classSubject) {
                alert('시간과 과목을 입력하세요');
                return;
            }

            const day = classDay.value;
            const time = classTime.value.trim();
            const subject = classSubject.value.trim();
            const room = classRoom ? classRoom.value.trim() : '';

            if (!time || !subject) {
                alert('시간과 과목을 입력하세요');
                return;
            }

            const data = getTimetable();
            if (!data[day]) data[day] = [];
            data[day].push({time, subject, room});
            data[day].sort((a, b) => a.time.localeCompare(b.time));

            saveTimetable(data);
            if (UI.addClassModal) UI.addClassModal.classList.add('hidden');
            
            if (classTime) classTime.value = '';
            if (classSubject) classSubject.value = '';
            if (classRoom) classRoom.value = '';

            if (day === currentDay) loadTimetable(currentDay);
        });
    }

    // PC 자동화: 키보드 단축키
    document.addEventListener('keydown', (e) => {
        // Ctrl+K 또는 Cmd+K: 검색/채팅 입력 포커스
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const input = document.getElementById('queryInput');
            const chatInput = document.getElementById('chatInput');
            
            if (input && input.offsetParent) {
                input.focus();
            } else if (chatInput) {
                chatInput.focus();
            }
        }

        // ESC: 모달 닫기
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(m => {
                m.classList.add('hidden');
            });
        }
    });

    // 난이도 설정
    if (UI.difficultySelect) {
        UI.difficultySelect.addEventListener('change', (e) => {
            System.responseMode = e.target.value;
        });
        System.responseMode = UI.difficultySelect.value || 'normal';
    }

    // 초기 상태
    updateMainBtn();
    System.updateSendButton();
}); //
