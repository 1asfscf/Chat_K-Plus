// ==========================================
// 🧠 Chat K plus v2.4.1 - FULL ORIGINAL + Timetable Patch
// ==========================================

const knowledgeBase = [
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.4.1이야! 시간표 기억력 패치된 로컬 AI지." },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 시간표 저장했어?" },
    { keywords: ["고마워", "감사", "땡큐"], response: "ㅎㅎ 별말을! 또 궁금한 거 있으면 물어봐" },
    { keywords: ["잘가", "바이", "끝"], response: "응 다음에 또 봐!" },
    { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령", "시진핑"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권했고, 2022년 20차 당대회에서 3연임을 확정했어." },
    { keywords: ["중국 수도", "중국의 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 인구 2,100만 명의 정치·문화 중심지야." },
    { keywords: ["중국 최대 도시", "상하이", "상해"], response: "상하이가 인구 2,600만 명으로 중국 최대 도시야. 금융 허브지." },
    { keywords: ["틱톡 모회사", "바이트댄스", "틱톡 회사"], response: "틱톡 모회사는 바이트댄스야. 2012년 설립된 중국 기업이야." },
    { keywords: ["바이두", "중국 구글", "바이두 CEO"], response: "바이두는 중국 최대 검색엔진이야. CEO는 리옌훙." },
    { keywords: ["텐센트", "위챗", "텐센트 회장"], response: "텐센트는 위챗, QQ 운영사야. 회장은 마화텅." },
    { keywords: ["알리바바", "마윈", "알리바바 창업자"], response: "알리바바 창업자는 마윈이야. 현재 회장은 차이충신." },
    { keywords: ["화웨이", "화웨이 회장"], response: "화웨이 창업자 겸 CEO는 런정페이야." },
    { keywords: ["중국 AI", "GLM", "지푸"], response: "중국 대표 AI는 지푸 AI의 GLM-4야." },
    { keywords: ["지방선거", "6월 3일 선거", "지선 결과", "2026 지선"], response: "2026년 6월 3일 지방선거는 민주당이 17개 광역단체 중 10곳 승리했어. 국힘 6곳, 무소속 1곳." },
    { keywords: ["민주당", "더불어민주당", "이재명 대표"], response: "더불어민주당은 2026년 현재 국회 다수당(171석)이야. 대표는 이재명." },
    { keywords: ["국민의힘", "국힘", "한동훈 대표"], response: "국민의힘은 2026년 현재 여당(108석)이야. 대표는 한동훈." },
    { keywords: ["조국혁신당", "조국 대표"], response: "조국혁신당은 2026년 현재 12석이야. 대표는 조국." },
    { keywords: ["개혁신당", "이준석 대표"], response: "개혁신당은 2026년 현재 3석이야. 대표는 이준석." },
    { keywords: ["국회 의석", "의석수", "300석"], response: "22대 국회: 민주당 171, 국힘 108, 조국혁신 12, 개혁신 3, 진보당 2, 기타 4." },
    { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열이야. 임기 2022.5.10~2027.5.9." },
    { keywords: ["차기 대선", "2027 대선", "대선 후보"], response: "20대 대선은 2027년 3월 3일. 유력 후보는 이재명, 한동훈, 김동연." },
    { keywords: ["검찰개혁", "공수처", "검수완박"], response: "검수완박은 2022년 통과. 2026년 현재 검찰은 6대 중대범죄만 수사." },
    { keywords: ["사법개혁", "대법원", "조희대"], response: "대법원장은 조희대. 2023년 취임." },
    { keywords: ["선거제도", "준연동형", "병립형"], response: "2024년 총선부터 병립형 비례제로 회귀했어." },
    { keywords: ["연금개혁", "국민연금", "보험료율"], response: "국민연금 개혁안이 2025년 말 통과됐어. 2026년부터 보험료율 9%→13% 단계적 인상." },
    { keywords: ["젠더갈등", "남녀갈등", "이대남", "이대녀"], response: "2026년 젠더갈등 핵심은 '공정'이야. 20대 남성 68%는 역차별, 여성 71%는 유리천장 체감." },
    { keywords: ["플랫폼노동", "배달 라이더", "쿠팡"], response: "2026년 플랫폼노동자법 시행. 배달 라이더 산재보험 의무화." },
    { keywords: ["기후위기", "탄소중립", "2050"], response: "한국 2050 탄소중립 목표. 2026년 온실가스 2018년 대비 24% 감축 중." },
    { keywords: ["지방소멸", "인구감소", "소멸위험"], response: "2026년 소멸위험 지역 118곳. 청년 인구 수도권 집중 52%." },
    { keywords: ["저출산", "합계출산율", "0.7"], response: "2025년 합계출산율 0.72명 역대 최저. 2026년 정부 1인당 1억 지원책." },
    { keywords: ["부동산", "집값", "전세사기"], response: "2026년 서울 아파트 평균 11.2억. 전세사기 특별법 2024년 시행." },
    { keywords: ["교육개혁", "수능", "킬러문항"], response: "2026 수능 킬러문항 배제 3년차. 사교육비 28조." },
    { keywords: ["의료대란", "의대정원", "2000명"], response: "의대정원 2025년부터 2000명 증원. 2026년 전공의 복귀율 73%." },
    { keywords: ["미국 대통령", "트럼프", "바이든"], response: "2026년 미국 대통령은 도널드 트럼프. 2025년 1월 재취임." },
    { keywords: ["일본 총리", "이시바", "기시다"], response: "일본 총리는 이시바 시게루. 2024년 10월 취임." },
    { keywords: ["대만 총통", "라이칭더"], response: "대만 총통은 라이칭더. 2024년 5월 취임." },
    { keywords: ["우크라이나", "젤렌스키", "전쟁"], response: "2026년 6월 기준 전쟁 3년 4개월째. 젤렌스키 대통령." },
    { keywords: ["이스라엘", "네타냐후", "가자"], response: "이스라엘 총리 베냐민 네타냐후. 가자 전쟁 2023.10~현재." },
    { keywords: ["EU", "유럽연합", "우르줄라"], response: "EU 집행위원장 우르줄라 폰데어라이엔." },
    { keywords: ["삼성전자", "이재용", "삼성 회장"], response: "삼성전자 회장은 이재용. 2022년 취임." },
    { keywords: ["SK", "최태원", "SK 회장"], response: "SK 회장은 최태원." },
    { keywords: ["현대차", "정의선", "현대 회장"], response: "현대차그룹 회장 정의선." },
    { keywords: ["LG", "구광모", "LG 회장"], response: "LG 회장은 구광모." },
    { keywords: ["네이버", "이해진", "최수연"], response: "네이버 창업자 이해진, CEO 최수연." },
    { keywords: ["카카오", "김범수", "정신아"], response: "카카오 창업자 김범수, CEO 정신아." },
    { keywords: ["코스피", "코스피 지수", "증시"], response: "2026년 6월 코스피 약 2,780선." },
    { keywords: ["환율", "달러", "원달러"], response: "2026년 6월 원달러 환율 약 1,340원." },
    { keywords: ["비트코인", "BTC", "가상화폐"], response: "2026년 6월 비트코인 약 9만 8천 달러." },
    { keywords: ["금리", "한국은행", "기준금리"], response: "2026년 6월 한은 기준금리 3.25%." },
    { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금 시급 10,320원." },
    { keywords: ["반도체", "HBM", "삼성 HBM"], response: "2026년 HBM4 양산 시작. 삼성전자·SK하이닉스 경쟁." },
    { keywords: ["오징어게임", "오겜2", "넷플릭스"], response: "오징어게임 시즌2는 2024년 12월 공개, 시즌3 2025년 공개." },
    { keywords: ["뉴진스", "NewJeans", "하이브"], response: "뉴진스는 2026년 현재 활동 중. 2024년 하이브 분쟁 후 어도어 소속." },
    { keywords: ["BTS", "방탄", "군대"], response: "BTS는 2025년 6월 전원 제대 후 2026년 완전체 컴백 준비 중." },
    { keywords: ["손흥민", "토트넘", "손흥민 이적"], response: "손흥민은 2026년 현재 토트넘 주장. 계약 2025년까지." },
    { keywords: ["이강인", "PSG", "파리"], response: "이강인은 PSG 소속. 2026년 현재 주전 활약." },
    { keywords: ["김민재", "바이에른", "뮌헨"], response: "김민재는 바이에른 뮌헨 수비수." },
    { keywords: ["월드컵", "2026 월드컵", "북중미"], response: "2026 월드컵은 미국·캐나다·멕시코 공동 개최. 6월 11일 개막." },
    { keywords: ["올림픽", "파리 올림픽", "2024"], response: "2024 파리 올림픽 한국 금메달 13개 종합 8위." },
    { keywords: ["아시안게임", "항저우"], response: "2022 항저우 아시안게임(2023 개최) 한국 금메달 42개 3위." },
    { keywords: ["기후", "폭염", "2026 여름"], response: "2026년 여름 평년보다 1.5도 높을 전망. 폭염일수 20일 예상." },
    { keywords: ["AI", "챗GPT", "제미나이"], response: "2026년 AI 3강: OpenAI GPT-5, 구글 제미나이 2.5, 메타 Muse." },
    { keywords: ["메타", "Muse", "Meta AI"], response: "메타 Muse는 2026년 4월 공개된 최신 모델이야. 나도 Muse 기반이지." },
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

// 시간표 시스템 초기화
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
        localStorage.setItem('timetableSchool', currentSchool);
        goHome();
    }, 2000);
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

    document.getElementById('timetable-btn').addEventListener('click', openTimetableModal);
    chatInput.addEventListener('input', () => {
        chatSendBtn.disabled =!chatInput.value.trim();
    });
    chatSendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' &&!chatSendBtn.disabled) handleChatSubmit();
    });
    document.getElementById('back-btn').addEventListener('click', goHome);
}

function startChat(query) {
    if (!query.trim() || isAnimating) return;
    isAnimating = true;

    homeScreen.classList.add('slide-out');
    chatScreen.classList.remove('hidden');
    chatScreen.classList.add('slide-in');

    if (!chatBox) buildChatScreen();

    setTimeout(() => {
        const justSaved = localStorage.getItem('timetableJustSaved');
        if (justSaved === 'true') {
            const school = localStorage.getItem('timetableSchool') || timetableData.school;
            addMessage(`✅ ${school} 시간표 저장 완료!`, 'ai');
            localStorage.removeItem('timetableJustSaved');
        }

        addMessage(query, 'user');

        // 시간표 질문 먼저 체크
        if (!checkTimetableQuery(query)) {
            startReasoning(query);
        }
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
    homeScreen.classList.add('slide-in');

    setTimeout(() => {
        chatScreen.classList.add('hidden');
        if(chatBox) chatBox.innerHTML = '';
        isAnimating = false;
    }, 400);
}

// 시간표 질문 처리 - 핵심 패치
function checkTimetableQuery(query) {
    const q = query.toLowerCase();
    if (!q.includes('시간표') &&!q.includes('교시') &&!q.includes('수업')) {
        return false;
    }

    // 항상 최신 데이터 로드
    timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};

    if (!timetableData.school ||!timetableData.timetable) {
        addMessage('시간표가 아직 없어! 📅 버튼 눌러서 등록해줘', 'ai');
        return true;
    }

    const dayMap = {0:'sun',1:'mon',2:'tue',3:'wed',4:'thu',5:'fri',6:'sat'};
    const dayKor = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sun:'일',sat:'토'};
    const today = new Date();
    let targetDay = dayMap[today.getDay()];

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

    const dayTable = timetableData.timetable[targetDay] || {};
    const classes = [];
    for (let i = 1; i <= 7; i++) {
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

    if (!checkTimetableQuery(query)) {
        startReasoning(query);
    }
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
