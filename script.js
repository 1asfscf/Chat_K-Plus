document.addEventListener('DOMContentLoaded', () => {
    // 1. 요소 참조
    const UI = {
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        searchView: document.getElementById('search-view'),
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        examples: document.querySelectorAll('.example-btn')
    };

// 2. 데이터베이스
    const DB = {
        "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다.",
        "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
        "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",
        "너에 대해서": "저는 Chat GOL의 AI 어시스턴트입니다. 당신을 돕기 위해 최적화된 지능형 봇입니다."
    };


// 3. 시스템 컨트롤러 (강제 활성화 로직 포함)
    const System = {
        // [핵심] 버튼 활성화 상태를 강제로 체크하는 함수
        checkButtonState: () => {
            const hasText = UI.input.value.trim().length > 0;
            UI.btn.disabled = !hasText;
            console.log("버튼 상태 업데이트:", hasText ? "활성(Enabled)" : "비활성(Disabled)");
        },


switchView: (isChatMode) => {
            if (isChatMode) {
                UI.searchView.classList.add('hidden');
                UI.chatView.classList.remove('hidden');
            } else {
                UI.searchView.classList.remove('hidden');
                UI.chatView.classList.add('hidden');
                UI.input.value = '';
                UI.btn.disabled = true; // 돌아갈 때 초기화
            }
        },


runReasoning: async (query) => {
            if (!query) return;
            System.switchView(true);
            UI.chatBox.innerHTML = 

${query}
;
            
            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            for (const step of steps) {
                const div = document.createElement('div');
                div.className = 'thinking-step';
                div.textContent = ⚙️ ${step};
                UI.chatBox.appendChild(div);
                UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
                await new Promise(r => setTimeout(r, 400));
            }

const ans = DB[query] || "학습되지 않은 내용입니다.";
            const div = document.createElement('div');
            div.className = 'message ai-msg';
            div.textContent = ans;
            UI.chatBox.appendChild(div);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        }
    };


// 4. 이벤트 연동 (어떤 입력 방식이든 다 잡아냄)
    
    // 입력창에 글자가 들어오면 무조건 버튼 상태를 체크해!
    UI.input.addEventListener('input', System.checkButtonState);
    UI.input.addEventListener('keyup', System.checkButtonState); // 키보드 입력 대응
    UI.input.addEventListener('change', System.checkButtonState); // 붙여넣기 대응


UI.btn.addEventListener('click', () => {
        System.runReasoning(UI.input.value.trim());
    });


UI.backBtn.addEventListener('click', () => {
        System.switchView(false);
    });


UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            UI.input.value = btn.textContent;
            System.checkButtonState(); // 예시 버튼 클릭 시 상태 강제 업데이트
            System.runReasoning(btn.textContent);
        });
    });
});
