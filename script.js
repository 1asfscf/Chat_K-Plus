// ==========================================
// 🧠 Chat K plus v2.4.1 - 시간표 기억 패치
// ==========================================

const knowledgeBase = [
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.4.1이야! 시간표 기억력 패치된 로컬 AI지." },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 시간표 저장했어?" },
    { keywords: ["고마워", "감사", "땡큐"], response: "ㅎㅎ 별말을! 또 궁금한 거 있으면 물어봐" },
    { keywords: ["잘가", "바이", "끝"], response: "응 다음에 또 봐!" },
    { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령", "시진핑"], response: "2026년 현재 중국 국가주석은 시진핑이야." },
    { keywords: ["지방선거", "6월 3일 선거", "지선 결과"], response: "2026년 6월 3일 지방선거는 민주당이 10곳 승리했어." },
    { keywords: ["민주당", "더불어민주당", "이재명"], response: "더불어민주당은 2026년 현재 국회 다수당(171석)이야." },
    { keywords: ["국민의힘", "국힘", "한동훈"], response: "국민의힘은 2026년 현재 여당(108석)이야." },
    { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열이야." },
    { keywords: ["연금개혁", "국민연금", "보험료율"], response: "국민연금 개혁안이 2025년 말 통과됐어. 2026년부터 보험료율 9%→13% 단계적 인상." },
    { keywords: ["젠더갈등", "남녀갈등", "이대남", "이대녀"], response: "2026년 젠더갈등 핵심은 '공정'이야." },
];

const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');

let chatBox, chatInput, chatSendBtn;
let thinkingTimers = [];
let isAnimating = false;

let timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};
let currentSchool = '';
let currentGrade = '';

function initTimetableSystem() {
    const modalHTML = `
        <div id="timetable-modal" class="modal hidden">
            <div class="modal-content">
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
        btn.onclick = (e) => selectSchool(school, e);
        schoolList.appendChild(btn);
    });

    document.getElementById('modal-next1').onclick = goToStep2;
    document.getElementById('modal-confirm').onclick = confirmTimetable;
}

function selectSchool(school, e) {
    document.querySelectorAll('.school-option').forEach(b => b.classList.remove('selected'));
    e.target.classList.add('selected');
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
    const grid = document.getElementById('timetable-grid');
    grid.innerHTML = `
        <table class="timetable-table">
            <tr><th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr>
            ${Array.from({length: 7}, (_, i) => `
                <tr>
                    <td>${i+1}</td>
                    ${['mon','tue','wed','thu','fri'].map(day =>
                        `<td><input type="text" data-day="${day}" data-period="${i+1}" placeholder="과목" value="${timetableData.timetable?.[day]?.[i+1] || ''}"></td>`
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
    document.getElementById('modal-step2').classList.add('hidden');
    document.getElementById('modal-loading').classList.remove('hidden');
    setTimeout(() => {
        localStorage.setItem('timetableData', JSON.stringify(timetableData));
        document.getElementById('timetable-modal').classList.add('hidden');
        localStorage.setItem('timetableJustSaved', 'true');
        goHome();
    }, 3000);
}

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

function buildChatScreen() {
    chatScreen.innerHTML = `
        <div id="chat-header-bar">
            <button id="back-btn">← 뒤로</button>
            <h3>Chat K plus v2.4.1</h3>
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
        const justSaved = localStorage.getItem('timetableJustSaved');
        if (justSaved === 'true') {
            const school = timetableData.school || localStorage.getItem('timetableSchool');
            addMessage(`✅ ${school} 시간표 저장 완료!`, 'ai');
            localStorage.removeItem('timetableJustSaved');
        }
        addMessage(query, 'user');
        // ★ 시간표 질문 먼저 체크
        if (checkTimetableQuery(query)) {
            isAnimating = false;
            return;
        }
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

// ★ 시간표 질문 처리 - 강화
function checkTimetableQuery(query) {
    const q = query.toLowerCase();
    if (!q.includes('시간표') &&!q.includes('교시') &&!q.includes('수업')) {
        return false;
    }

    // localStorage에서 다시 로드 (혹시 몰라서)
    timetableData = JSON.parse(localStorage.getItem('timetableData')) || timetableData;

    if (!timetableData.school ||!timetableData.timetable) {
        addMessage('시간표가 아직 없어! 📅 버튼 눌러서 등록해줘', 'ai');
        return true;
    }

    const dayMap = {0:'sun',1:'mon',2:'tue',3:'wed',4:'thu',5:'fri',6:'sat'};
    const dayKor = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sun:'일',sat:'토'};
    const today = new Date();
    let targetDay = dayMap[today.getDay()];

    // "내일", "월요일" 등 처리
    if (q.includes('내일')) {
        targetDay = dayMap[(today.getDay() + 1) % 7];
    } else if (q.includes('월요')) targetDay = 'mon';
    else if (q.includes('화요')) targetDay = 'tue';
    else if (q.includes('수요')) targetDay = 'wed';
    else if (q.includes('목요')) targetDay = 'thu';
    else if (q.includes('금요')) targetDay = 'fri';

    if (targetDay === 'sun' || targetDay === 'sat') {
        addMessage(`📅 ${timetableData.school} - 주말은 수업 없어!`, 'ai');
        return true;
    }

    const dayTable = timetableData.timetable[targetDay];
    if (!dayTable) {
        addMessage(`📅 ${dayKor[targetDay]}요일 시간표가 비어있어`, 'ai');
        return true;
    }

    const classes = [];
    for (let i=1; i<=7; i++) {
        if (dayTable[i]) classes.push(`${i}교시: ${dayTable[i]}`);
    }

    const result = classes.length > 0
       ? `📅 ${timetableData.school} ${dayKor[targetDay]}요일 시간표\n\n${classes.join('\n')}`
        : `📅 ${dayKor[targetDay]}요일은 등록된 수업이 없어`;

    addMessage(result, 'ai');
    return true;
}

function handleChatSubmit() {
    const query = chatInput.value;
    if (!query.trim()) return;
    addMessage(query, 'user');
    chatInput.value = '';
    chatSendBtn.disabled = true;

    if (checkTimetableQuery(query)) {
        return;
    }
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
        return "음... 2026년 6월 DB엔 그 내용 없어 ㅠㅠ '시간표' 물어봐!";
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
    if (chatBox) {
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    return msgDiv;
}

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
    initTimetableSystem();
    homeScreen.classList.add('slide-in');
    chatScreen.classList.add('hidden');
});
