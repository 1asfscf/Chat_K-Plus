// ── DOM 요소 (모두 한 번에 가져오기) ──
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const chatList = document.getElementById('chatList');
const settingsModal = document.getElementById('settingsModal');
const darkToggle = document.getElementById('darkToggle');
const fontBtns = document.getElementById('fontBtns');
const welcomeSection = document.getElementById('welcomeSection');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const newChatBtn = document.getElementById('newChatBtn');
const clearBtn = document.getElementById('clearBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsSidebarBtn = document.getElementById('settingsSidebarBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const resetBtn = document.getElementById('resetBtn');

// ── 상태 변수 ──
let isProcessing = false;
let conversations = {};
let currentChatId = Date.now();
let isFirstMessage = true;

// ── 초기 설정 불러오기 ──
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    darkToggle.checked = true;
}
const savedSize = localStorage.getItem('fontSize') || '16';
document.documentElement.style.setProperty('--font-size', savedSize + 'px');
document.querySelectorAll('.font-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === savedSize);
});

// ── 유틸리티 함수 ──
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}
function openSettings() {
    settingsModal.classList.add('open');
    overlay.classList.add('active');
}
function closeSettings() {
    settingsModal.classList.remove('open');
    overlay.classList.remove('active');
}

// ── 사이드바 새 대화 추가 ──
function addToSidebar(title) {
    const item = document.createElement('div');
    item.className = 'chat-item active';
    item.dataset.chatId = currentChatId;
    item.textContent = title;
    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    chatList.prepend(item);
}

// ── 채팅 영역 리셋 ──
function resetChatArea() {
    chatArea.innerHTML = `
        <div class="welcome" id="welcomeSection">
            <h2>무엇을 도와드릴까요?</h2>
            <p>아래 주제를 선택하거나 자유롭게 질문해보세요</p>
            <div class="suggestions">
                <button class="suggestion" data-query="머신러닝이 뭔지 쉽게 설명해줘">🧠 머신러닝이 뭐야?</button>
                <button class="suggestion" data-query="파이썬으로 간단한 게임 만드는 법">💻 파이썬 게임 만들기</button>
                <button class="suggestion" data-query="생산성 높이는 습관 알려줘">⚡ 생산성 습관</button>
                <button class="suggestion" data-query="클린코드 작성법">✨ 클린코드 팁</button>
            </div>
        </div>
    `;
    // 추천 카드 이벤트 다시 등록
    document.querySelectorAll('.suggestion').forEach(card => {
        card.addEventListener('click', () => {
            userInput.value = card.dataset.query;
            sendBtn.disabled = false;
            sendMessage();
        });
    });
}

// ── 대화 저장/로드 ──
function saveCurrentChat() {
    const messages = chatArea.querySelectorAll('.message');
    if (messages.length === 0) return;
    const title = getTitleFromMessages();
    conversations[currentChatId] = { title, html: chatArea.innerHTML };
}

function getTitleFromMessages() {
    const firstUserBubble = chatArea.querySelector('.message.user .bubble');
    if (firstUserBubble) {
        const t = firstUserBubble.textContent.trim();
        return t.length > 20 ? t.substring(0, 20) + '...' : t;
    }
    return '새 대화';
}

function loadChat(chatId) {
    if (isProcessing) return;
    saveCurrentChat();
    currentChatId = chatId;
    const data = conversations[chatId];
    if (data) {
        chatArea.innerHTML = data.html;
        isFirstMessage = false;
    } else {
        resetChatArea();
        isFirstMessage = true;
    }
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.toggle('active', item.dataset.chatId === chatId);
    });
    closeSidebar();
}

// ── 메시지 추가 ──
function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? '나' : 'CG';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = text === '...' ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : text.replace(/\n/g, '<br>');

    if (role === 'user') {
        div.appendChild(bubble);
        div.appendChild(avatar);
    } else {
        div.appendChild(avatar);
        div.appendChild(bubble);
    }

    chatArea.appendChild(div);
    scrollToBottom();
    return div;
}

// ── 메시지 전송 ──
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isProcessing) return;
    isProcessing = true;
    sendBtn.disabled = true;
    userInput.value = '';
    userInput.style.height = 'auto';

    if (welcomeSection) welcomeSection.remove();

    // 사용자 메시지
    appendMessage('user', text);

    // 로딩 인디케이터
    const loadingElem = appendMessage('bot', '...');

    // 지식 베이스 응답 + 지연
    const reply = getResponse(text);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    loadingElem.remove();

    // 봇 메시지 (타이핑 효과)
    const botElem = appendMessage('bot', '');
    const bubble = botElem.querySelector('.bubble');
    for (let char of reply) {
        bubble.textContent += char;
        scrollToBottom();
        await new Promise(r => setTimeout(r, 15));
    }

    // 대화 저장 및 사이드바 업데이트
    saveCurrentChat();
    const activeItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
    if (activeItem) {
        activeItem.textContent = text.length > 20 ? text.substring(0, 20) + '...' : text;
    }

    isProcessing = false;
    sendBtn.disabled = false;
}

// ── 이벤트 리스너 등록 ──
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    sendBtn.disabled = userInput.value.trim() === '';
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

mobileMenuBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', () => {
    closeSidebar();
    closeSettings();
});

newChatBtn.addEventListener('click', () => {
    saveCurrentChat();
    currentChatId = Date.now();
    resetChatArea();
    addToSidebar('새 대화');
    isFirstMessage = true;
    closeSidebar();
});

chatList.addEventListener('click', (e) => {
    const item = e.target.closest('.chat-item');
    if (!item) return;
    loadChat(item.dataset.chatId);
});

clearBtn.addEventListener('click', () => {
    if (confirm('모든 대화를 삭제할까요?')) {
        conversations = {};
        chatList.innerHTML = '';
        resetChatArea();
        addToSidebar('새 대화');
        isFirstMessage = true;
    }
});

settingsBtn.addEventListener('click', openSettings);
settingsSidebarBtn.addEventListener('click', () => {
    closeSidebar();
    openSettings();
});
closeSettingsBtn.addEventListener('click', closeSettings);

darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkToggle.checked);
    localStorage.setItem('darkMode', darkToggle.checked);
});

fontBtns.addEventListener('click', (e) => {
    const btn = e.target.closest('.font-btn');
    if (!btn) return;
    const size = btn.dataset.size;
    document.documentElement.style.setProperty('--font-size', size + 'px');
    localStorage.setItem('fontSize', size);
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});

resetBtn.addEventListener('click', () => {
    if (confirm('정말 모든 대화를 지울까요?')) {
        conversations = {};
        chatList.innerHTML = '';
        resetChatArea();
        addToSidebar('새 대화');
        isFirstMessage = true;
        closeSettings();
    }
});

// 추천 카드
document.querySelectorAll('.suggestion').forEach(card => {
    card.addEventListener('click', () => {
        userInput.value = card.dataset.query;
        sendBtn.disabled = false;
        sendMessage();
    });
});

// 초기 사이드바 항목
addToSidebar('새 대화');
