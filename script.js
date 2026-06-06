document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. UI 요소 캐싱 (모든 ID와 매칭)
    // ==========================================
    const UI = {
        // 검색 화면(Main)
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        examples: document.querySelectorAll('.example-btn'),
        
        // 채팅 화면(View)
        searchView: document.getElementById('search-view'),
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        
        // 채팅 하단 입력바
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn')
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
        // [화면 전환] 검색창 <-> 채팅창
        switchView(isChatMode) {
            UI.searchView.classList.toggle('hidden', isChatMode);
            UI.chatView.classList.toggle('hidden', !isChatMode);
        },


// [사고 로직] 질문을 받아 답변 생성
        async runReasoning(query) {
            if (!query) return;
            
            // 채팅창으로 전환
            this.switchView(true);
            
            // 사용자 질문 출력
            UI.chatBox.innerHTML += 

${query}
;
            
            // 사고 과정 시뮬레이션
            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            for (const step of steps) {
                const div = document.createElement('div');
                div.className = 'thinking-step';
                div.textContent = ⚙️ ${step};
                UI.chatBox.appendChild(div);
                UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
                await new Promise(r => setTimeout(r, 400));
            }

// 답변 출력
            const answer = DB[query] || "학습되지 않은 내용입니다.";
            UI.chatBox.innerHTML += 

${answer}
;
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        }
    };

// ==========================================
    // 4. 이벤트 바인딩 (두 입력창 모두 처리)
    // ==========================================


// [Main 검색창]
    UI.input.addEventListener('input', () => {
        UI.btn.disabled = UI.input.value.trim().length === 0;
    });
    UI.btn.addEventListener('click', () => {
        System.runReasoning(UI.input.value.trim());
        UI.input.value = ''; // 전송 후 초기화
    });


// [Chat 입력바]
    UI.sendBtn.addEventListener('click', () => {
        System.runReasoning(UI.chatInput.value.trim());
        UI.chatInput.value = ''; // 전송 후 초기화
    });


// [기타 기능] 뒤로가기 & 예시질문
    UI.backBtn.addEventListener('click', () => System.switchView(false));
    
    UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            System.runReasoning(btn.textContent);
        });
    });
});
