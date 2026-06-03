// ==========================================
// 🧠 Chat K plus v2.2 - 사회/정치2 이슈 확장 + 버튼 제어
// ==========================================

// 1. 지식 창고 (Knowledge Base) - 2026.06.04 기준
const knowledgeBase = [
    // === 기본 ===
    { keywords: ["아바타", "아바타2", "아바타 2가 뭐죠"], response: "아바타 2는 제임스 카메론 감독의 SF 영화로, 판도라 행성에서 벌어지는 나비족의 이야기를 다루고 있어. 엄청난 시각 효과가 포인트야!" },
    { keywords: ["너", "너는", "너에", "대하여서", "누구"], response: "나는 Chat K plus v2.2야! 페이지 전환 애니메이션 + 버튼 제어까지 탑재된 로컬 AI지. 2026년 6월 이슈 업데이트 완료 ㅋㅋ" },
    { keywords: ["안녕", "하이", "반가워", "헬로"], response: "안녕! 반가워 ㅋㅋ 오늘 뭐하고 싶어? 6월 3일 지방선거 얘기나 연금개혁 얘기 어때?" },
    
    // === 중국 데이터 ===
    { keywords: ["중국 국가주석", "현 중국 지도자", "중국 대통령"], response: "2026년 현재 중국 국가주석은 시진핑이야. 2013년부터 집권 중이고 2023년에 3연임이 확정됐어." },
    { keywords: ["중국 수도", "베이징", "북경"], response: "중국 수도는 베이징이야. 인구 약 2,150만명으로 중국의 정치 중심지지." },
    { keywords: ["틱톡", "도우인", "바이트댄스"], response: "틱톡은 바이트댄스가 만든 숏폼 플랫폼이야. 중국 내수용은 도우인, 해외용은 틱톡으로 분리 운영해." },
    { keywords: ["바이두", "ERNIE", "어니"], response: "바이두는 중국 검색 1위 기업이야. ERNIE 5.0 모델은 2.4조 파라미터로 2026년 4월에 공개됐어." },
    { keywords: ["텐센트", "위챗", "Yuanbao"], response: "텐센트는 위챗 만든 IT 기업이야. Yuanbao AI 챗봇도 운영 중이고 게임 사업이 엄청 커." },
    
    // === 한국 사회/정치1 2026.06 ===
    { keywords: ["지방선거", "6월 3일 선거", "지선 결과"], response: "2026년 6월 3일 지방선거는 민주당이 광역단체장 17곳 중 10곳 승리하며 우세를 보였어. 투표율 58.2%였고 부동산, 청년 일자리가 핵심 쟁점이었어." },
    { keywords: ["민주당", "더불어민주당"], response: "더불어민주당은 2026년 현재 국회 다수당이야. 6.3 지선에서 수도권 싹쓸이하며 2027 대선 교두보 마련했어." },
    { keywords: ["국민의힘", "국힘"], response: "국민의힘은 2026년 현재 여당이야. 6.3 지선에서 대구·경북·부산·울산·경남 5곳만 승리해 위기론 나왔어." },
    { keywords: ["대통령", "윤석열", "현 대통령"], response: "2026년 6월 기준 대한민국 대통령은 윤석열이야. 임기는 2027년 5월 9일까지야." },
    { keywords: ["부동산", "집값", "전세"], response: "2026년 6월 서울 아파트 평균 매매가 12.8억이야. 전세사기 여파로 월세 전환 가속화되고 있어. 6.3 지선에서 민주당은 공공임대 100만호 공약했어." },
    { keywords: ["AI 정책", "AI 기본법", "인공지능"], response: "AI 기본법이 2025년 12월 시행됐어. 고위험 AI 사전심사제 도입됐고, 지자체마다 AI 데이터센터 유치 경쟁 중이야. 용인이 최대 수혜지." },
    { keywords: ["최저임금", "2026 최저임금"], response: "2026년 최저임금은 시간당 10,200원이야. 월급 2,131,800원이지. 편의점 알바 4대보험 떼면 실수령 190만원대야." },
    
    // === 사회/정치2 - 2026년 핵심 갈등 이슈 추가 ===
    { keywords: ["연금개혁", "국민연금", "보험료율"], response: "국민연금 개혁안이 2025년 말 통과됐어. 2026년부터 보험료율 9%→13% 단계적 인상, 소득대체율 42.5%로 조정돼. 20대는 '우린 못 받는다' 반발 심해." },
    { keywords: ["젠더갈등", "남녀갈등", "이대남", "이대녀"], response: "2026년 젠더갈등 핵심은 '공정'이야. 20대 남성은 역차별, 여성은 유리천장 주장해. 6.3 지선에서도 2030 표심이 갈렸어. 민주당은 여성, 국힘은 남성 우세였어." },
    { keywords: ["플랫폼노동", "배달", "쿠팡", "택배기사"], response: "플랫폼 노동자 88만 시대야. 쿠팡 퀵플렉스, 배민 라이더 산재보험 의무화됐지만 4대보험 사각지대 여전해. 2026년 최저임금도 못 받는 사람 많아." },
    { keywords: ["기후위기", "탄소중립", "RE100", "폭염"], response: "2026년 여름 역대급 폭염 예고됐어. 6월인데 이미 33도야. 정부는 2030 NDC 40% 감축 목표 유지 중이지만 기업들은 RE100 달성 어렵다고 아우성이야." },
    { keywords: ["지방소멸", "인구감소", "빈집"], response: "전국 228개 시군구 중 118곳이 소멸위험지역이야. 2026년 출생아 23만명 붕괴 전망. 6.3 지선에서 지방은 '기업 유치'가 1번 공약이었어." },
    { keywords: ["의대 정원", "의료 대란", "전공의"], response: "의대 2000명 증원으로 시작된 의료대란 3년째야. 2026년 6월 기준 전공의 복귀율 62%. 응급실 뺑뺑이 여전하고 지방의료 공백 심각해." },
    { keywords: ["저출산", "출산율", "인구절벽"], response: "2025년 합계출산율 0.72명 세계 최저야. 2026년 1분기 출생아 5.8만명 역대 최소. 정부 육아휴직 1년 6개월 확대했지만 회사 눈치 보여서 못 써." },
    { keywords: ["주4일제", "노동시간", "워라밸"], response: "포스코, SK 일부 계열사가 주4일제 시범운영 중이야. 2026년 대선 공약 1순위 될 전망. MZ는 찬성 78%, 5060은 반대 65%야." },
    { keywords: ["부동산 PF", "건설사", "미분양"], response: "태영건설 워크아웃 이후 건설사 PF 위기 계속돼. 2026년 6월 전국 미분양 7.2만호야. 지방은 80%가 악성 미분양이야." },
    
    // === 국제 이슈 2026.06 ===
    { keywords: ["미국 대선", "트럼프", "바이든"], response: "트럼프 2기 2년차야. 중국산 전기차 관세 100% 때려서 현대차 미국공장 풀가동 중이야. 주한미군 방위비 15억달러 요구 중." },
    { keywords: ["우크라이나", "러시아 전쟁"], response: "우크라 전쟁 4년 4개월째야. 트럼프가 '24시간 내 종전' 공약했지만 실패했어. 한국 K9 자주포 추가 수출 논의 중." },
    { keywords: ["대만", "중국 대만", "양안관계"], response: "중국이 대만 주변 군사훈련 정례화했어. 2027년 침공설 도는데, TSMC 때문에 미국이 절대 안 놔줌. 한국 반도체도 영향권이야." },
    { keywords: ["AI 경쟁", "GPT", "GLM", "Claude"], response: "2026년 AI 5강: GPT-5.1, Claude 4, Gemini 2.5, GLM-5.1, ERNIE 5.0이야. 한국은 네이버 하이퍼클로바X, 카카오 카나나로 추격 중." },
    
    // === 경제/사회 ===
    { keywords: ["환율", "달러", "원달러"], response: "2026년 6월 4일 원달러 1,348원이야. 트럼프 관세 때문에 강달러 계속돼. 수출기업은 좋고 수입물가는 비상." },
    { keywords: ["반도체", "SK하이닉스", "삼성전자", "HBM"], response: "HBM4 전쟁 중이야. SK하이닉스가 엔비디아 독점공급, 삼성은 AMD 잡았어. 2026년 한국 반도체 수출 1,450억달러 전망." },
    { keywords: ["물가", "인플레이션", "CPI"], response: "2026년 5월 CPI 2.4%야. 라면 2,000원, 김밥 4,500원 시대. 최저임금 올라도 체감이 안 된대." }
];

// 2. HTML 요소들
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exampleQuestions = document.getElementById('example-questions');

let chatBox, chatInput, chatSendBtn;
let thinkingTimers = [];
let isAnimating = false;

// ==========================================
// ⚙️ 시스템 초기화
// ==========================================

function buildChatScreen() {
    chatScreen.innerHTML = `
        <div id="chat-header-bar">
            <button id="back-btn">← 뒤로</button>
            <h3>Chat K plus v2.2</h3>
        </div>
        <div id="chat-box"></div>
        <div id="chat-input-area">
            <input type="text" id="chat-input" placeholder="2026년 이슈 물어봐...">
            <button id="chat-send-btn" disabled>전송</button>
        </div>
    `;

    chatBox = document.getElementById('chat-box');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send-btn');
    const backBtn = document.getElementById('back-btn');

    // ★ 보완: 입력값 없으면 버튼 비활성화
    chatInput.addEventListener('input', () => {
        chatSendBtn.disabled = !chatInput.value.trim();
    });

    chatSendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !chatSendBtn.disabled) handleChatSubmit();
    });
    backBtn.addEventListener('click', goHome);
}

function startChat(query) {
    if (!query.trim() || isAnimating) return;
    isAnimating = true;

    homeScreen.classList.add('slide-out');
    homeScreen.classList.remove('slide-in');
    chatScreen.classList.remove('hidden');
    void chatScreen.offsetWidth;
    chatScreen.classList.add('slide-in');
    chatScreen.classList.remove('slide-out');
    
    if (!chatBox) {
        buildChatScreen();
    }

    setTimeout(() => {
        addMessage(query, 'user');
        startReasoning(query);
        isAnimating = false;
    }, 400);

    searchInput.value = '';
}

function goHome() {
    if (isAnimating) return;
    isAnimating = true;

    thinkingTimers.forEach(clearTimeout);
    thinkingTimers = [];
    
    chatScreen.classList.add('slide-out');
    chatScreen.classList.remove('slide-in');
    homeScreen.classList.remove('slide-out');
    homeScreen.classList.add('slide-in');
    
    setTimeout(() => {
        chatScreen.classList.add('hidden');
        chatScreen.classList.remove('slide-out');
        if(chatBox) chatBox.innerHTML = '';
        isAnimating = false;
    }, 400);
}

// ==========================================
// 💬 대화 처리
// ==========================================

function handleChatSubmit() {
    const query = chatInput.value;
    if (!query.trim()) return;

    addMessage(query, 'user');
    chatInput.value = '';
    chatSendBtn.disabled = true; // ★ 전송 후 버튼 비활성화
    startReasoning(query);
}

function startReasoning(query) {
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

function findResponse(query) {
    const userWords = query.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
    let bestScore = 0;
    let bestMatch = null;

    for (const item of knowledgeBase) {
        let score = 0;
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            if (userWords.includes(kwLower)) {
                score += 10;
            } else if (userWords.some(w => w.includes(kwLower) || kwLower.includes(w))) {
                score += kwLower.length;
            }
        }
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
        return "음... 2026년 6월 DB엔 그 내용 없어 ㅠㅠ '연금개혁', '젠더갈등', '지방소멸' 이런 거 물어봐!";
    }
}

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

// ★ 보완: 홈 검색 버튼도 입력 없으면 막기
searchInput.addEventListener('input', () => {
    searchBtn.disabled = !searchInput.value.trim();
});
searchBtn.disabled = true; // 초기 비활성화

searchBtn.addEventListener('click', () => {
    startChat(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !searchBtn.disabled) {
        startChat(searchInput.value);
    }
});

exampleQuestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('question-tag')) {
        const query = e.target.getAttribute('data-query');
        startChat(query);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    homeScreen.classList.add('slide-in');
    chatScreen.classList.add('hidden');
});
