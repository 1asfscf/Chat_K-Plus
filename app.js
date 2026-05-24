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
        btn.classList.add('active'); inputBox.classList.add('reasoning-active'); sendBtn.classList.add('reasoning-mode');
        textarea.placeholder = '추론 모드 활성화 - 깊이 있는 답변을 생성합니다...';
    } else {
        btn.classList.remove('active'); inputBox.classList.remove('reasoning-active'); sendBtn.classList.remove('reasoning-mode');
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
            { icon: '🔬', text: '과학 설명해줘', query: '과학이 뭐야?' }, { icon: '📚', text: '효과적인 공부법', query: '공부 잘하는 법' },
            { icon: '💻', text: '컴퓨터가 뭐야?', query: '컴퓨터가 뭐야?' }, { icon: '🌍', text: '중력이 뭐야?', query: '중력이 뭐야?' }
        ],
        'v2': [
            { icon: '🪐', text: '태양계 행성 표', query: '태양계 행성 표 보여줘' }, { icon: '💪', text: '운동 칼로리 그래프', query: '운동 칼로리 그래프 보여줘' },
            { icon: '📊', text: '그래프 그려줘', query: '그래프 그려줘' }, { icon: '🔬', text: '과학 설명해줘', query: '과학이 뭐야?' }
        ],
        'v3': [
            { icon: '💙', text: '위로가 필요해', query: '힘들어 위로해줘' }, { icon: '🪐', text: '태양계 행성 표', query: '태양계 행성 표' },
            { icon: '📊', text: '운동 칼로리 그래프', query: '운동 칼로리 그래프' }, { icon: '🚗', text: '또봇 정보', query: '또봇 정보 알려줘' }
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
    const defaultPatterns = ['아직 이 질문에 대한 데이터가 없어요', '아직 이 질문에 대한 확실한 데이터가 없어요', 'Chat K-Plus Ultra가 도와드릴 수 있는 것들이에요'];
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
        return { labels: ['도라에몽', '노진구', '신이슬', '왕비실', '만퉁퉁'], values: [98, 72, 88, 65, 60], title: '도라에몽 캐릭터 인기도' };
    if (q.includes('도라에몽') && (q.includes('비밀도구') || q.includes('도구') || q.includes('아이템')))
        return { labels: ['어디로든 문', '대나무\n헬리콥터', '타임머신', '4차원 주머니', '투명 망토'], values: [95, 90, 88, 85, 75], title: '도라에몽 인기 비밀도구' };
    if (q.includes('또봇') && (q.includes('주인공') || q.includes('파일럿') || q.includes('캐릭터') || q.includes('등장인물')))
        return { labels: ['또봇 X\n(차하나)', '또봇 Y\n(차두리)', '또봇 Z\n(권세모)', '또봇 W', '또봇 C', '또봇 D'], values: [95, 88, 92, 78, 85, 80], title: '또봇 주인공 인기도' };
    if (q.includes('또봇') && (q.includes('힘') || q.includes('능력') || q.includes('파워') || q.includes('전투력')))
        return { labels: ['또봇 X\n(차하나)', '또봇 Y\n(차두리)', '또봇 Z\n(권세모)', '또봇 W', '또봇 C', '또봇 D'], values: [90, 75, 95, 70, 85, 92], title: '또봇 전투력 비교' };
    if (q.includes('포켓몬') && (q.includes('주인공') || q.includes('캐릭터') || q.includes('스타팅')))
        return { labels: ['피카츄', '이상해씨', '파이리', '꼬부기', '리자몽', '뮤츠'], values: [100, 75, 82, 80, 95, 88], title: '포켓몬 인기도' };
    if (q.includes('원피스') && (q.includes('주인공') || q.includes('캐릭터') || q.includes('밀짚모자')))
        return { labels: ['루피', '조로', '나미', '상디', '우솝', '쵸파'], values: [98, 95, 82, 88, 70, 92], title: '원피스 밀짚모자 일당 인기도' };
    if ((q.includes('애니') || q.includes('애니메이션')) && (q.includes('비교') || q.includes('순위') || q.includes('인기')))
        return { labels: ['도라에몽', '포켓몬', '원피스', '나루토', '짱구', '또봇'], values: [95, 92, 98, 90, 85, 80], title: '애니메이션 인기 순위' };
    if (q.includes('공부') && (q.includes('그래프') || q.includes('데이터') || q.includes('비교') || q.includes('효과')))
        return { labels: ['능동적 회상', '간격 반복', '파인만 테크닉', '뽀모도로', '마인드맵', '일반 암기'], values: [90, 85, 80, 75, 70, 40], title: '공부법 효과 비교' };
    if (q.includes('운동') && (q.includes('그래프') || q.includes('비교')))
        return { labels: ['걷기', '조깅', '자전거', '수영', '줄넘기', '요가'], values: [150, 300, 250, 400, 450, 120], title: '운동별 칼로리 소모량' };
    if ((q.includes('프로그래밍') || q.includes('코딩') || q.includes('언어')) && (q.includes('인기') || q.includes('순위') || q.includes('비교')))
        return { labels: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript', 'Go'], values: [95, 90, 80, 70, 75, 65], title: '프로그래밍 언어 인기 순위' };
    if (q.includes('과일') || q.includes('음식'))
        return { labels: ['사과', '바나나', '오렌지', '포도', '딸기', '수박'], values: [85, 70, 90, 75, 95, 60], title: '과일 선호도 조사' };
    return null;
}

// ===== 차트 → 테이블 / 표 → 그래프 =====
function chartDataToTable(chartData) { return { headers: ['항목', '값'], rows: chartData.labels.map((l, i) => [l, String(chartData.values[i])]) }; }
function convertTableToChart(tableData) {
    if (!tableData || !tableData.headers || !tableData.rows) return null;
    if (tableData.rows.length >= 2) {
        const labels = [], values = [];
        for (const row of tableData.rows) { if (row.length >= 2) { labels.push(row[0]); const v = parseFloat(String(row[1]).replace(/,/g, '')); values.push(isNaN(v) ? 0 : v); } }
        if (labels.length >= 2 && values.some(v => v > 0)) return { labels, values };
    }
    return null;
}

// ===== 응답 생성 =====
function getChartTopicRequestReply() { return { reply: '📊 **그래프를 새로 그려드릴게요!**\n\n어떤 주제로 그래프를 만들까요?', table: null, chart: null, suggest: ['도라에몽 주인공 그래프', '또봇 주인공 그래프', '공부법 효과 비교'] }; }
function getChartNotAvailableReply(u) { return { reply: `⚠️ "${u}" 주제 데이터가 없어요.`, table: null, chart: null, suggest: ['도라에몽 주인공 그래프', '또봇 주인공 그래프'] }; }
function getReasoningAdviceReply() { return { reply: '💡 **추론 모드가 꺼져 있습니다**\n\n🧠 추론 버튼을 켜주세요!', table: null, chart: null, suggest: ['추론 모드 켜는 방법', '추론 모드로 뭐가 달라져?'] }; }
function getTableFromChartReply(cd) { const t = chartDataToTable(cd); return { reply: `📋 표로 변환! ${cd.labels.length}개\n최대:${Math.max(...cd.values)} 최소:${Math.min(...cd.values)} 평균:${Math.round(cd.values.reduce((a,b)=>a+b,0)/cd.values.length)}`, table: t, chart: null, suggest: ['더 자세히', '그래프로', '다른 그래프'] }; }

// ===== 추론 스트림 (타자 효과 + 페이드 전환) =====
function addReasoningStreamMessage(steps) {
    const ml = document.getElementById('messagesList');
    const id = 'rs-' + Date.now();
    const d = document.createElement('div');
    d.id = id;
    d.className = 'message bot';

    d.innerHTML = `
        <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="message-body">
            <div class="reasoning-stream">
                <span class="reasoning-stream-line" id="${id}-line">> 🧠 질문 분석 중...</span>
                <span class="reasoning-cursor" id="${id}-cursor">|</span>
            </div>
            <p style="color:var(--text-tertiary);font-size:13px;">
                <span class="reasoning-stream-spinner"></span> 심층 답변 생성 중...
            </p>
        </div>
    `;

    ml.appendChild(d);
    scrollToBottom();

    let currentTimeout = 800;
    steps.forEach((step, i) => {
        const newText = `> ${step.iconText} ${step.title}: ${step.desc}`;
        setTimeout(() => {
            const line = document.getElementById(`${id}-line`);
            const cursor = document.getElementById(`${id}-cursor`);
            if (line) { line.style.opacity = '0'; line.style.transition = 'opacity 0.15s ease'; }
            if (cursor) cursor.style.opacity = '0';
        }, currentTimeout);
        setTimeout(() => {
            const line = document.getElementById(`${id}-line`);
            const cursor = document.getElementById(`${id}-cursor`);
            if (!line) return;
            line.textContent = ''; line.style.opacity = '1';
            if (cursor) cursor.style.opacity = '1';
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < newText.length) { line.textContent += newText[charIndex]; charIndex++; }
                else clearInterval(typeInterval);
            }, 18);
        }, currentTimeout + 180);
        currentTimeout += 1200;
    });

    return id;
}

function removeLoadingMessage(id) { const e = document.getElementById(id); if (e) e.remove(); }

// ===== 메시지 전송 =====
function sendMessage(predefinedText) {
    const input = document.getElementById('userInput'); const text = predefinedText || input.value.trim();
    if (!text) return;
    if (isFirstMessage) { document.getElementById('welcomeScreen').style.display = 'none'; document.getElementById('messagesContainer').classList.add('active'); isFirstMessage = false; }
    addMessage('user', text);
    if (!predefinedText) { input.value = ''; input.style.height = 'auto'; updateInputState(); }
    const q = text.toLowerCase();

    // "다시 추론" 요청 감지 → 추론 모드 강제 ON + 재실행
    if (text.includes('다시 추론') || text.includes('재추론') || text.includes('다시 생각')) {
        if (!reasoningMode) toggleReasoning();
        setTimeout(() => { sendMessage(pendingKnowledgeInput || text.replace(/다시 추론|재추론|다시 생각/g, '').trim() || '이 질문에 대해 다시 추론해줘'); }, 300);
        return;
    }

    if (!reasoningMode && isFollowUpQuestion(text) && (lastChartData || lastTableData)) { setTimeout(() => { addMessage('bot', getReasoningAdviceReply().reply, null, null, getReasoningAdviceReply().suggest); saveConversation(); updateInputState(); }, 500); scrollToBottom(); return; }
    if (isNewChartRequest(text) && isChartRequest(text)) { waitingForChartTopic = true; setTimeout(() => { const r = getChartTopicRequestReply(); addMessage('bot', r.reply, null, null, r.suggest); saveConversation(); updateInputState(); }, 500); scrollToBottom(); return; }
    if (waitingForChartTopic && isChartRequest(text)) {
        waitingForChartTopic = false; const ex = extractChartDataFromKnowledge(text);
        if (ex) { lastChartData = { labels: ex.labels, values: ex.values }; lastResponseType = 'chart';
            if (reasoningMode) { const s = [{ icon: 'search', iconText: '🔍', title: '분석', desc: ex.title }, { icon: 'analyze', iconText: '📊', title: '데이터', desc: `${ex.labels.length}개` }, { icon: 'result', iconText: '✅', title: '완료', desc: '생성' }]; const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); addMessage('bot', `📊 **${ex.title}**`, null, { type: 'bar', data: lastChartData }, ['더 자세히', '표로', '다른 그래프'], s, true); saveConversation(); updateInputState(); }, 2000); }
            else { addMessage('bot', `📊 **${ex.title}**`, null, { type: 'bar', data: lastChartData }, ['더 자세히', '표로', '다른 그래프']); saveConversation(); updateInputState(); }
        } else {
            if (reasoningMode) { const s = [{ icon: 'search', iconText: '🔍', title: '검색', desc: '없음' }, { icon: 'warning-step', iconText: '⚠️', title: '실패', desc: '불가' }]; const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); const r = getChartNotAvailableReply(text); addMessage('bot', r.reply, null, null, r.suggest, s, false); saveConversation(); updateInputState(); }, 1500); }
            else { const r = getChartNotAvailableReply(text); addMessage('bot', r.reply, null, null, r.suggest); saveConversation(); updateInputState(); }
        }
        scrollToBottom(); return;
    }
    if (waitingForChartTopic) waitingForChartTopic = false;
    if (isChartRequest(text) && !isNewChartRequest(text) && lastTableData) {
        const cft = convertTableToChart(lastTableData);
        if (cft) { lastChartData = cft; lastResponseType = 'chart';
            if (reasoningMode) { const s = [{ icon: 'search', iconText: '📋', title: '표', desc: `${lastTableData.rows.length}개` }, { icon: 'analyze', iconText: '🔄', title: '변환', desc: '그래프' }, { icon: 'result', iconText: '✅', title: '완료', desc: '생성' }]; const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); addMessage('bot', '📊 표→그래프 변환!', null, { type: 'bar', data: cft }, ['더 자세히', '표로'], s, true); saveConversation(); updateInputState(); }, 1500); }
            else { setTimeout(() => { addMessage('bot', '📊 표→그래프 변환!', null, { type: 'bar', data: cft }, ['더 자세히', '표로']); saveConversation(); updateInputState(); }, 500); }
            scrollToBottom(); return;
        }
    }
    if (reasoningMode && isTableRequest(text) && lastChartData) { const s = [{ icon: 'search', iconText: '📊', title: '데이터', desc: `${lastChartData.labels.length}개` }, { icon: 'analyze', iconText: '🔄', title: '변환', desc: '표' }, { icon: 'result', iconText: '✅', title: '완료', desc: '생성' }]; const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); const r = getTableFromChartReply(lastChartData); lastTableData = r.table; lastResponseType = 'table'; addMessage('bot', r.reply, r.table, null, r.suggest, s, true); saveConversation(); updateInputState(); }, 1500); scrollToBottom(); return; }
    if (!reasoningMode && isTableRequest(text) && lastChartData) { setTimeout(() => { const r = getTableFromChartReply(lastChartData); lastTableData = r.table; lastResponseType = 'table'; addMessage('bot', r.reply, r.table, null, r.suggest); saveConversation(); updateInputState(); }, 500); scrollToBottom(); return; }
    if (reasoningMode && isFollowUpQuestion(text) && (lastChartData || lastTableData)) {
        if (lastChartData) { const s = generateChartDeepThinkingSteps(text, lastChartData); const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); addMessage('bot', generateChartDeepAnalysis(lastChartData), null, null, ['표로', '그래프로'], s, true); saveConversation(); updateInputState(); }, 3000); }
        else if (lastTableData) { const s = [{ icon: 'analyze', iconText: '🧠', title: '분석', desc: '표' }, { icon: 'search', iconText: '📋', title: '검토', desc: `${lastTableData.rows.length}개` }, { icon: 'result', iconText: '✅', title: '완료', desc: '분석' }]; const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); addMessage('bot', generateTableDeepAnalysis(lastTableData), null, null, ['그래프로'], s, true); saveConversation(); updateInputState(); }, 3000); }
        scrollToBottom(); return;
    }
    if (reasoningMode) { const sr = searchKnowledgeBase(text); const s = generateThinkingSteps(text, sr.found); const l = addReasoningStreamMessage(s); setTimeout(() => { removeLoadingMessage(l); let fr; if (sr.found) { fr = expandReasoningResponse(sr.response, text); if (sr.response.table) { lastTableData = sr.response.table; lastResponseType = 'table'; } if (sr.response.chart) { lastChartData = sr.response.chart.data; lastResponseType = 'chart'; } } else { fr = generateFallbackResponse(text); } addMessage('bot', fr.reply, fr.table || null, fr.chart || null, fr.suggest || [], s, sr.found); saveConversation(); updateInputState(); }, 3000); scrollToBottom(); return; }
    setTimeout(() => { const sr = searchKnowledgeBase(text); const r = sr.response; if (r.table) { lastTableData = r.table; lastResponseType = 'table'; } if (r.chart) { lastChartData = r.chart.data; lastResponseType = 'chart'; } if (!sr.found) { r.suggest = ['🔄 다시 추론하기', ...(r.suggest || [])]; } addMessage('bot', r.reply, r.table || null, r.chart || null, r.suggest || []); saveConversation(); updateInputState(); }, 500);
    scrollToBottom();
}

// ===== 심층 분석 =====
function generateTableDeepAnalysis(td) { const h = td.headers, r = td.rows; let a = '## 📋 표 심층 분석\n\n'; a += `${r.length}행 ${h.length}열\n컬럼: ${h.join(', ')}\n\n`; r.forEach(row => { a += `• ${row[0]}: ${row.slice(1).join(', ')}\n`; }); a += `\n> 💡 추론 모드`; return a; }
function generateChartDeepThinkingSteps(u, cd) { return [{ icon: 'analyze', iconText: '🧠', title: '질문', desc: u }, { icon: 'search', iconText: '📊', title: '데이터', desc: `${cd.labels.length}개` }, { icon: 'analyze', iconText: '📈', title: '통계', desc: '분석' }, { icon: 'result', iconText: '✅', title: '완료', desc: '해석' }]; }
function generateChartDeepAnalysis(cd) { const { labels, values } = cd; const maxV = Math.max(...values), minV = Math.min(...values), avgV = Math.round(values.reduce((a,b)=>a+b,0)/values.length), maxI = values.indexOf(maxV), minI = values.indexOf(minV); let a = '## 📊 심층 분석\n\n'; a += `최대:**${labels[maxI]}**(${maxV}) 최소:**${labels[minI]}**(${minV}) 평균:**${avgV}**\n\n`; const sorted = labels.map((l,i)=>({l,v:values[i]})).sort((a,b)=>b.v-a.v); sorted.forEach((item,i) => { a += `${i+1}위. ${item.l}: ${item.v}\n`; }); a += `\n> 💡 추론 모드`; return a; }
function generateThinkingSteps(u, kf) { return [{ icon: 'analyze', iconText: '🧠', title: '질문 분석', desc: `"${u}" 의도 파악` }, { icon: 'search', iconText: '🔍', title: '지식 검색', desc: kf ? '관련 지식 발견' : '⚠️ 정보 없음' }, { icon: 'analyze', iconText: '📋', title: '지식 검토', desc: kf ? '정확성 확인 중' : '대체 탐색' }, { icon: 'analyze', iconText: '🔗', title: '맥락 구성', desc: kf ? '최적 답변 구성' : '재분석' }, { icon: kf ? 'result' : 'warning-step', iconText: kf ? '✅' : '⚠️', title: kf ? '완료' : '대체', desc: kf ? '검증된 답변' : '최선의 답변' }]; }
function expandReasoningResponse(br, u) { let e = br.reply; const d = generateDeepAnalysis(u, br.reply); if (d) e += '\n\n---\n## 🔬 심층 분석\n\n' + d + '\n\n> 💡 추론 모드 검토 완료'; return { reply: e, table: br.table, chart: br.chart, suggest: br.suggest }; }
function generateDeepAnalysis(u, r) { const q = u.toLowerCase(); if (q.includes('개발자')||q.includes('누구')||q.includes('소개')) return '10대 개발자, JavaScript, 완전 무료.'; if (q.includes('과학')||q.includes('물리')||q.includes('화학')) return '관찰→가설→실험→분석→결론.'; if (q.includes('컴퓨터')||q.includes('코딩')) return '추상화, 알고리즘, Python 추천.'; if (q.includes('공부')||q.includes('학습')) return '망각 곡선, 복습, 수면이 핵심.'; if (q.includes('힘들')||q.includes('슬프')||q.includes('위로')) return '감정은 자연스러움, 수용이 중요.'; if (q.includes('운동')||q.includes('건강')) return '주 150분, 7-9시간 수면.'; if (q.includes('또봇')) return '2010년, X(차하나), Y(차두리), Z(권세모).'; if (q.includes('도라에몽')) return '1969년 후지코 F. 후지오.'; if (q.includes('극우')) return '기독교+반공 결합, 비판적 사고 필요.'; if (q.includes('ai')) return '특정 분야 능가, Chat K-Plus도 AI.'; return null; }
function generateFallbackResponse(u) { return { reply: `"${u}"에 대해 아직 잘 몰라요. 😅\n\n조금 다른 방식으로 물어봐 주시거나, 추론 모드를 켜고 다시 시도해 보세요.`, table: null, chart: null, suggest: ['🔄 다시 추론하기', '뭐 할 수 있어?', '과학이 뭐야?'] }; }

// ===== 메시지 UI =====
function addMessage(type, content, tableData, chartData, suggestions, thinkingSteps, knowledgeFound) {
    const ml = document.getElementById('messagesList'); const d = document.createElement('div'); d.className = `message ${type}`;
    const av = type === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    let bc = '';
    if (thinkingSteps && thinkingSteps.length > 0) {
        const hw = knowledgeFound === false;
        bc += `<div class="thinking-process expanded"><button class="thinking-toggle" onclick="toggleThinking(this.parentElement)"><div class="thinking-toggle-left"><i class="fa-solid fa-brain"></i>생각 과정</div><div class="thinking-toggle-right"><span class="thinking-badge${hw ? ' warning' : ''}">${hw ? '⚠️ 지식 부족' : '✅ 지식 발견'}</span><i class="fa-solid fa-chevron-down thinking-arrow"></i></div></button><div class="thinking-content">`;
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
function renderTable(td) { let h = '<table class="data-table"><thead><tr>'; td.headers.forEach(hd => { h += `<th>${escapeHtml(hd)}</th>`; }); h += '</tr></thead><tbody>'; td.rows.forEach(r => { h += '<tr>'; r.forEach(c => { h += `<td>${escapeHtml(String(c))}</td>`; }); h += '</tr>'; }); return h + '</tbody></table>'; }
function renderChart(cd) { const { labels, values } = cd.data; const max = Math.max(...values); const colors = ['linear-gradient(135deg,#6366f1,#818cf8)','linear-gradient(135deg,#10b981,#34d399)','linear-gradient(135deg,#f59e0b,#fbbf24)','linear-gradient(135deg,#ef4444,#f87171)','linear-gradient(135deg,#8b5cf6,#a78bfa)','linear-gradient(135deg,#ec4899,#f472b6)']; let h = '<div class="chart-wrapper"><div class="chart-title">📊 데이터 시각화</div><div class="bar-chart">'; labels.forEach((l, i) => { const p = (values[i] / max * 100).toFixed(0); h += `<div class="bar-item"><div class="bar-label">${escapeHtml(l)}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${colors[i % colors.length]};"><span class="bar-value">${values[i]}</span></div></div></div>`; }); return h + '</div></div>'; }
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function scrollToBottom() { setTimeout(() => { const c = document.getElementById('messagesContainer'); c.scrollTop = c.scrollHeight; }, 100); }
function autoResize(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'; updateInputState(); }
function updateInputState() { document.getElementById('sendBtn').disabled = !document.getElementById('userInput').value.trim(); }
function handleKeyDown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

// ===== 사이드바 =====
function toggleSidebar() { const s = document.getElementById('sidebar'); const o = document.getElementById('sidebarOverlay'); s.classList.toggle('closed'); if (window.innerWidth <= 768) { s.classList.contains('closed') ? o.classList.remove('active') : o.classList.add('active'); } }
window.addEventListener('resize', () => { const s = document.getElementById('sidebar'); const o = document.getElementById('sidebarOverlay'); if (window.innerWidth > 768) o.classList.remove('active'); else if (s.classList.contains('closed')) o.classList.remove('active'); });

// ===== 새 대화 =====
function newChat() { if (confirm('새 대화를 시작하시겠습니까?')) { conversationHistory = []; isFirstMessage = true; lastChartData = null; lastTableData = null; lastResponseType = null; waitingForChartTopic = false; document.getElementById('messagesList').innerHTML = ''; document.getElementById('welcomeScreen').style.display = 'flex'; document.getElementById('messagesContainer').classList.remove('active'); document.getElementById('userInput').value = ''; document.getElementById('userInput').style.height = 'auto'; localStorage.removeItem('chatKPlus_history'); updateInputState(); updateSuggestionChips(); } }
function clearHistory() { if (confirm('모든 대화 기록을 삭제하시겠습니까?')) { newChat(); document.getElementById('chatList').innerHTML = '<div class="chat-list-item active"><i class="fa-regular fa-message"></i><span>현재 대화</span></div>'; } }

// ===== 대화 저장 =====
function saveConversation() { if (localStorage.getItem('chatKPlus_autoSave') === 'off') return; try { localStorage.setItem('chatKPlus_history', JSON.stringify(conversationHistory.map(m => ({ type: m.type, content: m.content, timestamp: m.timestamp })))); localStorage.setItem('chatKPlus_model', currentModel); } catch (e) { conversationHistory.shift(); saveConversation(); } }
function loadConversation() { try { const s = localStorage.getItem('chatKPlus_history'); if (s) { const h = JSON.parse(s); if (h.length > 0) { isFirstMessage = false; document.getElementById('welcomeScreen').style.display = 'none'; document.getElementById('messagesContainer').classList.add('active'); h.forEach(msg => { const d = document.createElement('div'); d.className = `message ${msg.type}`; d.innerHTML = `<div class="message-avatar">${msg.type === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>'}</div><div class="message-body"><p>${escapeHtml(msg.content).replace(/\n/g, '<br>')}</p></div>`; document.getElementById('messagesList').appendChild(d); }); conversationHistory = h; } } const m = localStorage.getItem('chatKPlus_model'); if (m) { currentModel = m; updateSuggestionChips(); } } catch (e) { localStorage.removeItem('chatKPlus_history'); } }

// ===== 설정 / 다크모드 =====
function openSettings() { document.getElementById('settingsModal').classList.add('active'); updateThemeSelection(); }
function closeSettings() { document.getElementById('settingsModal').classList.remove('active'); }
document.addEventListener('click', (e) => { if (e.target === document.getElementById('settingsModal')) closeSettings(); if (e.target === document.getElementById('feedbackModal')) closeFeedbackModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSettings(); closeFeedbackModal(); } });
function setTheme(t) { localStorage.setItem('chatKPlus_theme', t); applyTheme(t); updateThemeSelection(); }
function applyTheme(t) { if (t === 'dark') document.body.classList.add('dark'); else if (t === 'light') document.body.classList.remove('dark'); else document.body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches); }
function updateThemeSelection() { const t = localStorage.getItem('chatKPlus_theme') || 'light'; ['themeLight', 'themeDark', 'themeSystem'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); }); const ae = document.getElementById(t === 'light' ? 'themeLight' : t === 'dark' ? 'themeDark' : 'themeSystem'); if (ae) ae.classList.add('active'); }
function loadTheme() { applyTheme(localStorage.getItem('chatKPlus_theme') || 'light'); }
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if ((localStorage.getItem('chatKPlus_theme') || 'light') === 'system') applyTheme('system'); });
function toggleAutoSave() { const t = document.getElementById('autoSaveToggle'); if (!t) return; t.classList.toggle('active'); localStorage.setItem('chatKPlus_autoSave', t.classList.contains('active') ? 'on' : 'off'); }
function loadAutoSaveSetting() { const t = document.getElementById('autoSaveToggle'); if (t) t.classList.toggle('active', localStorage.getItem('chatKPlus_autoSave') !== 'off'); }

// ===== 피드백 모달 =====
function openFeedbackModal() { closeSettings(); setTimeout(() => { document.getElementById('feedbackModal').classList.add('active'); }, 200); }
function closeFeedbackModal() { document.getElementById('feedbackModal').classList.remove('active'); }

// ===== 온보딩 =====
let currentSlide = 0; const totalSlides = 9;
function updateSlide() { const slides = document.querySelectorAll('.onboarding-slide'); const dots = document.querySelectorAll('.onboarding-dots .dot'); if (slides.length === 0 || dots.length === 0) return; slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide)); dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide)); const pb = document.getElementById('onboardingPrev'); if (pb) pb.style.visibility = currentSlide === 0 ? 'hidden' : 'visible'; const nb = document.getElementById('onboardingNext'); if (nb) nb.style.display = currentSlide === totalSlides - 1 ? 'none' : 'flex'; const sb = document.getElementById('onboardingStart'); if (sb) sb.style.display = currentSlide === totalSlides - 1 ? 'flex' : 'none'; }
function nextSlide() { if (currentSlide < totalSlides - 1) { currentSlide++; updateSlide(); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; updateSlide(); } }
function closeOnboarding() { const m = document.getElementById('onboardingModal'); if (!m) return; const inner = m.querySelector('.modal'); if (!inner) return; inner.style.transform = 'translateY(20px) scale(0.95)'; m.style.opacity = '0'; setTimeout(() => { m.classList.remove('active'); localStorage.setItem('chatKPlus_onboarding', 'done'); inner.style.transform = ''; m.style.opacity = ''; const welcome = document.getElementById('welcomeScreen'); if (welcome && isFirstMessage) welcome.style.display = 'flex'; }, 300); }
function checkOnboarding() { if (localStorage.getItem('chatKPlus_onboarding') !== 'done') { const m = document.getElementById('onboardingModal'); if (m) { m.classList.add('active'); updateSlide(); } } }

// ===== 입력 =====
document.getElementById('userInput').addEventListener('input', () => autoResize(document.getElementById('userInput')));
document.getElementById('userInput').focus();
