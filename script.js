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
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.modalClose = document.getElementById('modalClose');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.themeToggle = document.getElementById('themeToggle');
        this.exportBtn = document.getElementById('exportBtn');
        this.attachBtn = document.getElementById('attachBtn');
        this.fileInput = document.getElementById('fileInput');
        this.userName = document.getElementById('userName');
        this.userCard = document.getElementById('userCard');
        this.hljsTheme = document.getElementById('hljs-theme');
        
        this.currentChatId = Date.now();
        this.conversations = {};
        this.isProcessing = false;
        this.isFirstMessage = true;
        this.context = new ConversationContext();
        this.settings = this.loadSettings();
        this.typingSpeed = 35;
        
        this.init();
    }

    init() {
        this.setupListeners();
        this.applySettings();
        this.updateCharCount();
        this.loadConversations();
        
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false
            });
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('chatgot_settings');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('설정 로드 실패:', e);
            }
        }
        return {
            userName: '',
            theme: 'light',
            typingSpeed: 35
        };
    }

    saveSettings() {
        localStorage.setItem('chatgot_settings', JSON.stringify(this.settings));
    }

    applySettings() {
        if (this.settings.userName) {
            this.userName.textContent = this.settings.userName;
        }
        
        this.applyTheme(this.settings.theme);
        
        this.typingSpeed = this.settings.typingSpeed || 35;
    }

    applyTheme(theme) {
        const body = document.body;
        const icon = this.themeToggle.querySelector('i');
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fa-solid fa-sun';
            if (this.hljsTheme) this.hljsTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
        } else {
            body.removeAttribute('data-theme');
            if (icon) icon.className = 'fa-solid fa-moon';
            if (this.hljsTheme) this.hljsTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
        }
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

        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.modalClose.addEventListener('click', () => this.closeSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettingsFromModal());

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.exportBtn.addEventListener('click', () => this.exportConversation());
        this.attachBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        this.setupSuggestionCards();

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewChat();
            }
            if (e.key === 'Escape') {
                this.closeSettings();
                this.closeSidebar();
            }
        });

        this.userCard.addEventListener('click', () => this.openSettings());
    }

    setupSuggestionCards() {
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const query = card.dataset.query;
                this.userInput.value = query;
                this.updateCharCount();
                this.sendMessage();
            });
        });
    }

    openSettings() {
        const nameInput = document.getElementById('settingUserName');
        const speedInput = document.getElementById('typingSpeed');
        const speedValue = document.getElementById('speedValue');
        
        if (nameInput) nameInput.value = this.settings.userName || '';
        if (speedInput) {
            speedInput.value = this.settings.typingSpeed || 35;
            if (speedValue) speedValue.textContent = this.getSpeedLabel(speedInput.value);
        }
        
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
        });
        
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });
        
        if (speedInput) {
            speedInput.oninput = () => {
                if (speedValue) speedValue.textContent = this.getSpeedLabel(speedInput.value);
            };
        }
        
        this.settingsModal.classList.add('active');
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
    }

    saveSettingsFromModal() {
        const nameInput = document.getElementById('settingUserName');
        const speedInput = document.getElementById('typingSpeed');
        const activeTheme = document.querySelector('.theme-option.active');
        
        this.settings.userName = nameInput ? nameInput.value.trim() : '';
        this.settings.typingSpeed = speedInput ? parseInt(speedInput.value) : 35;
        this.settings.theme = activeTheme ? activeTheme.dataset.theme : 'light';
        
        this.saveSettings();
        this.applySettings();
        this.closeSettings();
    }

    getSpeedLabel(value) {
        const v = parseInt(value);
        if (v <= 20) return '빠름';
        if (v <= 40) return '보통';
        if (v <= 60) return '느림';
        return '매우 느림';
    }

    toggleTheme() {
        const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.settings.theme = next;
        this.applyTheme(next);
        this.saveSettings();
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
        this.charCount.textContent = len + '/10000';
        this.charCount.classList.toggle('visible', len > 0);
        const hasText = len > 0;
        this.sendBtn.disabled = !hasText || this.isProcessing;
    }

    createNewChat() {
        if (this.isProcessing) return;
        this.saveCurrentConversation();
        this.currentChatId = Date.now();
        this.isFirstMessage = true;
        this.context = new ConversationContext();

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
        this.setupSuggestionCards();
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
        item.innerHTML = '<i class="fa-solid fa-message"></i><span>' + this.escapeHtml(title) + '</span>';
        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
        this.chatList.insertBefore(item, this.chatList.firstChild);
        item.addEventListener('click', () => this.loadConversation(this.currentChatId));
    }

    saveCurrentConversation() {
        const messages = this.chatScroll.querySelectorAll('.message-row');
        if (messages.length > 0) {
            this.conversations[this.currentChatId] = {
                title: this.getConversationTitle(),
                html: this.chatScroll.innerHTML,
                context: {
                    lastCategory: this.context.lastCategory,
                    messageCount: this.context.messageCount,
                    history: this.context.history
                }
            };
            this.saveToLocalStorage();
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
            
            if (this.conversations[chatId].context) {
                this.context.lastCategory = this.conversations[chatId].context.lastCategory;
                this.context.messageCount = this.conversations[chatId].context.messageCount;
                this.context.history = this.conversations[chatId].context.history || [];
            }
            
            this.chatScroll.querySelectorAll('pre code').forEach(block => {
                if (typeof hljs !== 'undefined') hljs.highlightElement(block);
            });
        }
        
        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
        const activeItem = document.querySelector('.chat-item[data-chat-id="' + chatId + '"]');
        if (activeItem) activeItem.classList.add('active');
        this.closeSidebar();
    }

    clearAllConversations() {
        if (!confirm('모든 대화를 삭제하시겠습니까?')) return;
        this.conversations = {};
        localStorage.removeItem('chatgot_conversations');
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

        const userName = this.settings.userName || 'U';
        this.addMessage('user', message, userName);
        this.context.addMessage('user', message);
        this.scrollToBottom();

        const loadingEl = this.addLoadingIndicator();
        this.scrollToBottom();

        const delay = 300 + Math.random() * 400;
        await new Promise(resolve => setTimeout(resolve, delay));

        const result = searchKnowledgeBase(message, this.context);
        this.context.addMessage('bot', result.response, result.category);

        loadingEl.remove();
        await this.addMessageWithTyping('bot', result.response);

        this.updateChatTitle(message);
        this.saveCurrentConversation();

        this.isProcessing = false;
        this.updateCharCount();
        this.userInput.focus();
    }

    addMessage(role, content, userName) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-row ' + role;

        const avatarIcon = role === 'user'
            ? '<div class="message-avatar">' + this.escapeHtml((userName || 'U').charAt(0).toUpperCase()) + '</div>'
            : '<div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (role === 'bot' && typeof marked !== 'undefined') {
            bubble.innerHTML = this.renderMarkdown(content);
        } else {
            bubble.textContent = content;
        }

        msgDiv.innerHTML = avatarIcon;
        msgDiv.appendChild(bubble);
        
        if (role === 'bot') {
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'message-action-btn';
            copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> 복사';
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(content);
            });
            actions.appendChild(copyBtn);
            msgDiv.appendChild(actions);
        }
        
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        
        if (role === 'bot') {
            wrapper.querySelectorAll('pre code').forEach(block => {
                if (typeof hljs !== 'undefined') hljs.highlightElement(block);
            });
            this.wrapCodeBlocks(wrapper);
        }
        
        return msgDiv;
    }

    async addMessageWithTyping(role, content) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-row ' + role;

        const avatarIcon = '<div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>';
        msgDiv.innerHTML = avatarIcon;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        msgDiv.appendChild(bubble);
        
        const actions = document.createElement('div');
        actions.className = 'message-actions';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'message-action-btn';
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> 복사';
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard(content);
        });
        actions.appendChild(copyBtn);
        msgDiv.appendChild(actions);
        
        wrapper.appendChild(msgDiv);
        this.chatScroll.appendChild(wrapper);
        this.scrollToBottom();

        const plainText = content.replace(/[#*`_\[\]()|>-]/g, '');
        const chars = plainText.split('');
        
        let currentText = '';
        for (let i = 0; i < chars.length; i++) {
            currentText += chars[i];
            bubble.textContent = currentText;
            this.scrollToBottom();
            await new Promise(r => setTimeout(r, this.typingSpeed));
        }

        if (typeof marked !== 'undefined') {
            bubble.innerHTML = this.renderMarkdown(content);
        }
        this.chatScroll.querySelectorAll('pre code').forEach(block => {
            if (typeof hljs !== 'undefined') hljs.highlightElement(block);
        });
        this.wrapCodeBlocks(wrapper);
        this.scrollToBottom();
    }

    renderMarkdown(text) {
        if (typeof marked === 'undefined') return this.escapeHtml(text);
        
        let html = marked.parse(text);
        
        const div = document.createElement('div');
        div.innerHTML = html;
        
        div.querySelectorAll('a').forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
        
        return div.innerHTML;
    }

    wrapCodeBlocks(container) {
        container.querySelectorAll('pre').forEach(pre => {
            if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = '복사';
            copyBtn.addEventListener('click', () => {
                const code = pre.querySelector('code') || pre;
                this.copyToClipboard(code.textContent);
                copyBtn.textContent = '복사됨!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '복사';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(copyBtn);
        });
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
        const activeItem = document.querySelector('.chat-item[data-chat-id="' + this.currentChatId + '"]');
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    exportConversation() {
        const messages = [];
        this.chatScroll.querySelectorAll('.message-row').forEach(row => {
            const isUser = row.classList.contains('user');
            const bubble = row.querySelector('.message-bubble');
            if (bubble) {
                messages.push({
                    role: isUser ? 'user' : 'assistant',
                    content: bubble.textContent
                });
            }
        });

        if (messages.length === 0) {
            alert('내보낼 대화가 없습니다.');
            return;
        }

        const text = messages.map(function(m) {
            return (m.role === 'user' ? '사용자' : 'Chat Got') + ': ' + m.content;
        }).join('\n\n');
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatgot-conversation-' + new Date().toISOString().slice(0,10) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            this.userInput.value = '[파일: ' + file.name + ']\n' + content.substring(0, 500) + (content.length > 500 ? '...' : '');
            this.updateCharCount();
            this.autoResize();
        };
        
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
        
        e.target.value = '';
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('chatgot_conversations', JSON.stringify(this.conversations));
        } catch (e) {
            console.warn('localStorage 저장 실패:', e);
        }
    }

    loadConversations() {
        try {
            const saved = localStorage.getItem('chatgot_conversations');
            if (saved) {
                this.conversations = JSON.parse(saved);
                for (const chatId in this.conversations) {
                    const item = document.createElement('div');
                    item.className = 'chat-item';
                    item.dataset.chatId = chatId;
                    item.innerHTML = '<i class="fa-solid fa-message"></i><span>' + this.escapeHtml(this.conversations[chatId].title) + '</span>';
                    this.chatList.appendChild(item);
                    item.addEventListener('click', () => this.loadConversation(chatId));
                }
            }
        } catch (e) {
            console.warn('localStorage 로드 실패:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatGot();
});
