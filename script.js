// ==========================================
// 🧠 Chat K plus - 두뇌 (script.js) + 추론 시스템
// ==========================================

// 1. 지식 창고 (Knowledge Base)
const knowledgeBase = [
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["정치", "정치1"], response: "정치는 국가나 사회의 공동문제를 해결하기 위한 활동이야. 복잡한 주제지만, 궁금한 특정 정치 이슈가 있으면 더 물어봐줘!" },
    { keywords: ["사회", "정치2", "사회/정치2"], response: "사회와 정치는 뗄래야 뗄 수 없는 관계지. 사회적 현상이 정책으로 이어지고, 정책이 다시 사회를 바꾸거든. 어떤 부분이 궁금해?" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus야! API 없이 내장된 지식 베이스로 너랑 대화하는 인공지능(?)이지. 아직 완벽하진 않지만, 최선을 다해 대답할게! ㅋㅋ" },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 궁금한 거 있으면 마구 물어봐!" },
    { keywords: ["심심해", "뭐해", "심심"], response: "나도 심심해 ㅠㅠ 그럼 나한테 재밌는 퀴즈 내주거나, 아바타 2 같은 영화 얘기 어때?" }
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
