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
        "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다. 제이크 설리와 네이티리 가족이 해양 부족과 만나 겪는 이야기죠.",
        "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
        "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",
        "너에 대해서": "저는 Chat GOL의 AI 어시스턴트입니다. 당신을 돕기 위해 최적화된 지능형 봇입니다."
    };

    // ==========================================
    // 3. 시스템
    // ==========================================
    const System = {
        isThinking: false,

        switchView(isChat) {
            UI.searchView.classList.toggle('hidden', isChat);
            UI.chatView.classList.toggle('hidden', !isChat);
            if (isChat) {
                setTimeout(() => UI.chatInput.focus(), 100);
            }
        },

        addMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `message ${type === 'user' ? 'user-msg' : 'ai-msg'}`;
            msg.textContent = text;
            UI.chatBox.appendChild(msg);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
            return msg;
        },

        // [수정] 추론 과정을 하나로 통합
        async runReasoning(query) {
            if (!query || this.isThinking) return;
            this.isThinking = true;

            this.switchView(true);
            this.addMessage(query, 'user');

            // 하나의 thinking 버블 생성
            const thinking = document.createElement('div');
            thinking.className = 'message ai-msg thinking';
            thinking.innerHTML = `<span class="thinking-icon">⚙️</span> <span class="thinking-text">분석 중...</span>`;
            UI.chatBox.appendChild(thinking);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

            // 텍스트만 변경 (4단계)
            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            for (let i = 0; i < steps.length; i++) {
                thinking.querySelector('.thinking-text').textContent = steps[i];
                await new Promise(r => setTimeout(r, 500));
            }

            // thinking 제거하고 답변
            thinking.remove();
            const answer = DB[query] || `"${query}"에 대해 학습된 내용이 없습니다. 다른 질문을 해보세요.`;
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
    // ==========================================
    
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
    // 자동 높이 조절
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

    // 초기 상태
    updateMainBtn();
    System.updateSendButton();
});
