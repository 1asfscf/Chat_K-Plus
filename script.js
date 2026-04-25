class ChatGot {
    constructor() {
        this.chatScroll = document.getElementById('chatScroll');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.sidebarClose = document.getElementById('sidebarClose');
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
        this.loadConversations();
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
        this.sidebarClose.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        
        this.clearBtn.addEventListener('click', () => this.clearAllConversations());
        
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
        
        this.chatScroll.innerHTML = '';
        this.chatScroll.innerHTML = `
            <div class="welcome-section" id="welcomeSection">
                <div class="welcome-icon">
                    <div class="icon-ring"></div>
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h1 class="welcome-heading">What can I help with?</h1>
                <p class="welcome-sub">Ask anything, explore ideas, or get creative</p>
                <div class="suggestions-container">
                    <div class="suggestions-grid">
                        <button class="suggestion-card" data-query="Explain how machine learning works in simple terms">
                            <div class="suggestion-icon" style="background: #eef2ff; color: #6366f1;">
                                <i class="fa-solid fa-brain"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">Explain Machine Learning</span>
                                <span class="suggestion-desc">In simple terms with examples</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="Write a Python function to sort a list of dictionaries by a specific key">
                            <div class="suggestion-icon" style="background: #fef3c7; color: #f59e0b;">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">Code a sorting function</span>
                                <span class="suggestion-desc">Python programming help</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="How can I improve my productivity and time management?">
                            <div class="suggestion-icon" style="background: #fce7f3; color: #ec4899;">
                                <i class="fa-solid fa-bolt"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">Boost productivity</span>
                                <span class="suggestion-desc">Tips and strategies</span>
                            </div>
                        </button>
                        <button class="suggestion-card" data-query="What are the best practices for writing clean, maintainable code?">
                            <div class="suggestion-icon" style="background: #d1fae5; color: #10b981;">
                                <i class="fa-solid fa-feather"></i>
                            </div>
                            <div class="suggestion-content">
                                <span class="suggestion-title">Clean code practices</span>
                                <span class="suggestion-desc">Better software development</span>
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
        
        this.addChatToSidebar('New conversation');
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
            return text.length > 30 ? text.substring(0, 30) + '...' : text;
        }
        return 'New conversation';
    }

    loadConversations() {
        // 초기 로드 - 로컬 스토리지에서 불러오기 가능
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

        // 웰컴 섹션 제거
        if (this.welcomeSection) {
            this.welcomeSection.remove();
            this.welcomeSection = null;
            this.isFirstMessage = false;
        }

        // 사용자 메시지
        this.addMessage('user', message);
        this.scrollToBottom();

        // 봇 로딩 메시지
        const loadingEl = this.addLoadingIndicator();
        this.scrollToBottom();

        // 응답 생성
        const delay = 800 + Math.random() * 1500;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const result = searchKnowledgeBase(message);
        const response = result.response;
        
        // 로딩 제거
        loadingEl.remove();
        
        // 봇 응답
        this.addMessage('bot', response);
        this.scrollToBottom();
        
        // 사이드바 타이틀 업데이트
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
        
        msgDiv.innerHTML = `
            ${avatarIcon}
            <div class="message-bubble">${bubbleContent}</div>
        `;
        
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
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
                <span class="loading-text">Thinking...</span>
            </div>
        `;
        
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        
        return wrapper;
    }

    updateChatTitle(message) {
        const activeItem = document.querySelector(`.chat-item[data-chat-id="${this.currentChatId}"]`);
        if (activeItem) {
            const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
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
