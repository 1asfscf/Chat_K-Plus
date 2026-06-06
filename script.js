document.addEventListener('DOMContentLoaded', () => {
    // 1. UI 요소 캐싱
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

    // 3. 시스템 컨트롤러
    const System = {
        checkButtonState() {
            const hasText = UI.input.value.trim().length > 0;
            UI.btn.disabled = !hasText;
            console.log(`버튼 상태: ${hasText ? '활성' : '비활성'}`);
        },

        switchView(isChatMode) {
            UI.searchView.classList.toggle('hidden', isChatMode);
            UI.chatView.classList.toggle('hidden', !isChatMode);
            
            if (!isChatMode) {
                UI.input.value = '';
                UI.btn.disabled = true;
            }
        },

        async runReasoning(query) {
            if (!query) return;
            
            this.switchView(true);
            UI.chatBox.innerHTML = `<div class="message user-msg">${query}</div>`;
            
            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            const STEP_DELAY = 400;
            
            for (const step of steps) {
                const div = document.createElement('div');
                div.className = 'thinking-step';
                div.textContent = `⚙️ ${step}`;
                UI.chatBox.appendChild(div);
                UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
                await new Promise(r => setTimeout(r, STEP_DELAY));
            }

            const answer = DB[query] || "학습되지 않은 내용입니다.";
            const div = document.createElement('div');
            div.className = 'message ai-msg';
            div.textContent = answer;
            UI.chatBox.appendChild(div);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        }
    };

    // 4. 이벤트 바인딩
    UI.input.addEventListener('input', () => System.checkButtonState());
    UI.btn.addEventListener('click', () => System.runReasoning(UI.input.value.trim()));
    UI.backBtn.addEventListener('click', () => System.switchView(false));
    
    UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            UI.input.value = btn.textContent;
            System.checkButtonState();
            System.runReasoning(btn.textContent);
        });
    });

    // 초기 상태
    System.checkButtonState();
});
