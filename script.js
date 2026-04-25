class ChatGot {
    constructor() {
        this.chatScroll = document.getElementById('chatScroll');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.chatList = document.getElementById('chatList');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.charCount = document.getElementById('charCount');
        this.clearBtn = document.getElementById('clearBtn');
        
        this.currentChatId = Date.now();
        this.conversations = {};
        this.isProcessing = false;
        this.isFirstMessage = true;
        
        this.init();
    }

    init() {
        this.setupListeners();
        this.updateCharCount();
    }

    setupListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
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

        this.newChatBtn.addEventListener('click', () => this.createNewChat());
        this.menuBtn.addEventListener('click', () => this.openSidebar());
        this.sidebarCloseBtn.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        this.clearBtn.addEventListener('click', () => this.clearAllConversations());

        // 추천 카드 이벤트
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const query = card.dataset.query;
                this.userInput.value = query;
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
    }

    openSidebar() {
        this.sidebar.classList.add('mobile-open');
        this.sidebarOverlay.classList.add('active');
    }

    closeSidebar() {
        this.sidebar.classList.remove('mobile-open');
        this.sidebarOverlay.classList.remove('active');
    }

    autoResize() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 200) + 'px';
    }

    updateCharCount() {
        const len = this.userInput.value.length;
        this.charCount.textContent = `${len}/10000`;
        this.charCount.classList.toggle('visible', len > 0);
        const hasText = len > 0;
        this.sendBtn.disabled = !hasText || this.isProcessing;
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
                            <div class="suggestion-icon" style="background: #eef2ff; color: #6366f1;">
                                <i class="fa-solid fa-brain"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">머신러닝 쉽게 이해하기</span>
                                <span class="suggestion-desc">예시와 함께 설명해드려요</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="파이썬으로 데이터 정렬하는 함수 알려줘">
                            <div class="suggestion-icon" style="background: #fef3c7; color: #f59e0b;">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">파이썬 코딩 도움</span>
                                <span class="suggestion-desc">정렬 함수 예제</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="생산성을 높이는 방법이 뭐가 있을까?">
                            <div class="suggestion-icon" style="background: #fce7f3; color: #ec4899;">
                                <i class="fa-solid fa-bolt"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">생산성 향상 팁</span>
                                <span class="suggestion-desc">시간 관리 전략</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="클린 코드 작성하는 좋은 습관 알려줘">
                            <div class="suggestion-icon" style="background: #d1fae5; color: #10b981;">
                                <i class="fa-solid fa-feather"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">클린 코드 습관</span>
                                <span class="suggestion-desc">더 나은 개발을 위해</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.welcomeSection = document.getElementById('welcomeSection');
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const query = card.dataset.query;
                this.userInput.value = query;
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

        const loadingEl = this.addLoadingIndicator();
        this.scrollToBottom();

        const delay = 800 + Math.random() * 1500;
        await new Promise(resolve => setTimeout(resolve, delay));

        const result = searchKnowledgeBase(message);
        const response = result.response;

        loadingEl.remove();
        this.addMessage('bot', response);
        this.scrollToBottom();

        this.updateChatTitle(message);

        this.isProcessing = false;
        this.updateCharCount();
        this.userInput.focus();
    }

    addMessage(role, content) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message-row ${role}`;

        const avatarIcon = role === 'user'
            ? '<div class="message-avatar">U</div>'
            : '<div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>';

        const bubbleContent = content.replace(/\n/g, '<br>');
        msgDiv.innerHTML = `${avatarIcon}<div class="message-bubble">${bubbleContent}</div>`;
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        return msgDiv;
    }

    addLoadingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-row bot';
        msgDiv.id = 'loadingIndicator';
        msgDiv.innerHTML = `
            <div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="loading-indicator">
                <div class="loading-wave">
                    <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
                </div>
                <span class="loading-text">생각 중...</span>
            </div>
        `;
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        return wrapper;
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
