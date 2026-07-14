// script.js

// 1. 샘플 지식 베이스 데이터
const KNOWLEDGE_BASE = {
    "날씨": "오늘 날씨는 맑음입니다.",
    "기능": "Chat K Plus는 지식 베이스와 필터링 시스템을 갖춘 AI 챗봇입니다.",
    "개발자": "이 사이트는 Chat K Plus 개발자가 제작 중입니다."
};

// 2. 금지어 차단 목록 (시스템 필터)
const BANNED_WORDS = ["비속어", "욕설", "나쁜말"];

// DOM 요소 선택
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 메시지 전송 이벤트 이벤트리스너
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 유저 메시지 화면 표시
    appendMessage(text, 'user');
    userInput.value = '';

    // 시스템 필터링 검사 실행
    if (checkFilter(text)) {
        appendMessage("시스템 보안: 부적절한 표현이 감지되어 답변을 제공할 수 없습니다.", "bot");
        return;
    }

    // 지식 베이스 검색 및 답변 생성
    const response = searchKnowledgeBase(text);
    setTimeout(() => {
        appendMessage(response, 'bot');
    }, 500); // 챗GPT 느낌의 딜레이 효과
}

// 메시지 추가 함수
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 시스템 차단 필터 함수
function checkFilter(text) {
    return BANNED_WORDS.some(word => text.includes(word));
}

// 지식 베이스 매칭 함수
function searchKnowledgeBase(text) {
    for (const key in KNOWLEDGE_BASE) {
        if (text.includes(key)) {
            return KNOWLEDGE_BASE[key];
        }
    }
    return "죄송합니다, 지식 베이스에서 관련 정보를 찾지 못했습니다.";
}
