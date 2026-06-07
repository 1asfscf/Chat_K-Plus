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
    // --- AI 자기소개 (모든 변형 대응) ---
    "너에 대해서": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너 누구야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "넌 뭐야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너는 누구": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "자기소개": "안녕하세요! 저는 Chat K plus입니다. 질문에 답하고 정보를 찾아드리는 AI입니다.",
    "너에 대해 알려줘": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
    "너 뭐하는 애야": "저는 당신의 질문에 답하고, 검색을 돕는 AI 어시스턴트입니다.",
    "너 정체가 뭐야": "저는 Meta AI 기술을 기반으로 만든 Chat K plus 대화형 AI입니다.",

    // --- 기존 데이터 ---
    "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다. 제이크 설리와 네이티리 가족이 해양 부족과 만나 겪는 이야기죠.",
    "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
    "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다.",

    // --- 중국 관련 ---
    "중국": "중국은 동아시아 국가로 수도는 베이징입니다. 인구 약 14억 명으로 세계 2위입니다.",
    "중국 수도": "중국의 수도는 베이징(北京)입니다.",
    "중국 인구": "2024년 기준 약 14억 1천만 명입니다.",
    "중국 역사": "5000년 역사를 가진 문명국가로, 하·상·주나라부터 시작해 현재 중화인민공화국에 이릅니다.",
    "시진핑": "시진핑은 현재 중화인민공화국의 주석입니다. 2013년부터 집권 중입니다.",
    "중국 공산당": "중국공산당(CCP)은 1921년 창당된 중국의 집권 정당입니다.",
    "만리장성": "만리장성은 중국 북부를 가로지르는 세계 최대 방어시설로 길이가 2만km가 넘습니다.",
    "중국 음식": "짜장면, 마라탕, 딤섬, 베이징덕이 유명합니다.",

    // --- 공식 사이트 ---
    "네이버": "네이버 공식 사이트는 https://www.naver.com 입니다.",
    "네이버 공식 사이트": "네이버 공식 사이트는 https://www.naver.com 입니다.",
    "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다.",
    "구글": "구글 공식 사이트는 https://www.google.com 입니다.",
    "구글 공식 사이트": "구글 공식 사이트는 https://www.google.com 입니다.",
    "유튜브": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
    "유튜브 공식 사이트": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
    "인스타그램": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
    "인스타 공식 사이트": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
    "카카오": "카카오 공식 사이트는 https://www.kakaocorp.com 입니다.",
    "카카오톡": "카카오톡 공식 사이트는 https://www.kakaocorp.com/service/KakaoTalk 입니다.",
    "쿠팡": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
    "쿠팡 공식 사이트": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
    "chat gpt": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다.",
    "챗지피티": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다."
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
        
        // URL을 클릭 가능한 링크로 변환 (모달용)
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(text)) {
            msg.innerHTML = text.replace(urlRegex, url => 
                `<a href="#" class="external-link" data-url="${url}">${url}</a>`
            );
        } else {
            msg.textContent = text;
        }
        
        UI.chatBox.appendChild(msg);
        UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
        return msg;
    },

    // [완전 개편] 똑똑한 추론
    async runReasoning(query) {
        if (!query || this.isThinking) return;
        this.isThinking = true;

        this.switchView(true);
        this.addMessage(query, 'user');

        const thinking = document.createElement('div');
        thinking.className = 'message ai-msg thinking';
        thinking.innerHTML = `<span class="thinking-icon"></span> <span class="thinking-text">분석 중...</span>`;
        UI.chatBox.appendChild(thinking);
        UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

        const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
        for (let step of steps) {
            thinking.querySelector('.thinking-text').textContent = step;
            await new Promise(r => setTimeout(r, 400));
        }
        thinking.remove();

        // === 1. 정규화 ===
        const q = query.trim();
        const nq = q.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');

        let answer = null;

        // === 2. 완전 일치 ===
        if (DB[q]) answer = DB[q];

        // === 3. 부분 일치 ===
        if (!answer) {
            for (const key in DB) {
                const nk = key.toLowerCase();
                if (nq.includes(nk) || nk.includes(nq)) {
                    answer = DB[key];
                    break;
                }
            }
        }

        // === 4. 패턴 매칭 - 공식 사이트 ===
        if (!answer && /공식.*사이트|사이트.*알려|홈페이지/.test(nq)) {
            const sites = {
                '네이버': 'https://www.naver.com',
                '다음': 'https://www.daum.net',
                '구글': 'https://www.google.com',
                '유튜브': 'https://www.youtube.com',
                '인스타': 'https://www.instagram.com',
                '카카오': 'https://www.kakaocorp.com',
                '쿠팡': 'https://www.coupang.com',
                'chatgpt': 'https://chat.openai.com',
                '챗지피티': 'https://chat.openai.com'
            };
            for (const name in sites) {
                if (nq.includes(name)) {
                    answer = `${name} 공식 사이트는 ${sites[name]} 입니다.`;
                    break;
                }
            }
        }

        // === 5. 패턴 매칭 - AI 자기소개 ===
        if (!answer && /(너|니|당신).*(누구|뭐|정체|소개|누구야|뭐야)/.test(nq)) {
            answer = "저는 Chat K plus의 AI 어시스턴트입니다. 질문에 답하고 정보를 찾아드려요!";
        }

        // === 6. 패턴 매칭 - 중국 ===
        if (!answer && nq.includes('중국')) {
            if (nq.includes('수도')) answer = DB["중국 수도"];
            else if (nq.includes('인구')) answer = DB["중국 인구"];
            else answer = DB["중국"];
        }

        // === 7. 최종 fallback ===
        if (!answer) {
            answer = `"${q}"에 대해 학습된 내용이 없습니다. 다른 질문을 해보세요.`;
        }

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
// ==================================
    
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

// === 링크 경고 모달 ===
const linkModal = document.getElementById('linkModal');
const modalUrl = document.getElementById('modalUrl');
const modalCancel = document.getElementById('modalCancel');
const modalGo = document.getElementById('modalGo');
let pendingUrl = '';

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('external-link')) {
        e.preventDefault();
        pendingUrl = e.target.dataset.url;
        modalUrl.textContent = pendingUrl;
        linkModal.classList.remove('hidden');
    }
});

if (modalCancel) modalCancel.onclick = () => linkModal.classList.add('hidden');
if (modalGo) modalGo.onclick = () => {
    window.open(pendingUrl, '_blank');
    linkModal.classList.add('hidden');
};
if (linkModal) linkModal.querySelector('.modal-backdrop').onclick = () => linkModal.classList.add('hidden');

// 초기 상태
updateMainBtn();
System.updateSendButton();
});
