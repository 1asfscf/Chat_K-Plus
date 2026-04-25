// 지식 베이스
const knowledgeBase = {
    greetings: {
        patterns: ['안녕', '하이', '헬로', 'hi', 'hello', 'hey', '반가워', 'ㅎㅇ'],
        responses: [
            '안녕하세요! Chat Got입니다. 무엇을 도와드릴까요? 😊',
            '반갑습니다! 궁금한 점이 있으시면 언제든 물어보세요.',
            'Hello! 저는 Chat Got이에요. 편하게 질문해주세요.'
        ]
    },
    identity: {
        patterns: ['누구', '너는 누구', '이름', '정체', 'who are you', '뭐야', '무엇'],
        responses: [
            '저는 Chat Got입니다! AI 어시스턴트로, 여러분의 질문에 답변하고 도움을 드리는 역할을 해요. GPT 스타일의 깔끔한 인터페이스에서 대화를 나누고 있어요.',
            'Chat Got이라고 합니다. 최신 AI 기술로 만들어진 챗봇이에요. 편하게 대화 나눠요!'
        ]
    },
    capabilities: {
        patterns: ['할 수 있어', '가능', '기능', '뭘 할 수', '능력', '도움'],
        responses: [
            '다양한 주제의 질문에 답변할 수 있어요. 코딩, 글쓰기, 아이디어 브레인스토밍, 문제 해결 등 많은 분야에서 도움을 드릴 수 있습니다. 어떤 것이 궁금하신가요?',
            '저는 정보 검색, 창의적 글쓰기, 코딩 도움, 아이디어 제안, 문제 해결 등을 도와드릴 수 있어요. 필요하신 것이 있다면 말씀해주세요!'
        ]
    },
    coding: {
        patterns: ['코드', '프로그래밍', '파이썬', '자바스크립트', 'python', 'javascript', '코딩', '개발'],
        responses: [
            '코딩 관련 질문이시군요! 구체적으로 어떤 언어나 문제에 대해 도움이 필요하신가요? 예를 들어 알고리즘, 디버깅, 코드 리뷰 등 다양한 도움을 드릴 수 있어요.',
            '프로그래밍에 관심이 있으시군요. 파이썬, 자바스크립트 등 다양한 언어에 대한 질문에 답변해드릴 수 있어요. 어떤 것이 궁금하신가요?'
        ]
    },
    writing: {
        patterns: ['글쓰기', '작문', '에세이', '글', '이메일', '작성', '문서'],
        responses: [
            '글쓰기 도움이 필요하시군요. 에세이, 이메일, 보고서 등 어떤 형식의 글을 작성하고 계신가요? 목적과 대상 독자를 알려주시면 더 적절한 도움을 드릴 수 있어요.',
            '글쓰기는 연습이 중요해요. 어떤 종류의 글을 쓰고 계신지 알려주시면 구조, 문체, 표현 등 다양한 측면에서 도움을 드리겠습니다.'
        ]
    },
    ideas: {
        patterns: ['아이디어', '브레인스토밍', '창의적', '기발한', '영감', '제안'],
        responses: [
            '창의적인 아이디어를 찾고 계시군요! 어떤 분야나 주제에 대한 아이디어가 필요하신가요? 구체적인 상황을 알려주시면 더 도움이 되는 제안을 해드릴 수 있어요.',
            '브레인스토밍을 도와드릴게요. 주제나 제약 조건을 알려주시면 다양한 각도에서 아이디어를 제안해드리겠습니다.'
        ]
    },
    default: {
        patterns: [],
        responses: [
            '흥미로운 질문이네요. 이에 대해 더 자세히 알려주실 수 있나요? 구체적인 내용을 알려주시면 더 정확한 답변을 드릴 수 있어요.',
            '좋은 질문입니다. 이 주제에 대해 더 깊이 알아보고 싶으시다면, 구체적인 측면을 말씀해주세요.',
            '이해했습니다. 이 내용에 대해 몇 가지 관점에서 생각해볼 수 있어요. 어떤 부분에 특히 관심이 있으신가요?'
        ]
    }
};

class ChatGot {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.collapseBtn = document.getElementById('collapseBtn');
        this.sidebar = document.getElementById('sidebar');
        this.chatList = document.getElementById('chatList');
        this.suggestions = document.getElementById('suggestions');
        
        this.currentChatId = Date.now();
        this.chatHistory = [];
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createNewChat();
    }

    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.userInput.addEventListener('input', () => {
            this.autoResize();
            this.updateSendButton();
        });

        this.newChatBtn.addEventListener('click', () => this.createNewChat());
        this.menuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        this.collapseBtn.addEventListener('click', () => this.toggleSidebar());

        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.userInput.value = chip.querySelector('span').textContent;
                this.updateSendButton();
                this.sendMessage();
            });
        });

        document.querySelector('.sidebar-action:first-child').addEventListener('click', () => {
            this.clearAllChats();
        });
    }

    toggleMobileSidebar() {
        this.sidebar.classList.toggle('mobile-open');
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
    }

    autoResize() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 200) + 'px';
    }

    updateSendButton() {
        const hasText = this.userInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText;
        this.sendBtn.classList.toggle('active', hasText);
    }

    createNewChat() {
        this.currentChatId = Date.now();
        this.chatHistory = [];
        
        this.chatContainer.innerHTML = `
            <div class="chat-welcome">
                <div class="logo-animation">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="url(#gradient)" stroke-width="2.5"/>
                        <path d="M22 32C22 26.477 26.477 22 32 22C37.523 22 42 26.477 42 32C42 37.523 37.523 42 32 42" stroke="url(#gradient)" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="32" cy="32" r="4" fill="url(#gradient)"/>
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64">
                                <stop offset="0%" stop-color="#10A37F"/>
                                <stop offset="100%" stop-color="#32D4A4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 class="welcome-title">How can I help you today?</h1>
            </div>
            <div class="suggestions-row" id="suggestions">
                <button class="suggestion-chip">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>Explain quantum computing in simple terms</span>
                </button>
                <button class="suggestion-chip">
                    <i class="fa-solid fa-code"></i>
                    <span>Write a Python script for data analysis</span>
                </button>
                <button class="suggestion-chip">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>Draft an email for a job application</span>
                </button>
                <button class="suggestion-chip">
                    <i class="fa-solid fa-chart-line"></i>
                    <span>Compare marketing strategies for growth</span>
                </button>
            </div>
        `;

        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.userInput.value = chip.querySelector('span').textContent;
                this.updateSendButton();
                this.sendMessage();
            });
        });

        this.addChatToList('New Chat');
    }

    addChatToList(title) {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item active';
        chatItem.innerHTML = `
            <i class="fa-solid fa-message"></i>
            <span>${title}</span>
        `;
        
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
        this.chatList.insertBefore(chatItem, this.chatList.firstChild);
    }

    clearAllChats() {
        this.chatList.innerHTML = '';
        this.createNewChat();
    }

    findResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;
            
            const matched = data.patterns.some(pattern => lowerMessage.includes(pattern));
            if (matched) {
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        const defaultResponses = knowledgeBase.default.responses;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.sendBtn.disabled = true;
        this.sendBtn.classList.remove('active');

        // 환영 메시지 숨기기
        const welcome = document.querySelector('.chat-welcome');
        const suggestions = document.getElementById('suggestions');
        if (welcome) welcome.remove();
        if (suggestions) suggestions.remove();

        // 사용자 메시지 추가
        this.addMessage('user', message);
        this.userInput.value = '';
        this.userInput.style.height = 'auto';

        // 봇 메시지 추가 (로딩)
        const botMsgDiv = this.addMessage('bot', '', true);

        // 응답 생성
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        const response = this.findResponse(message);
        
        // 봇 메시지 업데이트
        const bubble = botMsgDiv.querySelector('.message-bubble');
        bubble.innerHTML = response;
        
        this.scrollToBottom();
        this.isProcessing = false;
        this.updateSendButton();
        this.userInput.focus();
    }

    addMessage(role, content, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-row ${role}`;
        
        const avatarIcon = role === 'user' ? 'U' : 'CG';
        const avatarHTML = role === 'bot' 
            ? `<div class="message-avatar"><i class="fa-solid fa-robot"></i></div>`
            : `<div class="message-avatar">${avatarIcon}</div>`;
        
        const bubbleContent = isLoading 
            ? '<div class="typing-dots"><span></span><span></span><span></span></div>'
            : content;
        
        messageDiv.innerHTML = `
            ${role === 'bot' ? avatarHTML : ''}
            <div class="message-bubble">${bubbleContent}</div>
            ${role === 'user' ? avatarHTML : ''}
        `;
        
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatGot();
});
