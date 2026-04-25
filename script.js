// 모든 DOM 요소 (null 체크 없이 바로 사용할 수 있도록)
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcomeSection = document.getElementById('welcomeSection');

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay = document.getElementById('overlay');
const newChatBtn = document.getElementById('newChatBtn');
const chatList = document.getElementById('chatList');
const clearBtn = document.getElementById('clearBtn');

const settingsBtn = document.getElementById('settingsBtn');
const settingsSidebarBtn = document.getElementById('settingsSidebarBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const darkToggle = document.getElementById('darkToggle');
const fontBtns = document.getElementById('fontBtns');
const resetBtn = document.getElementById('resetBtn');

// 상태 변수
let isProcessing = false;
let conversations = {};
let currentChatId = Date.now();
let isFirstMessage = true;

// -------------------- 유틸리티 --------------------
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// -------------------- 초기 설정 --------------------
function loadSettings() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        darkToggle.checked = true;
    }
    const size = localStorage.getItem('fontSize') || '16';
    document.documentElement.style.setProperty('--font-size', size + 'px');
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.size === size);
    });
}
loadSettings();

// -------------------- 이벤트 등록 --------------------
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

// 사이드바 열기/닫기
menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
});
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// 새 대화
newChatBtn.addEventListener('click', () => {
    saveCurrentChat();
    currentChatId = Date.now();
    resetChatArea();
    addToSidebar('새 대화');
    isFirstMessage = true;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// 대화 기록 클릭
chatList.addEventListener('click', (e) => {
    const item = e.target.closest('.chat-item');
    if (!item) return;
    const chatId = item.dataset.chatId;
    loadChat(chatId);
});

// 모두 지우기
clearBtn.addEventListener('click', () => {
    if (confirm('모든 대화를 삭제할까요?')) {
        conversations = {};
        chatList.innerHTML = '';
        resetChatArea();
        isFirstMessage = true;
        addToSidebar('새 대화');
    }
});

// 설정 모달 열기/닫기
function openSettings() {
    settingsModal.classList.add('open');
    overlay.classList.add('active');
}
function closeSettings() {
    settingsModal.classList.remove('open');
    overlay.classList.remove('active');
}
settingsBtn.addEventListener('click', openSettings);
settingsSidebarBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
overlay.addEventListener('click', () => {
    closeSettings();
    sidebar.classList.remove('open');
});

// 다크 모드
darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkToggle.checked);
    localStorage.setItem('darkMode', darkToggle.checked);
});

// 폰트 크기
fontBtns.addEventListener('click', (e) => {
    const btn = e.target.closest('.font-btn');
    if (!btn) return;
    const size = btn.dataset.size;
    document.documentElement.style.setProperty('--font-size', size + 'px');
    localStorage.setItem('fontSize', size);
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});

// 대화 초기화
resetBtn.addEventListener('click', () => {
    if (confirm('정말 모든 대화를 지울까요?')) {
        conversations = {};
        chatList.innerHTML = '';
        resetChatArea();
        isFirstMessage = true;
        addToSidebar('새 대화');
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

// -------------------- 대화 로직 --------------------
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
    scrollToBottom();

    // 로딩 표시
    const loadingElem = appendMessage('bot', '...');
    scrollToBottom();

    // 지식 베이스 응답 + 지연
    const reply = getResponse(text);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    loadingElem.remove();

    // 봇 메시지 타이핑 효과
    const botElem = appendMessage('bot', '');
    const bubble = botElem.querySelector('.bubble');
    for (let char of reply) {
        bubble.textContent += char;
        scrollToBottom();
        await new Promise(r => setTimeout(r, 15));
    }

    // 대화 기록 저장 및 사이드바 업데이트
    saveCurrentChat();
    updateSidebarItem(text);

    isProcessing = false;
    sendBtn.disabled = false;
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? '나' : 'CG';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    if (role === 'user') {
        div.appendChild(bubble);
        div.appendChild(avatar);
    } else {
        div.appendChild(avatar);
        div.appendChild(bubble);
    }

    chatArea.appendChild(div);
    return div;
}

// -------------------- 대화 관리 --------------------
function saveCurrentChat() {
    const messages = chatArea.querySelectorAll('.message');
    if (messages.length === 0) return;
    const html = chatArea.innerHTML;
    const title = getTitleFromMessages();
    conversations[currentChatId] = { title, html };
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
    // active 표시
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.toggle('active', item.dataset.chatId === chatId);
    });
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

function addToSidebar(title) {
    const item = document.createElement('div');
    item.className = 'chat-item active';
    item.dataset.chatId = currentChatId;
    item.textContent = title;
    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    chatList.prepend(item);
}

function updateSidebarItem(text) {
    const item = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
    if (item) {
        item.textContent = text.length > 20 ? text.substring(0, 20) + '...' : text;
    }
}

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
    // 새로 생긴 추천 카드에 이벤트 재등록
    document.querySelectorAll('.suggestion').forEach(card => {
        card.addEventListener('click', () => {
            userInput.value = card.dataset.query;
            sendBtn.disabled = false;
            sendMessage();
        });
    });
}

// 초기 대화 기록 하나 만들기
addToSidebar('새 대화');
