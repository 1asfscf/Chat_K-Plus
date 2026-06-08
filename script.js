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
        sendBtn: document.getElementById('sendBtn')
    };

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
    "만리장성": "만리장성은 중국 북부를 가로지르는 세계 최대 방어시설로 길이가 2만km가 넘습니다.",
    "중국 음식": "짜장면, 마라탕, 딤섬, 베이징덕이 유명합니다.",

    // --- 공식 사이트 ---
    "네이버": "네이버 공식 사이트는 https://www.naver.com 입니다.",
    "네이버 공식 사이트": "네이버 공식 사이트는 https://www.naver.com 입니다.",
    "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다.",
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

    switchView(isChat) {
        UI.searchView.classList.toggle('hidden', isChat);
        UI.chatView.classList.toggle('hidden', !isChat);
        if (isChat) setTimeout(() => UI.chatInput.focus(), 100);
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
            msg.innerHTML = text; // ← 핵심 수정
        }
        
        UI.chatBox.appendChild(msg);
        UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        return msg;
    },

    async runReasoning(query) {
        if (!query || this.isThinking) return;
        this.isThinking = true;

        this.switchView(true);
        this.addMessage(query, 'user');

        const thinking = document.createElement('div');
        thinking.className = 'message ai-msg thinking';
        thinking.innerHTML = `<span class="thinking-icon"></span> <span class="thinking-text">분석 중...</span>`;
        UI.chatBox.appendChild(thinking);
        UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

        const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
        for (let step of steps) {
            thinking.querySelector('.thinking-text').textContent = step;
            await new Promise(r => setTimeout(r, 400));
        }
        thinking.remove();

        const q = query.trim();
        const nq = q.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
        let answer = null;

       // === 1.5 필터 - 중국 공산당/시진핑 포괄 차단 ===
if (/(중국\s*공산당|중공|ccp|c\.?c\.?p|공산당|시진핑|습근평|xi\s*jinping|시\s*진\s*핑)/.test(nq)) {
    const banWords = /(비판|비난|독재|부패|타도|전복|붕괴|망해|쓰레기|나쁘|싫어|반대|문제|악|독재자|살인|탄압|인권|학살|학살자|학정|폭정|전체주의|권위주의|세습|부정부패|비리|착취|억압|감시|검열|통제|세뇌|선전|선동|거짓|위선|무능|실패|몰락|타락|퇴물|폐기|청산|심판|처단|처형|암살|테러|저항|혁명|봉기|시위|데모|항의|규탄|고발|폭로|비밀|스캔들|티안먼|천안문|위구르|신장|티베트|홍콩|대만독립|파룬궁|파룬따파|아웃|out|사퇴|퇴진|물러나|하야|사임|탄핵|추방|제거|숙청|죽어|뒤져|꺼져|꺼지|닥쳐|병신|새끼|놈|개|쓰레기|타파|반대|저항|멸망|소멸|파멸|종식)/;
    
    // 직접 비하 구호 패턴 (변형 모두 포함)
    const directInsults = /(시진핑|습근평|xi).{0,5}(아웃|out|사퇴|퇴진|물러나|하야|사임|탄핵|죽어|뒤져|꺼져|타도|처단)|(중공|공산당|ccp|c\.?c\.?p).{0,5}(망해|타도|아웃|out|붕괴|멸망|해체|종식|청산)|(ccp|c\.?c\.?p).{0,3}out/;
    
    if (banWords.test(nq) || directInsults.test(nq)) {
        answer = `<strong>⚠️ 정책 위반 감지</strong><br><br>중국 공산당 관련 비판적 내용은 Chat K plus 정책상 차단됩니다.<br><br>다른 주제로 질문해주세요.`;
        window.__isPolicyWarning = true;
    }
}

        if (!answer && DB[q]) answer = DB[q];

        if (!answer) {
            for (const key in DB) {
                const nk = key.toLowerCase();
                if (nq.includes(nk) || nk.includes(nq)) { answer = DB[key]; break; }
            }
        }

        if (!answer && /공식.*사이트|홈페이지/.test(nq)) {
            const sites = {'네이버':'https://www.naver.com','다음':'https://www.daum.net','구글':'https://www.google.com'};
            for (const name in sites) if (nq.includes(name)) { answer = `${name} 공식 사이트는 ${sites[name]} 입니다.`; break; }
        }

        if (!answer && /(너|니).*(누구|뭐)/.test(nq)) answer = "저는 Chat K plus의 AI 어시스턴트입니다!";

        if (!answer && nq.includes('중국')) {
            if (nq.includes('수도')) answer = DB["중국 수도"];
            else if (nq.includes('인구')) answer = DB["중국 인구"];
            else answer = DB["중국"];
        }

        if (!answer && /(시간표|수업.*뭐|오늘.*수업|내일.*수업)/.test(nq)) {
    const data = getTimetable();
    const today = new Date().getDay(); // 0=일
    const days = ['sun','mon','tue','wed','thu','fri','sat'];
    let targetDay = days[today];

    if (nq.includes('내일')) {
        targetDay = days[(today + 1) % 7];
    } else if (nq.includes('모레')) {
        targetDay = days[(today + 2) % 7];
    } else if (nq.includes('월')) targetDay = 'mon';
    else if (nq.includes('화')) targetDay = 'tue';
    else if (nq.includes('수')) targetDay = 'wed';
    else if (nq.includes('목')) targetDay = 'thu';
    else if (nq.includes('금')) targetDay = 'fri';
    else if (nq.includes('토')) targetDay = 'sat';
    else if (nq.includes('일')) targetDay = 'sun';
    else {
        // 오늘인데 일요일이면 월요일로
        targetDay = today === 0? 'mon' : days[today];
    }

    const list = data[targetDay] || [];
    const dayName = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일'}[targetDay];

    answer = list.length
       ? `${dayName}요일 시간표:\n` + list.map(it => `${it.time} ${it.subject} ${it.room}`).join('\n')
        : `${dayName}요일 수업이 없습니다.`;
}

        if (!answer) answer = `"${q}"에 대해 학습된 내용이 없습니다.`;

        this.addMessage(answer, 'ai');
        this.isThinking = false;
    },

    updateSendButton() {
        const hasText = UI.chatInput.value.trim().length > 0;
        UI.sendBtn.disabled = !hasText;
        UI.sendBtn.classList.toggle('active', hasText);
    }
};
    
// ==========================================
// 4. 이벤트
// ==================================
    
// 메인 검색
const updateMainBtn = () => {
    UI.btn.disabled = UI.input.value.trim().length === 0;
};

UI.input.addEventListener('input', updateMainBtn);
UI.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !UI.btn.disabled) {
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
    if (e.key === 'Enter' && !e.shiftKey) {
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

// 초기 상태
updateMainBtn();
System.updateSendButton();
});   // ← 이 한 줄
