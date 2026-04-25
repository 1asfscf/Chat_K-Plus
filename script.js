class ChatGot {
    constructor() {
        this.chatScroll = document.getElementById('chatScroll');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.sidebar = document.getElementById('sidebar');
        this.chatList = document.getElementById('chatList');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.charCount = document.getElementById('charCount');
        this.clearBtn = document.getElementById('clearBtn');
        
        // 설정 관련
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsSidebarBtn = document.getElementById('settingsSidebarBtn');
        this.settingsOverlay = document.getElementById('settingsOverlay');
        this.settingsModal = document.getElementById('settingsModal');
        this.settingsCloseBtn = document.getElementById('settingsCloseBtn');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.fontBtns = document.querySelectorAll('.font-btn');
        this.reduceMotionToggle = document.getElementById('reduceMotionToggle');
        this.conversationStyleSelect = document.getElementById('conversationStyle');
        this.resetConversationsBtn = document.getElementById('resetConversationsBtn');

        this.currentChatId = Date.now();
        this.conversations = {};
        this.isProcessing = false;
        this.isFirstMessage = true;

        // 설정 불러오기
        this.loadSettings();
        this.init();
    }

    init() {
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.userInput.addEventListener('input', () => {
            this.autoResize();
            this.updateCharCount();
        });
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.menuBtn.addEventListener('click', () => this.openSidebar());
        this.sidebarCloseBtn.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        this.newChatBtn.addEventListener('click', () => this.createNewChat());
        this.clearBtn.addEventListener('click', () => this.clearAllConversations());

        // 설정 모달 열기
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.settingsSidebarBtn.addEventListener('click', () => this.openSettings());
        this.settingsCloseBtn.addEventListener('click', () => this.closeSettings());
        this.settingsOverlay.addEventListener('click', () => this.closeSettings());

        // 다크 모드 토글
        this.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        // 폰트 크기
        this.fontBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFontSize(btn.dataset.size));
        });
        // 애니메이션 줄이기
        this.reduceMotionToggle.addEventListener('change', () => this.toggleReduceMotion());
        // 대화 스타일 (표시만)
        this.conversationStyleSelect.addEventListener('change', (e) => {
            localStorage.setItem('conversationStyle', e.target.value);
        });
        // 대화 초기화
        this.resetConversationsBtn.addEventListener('click', () => {
            if (confirm('정말 모든 대화를 삭제하시겠습니까?')) {
                this.clearAllConversations();
                this.closeSettings();
            }
        });

        // 추천 카드
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.userInput.value = card.dataset.query;
                this.updateCharCount();
                this.sendMessage();
            });
        });

        // 단축키
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewChat();
            }
        });

        this.updateCharCount();
    }

    openSidebar() {
        this.sidebar.classList.add('open');
        this.sidebarOverlay.classList.add('active');
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.sidebarOverlay.classList.remove('active');
    }

    openSettings() {
        this.settingsModal.classList.add('open');
        this.settingsOverlay.classList.add('active');
    }

    closeSettings() {
        this.settingsModal.classList.remove('open');
        this.settingsOverlay.classList.remove('active');
    }

    loadSettings() {
        // 다크 모드
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark');
            this.darkModeToggle.checked = true;
        }
        // 폰트 크기
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        this.applyFontSize(fontSize);
        document.querySelector(`.font-btn[data-size="${fontSize}"]`)?.classList.add('active');
        // 애니메이션 줄이기
        const reduceMotion = localStorage.getItem('reduceMotion') === 'true';
        if (reduceMotion) {
            document.body.classList.add('reduce-motion');
            this.reduceMotionToggle.checked = true;
        }
        // 대화 스타일
        const style = localStorage.getItem('conversationStyle') || 'default';
        if (this.conversationStyleSelect) this.conversationStyleSelect.value = style;
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark', this.darkModeToggle.checked);
        localStorage.setItem('darkMode', this.darkModeToggle.checked);
    }

    setFontSize(size) {
        this.fontBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.font-btn[data-size="${size}"]`)?.classList.add('active');
        this.applyFontSize(size);
        localStorage.setItem('fontSize', size);
    }

    applyFontSize(size) {
        let base;
        switch(size) {
            case 'small': base = '13px'; break;
            case 'large': base = '16px'; break;
            default: base = '14px';
        }
        document.documentElement.style.setProperty('--font-size-base', base);
    }

    toggleReduceMotion() {
        document.body.classList.toggle('reduce-motion', this.reduceMotionToggle.checked);
        localStorage.setItem('reduceMotion', this.reduceMotionToggle.checked);
    }

    autoResize() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 180) + 'px';
    }

    updateCharCount() {
        const len = this.userInput.value.length;
        this.charCount.textContent = `${len}/10000`;
        this.charCount.classList.toggle('visible', len > 0);
        this.sendBtn.disabled = len === 0 || this.isProcessing;
    }

    createNewChat() {
        if (this.isProcessing) return;
        this.saveCurrentConversation();
        this.currentChatId = Date.now();
        this.isFirstMessage = true;

        this.chatScroll.innerHTML = `
        <div class="welcome-section" id="welcomeSection">
            <div class="welcome-icon">
                <div class="icon-ring"></div>
                <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h1 class="welcome-heading">무엇을 도와드릴까요?</h1>
            <p class="welcome-sub">질문을 입력하거나 아래 주제를 선택해보세요</p>
            <div class="suggestions-container">
                <div class="suggestions-grid">
                    <button class="suggestion-card" data-query="머신러닝이 뭔지 쉽게 설명해줘">
                        <div class="suggestion-icon" style="background: #eef2ff; color: #6366f1;"><i class="fa-solid fa-brain"></i></div>
                        <div class="suggestion-content"><span class="suggestion-title">머신러닝 쉽게 이해하기</span><span class="suggestion-desc">예시와 함께 설명해드려요</span></div>
                    </button>
                    <button class="suggestion-card" data-query="파이썬으로 데이터 정렬하는 함수 알려줘">
                        <div class="suggestion-icon" style="background: #fef3c7; color: #f59e0b;"><i class="fa-solid fa-code"></i></div>
                        <div class="suggestion-content"><span class="suggestion-title">파이썬 코딩 도움</span><span class="suggestion-desc">정렬 함수 예제</span></div>
                    </button>
                    <button class="suggestion-card" data-query="생산성을 높이는 방법이 뭐가 있을까?">
                        <div class="suggestion-icon" style="background: #fce7f3; color: #ec4899;"><i class="fa-solid fa-bolt"></i></div>
                        <div class="suggestion-content"><span class="suggestion-title">생산성 향상 팁</span><span class="suggestion-desc">시간 관리 전략</span></div>
                    </button>
                    <button class="suggestion-card" data-query="클린 코드 작성하는 좋은 습관 알려줘">
                        <div class="suggestion-icon" style="background: #d1fae5; color: #10b981;"><i class="fa-solid fa-feather"></i></div>
                        <div class="suggestion-content"><span class="suggestion-title">클린 코드 습관</span><span class="suggestion-desc">더 나은 개발을 위해</span></div>
                    </button>
                </div>
            </div>
        </div>`;

        this.welcomeSection = document.getElementById('welcomeSection');
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.userInput.value = card.dataset.query;
                this.updateCharCount();
                this.sendMessage();
            });
        });

        this.addChatToSidebar('새 대화');
        this.userInput.value = '';
        this.updateCharCount();
        this.userInput.focus();
        this.closeSidebar();
    }

    addChatToSidebar(title) {
        const item = document.createElement('div');
        item.className = 'chat-item active';
        item.dataset.chatId = this.currentChatId;
        item.innerHTML = `<i class="fa-solid fa-message"></i><span>${title}</span>`;
        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
        this.chatList.insertBefore(item, this.chatList.firstChild);
        item.addEventListener('click', () => this.loadConversation(this.currentChatId));
    }

    saveCurrentConversation() {
        const messages = this.chatScroll.querySelectorAll('.message-row');
        if (messages.length > 0) {
            this.conversations[this.currentChatId] = {
                title: this.getConversationTitle(),
                html: this.chatScroll.innerHTML
            };
        }
    }

    getConversationTitle() {
        const firstUserMsg = this.chatScroll.querySelector('.message-row.user .message-bubble');
        if (firstUserMsg) {
            const text = firstUserMsg.textContent.trim();
            return text.length > 20 ? text.substring(0, 20) + '...' : text;
        }
        return '새 대화';
    }

    loadConversation(chatId) {
        if (this.isProcessing) return;
        this.saveCurrentConversation();
        this.currentChatId = chatId;
        if (this.conversations[chatId]) {
            this.chatScroll.innerHTML = this.conversations[chatId].html;
            this.welcomeSection = document.getElementById('welcomeSection');
            this.isFirstMessage = !this.welcomeSection;
        }
        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
        if (activeItem) activeItem.classList.add('active');
        this.closeSidebar();
    }

    clearAllConversations() {
        this.conversations = {};
        this.chatList.innerHTML = '';
        this.createNewChat();
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.sendBtn.disabled = true;
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.updateCharCount();

        if (this.welcomeSection) {
            this.welcomeSection.remove();
            this.welcomeSection = null;
            this.isFirstMessage = false;
        }

        this.addMessage('user', message);
        this.scrollToBottom();

        const thinkingEl = this.addThinkingIndicator();
        this.scrollToBottom();

        const responseText = searchKnowledgeBase(message);
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
        thinkingEl.remove();

        const botWrapper = this.addMessage('bot', '', true);
        await this.typeText(botWrapper.querySelector('.message-bubble'), responseText);

        this.updateChatTitle(message);

        this.isProcessing = false;
        this.updateCharCount();
        this.userInput.focus();
    }

    addMessage(role, content, isTyping = false) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message-row ${role}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (role === 'bot') {
            avatarDiv.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
        } else {
            avatarDiv.textContent = 'U';
        }

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (!isTyping) {
            bubble.innerHTML = content.replace(/\n/g, '<br>');
        }

        if (role === 'bot') {
            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubble);
        } else {
            msgDiv.appendChild(bubble);
            msgDiv.appendChild(avatarDiv);
        }

        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        return wrapper;
    }

    addThinkingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-row bot';
        msgDiv.innerHTML = `
            <div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="message-bubble">
                <div class="thinking-indicator">
                    <div class="thinking-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span>생각 중</span>
                </div>
            </div>
        `;
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        return wrapper;
    }

    async typeText(element, text) {
        element.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.appendChild(cursor);

        const words = text.split(/(\s+)/);
        for (let i = 0; i < words.length; i++) {
            const span = document.createElement('span');
            span.textContent = words[i];
            element.insertBefore(span, cursor);
            this.scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        }
        cursor.remove();
    }

    updateChatTitle(message) {
        const activeItem = document.querySelector(`.chat-item[data-chat-id="${this.currentChatId}"]`);
        if (activeItem) {
            const title = message.length > 20 ? message.substring(0, 20) + '...' : message;
            activeItem.querySelector('span').textContent = title;
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatScroll.scrollTop = this.chatScroll.scrollHeight;
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatGot();
});
