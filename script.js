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

        this.currentChatId = Date.now();
        this.conversations = {};
        this.isProcessing = false;
        this.isFirstMessage = true;

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

    autoResize() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 200) + 'px';
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
        // 새 카드 이벤트 등록
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

        // 사용자 메시지
        this.addMessage('user', message);
        this.scrollToBottom();

        // 생각 중 표시 (고스트 메시지)
        const thinkingEl = this.addThinkingIndicator();
        this.scrollToBottom();

        // 지식 베이스 검색
        const responseText = searchKnowledgeBase(message);
        // 자연스러운 응답 지연
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

        // 생각 중 제거
        thinkingEl.remove();

        // AI 타이핑 효과 적용
        const botWrapper = this.addMessage('bot', '', true);
        await this.typeText(botWrapper.querySelector('.message-bubble'), responseText);

        // 대화 제목 업데이트
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

        const avatar = role === 'user'
            ? '<div class="message-avatar">U</div>'
            : '<div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (!isTyping) {
            bubble.innerHTML = content.replace(/\n/g, '<br>');
        }

        msgDiv.appendChild(role === 'bot' ? avatarToElement(avatar) : avatarToElement(avatar));
        function avatarToElement(str) {
            const t = document.createElement('div');
            t.innerHTML = str;
            return t.firstElementChild;
        }
        // 위 avatarToElement 대신 간단한 방법
        if (role === 'bot') {
            msgDiv.innerHTML = avatar;
            msgDiv.appendChild(bubble);
        } else {
            msgDiv.appendChild(bubble);
            msgDiv.innerHTML = avatar + bubble.outerHTML;
        }
        // 정리
        msgDiv.innerHTML = '';
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (role === 'bot') {
            avatarDiv.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubble);
        } else {
            avatarDiv.textContent = 'U';
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
        element.innerHTML = ''; // clear
        const words = text.split(/(\s+)/); // 공백 유지
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.appendChild(cursor);

        for (let i = 0; i < words.length; i++) {
            // 커서 앞에 텍스트 삽입
            const span = document.createElement('span');
            span.textContent = words[i];
            element.insertBefore(span, cursor);
            this.scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        }
        // 타이핑 완료 후 커서 제거
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
