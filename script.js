class ChatApp {
    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        
        this.isProcessing = false;
        this.messageHistory = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // 메시지 전송
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 새 대화
        this.newChatBtn.addEventListener('click', () => this.startNewChat());

        // 메뉴 토글
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());

        // 추천 카드 클릭
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.messageInput.value = card.querySelector('span').textContent;
                this.sendMessage();
            });
        });
    }

    autoResizeTextarea() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    startNewChat() {
        // 대화 초기화
        this.messageHistory = [];
        this.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h2>안녕하세요! DeepSeek입니다.</h2>
                <p class="welcome-subtitle">무엇을 도와드릴까요?</p>
                
                <div class="suggestion-grid">
                    <button class="suggestion-card">
                        <i class="fas fa-lightbulb"></i>
                        <span>창의적인 아이디어 브레인스토밍</span>
                    </button>
                    <button class="suggestion-card">
                        <i class="fas fa-code"></i>
                        <span>코드 리뷰 및 디버깅</span>
                    </button>
                    <button class="suggestion-card">
                        <i class="fas fa-pen-fancy"></i>
                        <span>글쓰기 도움</span>
                    </button>
                    <button class="suggestion-card">
                        <i class="fas fa-brain"></i>
                        <span>복잡한 문제 해결</span>
                    </button>
                </div>
            </div>
        `;
        
        // 추천 카드 이벤트 재설정
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.messageInput.value = card.querySelector('span').textContent;
                this.sendMessage();
            });
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isProcessing) return;

        // 입력창 초기화
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.sendBtn.disabled = true;
        this.isProcessing = true;

        // 환영 메시지 숨기기
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.style.display = 'none';
        }

        // 사용자 메시지 추가
        this.addMessage('user', message);
        this.messageHistory.push({ role: 'user', content: message });

        // 봇 응답 추가 (로딩 상태)
        const botMessageEl = this.addMessage('bot', '', true);
        
        try {
            // API 호출 시뮬레이션
            const response = await this.simulateAPIResponse(message);
            this.updateBotMessage(botMessageEl, response);
            this.messageHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            this.updateBotMessage(botMessageEl, '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            this.isProcessing = false;
            this.sendBtn.disabled = false;
            this.messageInput.focus();
        }
    }

    addMessage(role, content, isLoading = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;
        
        const avatar = role === 'user' ? 'U' : 'DS';
        const icon = role === 'user' ? 'fa-user' : 'fa-robot';
        
        messageEl.innerHTML = `
            <div class="message-avatar">
                ${role === 'bot' ? `<i class="fas ${icon}"></i>` : avatar}
            </div>
            <div class="message-content">
                ${isLoading ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : content}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        return messageEl;
    }

    updateBotMessage(messageEl, content) {
        const contentDiv = messageEl.querySelector('.message-content');
        contentDiv.innerHTML = content;
        this.scrollToBottom();
    }

    async simulateAPIResponse(userMessage) {
        // 실제 API 응답을 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        const responses = [
            '흥미로운 질문이네요! 이에 대해 더 자세히 알려드릴 수 있습니다. 어떤 부분이 가장 궁금하신가요?',
            '좋은 질문입니다. 제가 분석해본 결과, 몇 가지 중요한 포인트가 있습니다. 함께 살펴볼까요?',
            '이해했습니다. 이 문제를 해결하기 위한 몇 가지 접근 방식을 제안해 드릴 수 있습니다.',
            '네, 물론입니다. 최신 정보를 바탕으로 최선의 답변을 드리도록 하겠습니다.'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// 타이핑 인디케이터 CSS 추가
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 4px 0;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-tertiary);
        animation: typing 1.4s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
