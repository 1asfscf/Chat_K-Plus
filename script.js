/**
 * Chat GOL - Core Engine
 * 1. 데이터베이스: 질문과 답변 쌍
 * 2. 사고 엔진: 5단계 추론 로직
 * 3. 상태 관리: UI 제어 (검색 <-> 채팅)
 */

// [1] 데이터 및 로직 설정
const knowledgeBase = {
    "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다.",
    "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
    "사회/정치2": "시민의 권리와 의무, 그리고 법과 제도를 다루는 학문 분야입니다.",
    "너에 대해서": "저는 Chat GOL의 AI 어시스턴트입니다. 당신을 돕기 위해 최적화된 지능형 봇입니다."
};


const reasoningSteps = [
    "질문의 의도를 분석하는 중...",
    "지식 베이스(DB) 인덱스를 탐색하는 중...",
    "관련 맥락과 데이터를 매칭하는 중...",
    "정보의 정확성을 검증하는 중...",
    "답변을 최종 생성하는 중..."
];


// [2] DOM 요소 선택
const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const searchView = document.getElementById('search-view');
const chatView = document.getElementById('chat-view');
const chatBox = document.getElementById('chat-box');
const backBtn = document.getElementById('backBtn');
const exampleBtns = document.querySelectorAll('.example-btn');


// [3] 유틸리티 함수: 뷰 전환 및 UI 조작
const switchView = (showViewId) => {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(showViewId).classList.remove('hidden');
};


const addMessage = (text, type) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = message ${type}-msg;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
};


const addThinking = (text) => {
    const div = document.createElement('div');
    div.className = 'thinking-step';
    div.textContent = ⚙️ ${text};
    chatBox.appendChild(div);
};


// [4] 메인 로직: 사고 엔진
const processSearch = async (question) => {
    // 1. 화면 전환
    chatBox.innerHTML = ''; // 채팅창 초기화
    switchView('chat-view');
    addMessage(question, 'user');


// 2. 5단계 사고 과정 실행
    for (const step of reasoningSteps) {
        addThinking(step);
        await new Promise(resolve => setTimeout(resolve, 800)); // 0.8초 생각 시간
    }


// 3. 답변 도출
    const answer = knowledgeBase[question] || "죄송합니다. 관련 정보를 찾을 수 없습니다.";
    addMessage(answer, 'ai');
};


// [5] 이벤트 리스너
queryInput.addEventListener('input', () => {
    // 입력창 글자 유무에 따라 버튼 활성화/비활성화
    searchBtn.disabled = queryInput.value.trim() === '';
});


searchBtn.addEventListener('click', () => {
    if(queryInput.value.trim()) processSearch(queryInput.value.trim());
});


backBtn.addEventListener('click', () => {
    switchView('search-view');
    queryInput.value = '';
    searchBtn.disabled = true; // 돌아오면 버튼 다시 비활성화
});


exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        queryInput.value = btn.textContent;
        searchBtn.disabled = false; // 버튼 강제 활성화
        processSearch(btn.textContent);
    });
});
