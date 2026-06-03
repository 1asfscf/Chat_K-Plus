// ==========================================
// 🧠 Chat K plus - 두뇌 (script.js) + 추론 시스템
// ==========================================

// 1. 지식 창고 (Knowledge Base) - 중국 데이터 추가됨
const knowledgeBase = [
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["정치", "정치1"], response: "정치는 국가나 사회의 공동문제를 해결하기 위한 활동이야. 복잡한 주제지만, 궁금한 특정 정치 이슈가 있으면 더 물어봐줘!" },
    { keywords: ["사회", "정치2", "사회/정치2"], response: "사회와 정치는 뗄래야 뗄 수 없는 관계지. 사회적 현상이 정책으로 이어지고, 정책이 다시 사회를 바꾸거든. 어떤 부분이 궁금해?" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus야! API 없이 내장된 지식 베이스로 너랑 대화하는 인공지능(?)이지. 아직 완벽하진 않지만, 최선을 다해 대답할게! ㅋㅋ" },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 궁금한 거 있으면 마구 물어봐!" },
    { keywords: ["심심해", "뭐해", "심심"], response: "나도 심심해 ㅠㅠ 그럼 나한테 재밌는 퀴즈 내주거나, 아바타 2 같은 영화 얘기 어때?" },
    
    // ===== 중국 관련 데이터 추가 =====
    { keywords: ["중국", "중국 대통령", "중국 국가주석", "시진핑", "습근평"], response: "중국 국가주석은 시진핑이야. 2013년부터 주석직을 맡고 있고, 중국공산당 총서기도 겸임 중이지. 2026년 현재 3연임 중이야." },
    { keywords: ["중국 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 영어로 Beijing, 중국어로는 北京. 인구 2100만 넘는 대도시고 자금성, 만리장성이 있어!" },
    { keywords: ["중국 인구", "중국 몇명"], response: "중국 인구는 2026년 기준 약 14억 1천만명이야. 세계 2위고, 1위는 인도야. 근데 최근 인구 감소 중이래." },
    { keywords: ["중국 면적", "중국 크기"], response: "중국 면적은 960만 km²로 세계 4위야. 러시아, 캐나다, 미국 다음이고 한국 면적의 약 96배 크기지." },
    { keywords: ["만리장성", "중국 성벽"], response: "만리장성은 총 길이 2만km가 넘는 세계 최대 성벽이야. 진나라 때부터 쌓기 시작해서 명나라 때 완성됐어. 유네스코 세계문화유산이지!" },
    { keywords: ["위안", "중국 돈", "RMB", "CNY"], response: "중국 돈은 위안화야. RMB 또는 CNY로 표시해. 1위안 = 약 190원이야. 2026년 6월 기준 환율 기준으로 말한 거!" },
    { keywords: ["중국어", "한어", "보통화"], response: "중국 공식 언어는 보통화야. Mandarin Chinese라고도 해. 간체자 써. 광동어는 광동성 쪽에서 쓰는 방언이고!" },
    { keywords: ["틱톡", "도우인", "바이트댄스"], response: "틱톡은 바이트댄스가 만든 숏폼 플랫폼이야. 중국 내수용은 도우인 抖音, 해외용은 틱톡 TikTok으로 나눠서 운영해." },
    { keywords: ["알리바바", "마윈", "타오바오"], response: "알리바바는 마윈이 만든 중국 최대 이커머스 기업이야. 타오바오, 티몰, 알리익스프레스 다 알리바바 거. AI는 Qwen 만들고 있지." },
    { keywords: ["텐센트", "위챗", "QQ", "마화텅"], response: "텐센트는 마화텅이 창업한 IT 공룡이야. 위챗, QQ 메신저 만들고 게임도 엄청 크게 해. Yuanbao AI도 텐센트 거야." },
    { keywords: ["바이두", "로빈리", "리옌홍"], response: "바이두는 로빈 리가 만든 중국 검색엔진 1위야. ERNIE 5.0 AI 모델 만든 회사. 2.4조 파라미터로 GPT-5.1 이겼대!" },
    { keywords: ["중국 국기", "오성홍기"], response: "중국 국기는 오성홍기야. 빨간 바탕에 큰 별 1개 + 작은 별 4개. 큰 별은 공산당, 작은 별 4개는 노동자·농민·소자산계급·민족자산을 뜻해." }
];

// 2. HTML 요소들 가져오기
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');

// 채팅방 요소들은 JS가 동적으로 만들 거라서 변수만 미리 선언
let chatBox, chatInput, chatSendBtn;

// ==========================================
// ⚙️ 시스템 초기화 (화면 세팅)
// ==========================================

function buildChatScreen() {
    chatScreen.innerHTML = `
        <div id="chat-header-bar">
            <button id="back-btn">← 뒤로</button>
            <h3>Chat K plus</h3>
        </div>
        <div id="chat-box"></div>
        <div id="chat-input-area">
            <input type="text" id="chat-input" placeholder="메시지를 입력하세요...">
            <button id="chat-send-btn">전송</button>
        </div>
    `;

    chatBox = document.getElementById('chat-box');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send-btn');
    const backBtn = document.getElementById('back-btn');

    chatSendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });
    backBtn.addEventListener('click', goHome);
}

function startChat(query) {
    if (!query.trim()) return;

    homeScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    
    if (!chatBox) {
        buildChatScreen();
    }

    addMessage(query, 'user');
    
    // ★ 변경점: 바로 답변하지 않고 추론 프로세스 시작!
    startReasoning(query);
    
    searchInput.value = '';
}

function goHome() {
    chatScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    if(chatBox) chatBox.innerHTML = '';
}

// ==========================================
// 💬 대화 처리 및 AI 로직
// ==========================================

function handleChatSubmit() {
    const query = chatInput.value;
    if (!query.trim()) return;

    addMessage(query, 'user');
    chatInput.value = '';

    // ★ 변경점: 여기서도 추론 프로세스 시작!
    startReasoning(query);
}

// ★★★ 추론(생각) 시스템 ★★★
function startReasoning(query) {
    // 1. 생각하는 말풍선 먼저 띄우기 (텍스트만 들어있는 상태)
    const thinkingDiv = addMessage("🔍 질문의 핵심 키워드를 추출하는 중...", 'thinking');

    // 2. 1단계 추론 (0.8초 후)
    setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "🧠 지식 베이스에서 연관 정보를 탐색 중...";
    }, 800);

    // 3. 2단계 추론 (1.6초 후)
    setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "💡 최적의 답변을 조합하는 중...";
    }, 1600);

    // 4. 3단계 완료 및 최종 대답 (2.4초 후)
    setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "✅ 추론 완료! 답변을 생성합니다.";
        
        // 0.4초 뒤에 생각 풍선 지우고 진짜 대답 띄우기
        setTimeout(() => {
            if(thinkingDiv) thinkingDiv.remove();
            const aiResponse = findResponse(query);
            addMessage(aiResponse, 'ai');
        }, 400);

    }, 2400);
}

// 지식 창고 뒤지기
function findResponse(query) {
    let bestMatch = null;
    let maxMatches = 0;

    const userWords = query.toLowerCase().split(/\s+/);

    for (const item of knowledgeBase) {
        let matches = 0;
        for (const word of userWords) {
            if (item.keywords.some(kw => word.includes(kw) || kw.includes(word))) {
                matches++;
            }
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = item;
        }
    }

    if (bestMatch && maxMatches > 0) {
        return bestMatch.response;
    } else {
        return "음... 아직 그 부분은 내 지식 창고에 없네 ㅠㅠ 다른 질문 해줄래? (예시 버튼 눌러봐도 좋아!)";
    }
}

// 화면에 말풍선 추가하기 (타입 추가: user, ai, thinking)
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
    
    // 생각 말풍선은 나중에 지우거나 수정해야 하니까 그 요소 자체를 반환해줌!
    return msgDiv;
}

// ==========================================
// 🚀 프로그램 실행 (이벤트 리스너 등록)
// ==========================================

searchBtn.addEventListener('click', () => {
    startChat(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startChat(searchInput.value);
    }
});

exampleQuestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('question-tag')) {
        const query = e.target.getAttribute('data-query');
        startChat(query);
    }
});
