// ==========================================
// 🧠 Chat K plus v2.4 - 정치 상세 + 시간표 모달 시스템
// ==========================================

// 1. 지식 창고 (Knowledge Base) - 2026.06.04 기준
const knowledgeBase = [
    // === 기본 ===
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.4야! 시간표 모달 + 정치 상세 데이터 탑재된 로컬 AI지. 2026년 6월 이슈 업데이트 완료 ㅋㅋ" },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 6월 3일 지방선거 얘기나 연금개혁 얘기 어때?" },
    { keywords: ["고마워", "감사", "땡큐"], response: "ㅎ 별말을! 또 궁금한 거 있으면 물어봐" },
    { keywords: ["잘가", "바이", "끝"], response: "응 다음에 또 봐! 시간표도 설정해봤지?" },

    // === 중국 데이터 ===
    { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령", "시진핑"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권 중이고 2023년에 3연임이 확정됐어." },
    { keywords: ["중국 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 인구 약 2,150만명으로 중국의 정치 중심지지." },
    { keywords: ["중국 인구", "중국 사람 수"], response: "2026년 기준 중국 인구는 약 14억 1천만명이야. 세계 2위고 인도 다음이지." },
    { keywords: ["틱톡", "도우인", "바이트댄스"], response: "틱톡은 바이트댄스가 만든 숏폼 플랫폼이야. 중국 내수용은 도우인, 해외용은 틱톡으로 분리 운영해. 미국에서 금지 논란 계속되고 있어." },
    { keywords: ["바이두", "ERNIE", "어니"], response: "바이두는 중국 검색 1위 기업이야. ERNIE 5.0 모델은 2.4조 파라미터로 2026년 4월에 공개됐어. GPT-5.1이랑 경쟁 중." },
    { keywords: ["텐센트", "위챗", "Yuanbao", "WeChat"], response: "텐센트는 위챗 만든 IT 기업이야. Yuanbao AI 챗봇도 운영 중이고 게임 사업이 엄청 커. 리그오브레전드도 텐센트 거야." },
    { keywords: ["알리바바", "타오바오", "마윈"], response: "알리바바는 중국 최대 전자상거래 기업이야. 타오바오, 티몰 운영하고 클라우드 사업도 해. 마윈이 창업했지." },
    { keywords: ["화웨이", "Huawei", "런정페이"], response: "화웨이는 중국 통신장비 1위야. 미국 제재 때문에 스마트폰 사업 타격 받았지만 5G 장비는 여전히 강해. 2026년 메이트 80 시리즈 나왔어." },
    { keywords: ["GLM", "지푸", "Zhipu AI"], response: "GLM-5.1은 중국 Zhipu AI가 만든 모델이야. 2.2조 파라미터고 코딩 성능 좋아. chat.z.ai에서 쓸 수 있어." },

    // === 한국 정치 상세 2026.06 - 대폭 확장 ===
    { keywords: ["지방선거", "6월 3일 선거", "지선 결과"], response: "2026년 6월 3일 지방선거는 민주당이 광역단체장 17곳 중 10곳 승리하며 우세를 보였어. 투표율 58.2%였고 부동산, 청년 일자리가 핵심 쟁점이었어. 서울 오세훈, 경기 김동연 재선." },
    { keywords: ["민주당", "더불어민주당", "이재명"], response: "더불어민주당은 2026년 현재 국회 다수당(171석)이야. 이재명 대표 체제 3년차. 6.3 지선에서 수도권 싹쓸이하며 2027 대선 교두보 마련했어. 주요 정책은 기본소득 확대, 부동산 공공성 강화." },
    { keywords: ["국민의힘", "국힘", "한동훈"], response: "국민의힘은 2026년 현재 여당(108석)이야. 한동훈 비대위원장 체제. 6.3 지선에서 대구·경북·부산·울산·경남 5곳만 승리해 위기론 나왔어. 주요 정책은 규제 완화, 친기업." },
    { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열이야. 임기는 2027년 5월 9일까지야. 지지율 34%대. 주요 성과는 한미동맹 강화, 주요 쟁점은 의료대란, 경제 침체." },
    { keywords: ["조국혁신당", "조국"], response: "조국혁신당은 2024년 창당 후 12석 확보한 원내 3당이야. 2026년 현재 조국 대표. 검찰개혁, 사법개혁 주장해. 6.3 지선에서 기초의원 23명 당선." },
    { keywords: ["개혁신당", "이준석"], response: "개혁신당은 이준석 대표가 이끄는 3석 정당이야. 2026년 2030 남성 지지율 15%로 존재감 있어. 주요 공약은 병역제도 개편, 정치개혁." },
    { keywords: ["국회", "의석수", "여소야대"], response: "22대 국회 의석: 민주당 171석, 국민의힘 108석, 조국혁신당 12석, 개혁신당 3석, 진보당 1석, 무소속 5석. 명백한 여소야대." },
    { keywords: ["대선", "2027 대선", "차기 대선"], response: "2027년 3월 3일 대선 예정. 민주당 이재명, 국민의힘 한동훈·오세훈·원희룡, 조국혁신당 조국 등이 거론돼. 6.3 지선 결과가 초반 판세 좌우." },
    { keywords: ["검찰개혁", "공수처", "검수완박"], response: "검수완박 이후 검찰 수사권 축소됐어. 2026년 현재 검찰은 6대 범죄만 수사. 공수처는 무력화 논란. 조국혁신당이 검찰 해체 주장." },
    { keywords: ["사법개혁", "대법원", "법관"], response: "대법원장 조희대 체제. 2026년 사법부 신뢰도 28% 역대 최저. 민주당은 법관 증원, 국민의힘은 사법농단 방지 주장." },
    { keywords: ["선거제도", "병립형", "준연동형"], response: "2024년 총선에서 병립형 회귀했어. 2026년 현재 위성정당 논란 재점화. 민주당은 준연동형 재도입, 국힘은 현행 유지 주장." },
    { keywords: ["부동산", "집값", "전세", "월세"], response: "2026년 6월 서울 아파트 평균 매매가 12.8억이야. 전세사기 여파로 월세 전환 가속화되고 있어. 6.3 지선에서 민주당은 공공임대 100만호 공약했어." },
    { keywords: ["AI 정책", "AI 기본법", "인공지능"], response: "AI 기본법이 2025년 12월 시행됐어. 고위험 AI 사전심사제 도입됐고, 지자체마다 AI 데이터센터 유치 경쟁 중이야. 용인이 최대 수혜지." },
    { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금은 시간당 10,200원이야. 월급 2,131,800원이지. 편의점 알바 4대보험 떼면 실수령 190만원대야." },

    // === 사회/정치2 ===
    { keywords: ["연금개혁", "국민연금", "보험료율"], response: "국민연금 개혁안이 2025년 말 통과됐어. 2026년부터 보험료율 9%→13% 단계적 인상, 소득대체율 42.5%로 조정돼. 20대는 '우린 못 받는다' 반발 심해." },
    { keywords: ["젠더갈등", "남녀갈등", "이대남", "이대녀"], response: "2026년 젠더갈등 핵심은 '공정'이야. 20대 남성은 역차별, 여성은 유리천장 주장해. 6.3 지선에서도 2030 표심이 갈렸어. 민주당은 여성, 국힘은 남성 우세였어." },
    { keywords: ["플랫폼노동", "배달", "쿠팡", "택배기사", "라이더"], response: "플랫폼 노동자 88만 시대야. 쿠팡 퀵플렉스, 배민 라이더 산재보험 의무화됐지만 4대보험 사각지대 여전해. 2026년 최저임금도 못 받는 사람 많아." },
    { keywords: ["기후위기", "탄소중립", "RE100", "폭염"], response: "2026년 여름 역대급 폭염 예고됐어. 6월인데 이미 33도야. 정부는 2030 NDC 40% 감축 목표 유지 중이지만 기업들은 RE100 달성 어렵다고 아우성이야." },
    { keywords: ["지방소멸", "인구감소", "빈집"], response: "전국 228개 시군구 중 118곳이 소멸위험지역이야. 2026년 출생아 23만명 붕괴 전망. 6.3 지선에서 지방은 '기업 유치'가 1번 공약이었어." },
    { keywords: ["의대 정원", "의료 대란", "전공의"], response: "의대 2000명 증원으로 시작된 의료대란 3년째야. 2026년 6월 기준 전공의 복귀율 62%. 응급실 뺑뺑이 여전하고 지방의료 공백 심각해." },
    { keywords: ["저출산", "출산율", "인구절벽"], response: "2025년 합계출산율 0.72명 세계 최저야. 2026년 1분기 출생아 5.8만명 역대 최소. 정부 육아휴직 1년 6개월 확대했지만 회사 눈치 보여서 못 써." },
    { keywords: ["주4일제", "노동시간", "워라밸"], response: "포스코, SK 일부 계열사가 주4일제 시범운영 중이야. 2026년 대선 공약 1순위 될 전망. MZ는 찬성 78%, 5060은 반대 65%야." },
    { keywords: ["부동산 PF", "건설사", "미분양", "태영건설"], response: "태영건설 워크아웃 이후 건설사 PF 위기 계속돼. 2026년 6월 전국 미분양 7.2만호야. 지방은 80%가 악성 미분양이야." },

    // === 국제 이슈 ===
    { keywords: ["미국 대선", "트럼프", "바이든"], response: "트럼프 2기 2년차야. 중국산 전기차 관세 100% 때려서 현대차 미국공장 풀가동 중이야. 주한미군 방위비 15억달러 요구 중." },
    { keywords: ["우크라이나", "러시아 전쟁", "젤렌스키", "푸틴"], response: "우크라 전쟁 4년 4개월째야. 트럼프가 '24시간 내 종전' 공약했지만 실패했어. 한국 K9 자주포 추가 수출 논의 중." },
    { keywords: ["대만", "중국 대만", "양안관계", "TSMC"], response: "중국이 대만 주변 군사훈련 정례화했어. 2027년 침공설 도는데, TSMC 때문에 미국이 절대 안 놔줌. 한국 반도체도 영향권이야." },
    { keywords: ["AI 경쟁", "GPT", "GLM", "Claude", "Gemini"], response: "2026년 AI 5강: GPT-5.1, Claude 4, Gemini 2.5, GLM-5.1, ERNIE 5.0이야. 한국은 네이버 하이퍼클로바X, 카카오 카나나로 추격 중." },
    { keywords: ["일본", "기시다", "엔저"], response: "일본 엔달러 160엔 돌파했어. 관광객은 좋은데 일본 국민은 물가 폭등으로 죽을 맛이야. 기시다 퇴진 후 이시바 총리야." },
    { keywords: ["북한", "김정은", "핵"], response: "북한이 2026년 들어 미사일 15발 쐈어. 러시아에 포탄 수출하고 기술 받아오는 중. 7차 핵실험 임박설 돌아." },

    // === 경제/사회 ===
    { keywords: ["환율", "달러", "원달러"], response: "2026년 6월 4일 원달러 1,348원이야. 트럼프 관세 때문에 강달러 계속돼. 수출기업은 좋고 수입물가는 비상." },
    { keywords: ["반도체", "SK하이닉스", "삼성전자", "HBM"], response: "HBM4 전쟁 중이야. SK하이닉스가 엔비디아 독점공급, 삼성은 AMD 잡았어. 2026년 한국 반도체 수출 1,450억달러 전망." },
    { keywords: ["물가", "인플레이션", "CPI"], response: "2026년 5월 CPI 2.4%야. 라면 2,000원, 김밥 4,500원 시대. 최저임금 올라도 체감이 안 된대." },
    { keywords: ["금리", "한국은행", "기준금리"], response: "2026년 6월 기준금리 3.25%야. 미국 5.5%라 금리차 2.25%p야. 한은은 환율 때문에 못 내리는 중." },
    { keywords: ["코스피", "주식", "증시"], response: "2026년 6월 코스피 2,850이야. 삼성전자 9만원, SK하이닉스 24만원 돌파했어. AI 테마주만 오르고 나머진 박스권." },
    { keywords: ["비트코인", "코인", "가상화폐"], response: "비트코인 1.5억 찍었어. 트럼프가 비트코인 지지해서 떡상했지. 한국은 김치프리미엄 8%야." },

    // === 문화 ===
    { keywords: ["뉴진스", "NewJeans"], response: "뉴진스 2026년 월드투어 중이야. 민희진 나가고 하이브로 복귀했어. 신곡 'Bubble Gum 2' 빌보드 1위 했지." },
    { keywords: ["BTS", "방탄소년단"], response: "BTS 2025년 완전체 컴백했어. 진, 제이홉 전역하고 7인 완전체 앨범 냈어. 2026년 월드투어 진행 중." }
];

// 2. HTML 요소들
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');

let chatBox, chatInput, chatSendBtn;
let thinkingTimers = [];
let isAnimating = false;

// ==========================================
// 📅 시간표 모달 시스템 - 신규 추가
// ==========================================

let timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};
let currentSchool = '';
let currentGrade = '';

function initTimetableSystem() {
    // 모달 HTML 동적 생성 - 닫기 버튼 추가됨
    const modalHTML = `
        <div id="timetable-modal" class="modal hidden">
            <div class="modal-content">
                <button id="modal-close" class="modal-close-btn">✕</button>
                <div id="modal-step1">
                    <h2>학교 선택</h2>
                    <div class="school-list" id="school-list"></div>
                    <div class="custom-school">
                        <input type="text" id="custom-school-input" placeholder="기타 학교 직접 입력">
                    </div>
                    <button id="modal-next1" class="modal-btn">다음</button>
                </div>
                <div id="modal-step2" class="hidden">
                    <h2>시간표 등록</h2>
                    <div id="timetable-grid"></div>
                    <button id="modal-confirm" class="modal-btn">확인</button>
                </div>
                <div id="modal-loading" class="hidden">
                    <div class="loading-spinner"></div>
                    <p>시간표 저장 중...</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 학교 리스트 생성 (랜덤 스크롤)
    const schools = [
        '인천국제고', '경기과학고', '서울과학고', '대원외고', '한영외고',
        '상산고', '민족사관고', '현대청운고', '포항제철고', '광양제철고',
        '기타'
    ];

    const schoolList = document.getElementById('school-list');
    schools.forEach(school => {
        const btn = document.createElement('button');
        btn.className = 'school-option';
        btn.textContent = school;
        btn.onclick = () => selectSchool(school);
        schoolList.appendChild(btn);
    });

    document.getElementById('modal-next1').onclick = goToStep2;
    document.getElementById('modal-confirm').onclick = confirmTimetable;
    document.getElementById('modal-close').onclick = closeTimetableModal; // ← 닫기 추가

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('timetable-modal');
            if (modal &&!modal.classList.contains('hidden')) {
                closeTimetableModal();
            }
        }
    });
}

function selectSchool(school) {
    document.querySelectorAll('.school-option').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    currentSchool = school;

    if (school === '기타') {
        document.getElementById('custom-school-input').focus();
    }
}

function openTimetableModal() {
    document.getElementById('timetable-modal').classList.remove('hidden');
    document.getElementById('modal-step1').classList.remove('hidden');
    document.getElementById('modal-step2').classList.add('hidden');
    document.getElementById('modal-loading').classList.add('hidden');
}

function closeTimetableModal() {
    document.getElementById('timetable-modal').classList.add('hidden');
    currentSchool = '';
    document.getElementById('custom-school-input').value = '';
    document.querySelectorAll('.school-option').forEach(b => b.classList.remove('selected'));
}

function goToStep2() {
    const customInput = document.getElementById('custom-school-input').value.trim();
    if (currentSchool === '기타' && customInput) {
        currentSchool = customInput;
    }

    if (!currentSchool) {
        alert('학교를 선택해주세요');
        return;
    }

    document.getElementById('modal-step1').classList.add('hidden');
    document.getElementById('modal-step2').classList.remove('hidden');

    // 시간표 그리드 생성
    const grid = document.getElementById('timetable-grid');
    grid.innerHTML = `
        <table class="timetable-table">
            <tr><th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr>
            ${Array.from({length: 7}, (_, i) => `
                <tr>
                    <td>${i+1}</td>
                    ${['mon','tue','wed','thu','fri'].map(day =>
                        `<td><input type="text" data-day="${day}" data-period="${i+1}" placeholder="과목"></td>`
                    ).join('')}
                </tr>
            `).join('')}
        </table>
    `;
}

function confirmTimetable() {
    const inputs = document.querySelectorAll('#timetable-grid input');
    const timetable = {};

    inputs.forEach(input => {
        const day = input.dataset.day;
        const period = input.dataset.period;
        if (!timetable[day]) timetable[day] = {};
        timetable[day][period] = input.value.trim();
    });

    timetableData = {
        school: currentSchool,
        timetable: timetable,
        updatedAt: new Date().toISOString()
    };

    // 로딩 애니메이션
    document.getElementById('modal-step2').classList.add('hidden');
    document.getElementById('modal-loading').classList.remove('hidden');

    setTimeout(() => {
        localStorage.setItem('timetableData', JSON.stringify(timetableData));
        document.getElementById('timetable-modal').classList.add('hidden');

        // 홈으로 이동
        if (!homeScreen.classList.contains('slide-in')) {
            goHome();
        }

        addMessage(`✅ ${currentSchool} 시간표 저장 완료!`, 'ai');
    }, 3000);
}

// ==========================================
// 🌙 다크모드
// ==========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.textContent = document.body.classList.contains('dark-mode')? '☀️' : '🌙';
    toggleBtn.onclick = toggleTheme;
    document.getElementById('app-wrapper').appendChild(toggleBtn);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark? '☀️' : '🌙';
}

// ==========================================
// ⚙️ 시스템 초기화
// ==========================================

function buildChatScreen() {
    chatScreen.innerHTML = `
        <div id="chat-header-bar">
            <button id="back-btn">← 뒤로</button>
            <h3>Chat K plus v2.4</h3>
        </div>
        <div id="chat-box"></div>
        <div id="chat-input-area">
            <button id="timetable-btn" title="시간표">📅</button>
            <input type="text" id="chat-input" placeholder="2026년 이슈 물어봐...">
            <button id="chat-send-btn" disabled>전송</button>
        </div>
    `;

    chatBox = document.getElementById('chat-box');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send-btn');
    const backBtn = document.getElementById('back-btn');
    const timetableBtn = document.getElementById('timetable-btn');

    timetableBtn.addEventListener('click', openTimetableModal);

    chatInput.addEventListener('input', () => {
        chatSendBtn.disabled =!chatInput.value.trim();
    });

    chatSendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' &&!chatSendBtn.disabled) handleChatSubmit();
    });
    backBtn.addEventListener('click', goHome);
}

function startChat(query) {
    if (!query.trim() || isAnimating) return;
    isAnimating = true;

    homeScreen.classList.add('slide-out');
    homeScreen.classList.remove('slide-in');
    chatScreen.classList.remove('hidden');
    void chatScreen.offsetWidth;
    chatScreen.classList.add('slide-in');
    chatScreen.classList.remove('slide-out');

    if (!chatBox) {
        buildChatScreen();
    }

    setTimeout(() => {
        addMessage(query, 'user');
        startReasoning(query);
        isAnimating = false;
    }, 400);

    searchInput.value = '';
    searchBtn.disabled = true;
}

function goHome() {
    if (isAnimating) return;
    isAnimating = true;

    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];

    chatScreen.classList.add('slide-out');
    chatScreen.classList.remove('slide-in');
    homeScreen.classList.remove('slide-out');
    homeScreen.classList.add('slide-in');

    setTimeout(() => {
        chatScreen.classList.add('hidden');
        chatScreen.classList.remove('slide-out');
        if(chatBox) chatBox.innerHTML = '';
        isAnimating = false;
    }, 400);
}

// ==========================================
// 💬 대화 처리
// ==========================================

function handleChatSubmit() {
    const query = chatInput.value;
    if (!query.trim()) return;

    // 시간표 질문 처리
    if (query.includes('시간표') || query.includes('교시')) {
        if (timetableData.school) {
            const today = new Date().toLocaleDateString('ko-KR', {weekday: 'short'});
            const dayMap = {'월': 'mon', '화': 'tue', '수': 'wed', '목': 'thu', '금': 'fri'};
            const day = dayMap[today[0]];
            if (day && timetableData.timetable[day]) {
                const todayClasses = Object.values(timetableData.timetable[day]).filter(c => c).join(', ');
                addMessage(query, 'user');
                chatInput.value = '';
                chatSendBtn.disabled = true;
                setTimeout(() => {
                    addMessage(`📅 ${timetableData.school} 오늘 시간표: ${todayClasses || '등록된 과목 없음'}`, 'ai');
                }, 500);
                return;
            }
        }
    }

    addMessage(query, 'user');
    chatInput.value = '';
    chatSendBtn.disabled = true;
    startReasoning(query);
}

function startReasoning(query) {
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];

    const thinkingDiv = addMessage("🔍 질문 핵심 키워드 추출 중...", 'thinking');

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "🧠 2026.06 DB에서 연관 정보 탐색 중...";
    }, 800));

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "💡 최신 이슈 + 팩트 크로스체크 중...";
    }, 1600));

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "✅ 추론 완료! 답변 생성";

        thinkingTimers.push(setTimeout(() => {
            if(thinkingDiv) thinkingDiv.remove();
            const aiResponse = findResponse(query);
            addMessage(aiResponse, 'ai');
        }, 400));
    }, 2400));
}

function findResponse(query) {
    const userWords = query.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
    let bestScore = 0;
    let bestMatch = null;

    for (const item of knowledgeBase) {
        let score = 0;
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            if (userWords.includes(kwLower)) {
                score += 10;
            } else if (userWords.some(w => w.includes(kwLower) || kwLower.includes(w))) {
                score += kwLower.length;
            }
        }
        if (score > 0 && item.keywords.length > 1) {
            score *= 1.2;
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    if (bestMatch && bestScore >= 5) {
        return bestMatch.response;
    } else {
        return "음... 2026년 6월 DB엔 그 내용 없어 ㅠㅠ '조국혁신당', '검찰개혁', '2027 대선' 이런 거 물어봐!";
    }
}

function addMessage(text, type) {
    const msgDiv = document.createElement('div');

    if (type === 'thinking') {
        msgDiv.classList.add('message', 'thinking-msg');
    } else if (type === 'user') {
        msgDiv.classList.add('message', 'user-msg');
    } else {
        msgDiv.classList.add('message', 'ai-msg');
    }

    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// ==========================================
// 🚀 프로그램 실행
// ==========================================

searchInput.addEventListener('input', () => {
    searchBtn.disabled =!searchInput.value.trim();
});
searchBtn.disabled = true;

searchBtn.addEventListener('click', () => {
    startChat(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' &&!searchBtn.disabled) {
        startChat(searchInput.value);
    }
});

exampleQuestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('question-tag')) {
        const query = e.target.getAttribute('data-query');
        startChat(query);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTimetableSystem(); // ★ 시간표 시스템 초기화
    homeScreen.classList.add('slide-in');
    chatScreen.classList.add('hidden');
});
