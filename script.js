document.addEventListener('DOMContentLoaded', () => {
    // 1. 시스템 요소 참조 (HTML의 모든 ID와 1:1 매칭)
    const UI = {
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        searchView: document.getElementById('search-view'),
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        examples: document.querySelectorAll('.example-btn')
    };

// 2. 데이터 베이스
    const DB = {
        "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다.",
        "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
        "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",
        "너에 대해서": "저는 Chat GOL의 AI 어시스턴트입니다. 당신을 돕기 위해 최적화된 지능형 봇입니다."
    };


// 3. 시스템 컨트롤러 (모든 동작을 통제)
    const System = {
        // 화면 전환 처리
        switchView: (isChatMode) => {
            if (isChatMode) {
                UI.searchView.classList.add('hidden');
                UI.chatView.classList.remove('hidden');
            } else {
                UI.searchView.classList.remove('hidden');
                UI.chatView.classList.add('hidden');
                UI.input.value = '';
                UI.btn.disabled = true; // 돌아갈 땐 다시 비활성화
            }
        },


// 사고 엔진 (5단계)
        runReasoning: async (query) => {
            // 초기화 및 화면 전환
            UI.chatBox.innerHTML = 

${query}
;
            System.switchView(true);
            
            const steps = [
                "질문 의도 분석 중...",
                "데이터베이스 인덱스 탐색...",
                "답변 정확성 검증...",
                "문맥 매칭 확인...",
                "최종 답변 생성 중..."
            ];

// 5단계 사고 로직 실행
            for (const step of steps) {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'thinking-step';
                stepDiv.textContent = ⚙️ ${step};
                UI.chatBox.appendChild(stepDiv);
                UI.chatBox.scrollTop = UI.chatBox.scrollHeight; // 자동 스크롤
                await new Promise(r => setTimeout(r, 600)); // 0.6초 대기
            }


// 답변 도출
            const answer = DB[query] || "해당 정보는 학습되지 않았습니다.";
            const ansDiv = document.createElement('div');
            ansDiv.className = 'message ai-msg';
            ansDiv.textContent = answer;
            UI.chatBox.appendChild(ansDiv);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        }
    };


// 4. 이벤트 연동 (사용자 동작을 시스템이 가로채서 제어)
    
    // 입력창 제어: 글자 있을 때만 버튼 활성화
    UI.input.addEventListener('input', () => {
        UI.btn.disabled = UI.input.value.trim().length === 0;
    });


// 검색 버튼 클릭 시
    UI.btn.addEventListener('click', () => {
        if (UI.input.value.trim()) System.runReasoning(UI.input.value.trim());
    });


// 돌아가기 버튼 클릭 시
    UI.backBtn.addEventListener('click', () => {
        System.switchView(false);
    });


// 예시 버튼 클릭 시
    UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            UI.input.value = btn.textContent; // 입력창에 자동 입력
            UI.btn.disabled = false;
            System.runReasoning(btn.textContent);
        });
    });
});
