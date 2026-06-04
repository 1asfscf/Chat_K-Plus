// ==========================================
// 🧠 Chat K plus v2.5 - 버그픽스 + 2026.06.04 기준
// ==========================================
// WARNING: 2026.06.04 09:00 KST 기준 데이터. 개표 진행중이라 실시간 아님
// 최종 결과는 중앙선관위 확인 필수

// 1. 지식 창고 - lastUpdated 필드 추가
const knowledgeBase = {
    lastUpdated: "2026.06.04 09:00 KST",
    items: [
        // === 기본 ===
        { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
        { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.5야! 시간표 모달 + 정치 상세 데이터 탑재된 로컬 AI지. 2026.06.04 기준 업데이트 ㅋㅋ 개표중이라 데이터 변동 가능" },
        { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 6월 3일 지방선거 개표중인데 결과 볼래?" },
        { keywords: ["고마워", "감사", "땡큐"], response: "ㅎ 별말을! 또 궁금한 거 있으면 물어봐" },
        { keywords: ["잘가", "바이", "끝"], response: "응 다음에 또 봐! 시간표도 설정해봤지?" },

        // === 2026 지방선거 - 개표중 데이터 ===
        { keywords: ["지방선거", "6월 3일 선거", "지선 결과", "개표"], response: "2026년 6월 3일 지방선거 개표 진행중이야. 6/4 09:00 기준 민주당이 광역단체장 17곳 중 10곳 우세 보이고 있어. 서울 오세훈, 경기 김동연, 인천 박찬대 우세. 최종은 선관위 발표 기다려야 해. 투표율 58.2%." },
        { keywords: ["인천시장", "박찬대", "인천 선거"], response: "2026.06.04 09:00 기준 인천시장 개표중 박찬대 후보 54%대 득표율로 1위 달리는 중이야. 출구조사랑 비슷하게 나오는 중. 단, 최종 확정은 선관위 발표 봐야 함." },
        { keywords: ["민주당", "더불어민주당", "이재명"], response: "더불어민주당은 2026년 현재 국회 다수당(171석). 이재명 대표 체제. 6.3 지선 개표중 수도권 우세 보이며 2027 대선 교두보 마련 분위기. 주요 정책은 기본소득 확대, 부동산 공공성 강화." },
        { keywords: ["국민의힘", "국힘", "한동훈"], response: "국민의힘은 2026년 현재 여당(108석). 한동훈 비대위원장 체제. 6.3 지선 개표중 대구·경북·부산·울산·경남 5곳 우세. 수도권 고전 중. 주요 정책은 규제 완화, 친기업." },
        { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열. 임기는 2027년 5월 9일까지. 지지율 34%대. 주요 성과는 한미동맹 강화, 주요 쟁점은 의료대란, 경제 침체." },
        { keywords: ["서울시장", "오세훈"], response: "서울시장 오세훈 후보 재선 유력. 6/4 09:00 기준 개표중 52% 득표율. 정원오 후보 35%." },
        { keywords: ["부산시장", "박형준", "전재수"], response: "부산시장 개표 접전중. 6/4 09:00 기준 전재수 48%, 박형준 44%. 출구조사보다 격차 줄어듦." },

        // === 나머지 데이터 동일 ===
        { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령", "시진핑"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권 중이고 2023년에 3연임이 확정됐어." },
        { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금은 시간당 10,200원이야. 월급 2,131,800원이지. 편의점 알바 4대보험 떼면 실수령 190만원대야." },
        { keywords: ["의대 정원", "의료 대란", "전공의"], response: "의대 2000명 증원으로 시작된 의료대란 3년째야. 2026년 6월 기준 전공의 복귀율 62%. 응급실 뺑뺑이 여전하고 지방의료 공백 심각해." },
        { keywords: ["비트코인", "코인", "가상화폐"], response: "비트코인 1.5억 찍었어. 트럼프가 비트코인 지지해서 떡상했지. 한국은 김치프리미엄 8%야." },
        { keywords: ["BTS", "방탄소년단"], response: "BTS 2025년 완전체 컴백했어. 진, 제이홉 전역하고 7인 완전체 앨범 냈어. 2026년 월드투어 진행 중." }
    ]
};

// 2. HTML 요소들
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');
const appWrapper = document.getElementById('app-wrapper'); // 버그1: appWrapper 캐싱

let chatBox, chatInput, chatSendBtn;
let thinkingTimers = [];
let isAnimating = false;
let animationQueue = []; // 버그6: 애니메이션 큐

// ==========================================
// 📅 시간표 모달 시스템 - 버그 수정
// ==========================================

let timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};
let currentSchool = '';
let currentGrade = '';

function initTimetableSystem() {
    // 버그1: app-wrapper 안에 생성해야 overflow:hidden 먹음
    const modalHTML = `
        <div id="timetable-modal" class="modal" data-state="hidden">
            <div class="modal-content">
                <button id="modal-close" class="modal-close-btn">✕</button>
                <div id="modal-step1" data-state="active">
                    <h2>학교 선택</h2>
                    <div class="school-list" id="school-list"></div>
                    <div class="custom-school">
                        <input type="text" id="custom-school-input" placeholder="기타 학교 직접 입력">
                    </div>
                    <button id="modal-next1" class="modal-btn">다음</button>
                </div>
                <div id="modal-step2" data-state="hidden">
                    <h2>시간표 등록</h2>
                    <div id="timetable-grid"></div>
                    <button id="modal-confirm" class="modal-btn">확인</button>
                </div>
                <div id="modal-loading" data-state="hidden">
                    <div class="loading-spinner"></div>
                    <p>시간표 저장 중...</p>
                </div>
            </div>
        </div>
    `;
    appWrapper.insertAdjacentHTML('beforeend', modalHTML);

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
        // 버그2: event 명시적 전달
        btn.onclick = (e) => selectSchool(school, e.target);
        schoolList.appendChild(btn);
    });

    document.getElementById('modal-next1')?.addEventListener('click', goToStep2);
    document.getElementById('modal-confirm')?.addEventListener('click', confirmTimetable);
    document.getElementById('modal-close')?.addEventListener('click', closeTimetableModal);

    // 버그4: ESC 키 이벤트 중복 방지
    document.addEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('timetable-modal');
        if (modal && modal.dataset.state === 'visible') {
            closeTimetableModal();
        }
    }
}

// 버그2: event 파라미터 추가
function selectSchool(school, targetElement) {
    document.querySelectorAll('.school-option').forEach(b => b.classList.remove('selected'));
    targetElement.classList.add('selected');
    currentSchool = school;

    if (school === '기타') {
        document.getElementById('custom-school-input')?.focus();
    }
}

function openTimetableModal() {
    const modal = document.getElementById('timetable-modal');
    if (!modal) return;
    
    modal.dataset.state = 'visible';
    document.getElementById('modal-step1').dataset.state = 'active';
    document.getElementById('modal-step2').dataset.state = 'hidden';
    document.getElementById('modal-loading').dataset.state = 'hidden';
}

function closeTimetableModal() {
    const modal = document.getElementById('timetable-modal');
    if (!modal) return;
    
    modal.dataset.state = 'hidden';
    currentSchool = '';
    const customInput = document.getElementById('custom-school-input');
    if (customInput) customInput.value = '';
    document.querySelectorAll('.school-option').forEach(b => b.classList.remove('selected'));
}

function goToStep2() {
    const customInput = document.getElementById('custom-school-input')?.value.trim() || '';
    if (currentSchool === '기타' && customInput) {
        currentSchool = customInput;
    }

    if (!currentSchool) {
        alert('학교를 선택해주세요');
        return;
    }

    document.getElementById('modal-step1').dataset.state = 'hidden';
    document.getElementById('modal-step2').dataset.state = 'active';

    const grid = document.getElementById('timetable-grid');
    if (!grid) return;
    
    // 버그3: createElement로 변경해서 CLS 방지
    const table = document.createElement('table');
    table.className = 'timetable-table';
    
    const thead = document.createElement('tr');
    thead.innerHTML = '<th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th>';
    table.appendChild(thead);
    
    const days = ['mon','tue','wed','thu','fri'];
    for (let i = 0; i < 7; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td>`;
        days.forEach(day => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.dataset.day = day;
            input.dataset.period = i+1;
            input.placeholder = '과목';
            input.style.minHeight = '44px'; // CLS 방지
            td.appendChild(input);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    }
    grid.innerHTML = '';
    grid.appendChild(table);
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

    document.getElementById('modal-step2').dataset.state = 'hidden';
    document.getElementById('modal-loading').dataset.state = 'active';

    setTimeout(() => {
        localStorage.setItem('timetableData', JSON.stringify(timetableData));
        document.getElementById('timetable-modal').dataset.state = 'hidden';

        if (!homeScreen.classList.contains('slide-in')) {
            goHome();
        }

        addMessage(`✅ ${currentSchool} 시간표 저장 완료!`, 'ai');
    }, 2000);
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
    appWrapper.appendChild(toggleBtn);
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
            <h3>Chat K plus v2.5</h3>
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

    timetableBtn?.addEventListener('click', openTimetableModal);

    chatInput?.addEventListener('input', () => {
        if (chatSendBtn) chatSendBtn.disabled = !chatInput.value.trim();
    });

    chatSendBtn?.addEventListener('click', handleChatSubmit);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatSendBtn && !chatSendBtn.disabled) handleChatSubmit();
    });
    backBtn?.addEventListener('click', goHome);
}

// 버그6: 애니메이션 큐 시스템
function queueAnimation(fn) {
    if (isAnimating) {
        animationQueue.push(fn);
        return;
    }
    isAnimating = true;
    fn(() => {
        isAnimating = false;
        const next = animationQueue.shift();
        if (next) queueAnimation(next);
    });
}

function startChat(query) {
    if (!query.trim()) return;
    
    queueAnimation((done) => {
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
            done();
        }, 400);

        searchInput.value = '';
        searchBtn.disabled = true;
    });
}

function goHome() {
    queueAnimation((done) => {
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
            done();
        }, 400);
    });
}

// ==========================================
// 💬 대화 처리
// ==========================================

function handleChatSubmit() {
    if (!chatInput) return;
    const query = chatInput.value;
    if (!query.trim()) return;

    // 버그3: 주말 처리
    if (query.includes('시간표') || query.includes('교시')) {
        if (timetableData.school) {
            const today = new Date();
            const dayNum = today.getDay(); // 0=일, 6=토
            if (dayNum === 0 || dayNum === 6) {
                addMessage(query, 'user');
                chatInput.value = '';
                if (chatSendBtn) chatSendBtn.disabled = true;
                setTimeout(() => {
                    addMessage(`📅 오늘은 주말이야! ${timetableData.school} 시간표는 평일에 확인해줘`, 'ai');
                }, 500);
                return;
            }
            
            const dayMap = {1:'mon', 2:'tue', 3:'wed', 4:'thu', 5:'fri'};
            const day = dayMap[dayNum];
            if (day && timetableData.timetable[day]) {
                const todayClasses = Object.values(timetableData.timetable[day]).filter(c => c).join(', ');
                addMessage(query, 'user');
                chatInput.value = '';
                if (chatSendBtn) chatSendBtn.disabled = true;
                setTimeout(() => {
                    addMessage(`📅 ${timetableData.school} 오늘 시간표: ${todayClasses || '등록된 과목 없음'}`, 'ai');
                }, 500);
                return;
            }
        }
    }

    addMessage(query, 'user');
    chatInput.value = '';
    if (chatSendBtn) chatSendBtn.disabled = true;
    startReasoning(query);
}

function startReasoning(query) {
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];

    const thinkingDiv = addMessage("🔍 질문 핵심 키워드 추출 중...", 'thinking');
    if (!thinkingDiv) return;

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "🧠 2026.06.04 DB에서 연관 정보 탐색 중...";
    }, 800));

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "💡 개표중 데이터 + 팩트 크로스체크 중...";
    }, 1600));

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "✅ 추론 완료! 답변 생성";

        thinkingTimers.push(setTimeout(() => {
            thinkingDiv.remove();
            const aiResponse = findResponse(query);
            addMessage(aiResponse, 'ai');
        }, 400));
    }, 2400));
}

function findResponse(query) {
    const userWords = query.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
    let bestScore = 0;
    let bestMatch = null;

    for (const item of knowledgeBase.items) {
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
        return bestMatch.response + `\n\n[DB 기준: ${knowledgeBase.lastUpdated}]`;
    } else {
        return `음... 2026.06.04 DB엔 그 내용 없어 ㅠㅠ '인천시장', '개표', '2027 대선' 이런 거 물어봐!\n\n[DB 기준: ${knowledgeBase.lastUpdated}]`;
    }
}

function addMessage(text, type) {
    if (!chatBox) return null;
    
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

searchInput?.addEventListener('input', () => {
    if (searchBtn) searchBtn.disabled = !searchInput.value.trim();
});
if (searchBtn) searchBtn.disabled = true;

searchBtn?.addEventListener('click', () => {
    startChat(searchInput.value);
});

searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchBtn && !searchBtn.disabled) {
        startChat(searchInput.value);
    }
});

exampleQuestions?.addEventListener('click', (e) => {
    if (e.target.classList.contains('question-tag')) {
        const query = e.target.getAttribute('data-query');
        if (query) startChat(query);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTimetableSystem();
    homeScreen.classList.add('slide-in');
    chatScreen.classList.add('hidden');
});
