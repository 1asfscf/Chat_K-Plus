// =========================================================
// Chat K plus - Complete Rebuild (2026-06-19 v3.6.1 Hotfix)
// v3.6 배타3 기반 - 문법 오류 수정 + 안정화 패치
// FIX: 1) DB 닫힘 누락 수정 2) checkPolicyViolation 미정의 수정 3) 안전성 강화
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. UI 요소 참조
    // ==========================================
    const UI = {
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        examples: document.querySelectorAll('.example-btn'),
        searchView: document.getElementById('search-view'),
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn'),
        stopBtn: document.getElementById('stopBtn'),
        difficultySelect: document.getElementById('difficultySelect'),
        attachmentBtn: document.getElementById('attachmentBtn'),
        timetableBtn: document.getElementById('timetableBtn'),
        menuBtn: document.getElementById('menuBtn'),
        linkModal: document.getElementById('linkModal'),
        modalUrl: document.getElementById('modalUrl'),
        modalCancel: document.getElementById('modalCancel'),
        modalGo: document.getElementById('modalGo'),
        timetableModal: document.getElementById('timetableModal'),
        timetableClose: document.getElementById('timetableClose'),
        timetableContent: document.getElementById('timetableContent'),
        addClassBtn: document.getElementById('addClassBtn'),
        addClassModal: document.getElementById('addClassModal'),
        cancelAdd: document.getElementById('cancelAdd'),
        saveAdd: document.getElementById('saveAdd')
    };

    if (UI.chatInput) UI.chatInput.placeholder = '무엇이든 물어보세요';

    // ==========================================
    // 2. 데이터베이스 (수정됨: 닫힘 오류 해결)
    // ==========================================
    const DB = {
        ai: {
            "너에 대해서": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
            "너 누구야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
            "넌 뭐야": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
            "너는 누구": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
            "자기소개": "안녕하세요! 저는 Chat K plus입니다. 질문에 답하고 정보를 찾아드리는 AI입니다.",
            "너에 대해 알려줘": "저는 Chat K plus의 AI 어시스턴트입니다. 빠른 검색과 대화에 최적화된 지능형 봇이죠.",
            "너 뭐하는 애야": "저는 당신의 질문에 답하고, 검색을 돕는 AI 어시스턴트입니다.",
            "너 정체가 뭐야": "저는 Meta AI 기술을 기반으로 만든 Chat K plus 대화형 AI입니다.",
            "너는 무슨 기반이야": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
            "너 무슨 기반": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
            "krl": "저는 KRL V10 기반의 AI 어시스턴트입니다.",
            "krl v10": "네, 저는 KRL V10 기반으로 동작합니다.",
            "기반이 뭐야": "저는 KRL V10 기반의 AI 어시스턴트입니다. KRL V10은 최신 자연어 처리 기술을 기반으로 한 AI 모델로, 빠른 검색과 대화에 최적화되어 있습니다."
        },
        entertainment: {
            "아바타 2가 뭐죠?": "판도라 행성의 바다를 배경으로 한 SF 영화입니다. 제이크 설리와 네이티리 가족이 해양 부족과 만나 겪는 이야기죠."
        },
        politics: {
            "정치": "사회적 갈등을 조정하고 공동의 이익을 도모하는 의사결정 과정입니다.",
            "사회/정치2": "시민의 권리와 의무, 법과 제도를 다루는 학문 분야입니다."
        },
        china: {
            "중국": "중국은 동아시아 국가로 수도는 베이징입니다. 인구 약 14억 명으로 세계 2위입니다.",
            "중국 수도": "중국의 수도는 베이징(北京)입니다.",
            "중국 인구": "2024년 기준 약 14억 1천만 명입니다.",
            "중국 역사": "5000년 역사를 가진 문명국가로, 하·상·주나라부터 시작해 현재 중화인민공화국에 이릅니다.",
            "만리장성": "만리장성은 중국 북부를 가로지르는 세계 최대 방어시설로 길이가 2만km가 넘습니다.",
            "중국 음식": "짜장면, 마라탕, 딤섬, 베이징덕이 유명합니다."
        },
        baby: {
            "아기": "아기는 출생 후 12개월까지의 영유아를 말합니다. 이 시기는 신체와 뇌 발달이 가장 빠른 시기입니다.",
            "아기_detail": "아기(0~12개월)는 신생아기(0~1개월), 영아기(1~12개월)로 나뉩니다. 평균적으로 생후 6개월에 첫 이가 나고, 12개월경 첫 걸음을 뗍니다.",
            "신생아": "신생아는 태어난 지 28일 이내의 아기입니다. 하루 16~20시간 수면하며 2~3시간마다 수유합니다.",
            "신생아_detail": "신생아는 체온 조절 능력이 미숙해 실내온도 24~26도를 유지해야 합니다. 배꼽은 보통 1~2주 내 탈락합니다.",
            "기저귀": "기저귀는 아기 배변을 받아주는 위생용품입니다. 일회용과 천 기저귀로 나뉩니다.",
            "기저귀_detail": "크기별로 NB, S, M, L, XL이 있습니다. 하루 평균 8~10개 사용하며 2~3시간마다 교체가 원칙입니다.",
            "분유": "분유는 모유 대용으로 만든 인공 영양식입니다. 1단계(0~6개월), 2단계(6~12개월)로 나뉩니다.",
            "분유_detail": "물 1: 분유 1스푼 비율로 40~50도 물에 타서 체온 정도로 식혀 수유합니다. 개봉 후 3주 이내 사용이 원칙입니다.",
            "이유식": "이유식은 생후 6개월부터 시작하는 고형식 연습입니다. 초기-중기-후기-완료기로 진행합니다.",
            "이유식_detail": "생후 180일경 시작이 WHO 권고입니다. 알레르기 확인을 위해 한 가지 재료씩 3일 간격으로 추가합니다.",
            "아기 수면": "아기는 하루 14~17시간 수면이 필요합니다. 밤낮 구분은 3개월 이후 생깁니다.",
            "아기 수면_detail": "수면교육은 4~6개월부터 가능하며, 일정한 수면의식이 도움됩니다. 엎드려 재우기는 금지입니다.",
            "예방접종": "예방접종은 질병 예방을 위한 필수 접종입니다. BCG, B형간염, DPT 등 국가필수예방접종이 있습니다.",
            "예방접종_detail": "국가필수예방접종은 무료입니다. 접종 후 20~30분 병원에 머물며 이상반응 관찰이 필요합니다."
        },
        search: {
            "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
            "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
            "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다.",
            "다음에서 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀",
            "다음 기저귀": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀",
            "기저귀 관련검색어": "다음 관련검색어:\n성인용 기저귀\n아기 기저귀\n성인 기저귀\n신생아 기저귀\n하기스 기저귀"
        },
        history: {
            "천안문": "천안문은 중국 베이징 중심부에 있는 성문입니다. 명나라 때 건설되었고 천안문 광장과 자금성의 입구입니다.",
            "천안문_detail": "천안문(天安門)은 1417년 명나라 영락제 때 처음 세워졌고, 현재 건물은 1651년 청나라 순치제 때 재건된 것입니다. 높이 34.7m, 폭 66m 규모입니다.",
            "천안문 광장": "천안문 광장은 베이징 중심부에 있는 대형 광장입니다. 면적 약 44만㎡로 대규모 집회와 행사가 열립니다.",
            "천안문 광장_detail": "남북 길이 880m, 동서 500m로 100만 명 이상 수용 가능합니다. 주변에 인민대회당, 중국국가박물관 등이 있습니다."
        },
        it: {
            "it": "IT(Information Technology)는 정보 기술을 의미합니다. 컴퓨터, 소프트웨어, 네트워크, 데이터 등을 활용하여 정보를 처리하는 기술입니다.",
            "it_detail": "IT는 소프트웨어 개발, 하드웨어, 네트워크, 데이터, 보안을 포함합니다. 최신 트렌드는 AI, 클라우드, 빅데이터입니다.",
            "인공지능": "인공지능(AI)은 인간의 지능을 모방하는 컴퓨터 시스템입니다.",
            "인공지능_detail": "머신러닝, 딥러닝, 자연어 처리, 컴퓨터 비전 등을 포함합니다. ChatGPT, 자율주행 등에 활용됩니다.",
            "머신러닝": "머신러닝은 데이터에서 패턴을 학습하여 예측이나 결정을 내리는 AI 기술입니다.",
            "클라우드": "클라우드 컴퓨팅은 인터넷을 통해 컴퓨팅 리소스를 제공하는 서비스입니다.",
            "빅데이터": "빅데이터는 대규모의 복잡한 데이터 집합을 의미합니다.",
            "프로그래밍": "프로그래밍은 컴퓨터에게 명령을 내리는 언어입니다.",
            "웹 개발": "웹 개발은 웹사이트와 웹 애플리케이션을 만드는 기술입니다.",
            "데이터베이스": "데이터베이스는 데이터를 저장하고 관리하는 시스템입니다.",
            "devops": "DevOps는 개발과 운영을 통합하는 방법론입니다."
        },
        websites: {
            "네이버 공식 사이트": "네이버 공식 사이트는 https://www.naver.com 입니다.",
            "구글": "구글 공식 사이트는 https://www.google.com 입니다.",
            "구글 공식 사이트": "구글 공식 사이트는 https://www.google.com 입니다.",
            "유튜브": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
            "유튜브 공식 사이트": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
            "인스타그램": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
            "인스타 공식 사이트": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
            "카카오": "카카오 공식 사이트는 https://www.kakaocorp.com 입니다.",
            "쿠팡": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
            "쿠팡 공식 사이트": "쿠팡 공식 사이트는 https://www.coupang.com 입니다.",
            "chat gpt": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다.",
            "챗지피티": "ChatGPT 공식 사이트는 https://chat.openai.com 입니다."
        }
    }; // <-- FIX: 닫힘 누락 해결

    // ==========================================
    // 3. 질문 분류 시스템
    // ==========================================
    const QuestionClassifier = {
        classify(query) {
            const nq = query.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
            if (/(너|니).*(누구|뭐|정체|기반|krl)/.test(nq)) return 'ai';
            if (/공식.*사이트|홈페이지|사이트.*알려줘/.test(nq)) return 'websites';
            if (/(시간표|수업.*뭐|오늘.*수업|내일.*수업|.*교시)/.test(nq)) return 'timetable';
            if (nq.includes('중국')) return 'china';
            if (/(아기|신생아|기저귀|분유|이유식|수면|예방접종)/.test(nq)) return 'baby';
            if (/(천안문|역사|문화)/.test(nq)) return 'history';
            if (/(it|인공지능|머신러닝|딥러닝|클라우드|빅데이터|사물인터넷|블록체인|사이버 보안|5g|프로그래밍|웹 개발|모바일 개발|데이터베이스|devops)/.test(nq)) return 'it';
            if (/(정치|사회|탄핵)/.test(nq)) return 'politics';
            if (/(영화|엔터|아바타)/.test(nq)) return 'entertainment';
            if (/(다음|네이버|구글|유튜브|인스타|카카오|쿠팡)/.test(nq)) return 'search';
            return 'all';
        },
        searchDB(category, query) {
            const nq = query.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
            const results = [];
            const scan = (catName) => {
                if (!DB[catName]) return;
                for (const key in DB[catName]) {
                    const nk = key.toLowerCase();
                    if (nq.includes(nk) || nk.includes(nq)) {
                        results.push({ key, value: DB[catName][key], category: catName });
                    }
                }
            };
            if (category === 'all') {
                for (const cat in DB) scan(cat);
            } else {
                scan(category);
                if (results.length === 0) for (const cat in DB) scan(cat);
            }
            return results;
        }
    };

    // ==========================================
    // 4. 시스템 기능 (FIX: 정책 함수 복구)
    // ==========================================
    const System = {
        isThinking: false,
        responseMode: 'normal',

        // FIX: 삭제되어 에러나던 함수 복구 - 완화 모드 (항상 통과)
        checkPolicyViolation(nq, rawQ) {
            // v4.4.R 완화 정책: 차단하지 않음. 필요하면 여기서 키워드 필터 추가
            // 예: if (nq.includes('금지어')) return '정책상 답변할 수 없습니다.';
            return null;
        },

        switchView(isChat) {
            if (!UI.searchView || !UI.chatView) return;
            UI.searchView.style.display = isChat ? 'none' : 'flex';
            UI.chatView.style.display = isChat ? 'flex' : 'none';
            UI.searchView.classList.toggle('hidden', isChat);
            UI.chatView.classList.toggle('hidden', !isChat);
            if (isChat) setTimeout(() => UI.chatInput && UI.chatInput.focus(), 100);
        },

        addMessage(text, type) {
            if (!UI.chatBox) return null;
            const msg = document.createElement('div');
            msg.className = `message ${type === 'user' ? 'user-msg' : 'ai-msg'}`;
            if (window.__isPolicyWarning) {
                msg.classList.add('policy-warning');
                window.__isPolicyWarning = false;
            }
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            if (urlRegex.test(text)) {
                msg.innerHTML = text.replace(urlRegex, url => `<a href="#" class="external-link" data-url="${url}">${url}</a>`);
            } else {
                msg.innerHTML = text;
            }
            UI.chatBox.appendChild(msg);
            UI.chatBox.scrollTo({ top: UI.chatBox.scrollHeight, behavior: 'smooth' });
            return msg;
        },

        async runReasoning(query) {
            if (!query || this.isThinking) return;
            this.isThinking = true;
            const mode = this.responseMode;
            const forceDetail = /(구체적|자세히|상세|자세한|구체적인)/.test(query);

            if (UI.sendBtn) UI.sendBtn.classList.add('hidden');
            if (UI.stopBtn) UI.stopBtn.classList.remove('hidden');

            this.switchView(true);
            this.addMessage(query, 'user');

            const thinking = document.createElement('div');
            thinking.className = 'message ai-msg thinking';
            thinking.innerHTML = `<span class="thinking-icon"></span><span class="thinking-text">분석 중...</span>`;
            UI.chatBox.appendChild(thinking);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;

            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            for (const step of steps) {
                if (!this.isThinking) break;
                const t = thinking.querySelector('.thinking-text');
                if (t) t.textContent = step;
                await new Promise(r => setTimeout(r, 280));
            }
            if (!this.isThinking) {
                thinking.remove();
                if (UI.stopBtn) UI.stopBtn.classList.add('hidden');
                if (UI.sendBtn) UI.sendBtn.classList.remove('hidden');
                return;
            }
            thinking.remove();

            const q = query.trim();
            const nq = q.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
            let answer = null;
            let matchedKey = null;

            const policyViolation = this.checkPolicyViolation(nq, q);
            if (policyViolation) {
                answer = policyViolation;
                window.__isPolicyWarning = true;
            }

            if (!answer) {
                const category = QuestionClassifier.classify(q);
                if (category === 'timetable') {
                    // 시간표는 아래 전용 로직으로 위임
                } else {
                    const results = QuestionClassifier.searchDB(category, q);
                    if (results.length > 0) {
                        answer = results.map(r => r.value).join('<br><br>');
                        matchedKey = results[0].key;
                    }
                }
            }

            if (!answer && /공식.*사이트|홈페이지|사이트.*알려줘/.test(nq)) {
                const sites = {
                    '네이버':'https://www.naver.com','다음':'https://www.daum.net','구글':'https://www.google.com',
                    '유튜브':'https://www.youtube.com','인스타그램':'https://www.instagram.com','인스타':'https://www.instagram.com',
                    '카카오':'https://www.kakaocorp.com','쿠팡':'https://www.coupang.com','챗지피티':'https://chat.openai.com','chat gpt':'https://chat.openai.com'
                };
                const found = [];
                for (const name in sites) {
                    if (nq.includes(name) && !found.some(f => f.includes(sites[name]))) {
                        found.push(`${name} 공식 사이트는 ${sites[name]} 입니다.`);
                        matchedKey = name;
                    }
                }
                if (found.length) answer = found.join('<br>');
            }

            if (!answer && /(시간표|수업.*뭐|오늘.*수업|내일.*수업|.*교시)/.test(nq)) {
                const data = getTimetable();
                const today = new Date().getDay();
                const days = ['mon','tue','wed','thu','fri'];
                let targetDay = null, dayName = null;

                if (nq.includes('오늘')) {
                    if (today === 0 || today === 6) answer = "주말은 시간표가 없어요. 월~금으로 물어봐줘!";
                    else { targetDay = days[today-1]; dayName = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금'}[targetDay]; }
                } else if (nq.includes('내일')) {
                    const ni = (today===0?0:today-1)+1;
                    if (ni>=5) answer="주말은 시간표가 없어요."; else {targetDay=days[ni]; dayName={mon:'월',tue:'화',wed:'수',thu:'목',fri:'금'}[targetDay];}
                } else if (nq.includes('월')) { targetDay='mon'; dayName='월'; }
                else if (nq.includes('화')) { targetDay='tue'; dayName='화'; }
                else if (nq.includes('수')) { targetDay='wed'; dayName='수'; }
                else if (nq.includes('목')) { targetDay='thu'; dayName='목'; }
                else if (nq.includes('금')) { targetDay='fri'; dayName='금'; }

                if (!answer && targetDay) {
                    const list = data[targetDay] || [];
                    const periodMatch = nq.match(/(\d+)교시/);
                    if (periodMatch) {
                        const tp = parseInt(periodMatch[1]);
                        const found = list.find(item => {
                            const m = item.time.match(/^(\d+):/);
                            if (!m) return false;
                            const h = parseInt(m[1]); const map={8:0,9:1,10:2,13:3,14:4,16:5}; return map[h]===tp;
                        });
                        answer = found ? `${dayName}요일 ${tp}교시는 ${found.subject} (${found.room})` : `${dayName}요일 ${tp}교시 수업이 없어요.`;
                    } else {
                        answer = list.length ? `${dayName}요일 시간표:<br>`+list.map(it=>`${it.time} ${it.subject} ${it.room}`).join('<br>') : `${dayName}요일 수업이 없어요.`;
                    }
                }
            }

            if (!answer) answer = `"${q}"에 대해 학습된 내용이 없어요. 다른 키워드로 물어봐줘!`;

            const shouldDetail = mode === 'detail' || forceDetail;
            if (mode === 'simple' && !forceDetail) {
                answer = answer.split(/<br><br>|\. /)[0] + '.';
            } else if (shouldDetail && matchedKey) {
                const detailKey = matchedKey + '_detail';
                for (const cat in DB) {
                    if (DB[cat][detailKey]) { answer += `<br><br><strong>상세:</strong> ${DB[cat][detailKey]}`; break; }
                }
            }

            this.addMessage(answer, 'ai');
            this.isThinking = false;
            if (UI.stopBtn) UI.stopBtn.classList.add('hidden');
            if (UI.sendBtn) UI.sendBtn.classList.remove('hidden');
            this.updateSendButton();
        },

        updateSendButton() {
            if (!UI.chatInput || !UI.sendBtn) return;
            const hasText = UI.chatInput.value.trim().length > 0;
            UI.sendBtn.disabled = !hasText;
        }
    };

    // ==========================================
    // 5. 시간표 기능
    // ==========================================
    let currentDay = 'mon';
    function getDefaultTimetable() {
        return {
            mon: [{time:'09:00-10:30', subject:'수학', room:'3-2'}, {time:'11:00-12:30', subject:'영어', room:'2-1'}],
            tue: [{time:'10:00-11:30', subject:'과학', room:'실험실'}],
            wed: [], thu: [{time:'13:00-14:30', subject:'국어', room:'3-1'}],
            fri: [{time:'09:00-10:30', subject:'체육', room:'운동장'}]
        };
    }
    function getTimetable() {
        try {
            const saved = localStorage.getItem('timetable');
            return saved ? JSON.parse(saved) : getDefaultTimetable();
        } catch(e) { console.error(e); return getDefaultTimetable(); }
    }
    function saveTimetable(data) { try{ localStorage.setItem('timetable', JSON.stringify(data)); }catch(e){} }
    function loadTimetable(day) {
        if (!UI.timetableContent) return;
        const data = getTimetable(); const list = data[day] || [];
        if (!list.length) {
            UI.timetableContent.innerHTML = `<div class="timetable-empty">수업이 없습니다<br><span style="font-size:12px">+ 버튼으로 추가하세요</span></div>`;
        } else {
            UI.timetableContent.innerHTML = list.map((it,i)=>`
                <div class="timetable-item" data-idx="${i}">
                    <div class="timetable-time">${it.time}</div>
                    <div class="timetable-subject">${it.subject}</div>
                    <div class="timetable-room">${it.room||'-'}</div>
                </div>`).join('');
            document.querySelectorAll('.timetable-item').forEach(el=>{
                let t; const del=()=>{ if(confirm('삭제할까요?')){ const idx=parseInt(el.dataset.idx); const d=getTimetable(); d[day].splice(idx,1); saveTimetable(d); loadTimetable(day); } };
                el.addEventListener('touchstart',()=>{t=setTimeout(del,600)}); el.addEventListener('touchend',()=>clearTimeout(t));
                el.addEventListener('mousedown',()=>{t=setTimeout(del,600)}); el.addEventListener('mouseup',()=>clearTimeout(t));
            });
        }
    }

    // ==========================================
    // 6. 이벤트
    // ==========================================
    function updateMainBtn(){ if(!UI.input||!UI.btn) return; UI.btn.disabled = UI.input.value.trim().length===0; }
    if (UI.input){
        UI.input.addEventListener('input', updateMainBtn);
        UI.input.addEventListener('keydown', e=>{ if(e.key==='Enter'&&!UI.btn.disabled){ System.runReasoning(UI.input.value.trim()); UI.input.value=''; updateMainBtn(); } });
    }
    if (UI.btn) UI.btn.addEventListener('click', ()=>{ System.runReasoning(UI.input.value.trim()); UI.input.value=''; updateMainBtn(); });

    function handleChatInput(){
        if(!UI.chatInput) return;
        System.updateSendButton();
        UI.chatInput.style.height='auto';
        UI.chatInput.style.height=Math.min(UI.chatInput.scrollHeight,160)+'px';
    }
    if (UI.chatInput){
        UI.chatInput.addEventListener('input', handleChatInput);
        UI.chatInput.addEventListener('keydown', e=>{
            if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); if(!UI.sendBtn.disabled){ System.runReasoning(UI.chatInput.value.trim()); UI.chatInput.value=''; UI.chatInput.style.height='auto'; System.updateSendButton(); } }
        });
        UI.chatInput.addEventListener('focus', ()=> setTimeout(()=>{ if(UI.chatBox) UI.chatBox.scrollTop=UI.chatBox.scrollHeight; },300));
    }
    if (UI.sendBtn) UI.sendBtn.addEventListener('click', ()=>{ if(UI.sendBtn.disabled) return; System.runReasoning(UI.chatInput.value.trim()); UI.chatInput.value=''; UI.chatInput.style.height='auto'; System.updateSendButton(); });
    if (UI.stopBtn) UI.stopBtn.addEventListener('click', ()=>{ if(!System.isThinking) return; System.isThinking=false; document.querySelector('.message.thinking')?.remove(); System.addMessage('⏹️ 중지됨','ai'); UI.stopBtn.classList.add('hidden'); UI.sendBtn.classList.remove('hidden'); System.updateSendButton(); });
    if (UI.backBtn) UI.backBtn.addEventListener('click', ()=>{ System.switchView(false); if(UI.chatBox) UI.chatBox.innerHTML=''; });
    UI.examples.forEach(b=> b.addEventListener('click', ()=> System.runReasoning(b.textContent.trim())));

    let pendingUrl='';
    document.addEventListener('click', e=>{
        if(e.target.classList.contains('external-link')){ e.preventDefault(); pendingUrl=e.target.dataset.url; if(UI.modalUrl) UI.modalUrl.textContent=pendingUrl; if(UI.linkModal) UI.linkModal.classList.remove('hidden'); }
    });
    if(UI.modalCancel) UI.modalCancel.onclick=()=> UI.linkModal.classList.add('hidden');
    if(UI.modalGo) UI.modalGo.onclick=()=>{ window.open(pendingUrl,'_blank'); UI.linkModal.classList.add('hidden'); };
    if(UI.linkModal){ const bg=UI.linkModal.querySelector('.modal-backdrop'); if(bg) bg.onclick=()=>UI.linkModal.classList.add('hidden'); }

    if(UI.timetableBtn) UI.timetableBtn.addEventListener('click', ()=>{ if(UI.timetableModal){ UI.timetableModal.classList.remove('hidden'); loadTimetable(currentDay); } });
    if(UI.timetableClose) UI.timetableClose.onclick=()=> UI.timetableModal.classList.add('hidden');
    if(UI.timetableModal){ const bg=UI.timetableModal.querySelector('.modal-backdrop'); if(bg) bg.onclick=()=>UI.timetableModal.classList.add('hidden'); }
    document.querySelectorAll('.tab').forEach(tab=>{ tab.addEventListener('click', ()=>{ document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); currentDay=tab.dataset.day; loadTimetable(currentDay); }); });
    if(UI.addClassBtn) UI.addClassBtn.addEventListener('click', ()=>{ const d=document.getElementById('classDay'); if(d) d.value=currentDay; if(UI.addClassModal) UI.addClassModal.classList.remove('hidden'); });
    if(UI.cancelAdd) UI.cancelAdd.onclick=()=> UI.addClassModal.classList.add('hidden');
    if(UI.addClassModal){ const bg=UI.addClassModal.querySelector('.modal-backdrop'); if(bg) bg.onclick=()=>UI.addClassModal.classList.add('hidden'); }
    if(UI.saveAdd) UI.saveAdd.addEventListener('click', ()=>{
        const dayEl=document.getElementById('classDay'), timeEl=document.getElementById('classTime'), subjEl=document.getElementById('classSubject'), roomEl=document.getElementById('classRoom');
        if(!timeEl||!subjEl){ alert('시간과 과목을 입력하세요'); return; }
        const day=dayEl?dayEl.value:currentDay, time=timeEl.value.trim(), subject=subjEl.value.trim(), room=roomEl?roomEl.value.trim():'';
        if(!time||!subject){ alert('시간과 과목을 입력하세요'); return; }
        const data=getTimetable(); if(!data[day]) data[day]=[]; data[day].push({time,subject,room}); data[day].sort((a,b)=>a.time.localeCompare(b.time));
        saveTimetable(data); if(UI.addClassModal) UI.addClassModal.classList.add('hidden'); timeEl.value=''; subjEl.value=''; if(roomEl) roomEl.value=''; if(day===currentDay) loadTimetable(currentDay);
    });

    document.addEventListener('keydown', e=>{
        if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); const inp=document.getElementById('queryInput')?.offsetParent?document.getElementById('queryInput'):document.getElementById('chatInput'); if(inp) inp.focus(); }
        if(e.key==='Escape'){ document.querySelectorAll('.modal:not(.hidden)').forEach(m=>m.classList.add('hidden')); }
    });
    if(UI.difficultySelect){ UI.difficultySelect.addEventListener('change', e=>{ System.responseMode=e.target.value; }); System.responseMode=UI.difficultySelect.value||'normal'; }

    updateMainBtn(); System.updateSendButton();
});
