// ===== Chat K-Plus 상태 관리 =====
let currentModel = 'v3';
let conversationHistory = [];
let isFirstMessage = true;
let reasoningMode = false;
let lastChartData = null;
let lastTableData = null;
let lastResponseType = null;
let waitingForChartTopic = false;

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    updateInputState();
    document.getElementById('userInput').focus();
    loadTheme();
    loadAutoSaveSetting();
    loadConversation();
    checkOnboarding();
});

// ===== 추론 모드 토글 =====
function toggleReasoning() {
    reasoningMode = !reasoningMode;
    const btn = document.getElementById('reasoningBtn');
    const inputBox = document.getElementById('inputBox');
    const sendBtn = document.getElementById('sendBtn');
    const textarea = document.getElementById('userInput');
    
    if (reasoningMode) {
        btn.classList.add('active');
        inputBox.classList.add('reasoning-active');
        sendBtn.classList.add('reasoning-mode');
        textarea.placeholder = '추론 모드 활성화 - 깊이 있는 답변을 생성합니다...';
    } else {
        btn.classList.remove('active');
        inputBox.classList.remove('reasoning-active');
        sendBtn.classList.remove('reasoning-mode');
        textarea.placeholder = '무엇이든 물어보세요...';
    }
    textarea.focus();
}

// ===== 모델 전환 =====
function switchModel(version, element) {
    currentModel = version;
    lastChartData = null; lastTableData = null; lastResponseType = null; waitingForChartTopic = false;
    document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    const modelNames = { 'v1': 'Chat K-Plus Basic v1.0', 'v2': 'Chat K-Plus Pro v2.0', 'v3': 'Chat K-Plus Ultra v3.0' };
    document.getElementById('currentModelName').textContent = modelNames[version];
    document.getElementById('topModelName').textContent = modelNames[version];
    updateSuggestionChips();
}

// ===== 제안 칩 =====
function updateSuggestionChips() {
    const grid = document.getElementById('suggestionsGrid');
    const suggestions = {
        'v1': [
            { icon: '🔬', text: '과학 설명해줘', query: '과학이 뭐야?' },
            { icon: '📚', text: '효과적인 공부법', query: '공부 잘하는 법' },
            { icon: '💻', text: '컴퓨터가 뭐야?', query: '컴퓨터가 뭐야?' },
            { icon: '🌍', text: '중력이 뭐야?', query: '중력이 뭐야?' }
        ],
        'v2': [
            { icon: '🪐', text: '태양계 행성 표', query: '태양계 행성 표 보여줘' },
            { icon: '💪', text: '운동 칼로리 그래프', query: '운동 칼로리 그래프 보여줘' },
            { icon: '📊', text: '그래프 그려줘', query: '그래프 그려줘' },
            { icon: '🔬', text: '과학 설명해줘', query: '과학이 뭐야?' }
        ],
        'v3': [
            { icon: '💙', text: '위로가 필요해', query: '힘들어 위로해줘' },
            { icon: '🪐', text: '태양계 행성 표', query: '태양계 행성 표' },
            { icon: '📊', text: '운동 칼로리 그래프', query: '운동 칼로리 그래프' },
            { icon: '🚗', text: '또봇 정보', query: '또봇 정보 알려줘' }
        ]
    };
    const chips = suggestions[currentModel] || suggestions['v3'];
    grid.innerHTML = chips.map(c => `<button class="suggestion-chip" onclick="sendMessage('${escapeHtml(c.query)}')"><span class="chip-icon">${c.icon}</span>${c.text}</button>`).join('');
}

// ===== 지식 베이스 검색 =====
function searchKnowledgeBase(userInput) {
    let response = null, found = false;
    switch(currentModel) {
        case 'v1': response = window.getResponseV1(userInput); break;
        case 'v2': response = window.getResponseV2(userInput); break;
        case 'v3': response = window.getResponseV3(userInput); break;
        default: response = window.getResponseV3(userInput);
    }
    if (currentModel === 'v2' && !response.chart && window.parseChartDataV2) {
        const cc = window.parseChartDataV2(userInput);
        if (cc) { response.chart = { type: 'bar', data: cc }; response.reply = '📊 입력하신 데이터로 그래프를 생성했습니다.'; lastChartData = cc; lastResponseType = 'chart'; found = true; return { response, found }; }
    }
    if (currentModel === 'v3' && !response.chart && window.parseChartDataV3) {
        const cc = window.parseChartDataV3(userInput);
        if (cc) { response.chart = { type: 'bar', data: cc }; response.reply = '📊 입력하신 데이터로 그래프를 생성했습니다.'; lastChartData = cc; lastResponseType = 'chart'; found = true; return { response, found }; }
    }
    if (response.chart && response.chart.data) { lastChartData = response.chart.data; lastResponseType = 'chart'; }
    if (response.table && response.table.rows) { lastTableData = response.table; lastResponseType = 'table'; }
    const defaultPatterns = ['아직 이 질문에 대한 데이터가 없어요', '아직 이 질문에 대한 확실한 데이터가 없어요'];
    found = !defaultPatterns.some(p => response.reply.includes(p));
    return { response, found };
}

// ===== 감지 함수들 =====
function isChartRequest(input) { return ['그래프', '차트', '그래프로', '차트로', '그래프 그려', '그래프 만들어', '그래프 보여', '시각화'].some(p => input.toLowerCase().includes(p)); }
function isNewChartRequest(input) { return ['다른 데이터', '다른 걸로', '다른거로', '다른 주제', '새로운 데이터', '바꿔서', '다른 그래프', '새 그래프'].some(p => input.toLowerCase().includes(p)); }
function isFollowUpQuestion(input) { return ['더 자세히', '자세히 설명', '더 설명', '상세히', '구체적으로', '더 알려줘', '더 말해줘', '부연 설명', '추가 설명', '그게 무슨 뜻', '왜 그런거', '이유가 뭐', '어떻게', '그래서', '그럼', '왜'].some(p => input.toLowerCase().includes(p)); }
function isTableRequest(input) { return ['표로', '표 보여', '표 나타내', '표 생성', '테이블로', '표 만들어', '표 정리'].some(p => input.toLowerCase().includes(p)); }

// ===== 그래프 데이터 추출 =====
function extractChartDataFromKnowledge(userInput) {
    const q = userInput.toLowerCase();
    if (q.includes('도라에몽') && (q.includes('주인공') || q.includes('캐릭터') || q.includes('등장인물')))
        return { labels: ['도라에몽', '노진구', '신이슬', '왕비실', '만퉁퉁'], values: [98, 72, 88, 65, 60], title: '도라에몽 캐릭터 인기도', description: '도라에몽 주요 캐릭터들의 인기도입니다.' };
    if (q.includes('도라에몽') && (q.includes('비밀도구') || q.includes('도구') || q.includes('아이템')))
        return { labels: ['어디로든 문', '대나무\n헬리콥터', '타임머신', '4차원 주머니', '투명 망토'], values: [95, 90, 88, 85, 75], title: '도라에몽 인기 비밀도구', description: '도라에몽의 가장 인기 있는 비밀도구들입니다.' };
    if (q.includes('또봇') && (q.includes('주인공') || q.includes('파일럿') || q.includes('캐릭터') || q.includes('등장인물')))
        return { labels: ['또봇 X\n(차하나)', '또봇 Y\n(차두리)', '또봇 Z\n(권세모)', '또봇 W', '또봇 C', '또봇 D'], values: [95, 88, 92, 78, 85, 80], title: '또봇 주인공 인기도', description: '또봇 시리즈 주요 파일럿들의 종합 인기도 점수입니다.' };
    if (q.includes('또봇') && (q.includes('힘') || q.includes('능력') || q.includes('파워') || q.includes('전투력')))
        return { labels: ['또봇 X\n(차하나)', '또봇 Y\n(차두리)', '또봇 Z\n(권세모)', '또봇 W', '또봇 C', '또봇 D'], values: [90, 75, 95, 70, 85, 92], title: '또봇 전투력 비교', description: '또봇 로봇들의 전투력 종합 평가입니다.' };
    if (q.includes('포켓몬') && (q.includes('주인공') || q.includes('캐릭터') || q.includes('스타팅')))
        return { labels: ['피카츄', '이상해씨', '파이리', '꼬부기', '리자몽', '뮤츠'], values: [100, 75, 82, 80, 95, 88], title: '포켓몬 인기도', description: '대표 포켓몬들의 인기도입니다.' };
    if (q.includes('원피스') && (q.includes('주인공') || q.includes('캐릭터') || q.includes('밀짚모자')))
        return { labels: ['루피', '조로', '나미', '상디', '우솝', '쵸파'], values: [98, 95, 82, 88, 70, 92], title: '원피스 밀짚모자 일당 인기도', description: '밀짚모자 해적단 캐릭터 인기도입니다.' };
    if ((q.includes('애니') || q.includes('애니메이션')) && (q.includes('비교') || q.includes('순위') || q.includes('인기')))
        return { labels: ['도라에몽', '포켓몬', '원피스', '나루토', '짱구', '또봇'], values: [95, 92, 98, 90, 85, 80], title: '애니메이션 인기 순위', description: 'Chat K-Plus 지식베이스 기준 애니메이션 인기도입니다.' };
    if (q.includes('공부') && (q.includes('그래프') || q.includes('데이터') || q.includes('비교') || q.includes('효과')))
        return { labels: ['능동적 회상', '간격 반복', '파인만 테크닉', '뽀모도로', '마인드맵', '일반 암기'], values: [90, 85, 80, 75, 70, 40], title: '공부법 효과 비교', description: '과학적으로 검증된 공부법들의 효과성 비교입니다.' };
    if (q.includes('운동') && (q.includes('그래프') || q.includes('비교')))
        return { labels: ['걷기', '조깅', '자전거', '수영', '줄넘기', '요가'], values: [150, 300, 250, 400, 450, 120], title: '운동별 칼로리 소모량 (30분)', description: '60kg 성인 기준 30분 운동 시 칼로리 소모량입니다.' };
    if ((q.includes('프로그래밍') || q.includes('코딩') || q.includes('언어')) && (q.includes('인기') || q.includes('순위') || q.includes('비교')))
        return { labels: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript', 'Go'], values: [95, 90, 80, 70, 75, 65], title: '프로그래밍 언어 인기 순위', description: '2024년 기준 프로그래밍 언어 종합 인기도입니다.' };
    if (q.includes('과일') || q.includes('음식'))
        return { labels: ['사과', '바나나', '오렌지', '포도', '딸기', '수박'], values: [85, 70, 90, 75, 95, 60], title: '과일 선호도 조사', description: '가상의 과일 선호도 데이터입니다.' };
    return null;
}

// ===== 차트 → 테이블 =====
function chartDataToTable(chartData) { return { headers: ['항목', '값'], rows: chartData.labels.map((l, i) => [l, String(chartData.values[i])]) }; }

// ===== 표 → 그래프 =====
function convertTableToChart(tableData) {
    if (!tableData || !tableData.headers || !tableData.rows) return null;
    if (tableData.headers[0] === '구분' && tableData.headers.length >= 3) {
        const names = tableData.headers.slice(1), labels = [];
        if (tableData.rows[0] && tableData.rows[0][0] === '파일럿 (본명)') {
            const pilotInfo = tableData.rows[0].slice(1);
            names.forEach((name, i) => labels.push(pilotInfo[i] ? name + '\n(' + pilotInfo[i].split(' ')[0] + ')' : name));
        } else labels.push(...names);
        return { labels, values: labels.map((_, i) => [95, 88, 92, 78, 85, 80][i] || 70) };
    }
    if (tableData.headers[0] === '캐릭터' && tableData.headers.length >= 2)
        return { labels: tableData.rows.map(r => r[0]), values: [98, 72, 88, 65, 60] };
    if (tableData.rows.length >= 2) {
        const labels = tableData.rows.map(r => r[0]);
        const values = tableData.rows.map((r, i) => { const v = parseFloat(r[1]); return isNaN(v) ? 50 + i * 5 : v; });
        return { labels, values };
    }
    return null;
}

// ===== 응답 생성 함수들 =====
function getChartTopicRequestReply() {
    return { reply: '📊 **그래프를 새로 그려드릴게요!**\n\n어떤 주제로 그래프를 만들까요?\n\n**예시 요청:**\n• "도라에몽 주인공들로 그래프"\n• "또봇 주인공들로 그래프"\n• "공부법 효과 비교 그래프"\n• "애니메이션 인기 비교"\n• "사과 7, 바나나 5, 오렌지 9"\n\n원하는 주제를 말씀해주세요! 😊', table: null, chart: null, suggest: ['도라에몽 주인공 그래프', '또봇 주인공 그래프', '공부법 효과 비교', '애니메이션 인기 비교'] };
}
function getChartNotAvailableReply(userInput) {
    return { reply: `⚠️ **그래프를 생성할 수 없습니다**\n\n"${userInput}" 주제에 대한 데이터가 없어요.\n\n**가능한 주제:**\n• 도라에몽/또봇/포켓몬/원피스 캐릭터\n• 공부법 효과 비교\n• 운동 칼로리 비교\n• 프로그래밍 언어 순위\n• 애니메이션 인기 비교\n• 직접 입력 (예: "사과 5, 바나나 3")`, table: null, chart: null, suggest: ['도라에몽 주인공 그래프', '또봇 주인공 그래프', '애니메이션 인기 비교', '사과 5, 바나나 3, 오렌지 7'] };
}
function getReasoningAdviceReply() {
    return { reply: '💡 **추론 모드가 꺼져 있습니다**\n\n심층 분석이 필요하시면 입력창 오른쪽의 🧠 **추론 버튼**을 클릭해서 추론 모드를 켜주세요!', table: null, chart: null, suggest: ['추론 모드 켜는 방법', '추론 모드로 뭐가 달라져?'] };
}
function getTableFromChartReply(chartData) {
    const table = chartDataToTable(chartData);
    let reply = '📋 **그래프 데이터를 표로 변환했습니다!**\n\n';
    reply += `총 ${chartData.labels.length}개 항목\n• 최대: ${Math.max(...chartData.values)}\n• 최소: ${Math.min(...chartData.values)}\n• 평균: ${Math.round(chartData.values.reduce((a,b)=>a+b,0)/chartData.values.length)}`;
    return { reply, table, chart: null, suggest: ['더 자세히 설명해줘', '다른 데이터로 그래프 그려줘', '다시 그래프로 보여줘'] };
}

// ===== 메시지 전송 =====
function sendMessage(predefinedText) {
    const input = document.getElementById('userInput');
    const text = predefinedText || input.value.trim();
    if (!text) return;
    if (isFirstMessage) { document.getElementById('welcomeScreen').style.display = 'none'; document.getElementById('messagesContainer').classList.add('active'); isFirstMessage = false; }
    addMessage('user', text);
    if (!predefinedText) { input.value = ''; input.style.height = 'auto'; updateInputState(); }
    const q = text.toLowerCase();

    // CASE 1: 추론 OFF + 후속 질문
    if (!reasoningMode && isFollowUpQuestion(text) && (lastChartData || lastTableData)) {
        setTimeout(() => { addMessage('bot', getReasoningAdviceReply().reply, null, null, getReasoningAdviceReply().suggest); saveConversation(); updateInputState(); }, 500);
        scrollToBottom(); return;
    }
    // CASE 2: 새로운 그래프 요청
    if (isNewChartRequest(text) && isChartRequest(text)) {
        waitingForChartTopic = true;
        setTimeout(() => { const r = getChartTopicRequestReply(); addMessage('bot', r.reply, null, null, r.suggest); saveConversation(); updateInputState(); }, 500);
        scrollToBottom(); return;
    }
    // CASE 3: 그래프 주제 대기 + 요청
    if (waitingForChartTopic && isChartRequest(text)) {
        waitingForChartTopic = false;
        const extracted = extractChartDataFromKnowledge(text);
        if (extracted) {
            lastChartData = { labels: extracted.labels, values: extracted.values }; lastResponseType = 'chart';
            if (reasoningMode) {
                const steps = [{ icon: 'search', iconText: '🔍', title: '주제 분석', desc: `"${text}" 파악` }, { icon: 'analyze', iconText: '📊', title: '데이터 매칭', desc: `"${extracted.title}" 발견` }, { icon: 'result', iconText: '✅', title: '완료', desc: `${extracted.labels.length}개 항목` }];
                const lid = addThinkingMessage(steps);
                setTimeout(() => { removeLoadingMessage(lid); addMessage('bot', `📊 **${extracted.title}**\n\n${extracted.description}`, null, { type: 'bar', data: lastChartData }, ['더 자세히', '표로', '다른 그래프'], steps, true); saveConversation(); updateInputState(); }, 1500);
            } else { addMessage('bot', `📊 **${extracted.title}**\n\n${extracted.description}`, null, { type: 'bar', data: lastChartData }, ['더 자세히', '표로', '다른 그래프']); saveConversation(); updateInputState(); }
        } else {
            if (reasoningMode) {
                const steps = [{ icon: 'search', iconText: '🔍', title: '검색', desc: '데이터 검색 중...' }, { icon: 'warning-step', iconText: '⚠️', title: '없음', desc: '생성 불가' }];
                const lid = addThinkingMessage(steps);
                setTimeout(() => { removeLoadingMessage(lid); const r = getChartNotAvailableReply(text); addMessage('bot', r.reply, null, null, r.suggest, steps, false); saveConversation(); updateInputState(); }, 1500);
            } else { const r = getChartNotAvailableReply(text); addMessage('bot', r.reply, null, null, r.suggest); saveConversation(); updateInputState(); }
        }
        scrollToBottom(); return;
    }
    if (waitingForChartTopic) { waitingForChartTopic = false; }
    // CASE 4: 추론 ON + 그래프 + 표 있음
    if (reasoningMode && isChartRequest(text) && !isNewChartRequest(text) && lastTableData && !lastChartData) {
        const cft = convertTableToChart(lastTableData);
        if (cft) { lastChartData = cft; lastResponseType = 'chart';
            const steps = [{ icon: 'analyze', iconText: '🔄', title: '변환', desc: '표→그래프' }, { icon: 'search', iconText: '📋', title: '추출', desc: '데이터 추출' }, { icon: 'result', iconText: '✅', title: '완료', desc: '그래프 생성' }];
            const lid = addThinkingMessage(steps);
            setTimeout(() => { removeLoadingMessage(lid); addMessage('bot', '📊 **표→그래프 변환 완료!**', null, { type: 'bar', data: cft }, ['더 자세히', '표로', '다른 그래프'], steps, true); saveConversation(); updateInputState(); }, 1500);
            scrollToBottom(); return;
        }
    }
    // CASE 5: 추론 OFF + 그래프 + 표 있음
    if (!reasoningMode && isChartRequest(text) && !isNewChartRequest(text) && lastTableData && !lastChartData) {
        setTimeout(() => { addMessage('bot', getReasoningAdviceReply().reply, null, null, getReasoningAdviceReply().suggest); saveConversation(); updateInputState(); }, 500);
        scrollToBottom(); return;
    }
    // CASE 6: 추론 ON + 표 + 차트 있음
    if (reasoningMode && isTableRequest(text) && lastChartData) {
        const steps = [{ icon: 'analyze', iconText: '🔄', title: '변환', desc: '그래프→표' }, { icon: 'search', iconText: '📊', title: '로드', desc: `${lastChartData.labels.length}개` }, { icon: 'result', iconText: '✅', title: '완료', desc: '표 생성' }];
        const lid = addThinkingMessage(steps);
        setTimeout(() => { removeLoadingMessage(lid); const r = getTableFromChartReply(lastChartData); lastTableData = r.table; lastResponseType = 'table'; addMessage('bot', r.reply, r.table, null, r.suggest, steps, true); saveConversation(); updateInputState(); }, 1500);
        scrollToBottom(); return;
    }
    // CASE 7: 추론 OFF + 표 + 차트 있음
    if (!reasoningMode && isTableRequest(text) && lastChartData) {
        setTimeout(() => { const r = getTableFromChartReply(lastChartData); lastTableData = r.table; lastResponseType = 'table'; addMessage('bot', r.reply, r.table, null, r.suggest); saveConversation(); updateInputState(); }, 500);
        scrollToBottom(); return;
    }
    // CASE 8: 추론 ON + 후속 질문 + 데이터 있음
    if (reasoningMode && isFollowUpQuestion(text) && (lastChartData || lastTableData)) {
        if (lastChartData) {
            const steps = generateChartDeepThinkingSteps(text, lastChartData); const lid = addThinkingMessage(steps);
            setTimeout(() => { removeLoadingMessage(lid); addMessage('bot', generateChartDeepAnalysis(lastChartData), null, null, ['표로', '다른 그래프', '더 자세히'], steps, true); saveConversation(); updateInputState(); }, 3000);
        } else if (lastTableData) {
            const steps = [{ icon: 'analyze', iconText: '🧠', title: '분석', desc: '표 심층 분석' }, { icon: 'search', iconText: '📋', title: '검토', desc: `${lastTableData.rows.length}개 행` }, { icon: 'analyze', iconText: '🔗', title: '맥락', desc: '방향 결정' }, { icon: 'result', iconText: '✅', title: '완료', desc: '분석 제공' }];
            const lid = addThinkingMessage(steps);
            setTimeout(() => { removeLoadingMessage(lid); addMessage('bot', generateTableDeepAnalysis(lastTableData), null, null, ['그래프로', '더 자세히'], steps, true); saveConversation(); updateInputState(); }, 3000);
        }
        scrollToBottom(); return;
    }
    // CASE 9: 추론 ON 일반
    if (reasoningMode) {
        const searchResult = searchKnowledgeBase(text); const steps = generateThinkingSteps(text, searchResult.found); const lid = addThinkingMessage(steps);
        setTimeout(() => { removeLoadingMessage(lid); let finalResponse;
            if (searchResult.found) { finalResponse = expandReasoningResponse(searchResult.response, text); if (searchResult.response.table) { lastTableData = searchResult.response.table; lastResponseType = 'table'; } if (searchResult.response.chart) { lastChartData = searchResult.response.chart.data; lastResponseType = 'chart'; } }
            else { finalResponse = generateFallbackResponse(text); }
            addMessage('bot', finalResponse.reply, finalResponse.table || null, finalResponse.chart || null, finalResponse.suggest || [], steps, searchResult.found); saveConversation(); updateInputState(); }, 3000);
        scrollToBottom(); return;
    }
    // CASE 10: 일반 모드
    setTimeout(() => { const searchResult = searchKnowledgeBase(text); const response = searchResult.response;
        if (response.table) { lastTableData = response.table; lastResponseType = 'table'; } if (response.chart) { lastChartData = response.chart.data; lastResponseType = 'chart'; }
        addMessage('bot', response.reply, response.table || null, response.chart || null, response.suggest || []); saveConversation(); updateInputState(); }, 500);
    scrollToBottom();
}

// ===== 표 심층 분석 =====
function generateTableDeepAnalysis(tableData) {
    const h = tableData.headers, r = tableData.rows; let a = '## 📋 표 데이터 심층 분석\n\n';
    a += `**기본:** ${r.length}행, ${h.length}열\n**컬럼:** ${h.join(', ')}\n\n**요약:**\n`;
    r.forEach(row => { a += `• ${row[0]}: ${row.slice(1).join(', ')}\n`; });
    a += `\n**인사이트:**\n• ${r.length}개 항목\n• 주요 컬럼: "${h[0]}"\n`;
    if (r.length >= 3) a += `• 상위: ${r.slice(0,3).map(rw => rw[0]).join(', ')}\n`;
    a += `\n> 💡 추론 모드 검토 완료`; return a;
}

// ===== 그래프 심층 분석 =====
function generateChartDeepThinkingSteps(userInput, chartData) {
    return [{ icon: 'analyze', iconText: '🧠', title: '질문 감지', desc: `"${userInput}" 분석` }, { icon: 'search', iconText: '📊', title: '데이터 로드', desc: `${chartData.labels.length}개 항목` }, { icon: 'analyze', iconText: '📋', title: '검토', desc: '정확성 확인' }, { icon: 'analyze', iconText: '📈', title: '통계', desc: '최대/최소/평균 분석' }, { icon: 'result', iconText: '✅', title: '완료', desc: '심층 해석 제공' }];
}
function generateChartDeepAnalysis(chartData) {
    const { labels, values } = chartData; const maxV = Math.max(...values), minV = Math.min(...values);
    const avgV = Math.round(values.reduce((a,b)=>a+b,0)/values.length), totalV = values.reduce((a,b)=>a+b,0);
    const maxI = values.indexOf(maxV), minI = values.indexOf(minV);
    let a = '## 📊 그래프 심층 분석\n\n';
    a += `**통계**\n• ${labels.length}개\n• 최대: **${labels[maxI]}** (${maxV})\n• 최소: **${labels[minI]}** (${minV})\n• 평균: **${avgV}**\n\n**순위**\n`;
    const sorted = labels.map((l,i)=>({l,v:values[i]})).sort((a,b)=>b.v-a.v);
    sorted.forEach((item,i) => { a += `${i+1}위. **${item.l}**: ${item.v} ${'█'.repeat(Math.round(item.v/maxV*20))}\n`; });
    const gap = maxV-minV, gapP = Math.round((gap/maxV)*100);
    a += `\n**인사이트**\n• 차이: **${gap}** (${gapP}%)\n• ${labels[maxI]} > 평균 **${maxV-avgV}**\n`;
    if (values.length>=3) { const top3 = sorted.slice(0,3).reduce((a,b)=>a+b.v,0); if (Math.round((top3/totalV)*100)>50) a += `• 상위3 = **${Math.round((top3/totalV)*100)}%**\n`; }
    a += `\n**결론**\n**${labels[maxI]}** 가장 두드러짐. `; a += gapP>70?'편차 큼.':'고른 분포.'; a += `\n\n> 💡 추론 모드 검토 완료`; return a;
}

// ===== 생각 과정 =====
function generateThinkingSteps(userInput, knowledgeFound) {
    return [{ icon: 'analyze', iconText: '🧠', title: '질문 분석', desc: `"${userInput}" 의도/키워드 파악` }, { icon: 'search', iconText: '🔍', title: '지식 베이스 검색', desc: knowledgeFound?'관련 지식 발견, 데이터 추출':'⚠️ 일치 정보 없음' }, { icon: 'analyze', iconText: '📋', title: '지식 검토', desc: knowledgeFound?'정확성/관련성 검토, 최적 정보 선별':'유사 키워드/문맥 분석, 대체 탐색' }, { icon: 'analyze', iconText: '🔗', title: '맥락 분석', desc: knowledgeFound?'검토된 지식 구성':'재분석으로 답변 준비' }, { icon: knowledgeFound?'result':'warning-step', iconText: knowledgeFound?'✅':'⚠️', title: knowledgeFound?'답변 완료':'대체 답변', desc: knowledgeFound?'검증된 답변':'최선의 답변' }];
}
function expandReasoningResponse(baseResponse, userInput) {
    let expanded = baseResponse.reply; const deep = generateDeepAnalysis(userInput, baseResponse.reply);
    if (deep) { expanded += '\n\n---\n\n## 🔬 심층 분석\n\n' + deep + '\n\n> 💡 추론 모드 검토 완료'; }
    return { reply: expanded, table: baseResponse.table, chart: baseResponse.chart, suggest: baseResponse.suggest };
}
function generateDeepAnalysis(userInput, reply) {
    const q = userInput.toLowerCase();
    if (q.includes('개발자')||q.includes('누구')||q.includes('소개')||q.includes('만든')) return '10대 개발자가 JavaScript로 혼자 개발. 완전 무료, API 독립형 AI 비서.';
    if (q.includes('과학')||q.includes('물리')||q.includes('화학')||q.includes('생물')) return '과학적 방법론: 관찰→가설→실험→분석→결론. 핵심은 반증 가능성. 호기심에서 시작.';
    if (q.includes('컴퓨터')||q.includes('프로그래밍')||q.includes('코딩')||q.includes('인터넷')) return '컴퓨터 과학 핵심: 추상화, 알고리즘, 자료구조. 초보자는 Python 추천.';
    if (q.includes('공부')||q.includes('학습')||q.includes('영어')||q.includes('수학')) return '망각 곡선 극복 복습, 정교화, 분산 학습, 충분한 수면이 핵심. 자기 전 5분 복습 효과적.';
    if (q.includes('힘들')||q.includes('슬프')||q.includes('외로')||q.includes('불안')||q.includes('위로')||q.includes('화나')||q.includes('고민')) return '감정은 자연스러운 반응. 수용과 인지 재구성이 도움. 혼자가 아니에요.';
    if (q.includes('운동')||q.includes('건강')||q.includes('다이어트')||q.includes('수면')) return '주 150분 중강도 운동 권장. 7-9시간 수면 필수. 작은 습관부터 시작하세요.';
    if (q.includes('또봇')||q.includes('tobot')) return '2010년 첫 방영, 대한민국 대표 변신 로봇 애니. X(차하나/박태성), Y(차두리/신경선), Z(권세모/신경선).';
    if (q.includes('도라에몽')||q.includes('doraemon')) return '1969년 후지코 F. 후지오 작품. 22세기 고양이 로봇. 비밀도구: 어디로든 문, 대나무 헬리콥터.';
    if (q.includes('애니')||q.includes('포켓몬')||q.includes('원피스')||q.includes('나루토')||q.includes('짱구')) return 'Chat K-Plus는 다양한 애니메이션 정보를 제공합니다. "애니 추천"이라고 물어보세요!';
    if (q.includes('극우')) return '한국 극우는 기독교 근본주의+반공 이데올로기 결합, 특정 교회의 조직적 동원, 음모론 확산이 특징. 민주적 절차 불신과 외세 의존이 핵심 문제. 비판적 사고로 접근해야 합니다.';
    if (q.includes('ai')||q.includes('인공지능')) return 'AI는 특정 분야에서 인간 능가. Chat K-Plus도 AI 기술의 한 예시.';
    return null;
}
function generateFallbackResponse(userInput) {
    return { reply: `"${userInput}" 데이터 부족.\n\n주제: 과학, 기술, 공부, 건강, 감정, 또봇, 도라에몽, 애니, 그래프`, table: null, chart: null, suggest: ['뭐 할 수 있어?', '과학', '도라에몽', '그래프'] };
}

// ===== 로딩 =====
function addThinkingMessage(steps) {
    const ml = document.getElementById('messagesList'); const id = 't-' + Date.now();
    const d = document.createElement('div'); d.id = id; d.className = 'message bot';
    let sh = steps.map((s,i) => `<div class="thinking-step" style="animation-delay:${i*0.2}s"><div class="thinking-step-icon ${s.icon}">${s.iconText}</div><div class="thinking-step-body"><div class="thinking-step-title">${s.title}</div><div class="thinking-step-desc">${s.desc}</div></div></div>`).join('');
    d.innerHTML = `<div class="message-avatar"><i class="fa-solid fa-robot"></i></div><div class="message-body"><div class="thinking-process expanded"><div class="thinking-toggle" style="cursor:default;"><div class="thinking-toggle-left"><i class="fa-solid fa-brain"></i>생각 과정</div><div class="thinking-toggle-right"><span class="thinking-badge">추론 모드</span></div></div><div class="thinking-content">${sh}</div></div><p style="color:var(--text-tertiary);font-size:13px;"><i class="fa-solid fa-spinner fa-spin"></i> 지식 검토 및 답변 생성 중...</p></div>`;
    ml.appendChild(d); scrollToBottom(); return id;
}
function removeLoadingMessage(id) { const e = document.getElementById(id); if (e) e.remove(); }

// ===== 메시지 UI =====
function addMessage(type, content, tableData, chartData, suggestions, thinkingSteps, knowledgeFound) {
    const ml = document.getElementById('messagesList'); const d = document.createElement('div'); d.className = `message ${type}`;
    const av = type === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>'; let bc = '';
    if (thinkingSteps && thinkingSteps.length > 0) {
        const hw = knowledgeFound === false;
        bc += `<div class="thinking-process expanded"><button class="thinking-toggle" onclick="toggleThinking(this.parentElement)"><div class="thinking-toggle-left"><i class="fa-solid fa-brain"></i>생각 과정</div><div class="thinking-toggle-right"><span class="thinking-badge${hw?' warning':''}">${hw?'⚠️ 지식 부족':'✅ 지식 발견'}</span><i class="fa-solid fa-chevron-down thinking-arrow"></i></div></button><div class="thinking-content">`;
        thinkingSteps.forEach(s => { bc += `<div class="thinking-step"><div class="thinking-step-icon ${s.icon}">${s.iconText}</div><div class="thinking-step-body"><div class="thinking-step-title">${s.title}</div><div class="thinking-step-desc">${s.desc}</div></div></div>`; });
        bc += `</div></div>`;
    }
    bc += `<p>${escapeHtml(content).replace(/\n/g, '<br>')}</p>`;
    if (tableData && tableData.headers && tableData.rows && tableData.headers.length > 0 && tableData.rows.length > 0) bc += renderTable(tableData);
    if (chartData && chartData.data && chartData.data.labels && chartData.data.values && chartData.data.labels.length >= 2) bc += renderChart(chartData);
    if (suggestions && suggestions.length > 0) { bc += '<div class="suggestions">'; suggestions.forEach(s => { bc += `<button class="suggest-tag" onclick="sendMessage('${escapeHtml(s)}')">${escapeHtml(s)}</button>`; }); bc += '</div>'; }
    d.innerHTML = `<div class="message-avatar">${av}</div><div class="message-body">${bc}</div>`;
    ml.appendChild(d); conversationHistory.push({ type, content, tableData, chartData, suggestions, thinkingSteps, knowledgeFound, timestamp: new Date().toISOString() }); scrollToBottom();
}
function toggleThinking(el) { el.classList.toggle('expanded'); }

// ===== 렌더링 =====
function renderTable(td) { let h = '<table class="data-table"><thead><tr>'; td.headers.forEach(hd => { h += `<th>${escapeHtml(hd)}</th>`; }); h += '</tr></thead><tbody>'; td.rows.forEach(r => { h += '<tr>'; r.forEach(c => { h += `<td>${escapeHtml(String(c))}</td>`; }); h += '</tr>'; }); return h + '</tbody></table>'; }
function renderChart(cd) { const { labels, values } = cd.data; const max = Math.max(...values); const colors = ['linear-gradient(135deg,#2563eb,#3b82f6)','linear-gradient(135deg,#10b981,#34d399)','linear-gradient(135deg,#f59e0b,#fbbf24)','linear-gradient(135deg,#ef4444,#f87171)','linear-gradient(135deg,#8b5cf6,#a78bfa)','linear-gradient(135deg,#ec4899,#f472b6)']; let h = '<div class="chart-wrapper"><div class="chart-title">📊 데이터 시각화</div><div class="bar-chart">'; labels.forEach((l, i) => { const p = (values[i]/max*100).toFixed(0); h += `<div class="bar-item"><div class="bar-label">${escapeHtml(l)}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${colors[i%colors.length]};"><span class="bar-value">${values[i]}</span></div></div></div>`; }); return h + '</div></div>'; }

// ===== 유틸 =====
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function scrollToBottom() { setTimeout(() => { const c = document.getElementById('messagesContainer'); c.scrollTop = c.scrollHeight; }, 100); }
function autoResize(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'; updateInputState(); }
function updateInputState() { document.getElementById('sendBtn').disabled = !document.getElementById('userInput').value.trim(); }
function handleKeyDown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

// ===== 사이드바 =====
function toggleSidebar() { const sidebar = document.getElementById('sidebar'); const overlay = document.getElementById('sidebarOverlay'); sidebar.classList.toggle('closed'); if (window.innerWidth <= 768) { sidebar.classList.contains('closed') ? overlay.classList.remove('active') : overlay.classList.add('active'); } }
window.addEventListener('resize', () => { const sidebar = document.getElementById('sidebar'); const overlay = document.getElementById('sidebarOverlay'); if (window.innerWidth > 768) { overlay.classList.remove('active'); } else { if (sidebar.classList.contains('closed')) overlay.classList.remove('active'); } });

// ===== 새 대화 =====
function newChat() { if (confirm('새 대화를 시작하시겠습니까?')) { conversationHistory = []; isFirstMessage = true; lastChartData = null; lastTableData = null; lastResponseType = null; waitingForChartTopic = false; document.getElementById('messagesList').innerHTML = ''; document.getElementById('welcomeScreen').style.display = 'flex'; document.getElementById('messagesContainer').classList.remove('active'); document.getElementById('userInput').value = ''; document.getElementById('userInput').style.height = 'auto'; localStorage.removeItem('chatKPlus_history'); updateInputState(); updateSuggestionChips(); } }
function clearHistory() { if (confirm('모든 대화 기록을 삭제하시겠습니까?')) { newChat(); document.getElementById('chatList').innerHTML = '<div class="chat-list-item active"><i class="fa-regular fa-message"></i><span>현재 대화</span></div>'; } }

// ===== 대화 저장 / 불러오기 =====
function saveConversation() { if (localStorage.getItem('chatKPlus_autoSave') === 'off') return; try { const data = conversationHistory.map(m => ({ type: m.type, content: m.content, timestamp: m.timestamp })); localStorage.setItem('chatKPlus_history', JSON.stringify(data)); localStorage.setItem('chatKPlus_model', currentModel); } catch(e) { conversationHistory.shift(); saveConversation(); } }
function loadConversation() { try { const saved = localStorage.getItem('chatKPlus_history'); if (saved) { const history = JSON.parse(saved); if (history.length > 0) { isFirstMessage = false; document.getElementById('welcomeScreen').style.display = 'none'; document.getElementById('messagesContainer').classList.add('active'); history.forEach(msg => { const d = document.createElement('div'); d.className = `message ${msg.type}`; d.innerHTML = `<div class="message-avatar">${msg.type==='user'?'<i class="fa-solid fa-user"></i>':'<i class="fa-solid fa-robot"></i>'}</div><div class="message-body"><p>${escapeHtml(msg.content).replace(/\n/g,'<br>')}</p></div>`; document.getElementById('messagesList').appendChild(d); }); conversationHistory = history; } } const m = localStorage.getItem('chatKPlus_model'); if (m) { currentModel = m; updateSuggestionChips(); } } catch(e) { localStorage.removeItem('chatKPlus_history'); } }

// ===== 설정 / 다크모드 =====
function openSettings() { document.getElementById('settingsModal').classList.add('active'); updateThemeSelection(); }
function closeSettings() { document.getElementById('settingsModal').classList.remove('active'); }
document.addEventListener('click', e => { if (e.target === document.getElementById('settingsModal')) closeSettings(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSettings(); });
function setTheme(theme) { localStorage.setItem('chatKPlus_theme', theme); applyTheme(theme); updateThemeSelection(); }
function applyTheme(theme) { if (theme === 'dark') document.body.classList.add('dark'); else if (theme === 'light') document.body.classList.remove('dark'); else if (theme === 'system') document.body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches); }
function updateThemeSelection() { const t = localStorage.getItem('chatKPlus_theme') || 'light'; ['themeLight','themeDark','themeSystem'].forEach(id => document.getElementById(id).classList.remove('active')); document.getElementById(t==='light'?'themeLight':t==='dark'?'themeDark':'themeSystem').classList.add('active'); }
function loadTheme() { applyTheme(localStorage.getItem('chatKPlus_theme') || 'light'); }
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if ((localStorage.getItem('chatKPlus_theme')||'light') === 'system') applyTheme('system'); });
function toggleAutoSave() { const t = document.getElementById('autoSaveToggle'); t.classList.toggle('active'); localStorage.setItem('chatKPlus_autoSave', t.classList.contains('active')?'on':'off'); }
function loadAutoSaveSetting() { document.getElementById('autoSaveToggle').classList.toggle('active', localStorage.getItem('chatKPlus_autoSave') !== 'off'); }

// ===== 온보딩 =====
let currentSlide = 0;
const totalSlides = 9;

function updateSlide() {
    document.querySelectorAll('.onboarding-slide').forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    document.querySelectorAll('.onboarding-dots .dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    document.getElementById('onboardingPrev').style.visibility = currentSlide === 0 ? 'hidden' : 'visible';
    document.getElementById('onboardingNext').style.display = currentSlide === totalSlides - 1 ? 'none' : 'flex';
    document.getElementById('onboardingStart').style.display = currentSlide === totalSlides - 1 ? 'flex' : 'none';
}

function nextSlide() { if (currentSlide < totalSlides - 1) { currentSlide++; updateSlide(); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; updateSlide(); } }

function closeOnboarding() {
    const modal = document.getElementById('onboardingModal');
    const innerModal = modal.querySelector('.modal');
    
    // 페이드 아웃 애니메이션
    innerModal.style.transform = 'translateY(20px) scale(0.95)';
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
        localStorage.setItem('chatKPlus_onboarding', 'done');
        // 초기화
        innerModal.style.transform = '';
        modal.style.opacity = '';
    }, 300);
}

function checkOnboarding() {
    if (localStorage.getItem('chatKPlus_onboarding') !== 'done') {
        document.getElementById('onboardingModal').classList.add('active');
        updateSlide();
    }
}

// ===== 입력 이벤트 =====
document.getElementById('userInput').addEventListener('input', () => autoResize(document.getElementById('userInput')));
document.getElementById('userInput').focus();
