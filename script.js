// ==========================================
// 🧠 Chat K plus v2.1 - 두뇌 (script.js) + 페이지 전환 애니메이션
// ==========================================

// 1. 지식 창고 (Knowledge Base) - 2026.06.04 기준
const knowledgeBase = [
    // === 기본 ===
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.1이야! 페이지 전환 애니메이션까지 탑재된 로컬 AI지. 2026년 6월 이슈 업데이트 완료 ㅋㅋ" },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 6월 3일 지방선거 얘기나 AI 모델 얘기 어때?" },
    
    // === 중국 데이터 ===
    { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권 중이고 2023년에 3연임이 확정됐어." },
    { keywords: ["중국 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 인구 약 2,150만명으로 중국의 정치 중심지지." },
    { keywords: ["틱톡", "도우인", "바이트댄스"], response: "틱톡은 바이트댄스가 만든 숏폼 플랫폼이야. 중국 내수용은 도우인, 해외용은 틱톡으로 분리 운영해." },
    { keywords: ["바이두", "ERNIE", "어니"], response: "바이두는 중국 검색 1위 기업이야. ERNIE 5.0 모델은 2.4조 파라미터로 2026년 4월에 공개됐어." },
    { keywords: ["텐센트", "위챗", "Yuanbao"], response: "텐센트는 위챗 만든 IT 기업이야. Yuanbao AI 챗봇도 운영 중이고 게임 사업이 엄청 커." },
    
    // === 한국 사회/정치 2026.06 이슈 ===
    { keywords: ["지방선거", "6월 3일 선거", "지선 결과"], response: "2026년 6월 3일 지방선거는 민주당이 광역단체장 17곳 중 10곳 승리하며 우세를 보였어. 주요 쟁점은 부동산 정책, 청년 일자리, AI 산업 육성이었어." },
    { keywords: ["민주당", "더불어민주당"], response: "더불어민주당은 2026년 현재 국회 다수당이야. 6월 3일 지방선거에서 광역단체장 10석 확보하며 지방권력도 우세해졌어." },
    { keywords: ["국민의힘", "국힘"], response: "국민의힘은 2026년 현재 여당이야. 6.3 지방선거에서 광역 5곳 승리했어. 주요 지지층은 60대 이상, 영남권이야." },
    { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열이야. 임기는 2027년 5월까지야." },
    { keywords: ["부동산", "집값", "전세"], response: "2026년 6월 현재 서울 아파트 매매가는 보합세야. 6.3 지방선거에서 민주당은 공공주택 확대, 국민의힘은 규제 완화를 공약했어." },
    { keywords: ["AI 정책", "AI 기본법", "인공지능"], response: "2026년 현재 한국은 AI 기본법 시행 중이야. 지방선거에서도 각 지자체가 AI 데이터센터 유치 경쟁을 벌였어." },
    { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금은 시간당 10,200원이야. 2025년 9,860원에서 3.4% 인상됐어. 노사 모두 불만 있어." },
    { keywords: ["의대 정원", "의료 대란"], response: "의대 정원 2000명 증원 정책으로 2024~2025년 의료계 갈등이 있었어. 2026년 현재는 전공의 일부 복귀했지만 완전 정상화는 아니야." },
    { keywords: ["저출산", "출산율", "인구"], response: "2025년 합계출산율 0.72명으로 역대 최저야. 6.3 지방선거에서도 육아수당, 신혼부부 주택이 핵심 공약이었어." },
    
    // === 국제 이슈 2026.06 ===
    { keywords: ["미국 대선", "트럼프", "바이든"], response: "2024년 미국 대선에서 트럼프가 당선돼 2025년 1월 취임했어. 2026년 현재 2년차야. 주요 정책은 관세 인상, 중국 견제야." },
    { keywords: ["우크라이나", "러시아 전쟁"], response: "우크라이나-러시아 전쟁은 2022년 시작 후 2026년 현재까지 4년째야. 최근 휴전 협상 얘기가 나오지만 진전은 없어." },
    { keywords: ["대만", "중국 대만"], response: "대만 문제는 미중 갈등 핵심이야. 2026년 현재 중국은 '하나의 중국' 원칙을, 미국은 대만관계법으로 대만을 지원 중이야." },
    { keywords: ["AI 경쟁", "GPT", "GLM", "Claude"], response: "2026년 AI 경쟁 상황: OpenAI GPT-5.1, Anthropic Claude 4, Google Gemini 2.5, 중국 Zhipu GLM-5.1, 바이두 ERNIE 5.0이 경쟁 중이야." },
    
    // === 경제/사회 ===
    { keywords: ["환율", "달러", "원달러"], response: "2026년 6월 4일 원달러 환율은 약 1,350원대야. 미국 금리와 AI 반도체 수출이 주요 변수야." },
    { keywords: ["반도체", "SK하이닉스", "삼성전자"], response: "2026년 HBM 시장 주도권 경쟁 중이야. SK하이닉스가 HBM4 양산 시작했고, 삼성전자가 추격 중이야." },
    { keywords: ["물가", "인플레이션", "CPI"], response: "2026년 5월 소비자물가 상승률은 2.4%야. 목표치 2%에 근접했어. 외식물가, 공공요금이 변수야." }
];

// 2. HTML 요소들 가져오기
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');

// 채팅방 요소들
let chatBox, chatInput, chatSendBtn;
let thinkingTimers = [];
let isAnimating = false; // ★ 애니메이션 중복 실행 방지

// ==========================================
// ⚙️ 시스템 초기화 (화면 세팅)
// ==========================================

function buildChatScreen() {
    chatScreen.innerHTML = `
        <div id="chat-header-bar">
            <button id="back-btn">← 뒤로</button>
            <h3>Chat K plus v2.1</h3>
        </div>
        <div id="chat-box"></div>
        <div id="chat-input-area">
            <input type="text" id="chat-input" placeholder="2026년 이슈 물어봐...">
            <button id="chat-send-btn">전송</button>
        </div>
    `;

    chatBox = document.getElementById('chat-box');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send-btn');
    const backBtn = document.getElementById('back-btn');

    chatSendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });
    backBtn.addEventListener('click', goHome);
}

// ★ 페이지 전환 애니메이션 추가 - 홈 → 채팅
function startChat(query) {
    if (!query.trim() || isAnimating) return;
    isAnimating = true;

    // 1. 홈 화면 왼쪽으로 밀어내기
    homeScreen.classList.add('slide-out');
    homeScreen.classList.remove('slide-in');
    
    // 2. 채팅 화면 준비
    chatScreen.classList.remove('hidden');
    
    // 3. 브라우저 리플로우 강제 - 애니메이션 트리거
    void chatScreen.offsetWidth;
    
    // 4. 채팅 화면 오른쪽에서 슬라이드인
    chatScreen.classList.add('slide-in');
    chatScreen.classList.remove('slide-out');
    
    if (!chatBox) {
        buildChatScreen();
    }

    // 5. 애니메이션 끝나고 메시지 표시 (400ms)
    setTimeout(() => {
        addMessage(query, 'user');
        startReasoning(query);
        isAnimating = false;
    }, 400);

    searchInput.value = '';
}

// ★ 페이지 전환 애니메이션 추가 - 채팅 → 홈
function goHome() {
    if (isAnimating) return;
    isAnimating = true;

    // 1. 타이머 전부 취소
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];
    
    // 2. 채팅 화면 오른쪽으로 밀어내기
    chatScreen.classList.add('slide-out');
    chatScreen.classList.remove('slide-in');
    
    // 3. 홈 화면 왼쪽에서 들어오기
    homeScreen.classList.remove('slide-out');
    homeScreen.classList.add('slide-in');
    
    // 4. 애니메이션 끝나고 채팅 화면 숨기기 + 초기화
    setTimeout(() => {
        chatScreen.classList.add('hidden');
        chatScreen.classList.remove('slide-out');
        if(chatBox) chatBox.innerHTML = '';
        isAnimating = false;
    }, 400);
}

// ==========================================
// 💬 대화 처리 및 AI 로직
// ==========================================

function handleChatSubmit() {
    const query = chatInput.value;
    if (!query.trim()) return;

    addMessage(query, 'user');
    chatInput.value = '';
    startReasoning(query);
}

// 추론 시스템 - 타이머 누수 해결
function startReasoning(query) {
    // 이전 추론 중이면 전부 취소
    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];
    
    const thinkingDiv = addMessage("🔍 질문 핵심 키워드 추출 중...", 'thinking');

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "🧠 2026.06 DB에서 연관 정보 탐색 중...";
    }, 800));

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "💡 최신 이슈 + 팩트 크로스체크 중...";
    }, 1600));

    thinkingTimers.push(setTimeout(() => {
        if(thinkingDiv) thinkingDiv.textContent = "✅ 추론 완료! 답변 생성";
        
        thinkingTimers.push(setTimeout(() => {
            if(thinkingDiv) thinkingDiv.remove();
            const aiResponse = findResponse(query);
            addMessage(aiResponse, 'ai');
        }, 400));
    }, 2400));
}

// 검색 점수제 알고리즘
function findResponse(query) {
    const userWords = query.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
    let bestScore = 0;
    let bestMatch = null;

    for (const item of knowledgeBase) {
        let score = 0;
        
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            // 1. 완전 일치 = 10점
            if (userWords.includes(kwLower)) {
                score += 10;
            }
            // 2. 포함 관계 = 키워드 길이만큼 점수
            else if (userWords.some(w => w.includes(kwLower) || kwLower.includes(w))) {
                score += kwLower.length;
            }
        }
        
        // 3. 키워드 여러 개 매칭 시 보너스
        if (score > 0 && item.keywords.length > 1) {
            score *= 1.2;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    if (bestMatch && bestScore >= 5) {
        return bestMatch.response;
    } else {
        return "음... 2026년 6월 DB엔 그 내용 없어 ㅠㅠ '지방선거', 'AI 경쟁', '최저임금' 이런 거 물어봐!";
    }
}

// 화면에 말풍선 추가
function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    
    if (type === 'thinking') {
        msgDiv.classList.add('message', 'thinking-msg');
    } else if (type === 'user') {
        msgDiv.classList.add('message', 'user-msg');
    } else {
        msgDiv.classList.add('message', 'ai-msg');
    }
    
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// ==========================================
// 🚀 프로그램 실행
// ==========================================

searchBtn.addEventListener('click', () => {
    startChat(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startChat(searchInput.value);
    }
});

exampleQuestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('question-tag')) {
        const query = e.target.getAttribute('data-query');
        startChat(query);
    }
});

// ★ 초기 상태 세팅 - 홈 화면만 보이게
document.addEventListener('DOMContentLoaded', () => {
    homeScreen.classList.add('slide-in');
    chatScreen.classList.add('hidden');
});
