/**
 * [Data Layer]
 * 데이터베이스 역할을 하는 객체야. 
 * 나중에 데이터가 많아지면 별도의 JSON 파일로 분리해도 돼.
 */
const knowledgeBase = {
    "아바타 2가 뭐죠?": "아바타: 물의 길은 제임스 카메론 감독의 SF 영화 속편으로, 판도라 행성의 바다를 배경으로 합니다.",
    "정치": "정치는 사회 구성원 간의 갈등을 조정하고 공동체의 문제를 해결해 나가는 권력 과정입니다.",
    "사회/정치2": "사회 구조와 정치적 의사결정의 상관관계를 연구하는 분야로, 시민들의 참여가 중요합니다.",
    "너에 대해서": "저는 Chat GOL의 AI 어시스턴트입니다. 당신의 질문에 답변하고 업무를 돕기 위해 설계되었습니다."
};

/**
 * [UI Logic & Controller]
 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('queryInput');
    const searchBtn = document.getElementById('searchBtn');
    const exampleBtns = document.querySelectorAll('.example-btn');


// 검색 실행 핵심 로직
    const executeSearch = (query) => {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            alert("질문을 입력해주세요!");
            return;
        }


// DB에서 데이터 검색 (매칭되는 키가 있으면 답변, 없으면 기본 메시지)
        const result = knowledgeBase[trimmedQuery] || "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다.";
        
        // 결과 표시 (UI를 더 고도화하려면 alert 대신 모달이나 화면 요소를 쓰면 돼)
        console.log([Search Result]: ${result});
        alert([결과]: ${result});
    };


// 1. 버튼 클릭 이벤트 (UI -> Data 연결)
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent;
            input.value = question;
            // 바로 검색까지 실행하고 싶으면 아래 주석 해제
            // executeSearch(question); 
        });
    });


// 2. 검색 버튼 클릭
    searchBtn.addEventListener('click', () => executeSearch(input.value));


// 3. 엔터키 이벤트
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch(input.value);
    });
});
