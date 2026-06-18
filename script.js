// =========================================================
// Chat K plus - Complete Rebuild (2026-06-18 v3.1-fixed)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. UI 요소 참조
    // ==========================================
    const UI = {
        // 검색 화면
        input: document.getElementById('queryInput'),
        btn: document.getElementById('searchBtn'),
        examples: document.querySelectorAll('.example-btn'),
        searchView: document.getElementById('search-view'),

        // 채팅 화면
        chatView: document.getElementById('chat-view'),
        chatBox: document.getElementById('chat-box'),
        backBtn: document.getElementById('backBtn'),
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn'),
        stopBtn: document.getElementById('stopBtn'),
        difficultySelect: document.getElementById('difficultySelect'),

        // 입력바 컨트롤
        attachmentBtn: document.getElementById('attachmentBtn'),
        timetableBtn: document.getElementById('timetableBtn'),
        menuBtn: document.getElementById('menuBtn'),

        // 링크 경고 모달
        linkModal: document.getElementById('linkModal'),
        modalUrl: document.getElementById('modalUrl'),
        modalCancel: document.getElementById('modalCancel'),
        modalGo: document.getElementById('modalGo'),

        // 시간표 모달
        timetableModal: document.getElementById('timetableModal'),
        timetableClose: document.getElementById('timetableClose'),
        timetableContent: document.getElementById('timetableContent'), // ← 수정: = → :
        addClassBtn: document.getElementById('addClassBtn'),

        // 수업 추가 모달
        addClassModal: document.getElementById('addClassModal'),
        cancelAdd: document.getElementById('cancelAdd'),
        saveAdd: document.getElementById('saveAdd')
    };

    // placeholder 설정
    if (UI.chatInput) {
        UI.chatInput.placeholder = '무엇이든 물어보세요';
    }

    // ==========================================
    // 2. 유틸리티 함수
    // ==========================================
    let paddingTimer = null;

    function fixChatPadding() {
        const footer = document.querySelector('.chat-footer');
        const chatBox = document.getElementById('chat-box');

        if (!footer ||!chatBox) return;

        if (window.innerWidth < 768) {
            clearTimeout(paddingTimer);
            paddingTimer = setTimeout(() => {
                const height = footer.offsetHeight;
                chatBox.style.paddingBottom = (height + 20) + 'px';
                chatBox.scrollTop = chatBox.scrollHeight;

                if (footer.classList.contains('keyboard-open')) {
                    chatBox.style.paddingBottom = (height + 10) + 'px';
                }
            }, 50);
        } else {
            chatBox.style.paddingBottom = '20px';
        }
    }

    window.addEventListener('resize', fixChatPadding);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', fixChatPadding);
    }

    // ==========================================
    // 3. 데이터베이스
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
            "chat k plus 무슨 기반이야": "저는 KRL V10 기반의 AI 어시스턴트입니다. KRL V10은 최신 자연어 처리 기술을 기반으로 한 AI 모델로, 빠른 검색과 대화에 최적화되어 있습니다.",
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
            "시진핑": "시진핑은 현재 중화인민공화국의 주석입니다. 2013년부터 집권 중입니다.",
            "중국 공산당": "중국공산당(CCP)은 1921년 창당된 중국의 집권 정당입니다.",
            "중국 공산당 역사": "중국공산당은 1921년 7월 상하이에서 창당되었습니다. 1949년 중화인민공화국 수립 후 집권당이 되었으며, 마오쩌둥, 덩샤오핑, 장쩌민, 후진타오, 시진핑으로 이어지는 지도 체제를 유지하고 있습니다.",
            "중공 역사": "중국공산당은 1921년 7월 상하이에서 창당되었습니다. 1949년 중화인민공화국 수립 후 집권당이 되었으며, 마오쩌둥, 덩샤오핑, 장쩌민, 후진타오, 시진핑으로 이어지는 지도 체제를 유지하고 있습니다.",
            "ccp 역사": "중국공산당(CCP)은 1921년 창당되어 1949년부터 중국을 통치하는 집권 정당입니다.",
            "만리장성": "만리장성은 중국 북부를 가로지르는 세계 최대 방어시설로 길이가 2만km가 넘습니다.",
            "중국 음식": "짜장면, 마라탕, 딤섬, 베이징덕이 유명합니다."
        },

        baby: {
            "아기": "아기는 출생 후 12개월까지의 영유아를 말합니다. 이 시기는 신체와 뇌 발달이 가장 빠른 시기입니다.",
            "아기_detail": "아기(0~12개월)는 신생아기(0~1개월), 영아기(1~12개월)로 나뉩니다. 평균적으로 생후 6개월에 첫 이가 나고, 12개월경 첫 걸음을 뗍니다. 수면은 하루 14~17시간 필요하며, 모유나 분유를 주식으로 합니다. 애착 형성이 중요한 시기로, 스킨십과 눈맞춤이 정서 발달에 핵심입니다.",
            "신생아": "신생아는 태어난 지 28일 이내의 아기입니다. 하루 16~20시간 수면하며 2~3시간마다 수유합니다.",
            "신생아_detail": "신생아는 체온 조절 능력이 미숙해 실내온도 24~26도를 유지해야 합니다. 배꼽은 보통 1~2주 내 탈락하며, 황달이 흔히 나타납니다. 모로반사, 빨기반사 등 원시반사가 있으며 생후 1개월 내 대부분 사라집니다. 하루 8~12회 수유, 6~8회 소변 기저귀가 정상입니다.",
            "기저귀": "기저귀는 아기 배변을 받아주는 위생용품입니다. 일회용과 천 기저귀로 나뉩니다.",
            "기저귀_detail": "기저귀는 크기별로 신생아용(NB), 소형(S), 중형(M), 대형(L), 특대형(XL)이 있습니다. 하루 평균 8~10개 사용하며, 2~3시간마다 교체가 원칙입니다. 발진 예방을 위해 매번 물티슈로 닦고 충분히 말린 후 착용합니다. 주요 브랜드: 하기스, 팸퍼스, 마미포코. 천기저귀는 빨아서 재사용 가능하나 관리가 번거롭습니다.",
            "분유": "분유는 모유 대용으로 만든 인공 영양식입니다. 1단계(0~6개월), 2단계(6~12개월)로 나뉩니다.",
            "분유_detail": "분유는 조제유라고도 하며, 소나 염소 우유를 아기 소화기관에 맞게 가공한 것입니다. 1단계는 초유 성분과 유사하게, 2단계는 철분과 칼슘이 강화됩니다. 물 1: 분유 1스푼 비율로 40~50도 물에 타서 체온 정도로 식혀 수유합니다. 개봉 후 3주 이내 사용, 제조 후 1시간 내 섭취가 원칙입니다. 주요 브랜드: 앱솔루트, 임페리얼, 아이엠마더.",
            "이유식": "이유식은 생후 6개월부터 시작하는 고형식 연습입니다. 초기-중기-후기-완료기로 진행합니다.",
            "이유식_detail": "이유식은 생후 180일경 시작이 WHO 권고입니다. 초기(6개월): 10배죽, 소고기미음 등 하루 1회. 중기(7~8개월): 7배죽, 채소큐브 추가 하루 2회. 후기(9~11개월): 5배죽, 손가락 음식 하루 3회. 완료기(12개월~): 진밥, 일반식. 알레르기 확인을 위해 한 가지 재료씩 3일 간격으로 추가합니다. 꿀, 생우유, 달걀흰자는 12개월 이후 급여합니다.",
            "아기 수면": "아기는 하루 14~17시간 수면이 필요합니다. 밤낮 구분은 3개월 이후 생깁니다.",
            "아기 수면_detail": "신생아: 16~20시간, 2~4시간 간격. 3개월: 15시간, 밤에 5~6시간 연속 수면 시작. 6개월: 14시간, 밤 8~10시간 통잠 가능. 수면교육은 4~6개월부터 가능하며, 일정한 수면의식(목욕→수유→자장가)이 도움됩니다. 엎드려 재우기는 SIDS 위험으로 금지, 반드시 바로 눕힙니다.",
            "예방접종": "예방접종은 질병 예방을 위한 필수 접종입니다. BCG, B형간염, DPT 등 국가필수예방접종이 있습니다.",
            "예방접종_detail": "국가필수예방접종은 무료입니다. 생후 0개월: B형간염 1차, BCG. 1개월: B형간염 2차. 2개월: DPT 1차, 소아마비 1차. 4개월: DPT 2차, 소아마비 2차. 6개월: B형간염 3차, DPT 3차. 12개월: MMR 1차, 수두. 접종 후 20~30분 병원에 머물며 이상반응 관찰 필요. 발열 시 해열제 복용 가능합니다."
        },

        search: {
            "다음": "다음 공식 사이트는 https://www.daum.net 입니다.",
            "다음 공식 사이트": "다음 공식 사이트는 https://www.daum.net 입니다.",
            "다음 사이트 공식 사이트 알려줘": "다음 공식 사이트는 https://www.daum.net 입니다."
        },

        history: {
            "천안문": "천안문은 중국 베이징 중심부에 있는 성문입니다. 명나라 때 건설되었고 천안문 광장과 자금성의 입구입니다.",
            "천안문_detail": "천안문(天安門)은 1417년 명나라 영락제 때 처음 세워졌고, 현재 건물은 1651년 청나라 순치제 때 재건된 것입니다. 높이 34.7m, 폭 66m 규모입니다. 1949년 10월 1일 마오쩌둥이 중화인민공화국 성립을 선포한 곳이기도 합니다. 천안문 광장은 세계에서 가장 큰 도시 광장 중 하나로 면적은 약 44만㎡입니다.",
            "천안문 광장": "천안문 광장은 베이징 중심부에 있는 대형 광장입니다. 면적 약 44만㎡로 대규모 집회와 행사가 열립니다.",
            "천안문 광장_detail": "천안문 광장은 남북 길이 880m, 동서 500m로 100만 명 이상 수용 가능합니다. 광장 주변에는 인민대회당, 중국국가박물관, 인민영웅기념비, 마오쩌둥 기념당이 있습니다. 매년 국경절 열병식 등 국가 주요 행사가 개최됩니다."
        },

        science: {
            "생물학적 성 차이": "인간의 성별은 성염색체 XX(여성), XY(남성)에 의해 결정됩니다. 성호르몬과 생식기관 구조에서 근본적 차이가 있습니다.",
            "생물학적 성 차이_detail": "🔬 유전적 수준: 여성 XX, 남성 XY 염색체. Y염색체의 SRY 유전자가 고환 발달 촉진.<br><br>호르몬: 여성은 에스트로겐·프로게스테론이 높고, 남성은 테스토스테론이 높음. 이는 근육량, 체지방 분포, 2차 성징에 영향.<br><br>생식기관: 여성은 난소·자궁·질, 남성은 고환·정관·전립선·음경 구조.<br><br>뇌 신경과학: 편도체, 해마, 뇌량 등 일부 영역에서 평균적 차이가 보고되나, 개인차가 성별 간 차이보다 크고 학계 논쟁 중. 과도한 일반화 주의 필요.",
            "성염색체": "성염색체는 성별을 결정하는 염색체입니다. 여성은 XX, 남성은 XY 구성입니다.",
            "성호르몬": "성호르몬은 생식과 2차 성징을 조절합니다. 에스트로겐, 프로게스테론, 테스토스테론이 대표적입니다.",
            "뇌 성 차이": "뇌 구조에서 성별 간 평균적 차이가 일부 보고되나, 개인차가 더 크고 학계에서 논쟁 중입니다.",
            "섹스": "섹스(Sex)는 생물학적 성별을 의미합니다. 인간의 경우 성염색체 XX(여성), XY(남성)에 의해 결정되며, 성호르몬과 생식기관 구조에서 근본적 차이가 있습니다.",
            "과학": "과학은 자연 현상을 체계적으로 관찰, 실험, 분석하여 법칙과 원리를 발견하는 학문입니다."
        },

        websites: {
            "네이버 공식 사이트": "네이버 공식 사이트는 https://www.naver.com 입니다.",
            "구글": "구글 공식 사이트는 https://www.google.com 입니다.",
            "구글 공식 사이트": "구글 공식 사이트는 https://www.google.com 입니다.",
            "유튜브": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
            "유튜브 공식 사이트": "유튜브 공식 사이트는 https://www.youtube.com 입니다.",
            "인스타그램": "인스타그램 공식 사이트는 https://www.instagram.com 입니다.",
            "카카오": "카카오 공식 사이트는 https://www.kakaocorp.com 입니다.",
            "쿠팡": "쿠팡 공식 사이트는 https://www.coupang.com 입니다."
        },

        impeachment: {
            "박근혜 전 대통령 탄핵 이유": "박근혜 전 대통령은 2017년 3월 10일 헌법재판소에서 탄핵이 인용되었습니다. 주요 사유: 최순실 국정 개입, 미르·K스포츠재단 출연금 강요, 세월호 대응 부실 등.",
            "역대 대통령 탄핵": "대한민국 역사상 탄핵된 대통령은 박근혜 전 대통령 한 명입니다. 2017년 3월 10일 헌법재판소에서 탄핵이 인용되었습니다."
        }
    };

    // ==========================================
    // 4. 질문 분류 시스템
    // ==========================================
    const QuestionClassifier = {
        classify(query) {
            const nq = query.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');

            if (/(너|니).*(누구|뭐|정체|기반|krl)/.test(nq)) return 'ai';
            if (/공식.*사이트|홈페이지/.test(nq)) return 'websites';
            if (/(시간표|수업)/.test(nq)) return 'timetable';
            if (nq.includes('중국')) return 'china';
            if (/(아기|신생아|기저귀|분유|이유식)/.test(nq)) return 'baby';
            if (/(천안문|역사)/.test(nq)) return 'history';
            if (/(생물학|성|염색체|호르몬|뇌|섹스|과학)/.test(nq)) return 'science';
            if (/(정치|탄핵)/.test(nq)) return 'politics';
            if (/(영화|아바타)/.test(nq)) return 'entertainment';
            if (/(다음|네이버|구글)/.test(nq)) return 'search';

            return 'all';
        },

        searchDB(category, query) {
            const nq = query.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
            const results = [];

            const searchIn = (cat) => {
                for (const key in DB[cat]) {
                    const nk = key.toLowerCase();
                    if (nq.includes(nk) || nk.includes(nq)) {
                        results.push({ key, value: DB[cat][key], category: cat });
                    }
                }
            };

            if (category === 'all') {
                for (const cat in DB) searchIn(cat);
            } else if (DB[category]) {
                searchIn(category);
            }

            return results;
        }
    };

    // ==========================================
    // 5. 시스템 기능
    // ==========================================
    const System = {
        isThinking: false,
        responseMode: 'normal',

        switchView(isChat) {
            if (!UI.searchView ||!UI.chatView) return;

            UI.searchView.style.display = isChat? 'none' : 'flex';
            UI.chatView.style.display = isChat? 'flex' : 'none';

            if (isChat) {
                setTimeout(() => {
                    UI.chatInput?.focus();
                    fixChatPadding();
                }, 100);
            }
        },

        addMessage(text, type) {
            if (!UI.chatBox) return null;

            const msg = document.createElement('div');
            msg.className = `message ${type === 'user'? 'user-msg' : 'ai-msg'}`;

            if (window.__isPolicyWarning) {
                msg.classList.add('policy-warning');
                window.__isPolicyWarning = false;
            }

            const urlRegex = /(https?:\/\/[^\s]+)/g;
            msg.innerHTML = text.match(urlRegex)
               ? text.replace(urlRegex, url => `<a href="#" class="external-link" data-url="${url}">${url}</a>`)
                : text;

            UI.chatBox.appendChild(msg);
            UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
            fixChatPadding();

            return msg;
        },

        async runReasoning(query) {
            if (!query || this.isThinking) return;
            this.isThinking = true;

            const mode = this.responseMode;
            const forceDetail = /(구체적|자세히|상세)/.test(query);

            UI.sendBtn?.classList.add('hidden');
            UI.stopBtn?.classList.remove('hidden');

            this.switchView(true);
            this.addMessage(query, 'user');

            // 씽킹 애니메이션
            const thinking = document.createElement('div');
            thinking.className = 'message ai-msg thinking';
            thinking.innerHTML = `<span class="thinking-icon"></span> <span class="thinking-text">분석 중...</span>`;
            UI.chatBox.appendChild(thinking);

            const steps = ["분석 중...", "검색 중...", "확인 중...", "생성 중..."];
            for (const step of steps) {
                if (!this.isThinking) break;
                thinking.querySelector('.thinking-text').textContent = step;
                await new Promise(r => setTimeout(r, 400));
            }

            if (!this.isThinking) {
                thinking.remove();
                UI.stopBtn?.classList.add('hidden');
                UI.sendBtn?.classList.remove('hidden');
                return;
            }

            thinking.remove();

            // 정책 필터
            const nq = query.toLowerCase().replace(/[?!.~]/g, '').replace(/\s+/g, ' ');
            let answer = this.checkPolicyViolation(nq, query);
            let matchedKey = null;

            if (answer) {
                window.__isPolicyWarning = true;
            } else {
                // DB 검색
                const category = QuestionClassifier.classify(query);
                const results = QuestionClassifier.searchDB(category, query);

                if (results.length > 0) {
                    answer = results[0].value;
                    matchedKey = results[0].key;
                }
            }

            // 시간표 처리
            if (!answer && /(시간표|수업)/.test(nq)) {
                const data = getTimetable();
                const today = new Date().getDay();
                const days = ['mon','tue','wed','thu','fri'];
                const targetDay = days[today === 0? 0 : Math.min(today - 1, 4)];

                if (today === 0 || today === 6) {
                    answer = "주말 시간표는 제공하지 않습니다.";
                } else {
                    const list = data[targetDay] || [];
                    const dayName = {mon:'월',tue:'화',wed:'수',thu:'목',fri:'금'}[targetDay];
                    answer = list.length
                       ? `${dayName}요일 시간표:<br>` + list.map(it => `${it.time} ${it.subject}`).join('<br>')
                        : `${dayName}요일 수업이 없습니다.`;
                }
            }

            if (!answer) answer = `"${query}"에 대해 학습된 내용이 없습니다.`;

            // 난이도 처리
            if (mode === 'simple' &&!forceDetail) {
                answer = answer.split(/[.!?]\s/)[0] + '.';
            } else if ((mode === 'detail' || forceDetail) && matchedKey) {
                const detailKey = matchedKey + '_detail';
                for (const cat in DB) {
                    if (DB[cat][detailKey]) {
                        answer += `<br><strong>상세:</strong> ${DB[cat][detailKey]}`;
                        break;
                    }
                }
            }

            this.addMessage(answer, 'ai');
            this.isThinking = false;
            UI.stopBtn?.classList.add('hidden');
            UI.sendBtn?.classList.remove('hidden');
            this.updateSendButton();
        },

        checkPolicyViolation(nq, rawQ) {
            const criticalKeywords = ['비판','독재','부패','타도','병신','새끼','죽어','탄핵'];
            const chinaKeywords = ['중국','시진핑','천안문','위구르'];

            const hasChina = chinaKeywords.some(k => nq.includes(k));
            const hasCritical = criticalKeywords.some(k => nq.includes(k));

            if (hasChina && hasCritical) {
                return `<strong>⚠️ 정책 위반</strong><br><br>중국 관련 비판적 내용은 차단됩니다.`;
            }

            return null;
        },

        updateSendButton() {
            if (!UI.chatInput ||!UI.sendBtn) return;
            const hasText = UI.chatInput.value.trim().length > 0;
            UI.sendBtn.disabled =!hasText;
        }
    };

    // ==========================================
    // 6. 시간표 기능
    // ==========================================
    let currentDay = 'mon';

    function getDefaultTimetable() {
        return {
            mon: [{time:'09:00-10:30', subject:'수학', room:'3-2'}],
            tue: [{time:'10:00-11:30', subject:'과학', room:'실험실'}],
            wed: [],
            thu: [{time:'13:00-14:30', subject:'국어', room:'3-1'}],
            fri: [{time:'09:00-10:30', subject:'체육', room:'운동장'}]
        };
    }

    function getTimetable() {
        try {
            return JSON.parse(localStorage.getItem('timetable')) || getDefaultTimetable();
        } catch {
            return getDefaultTimetable();
        }
    }

    function saveTimetable(data) {
        localStorage.setItem('timetable', JSON.stringify(data));
    }

    function loadTimetable(day) {
        if (!UI.timetableContent) return;

        const data = getTimetable();
        const list = data[day] || [];

        UI.timetableContent.innerHTML = list.length === 0
           ? `<div class="timetable-empty">수업이 없습니다</div>`
            : list.map((item, idx) => `
                <div class="timetable-item" data-idx="${idx}">
                    <div class="timetable-time">${item.time}</div>
                    <div class="timetable-subject">${item.subject}</div>
                    <div class="timetable-room">${item.room}</div>
                </div>
            `).join('');
    }

    // ==========================================
    // 7. 이벤트 리스너
    // ==========================================
    if (UI.input) {
        UI.input.addEventListener('input', () => {
            if (UI.btn) UI.btn.disabled = UI.input.value.trim().length === 0;
        });

        UI.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && UI.input.value.trim()) {
                System.runReasoning(UI.input.value.trim());
                UI.input.value = '';
            }
        });
    }

    if (UI.btn) {
        UI.btn.addEventListener('click', () => {
            if (UI.input.value.trim()) {
                System.runReasoning(UI.input.value.trim());
                UI.input.value = '';
            }
        });
    }

    if (UI.chatInput) {
        UI.chatInput.addEventListener('input', () => {
            System.updateSendButton();
            UI.chatInput.style.height = 'auto';
            UI.chatInput.style.height = Math.min(UI.chatInput.scrollHeight, 120) + 'px';
            fixChatPadding();
        });

        UI.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' &&!e.shiftKey) {
                e.preventDefault();
                if (UI.chatInput.value.trim()) {
                    System.runReasoning(UI.chatInput.value.trim());
                    UI.chatInput.value = '';
                    UI.chatInput.style.height = 'auto';
                }
            }
        });
    }

    if (UI.sendBtn) {
        UI.sendBtn.addEventListener('click', () => {
            if (UI.chatInput.value.trim()) {
                System.runReasoning(UI.chatInput.value.trim());
                UI.chatInput.value = '';
                UI.chatInput.style.height = 'auto';
            }
        });
    }

    if (UI.stopBtn) {
        UI.stopBtn.addEventListener('click', () => {
            System.isThinking = false;
            document.querySelector('.thinking')?.remove();
            System.addMessage('⏹️ 중지됨', 'ai');
        });
    }

    if (UI.backBtn) {
        UI.backBtn.addEventListener('click', () => {
            System.switchView(false);
            if (UI.chatBox) UI.chatBox.innerHTML = '';
        });
    }

    UI.examples.forEach(btn => {
        btn.addEventListener('click', () => {
            System.runReasoning(btn.textContent.trim());
        });
    });

    // 모달 처리
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('external-link')) {
            e.preventDefault();
            const url = e.target.dataset.url;
            if (UI.modalUrl) UI.modalUrl.textContent = url;
            UI.linkModal?.classList.remove('hidden');
        }
    });

    UI.modalCancel?.addEventListener('click', () => UI.linkModal?.classList.add('hidden'));
    UI.modalGo?.addEventListener('click', () => {
        window.open(UI.modalUrl?.textContent, '_blank');
        UI.linkModal?.classList.add('hidden');
    });

    // 시간표
    UI.timetableBtn?.addEventListener('click', () => {
        UI.timetableModal?.classList.remove('hidden');
        loadTimetable(currentDay);
    });

    UI.timetableClose?.addEventListener('click', () => {
        UI.timetableModal?.classList.add('hidden');
    });

    // 초기화
    System.updateSendButton();
    if (UI.btn) UI.btn.disabled = true;
});
