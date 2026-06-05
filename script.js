// ==========================================
// 🧠 Chat K plus v2.5.3 - JS Full Fix
// Studio Ferrari - 2026.06.05 Hotfix
// ==========================================

// 1. 전역 변수
const knowledgeBase = {
    lastUpdated: "2026.06.04 09:00 KST",
    items: [
        { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
        { keywords: ["너", "너는", "너에", "대하여서", "누구", "자기소개"], response: "나는 Chat K plus v2.5.2야! 시간표 모달 + 정치 상세 데이터 탑재된 로컬 AI지. 2026.06.04 기준 업데이트 ㅋㅋ 개표중이라 데이터 변동 가능" },
        { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 6월 3일 지방선거 개표중인데 결과 볼래?" },
        { keywords: ["고마워", "감사", "땡큐"], response: "ㅎ 별말을! 또 궁금한 거 있으면 물어봐" },
        { keywords: ["잘가", "바이", "끝"], response: "응 다음에 또 봐! 시간표도 설정해봤지?" },
        { keywords: ["요즘 이슈", "최근 이슈", "이슈 뭐야", "핫이슈", "뉴스", "요즘 뭐", "요즘 뉴스"], response: "2026년 6월 최대 이슈는 6.3 지방선거 개표야. 6/4 09:00 기준 민주당이 광역단체장 17곳 중 10곳 우세. 서울 오세훈, 경기 김동연, 인천 박찬대 재선 유력. 투표율 58.2%로 역대급. 그 외에 의대 증원 의료대란 3년차, 비트코인 1.5억 돌파, 엔화 160엔 돌파도 핫해.", priority: 10 },
        { keywords: ["오늘 이슈", "오늘 뉴스", "오늘 뭐"], response: "오늘 2026.06.04 핵심은 지방선거 개표 진행중이야. 인천 박찬대 54%대 1위, 서울 오세훈 52% 재선 유력. 최종 결과는 밤 늦게 나올 듯.", priority: 10 },
        { keywords: ["다음 사이트 주소", "다음 주소", "다음 링크", "daum 주소", "다음 공식 사이트", "다음 홈페이지"], response: "다음(Daum) 공식 사이트야.\n\n🔗 주소: {{LINK:https://www.daum.net|다음 바로가기}}\n\n다음은 카카오가 운영하는 대한민국 대표 포털 사이트야. 뉴스, 메일, 카페, 검색, 지도, 쇼핑 등 다양한 서비스를 제공해. 1995년 설립된 1세대 포털로 지금도 네이버랑 양대산맥이지.", priority: 15, type: "external_link" },
        { keywords: ["지방선거", "6월 3일 선거", "지선 결과", "개표", "선거 결과"], response: "2026년 6월 3일 지방선거 개표 진행중이야. 6/4 09:00 기준 민주당이 광역단체장 17곳 중 10곳 우세 보이고 있어. 서울 오세훈, 경기 김동연, 인천 박찬대 재선 유력. 투표율 58.2%." },
        { keywords: ["인천시장", "박찬대", "인천 선거"], response: "2026.06.04 09:00 기준 인천시장 개표중 박찬대 후보 54%대 득표율로 1위 달리는 중이야. 출구조사랑 비슷하게 나오는 중. 단, 최종 확정은 선관위 발표 봐야 함." },
        { keywords: ["민주당", "더불어민주당", "이재명"], response: "더불어민주당은 2026년 현재 국회 다수당(171석). 이재명 대표 체제. 6.3 지선 개표중 수도권 우세 보이며 2027 대선 교두보 마련 분위기. 주요 정책은 기본소득 확대, 부동산 공공성 강화." },
        { keywords: ["국민의힘", "국힘", "한동훈"], response: "국민의힘은 2026년 현재 여당(108석). 한동훈 비대위원장 체제. 6.3 지선 개표중 대구·경북·부산·울산·경남 5곳 우세. 수도권 고전 중. 주요 정책은 규제 완화, 친기업." },
        { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열. 임기는 2027년 5월 9일까지. 지지율 34%대. 주요 성과는 한미동맹 강화, 주요 쟁점은 의료대란, 경제 침체." },
        { keywords: ["서울시장", "오세훈"], response: "서울시장 오세훈 후보 재선 유력. 6/4 09:00 기준 개표중 52% 득표율. 정원오 후보 35%." },
        { keywords: ["부산시장", "박형준", "전재수"], response: "부산시장 개표 접전중. 6/4 09:00 기준 전재수 48%, 박형준 44%. 출구조사보다 격차 줄어듦." },
        { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령", "시진핑"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권 중이고 2023년에 3연임이 확정됐어." },
        { keywords: ["중국 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 인구 약 2,150만명으로 중국의 정치 중심지지." },
        { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금은 시간당 10,200원이야. 월급 2,131,800원이지. 편의점 알바 4대보험 떼면 실수령 190만원대야." },
        { keywords: ["비트코인", "코인", "가상화폐"], response: "비트코인 1.5억 찍었어. 트럼프가 비트코인 지지해서 떡상했지. 한국은 김치프리미엄 8%야." },
        { keywords: ["의대 정원", "의료 대란", "전공의"], response: "의대 2000명 증원으로 시작된 의료대란 3년째야. 2026년 6월 기준 전공의 복귀율 62%. 응급실 뺑뺑이 여전하고 지방의료 공백 심각해." },
        { keywords: ["BTS", "방탄소년단"], response: "BTS 2025년 완전체 컴백했어. 진, 제이홉 전역하고 7인 완전체 앨범 냈어. 2026년 월드투어 진행 중." }
    ]
};

// 2. DOM 요소 변수
let homeScreen, chatScreen, searchInput, searchBtn, exampleQuestions;
let chatBox, chatInput, chatSendBtn, backBtn, timetableBtn;
let thinkingTimers = [];
let currentSchool = '';
let timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};
let pendingExternalUrl = '';

// ==========================================
// 🌙 다크모드 - 중복 생성 방지
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    
    // HTML에 이미 있는 버튼들 재활용
    const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-chat');
    toggleBtns.forEach(btn => {
        btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        btn.onclick = toggleTheme;
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('#theme-toggle, #theme-toggle-chat').forEach(btn => {
        btn.textContent = isDark ? '☀️' : '🌙';
    });
}

// ==========================================
// 🔄 화면 전환 - display 강제 제어
// ==========================================
function startChat(query) {
    if (!query.trim()) return;
    
    // 홈화면 강제 숨김
    homeScreen.style.display = 'none';
    homeScreen.classList.add('hidden');
    
    // 채팅화면 강제 표시
    chatScreen.style.display = 'flex';
    chatScreen.classList.remove('hidden');
    
    setTimeout(() => {
        addMessage(query, 'user');
        startReasoning(query);
    }, 50);
    
    searchInput.value = '';
    searchBtn.disabled = true;
    searchBtn.classList.remove('active');
}

function goHome() {
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];
    
    // 채팅화면 강제 숨김
    chatScreen.style.display = 'none';
    chatScreen.classList.add('hidden');
    
    // 홈화면 강제 표시
    homeScreen.style.display = 'flex';
    homeScreen.classList.remove('hidden');
    
    if(chatBox) chatBox.innerHTML = '';
}

// ==========================================
// ⚠️ 외부링크 경고 모달
// ==========================================
function showExternalLinkWarning(url, siteName) {
    const modal = document.getElementById('external-link-warning');
    const urlDiv = document.getElementById('warning-url');
    const nameSpan = document.getElementById('warning-site-name');
    
    if (!modal) return;
    
    pendingExternalUrl = url;
    urlDiv.textContent = url;
    nameSpan.textContent = siteName || '외부 사이트';
    
    document.body.classList.add('modal-open');
    modal.dataset.state = 'visible';
}

function closeExternalLinkWarning() {
    const modal = document.getElementById('external-link-warning');
    if (!modal) return;
    document.body.classList.remove('modal-open');
    modal.dataset.state = 'hidden';
    pendingExternalUrl = '';
}

function confirmExternalLink() {
    if (pendingExternalUrl) {
        window.open(pendingExternalUrl, '_blank', 'noopener,noreferrer');
    }
    closeExternalLinkWarning();
}

// ==========================================
// 📅 시간표 모달
// ==========================================
function initTimetableSystem() {
    const schools = [
        '인천국제고', '경기과학고', '서울과학고', '대원외고', '한영외고',
        '상산고', '민족사관고', '현대청운고', '포항제철고', '광양제철고',
        '기타'
    ];

    const schoolList = document.getElementById('school-list');
    if (schoolList) {
        schoolList.innerHTML = '';
        schools.forEach(school => {
            const btn = document.createElement('button');
            btn.className = 'school-option btn btn-secondary';
            btn.textContent = school;
            btn.onclick = (e) => selectSchool(school, e.target);
            schoolList.appendChild(btn);
        });
    }

    document.getElementById('modal-next1')?.addEventListener('click', goToStep2);
    document.getElementById('modal-confirm')?.addEventListener('click', confirmTimetable);
    document.getElementById('modal-close')?.addEventListener('click', closeTimetableModal);
    document.getElementById('warning-cancel')?.addEventListener('click', closeExternalLinkWarning);
    document.getElementById('warning-confirm')?.addEventListener('click', confirmExternalLink);
    document.querySelectorAll('.modal-backdrop').forEach(bd => {
        bd.addEventListener('click', () => {
            closeTimetableModal();
            closeExternalLinkWarning();
        });
    });
    document.addEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        const timetableModal = document.getElementById('timetable-modal');
        const warningModal = document.getElementById('external-link-warning');
        if (timetableModal && timetableModal.dataset.state === 'visible') {
            closeTimetableModal();
        } else if (warningModal && warningModal.dataset.state === 'visible') {
            closeExternalLinkWarning();
        }
    }
}

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
    document.body.classList.add('modal-open');
    document.getElementById('modal-step1').dataset.state = 'active';
    document.getElementById('modal-step2').dataset.state = 'hidden';
    document.getElementById('modal-loading').dataset.state = 'hidden';
    document.getElementById('modal-next1').style.display = 'flex';
    document.getElementById('modal-confirm').style.display = 'none';
    document.querySelector('.modal-title').textContent = '학교 선택';
    modal.dataset.state = 'visible';
}

function closeTimetableModal() {
    const modal = document.getElementById('timetable-modal');
    if (!modal) return;
    document.body.classList.remove('modal-open');
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
    document.getElementById('modal-next1').style.display = 'none';
    document.getElementById('modal-confirm').style.display = 'flex';
    document.querySelector('.modal-title').textContent = '시간표 등록';

    const grid = document.getElementById('timetable-grid');
    if (!grid) return;
    
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
            input.style.minHeight = '44px';
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
        closeTimetableModal();
        addMessage(`✅ ${currentSchool} 시간표 저장 완료!`, 'ai');
    }, 1500);
}

// ==========================================
// 💬 대화 처리
// ==========================================
function handleChatSubmit() {
    if (!chatInput) return;
    const query = chatInput.value.trim();
    if (!query) return;

    if (query.includes('시간표') || query.includes('교시')) {
        if (timetableData.school) {
            const today = new Date();
            const dayNum = today.getDay();
            if (dayNum === 0 || dayNum === 6) {
                addMessage(query, 'user');
                chatInput.value = '';
                chatSendBtn.disabled = true;
                chatSendBtn.classList.remove('active');
                setTimeout(() => {
                    addMessage(`📅 오늘은 주말이야! ${timetableData.school} 시간표는 평일에 확인해줘`, 'ai');
                }, 300);
                return;
            }
            const dayMap = {1:'mon', 2:'tue', 3:'wed', 4:'thu', 5:'fri'};
            const day = dayMap[dayNum];
            if (day && timetableData.timetable[day]) {
                const todayClasses = Object.values(timetableData.timetable[day]).filter(c => c).join(', ');
                addMessage(query, 'user');
                chatInput.value = '';
                chatSendBtn.disabled = true;
                chatSendBtn.classList.remove('active');
                setTimeout(() => {
                    addMessage(`📅 ${timetableData.school} 오늘 시간표: ${todayClasses || '등록된 과목 없음'}`, 'ai');
                }, 300);
                return;
            }
        }
    }

    addMessage(query, 'user');
    chatInput.value = '';
    chatSendBtn.disabled = true;
    chatSendBtn.classList.remove('active');
    startReasoning(query);
}

function startReasoning(query) {
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];

    const thinkingDiv = addMessage("🔍 질문 분석 중...", 'thinking');
    if (!thinkingDiv) return;

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "🧠 2026.06.04 DB 검색 중";
    }, 600));

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "💡 개표 데이터 교차 검증 중";
    }, 1200));

    thinkingTimers.push(setTimeout(() => {
        thinkingDiv.textContent = "✅ 답변 생성 완료";
        thinkingTimers.push(setTimeout(() => {
            thinkingDiv.remove();
            const aiResponse = findResponse(query);
            addMessage(aiResponse, 'ai');
        }, 300));
    }, 1800));
}

function findResponse(query) {
    const normalizedQuery = query.toLowerCase().replace(/[?.,!]/g, ' ').replace(/\s+/g, ' ').trim();
    const userWords = normalizedQuery.split(' ').filter(w => w.length > 0);
    
    let bestScore = 0;
    let bestMatch = null;

    for (const item of knowledgeBase.items) {
        let score = 0;
        const priority = item.priority || 0;
        
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            
            if (normalizedQuery === kwLower) {
                score += 100 + priority * 10;
                continue;
            }
            
            if (userWords.includes(kwLower)) {
                score += 50 + priority * 5;
                continue;
            }
            
            if (kwLower.length > 2 && normalizedQuery.includes(kwLower)) {
                score += 10 + priority;
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    if (bestMatch && bestScore >= 20) {
        let response = bestMatch.response;
        
        if (bestMatch.type === 'external_link') {
            response = response.replace(/\{\{LINK:(.*?)\|(.*?)\}\}/g, (match, url, text) => {
                const siteName = text.replace(' 바로가기', '');
                return `<a href="#" onclick="event.preventDefault(); showExternalLinkWarning('${url}', '${siteName}')" style="color: var(--primary-dark); text-decoration: underline; font-weight: 600;">${text}</a>`;
            });
        }
        
        return `${response}\n\n[DB 기준: ${knowledgeBase.lastUpdated}]`;
    } else {
        return `음... 2026.06.04 DB엔 그 내용 없어 ㅠㅠ '인천시장', '개표', '오늘 이슈' 이런 거 물어봐!\n\n[DB 기준: ${knowledgeBase.lastUpdated}]`;
    }
}

function addMessage(text, type) {
    if (!chatBox) return null;
    const msgDiv = document.createElement('div');
    
    if (type === 'thinking') {
        msgDiv.classList.add('message', 'thinking-msg');
        msgDiv.textContent = text;
    } else if (type === 'user') {
        msgDiv.classList.add('message', 'user');
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
    } else {
        msgDiv.classList.add('message', 'ai');
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        if (text.includes('<a href=')) {
            bubble.innerHTML = text.replace(/\n/g, '<br>');
        } else {
            bubble.textContent = text;
        }
        msgDiv.appendChild(bubble);
    }
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// ==========================================
// 🚀 초기화
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 연결
    homeScreen = document.getElementById('home-screen');
    chatScreen = document.getElementById('chat-screen');
    searchInput = document.getElementById('search-input');
    searchBtn = document.getElementById('search-btn');
    exampleQuestions = document.getElementById('example-questions');
    chatBox = document.getElementById('chat-container');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send-btn');
    backBtn = document.getElementById('back-btn');
    timetableBtn = document.getElementById('timetable-btn');
    
    // 이벤트 바인딩
    backBtn?.addEventListener('click', goHome);
    timetableBtn?.addEventListener('click', openTimetableModal);
    
    searchInput?.addEventListener('input', () => {
        const hasValue = searchInput.value.trim().length > 0;
        searchBtn.disabled = !hasValue;
        searchBtn.classList.toggle('active', hasValue);
    });
    
    searchBtn?.addEventListener('click', () => {
        if (searchInput.value.trim()) startChat(searchInput.value);
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
    
    chatInput?.addEventListener('input', () => {
        if (chatSendBtn) {
            const hasValue = chatInput.value.trim().length > 0;
            chatSendBtn.disabled = !hasValue;
            chatSendBtn.classList.toggle('active', hasValue);
        }
    });
    
    chatSendBtn?.addEventListener('click', handleChatSubmit);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatSendBtn && !chatSendBtn.disabled) handleChatSubmit();
    });
    
    // 시스템 초기화
    initTheme();
    initTimetableSystem();
    
    // 초기 상태: 홈화면만 표시
    homeScreen.style.display = 'flex';
    chatScreen.style.display = 'none';
    homeScreen.classList.remove('hidden');
    chatScreen.classList.add('hidden');
});
