const knowledgeBase = {
    // 인사 및 기본
    greetings: {
        keywords: ['안녕', '하이', '헬로', 'hi', 'hello', 'hey', '반가워', 'ㅎㅇ', 'greetings', 'good morning', 'good evening'],
        responses: [
            "안녕하세요! 👋 Chat Got입니다. 오늘은 어떤 도움이 필요하신가요? 질문이 있다면 편하게 물어봐주세요.",
            "반갑습니다! 저는 Chat Got이에요. 궁금하신 점이나 도움이 필요하신 부분이 있으시다면 언제든 말씀해주세요.",
            "Hello! I'm Chat Got, your AI assistant. How can I help you today? Whether it's coding, writing, research, or just casual conversation, I'm here for you."
        ]
    },
    
    identity: {
        keywords: ['누구', '너는 누구', '이름', '정체', 'who are you', 'what are you', '자기소개', '소개', '너는', '챗봇'],
        responses: [
            "저는 Chat Got입니다! 🎯 최신 AI 기술로 만들어진 지능형 어시스턴트입니다. 프로그래밍, 글쓰기, 학습, 아이디어 발상, 문제 해결 등 다양한 분야에서 도움을 드릴 수 있어요. \n\n특히 코드 리뷰, 알고리즘 설명, 기술 문서 작성에 강점을 가지고 있습니다. 무엇이 궁금하신가요?",
            "안녕하세요! 저는 Chat Got이라고 해요. 방대한 지식 베이스를 기반으로 사용자분들의 질문에 답변하는 AI 어시스턴트입니다. \n\n제 특징은:\n• 신속하고 정확한 답변\n• 다양한 분야의 지식\n• 친절하고 이해하기 쉬운 설명\n• 코딩, 수학, 과학, 인문학 등 폭넓은 커버리지\n\n어떤 것이 궁금하신가요? 😊"
        ]
    },

    // 기술 & 프로그래밍
    programming: {
        keywords: ['코드', '프로그래밍', '파이썬', 'python', '자바', 'java', '자바스크립트', 'javascript', '코딩', '개발', '알고리즘', '함수', '클래스', 'api', 'database', 'sql', 'react', 'vue', 'angular', 'node', 'django', 'flask', 'git', 'docker'],
        responses: [
            "프로그래밍 관련 질문이시군요! 💻\n\n제가 도와드릴 수 있는 부분:\n• 코드 리뷰 및 최적화 제안\n• 알고리즘 설명 및 구현\n• 디버깅 도움\n• 디자인 패턴 추천\n• Best practices 안내\n\n구체적인 코드나 문제 상황을 알려주시면 더 정확한 도움을 드릴 수 있어요.",
            "코딩에 관심이 있으시군요! 개발자로서 성장하는데 도움이 되는 조언을 드릴게요.\n\n최근 트렌드:\n- 클린 코드와 리팩토링의 중요성\n- 테스트 주도 개발(TDD)\n- 마이크로서비스 아키텍처\n- AI/ML 통합\n\n어떤 언어나 프레임워크에 대해 알고 싶으신가요?"
        ]
    },

    python: {
        keywords: ['파이썬', 'python', 'pip', 'django', 'flask', 'numpy', 'pandas', 'tensorflow', 'pytorch'],
        responses: [
            "Python은 정말 versatile한 언어죠! 🐍\n\nPython의 강점:\n• 읽기 쉽고 간결한 문법\n• 방대한 라이브러리 생태계\n• 데이터 과학, ML, 웹 개발, 자동화에 강함\n• 강력한 커뮤니티 지원\n\nPython 관련해서 구체적으로 어떤 도움이 필요하신가요?",
            "Python 개발을 도와드릴게요!\n\n주요 사용 사례:\n- 데이터 분석 (pandas, numpy)\n- 머신러닝 (scikit-learn, tensorflow)\n- 웹 개발 (Django, Flask)\n- 자동화 스크립트\n- API 개발\n\n특정 문제나 구현하고 싶은 기능이 있으신가요?"
        ]
    },

    javascript: {
        keywords: ['자바스크립트', 'javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript', 'ts', 'frontend', '프론트엔드'],
        responses: [
            "JavaScript/TypeScript 관련 질문이군요! ⚡\n\n현대 JS 생태계:\n• React, Vue, Angular - 주요 프론트엔드 프레임워크\n• Node.js - 서버사이드 JS\n• TypeScript - 정적 타입 지원\n• Next.js, Nuxt - SSR/SSG 프레임워크\n\n어떤 부분에 대해 더 알고 싶으신가요?",
            "프론트엔드 개발의 핵심이죠!\n\n2024년 트렌드:\n- Server Components\n- Edge Computing\n- AI 통합 웹앱\n- WebAssembly\n\n구체적인 프로젝트나 문제가 있으시면 말씀해주세요."
        ]
    },

    // 비즈니스 & 생산성
    productivity: {
        keywords: ['생산성', '시간관리', 'productivity', 'time management', 'gtd', 'pomodoro', '뽀모도로', '계획', '목표', '효율'],
        responses: [
            "생산성 향상을 위한 핵심 전략을 공유해드릴게요! ⚡\n\n1. 시간 관리 기법\n• Pomodoro 테크닉: 25분 집중, 5분 휴식\n• Time Blocking: 일정 블록 단위로 계획\n• Eisenhower Matrix: 중요도/긴급도로 작업 분류\n\n2. 도구 추천\n• Notion, Obsidian (노트/지식 관리)\n• Todoist, TickTick (할 일 관리)\n• Forest (집중력 향상)\n\n3. 습관 형성\n• Atomic Habits 방법론\n• 2분 규칙: 작게 시작하기\n• habit stacking: 기존 습관에 연결\n\n어떤 부분을 더 개선하고 싶으신가요?",
            "효과적인 생산성 향상 방법을 알려드릴게요!\n\n핵심 원칙:\n• Deep Work: 방해없는 깊은 집중 시간 확보\n• 80/20 법칙: 가장 중요한 20%에 집중\n• Weekly Review: 주간 리뷰로 방향 점검\n\n아침 루틴의 중요성도 빼놓을 수 없어요:\n1. 명상 또는 가벼운 운동\n2. 하루 목표 설정\n3. 가장 어려운 작업 먼저 처리\n\n도움이 되셨나요?"
        ]
    },

    // 건강 & 웰빙
    health: {
        keywords: ['건강', '운동', '다이어트', '식단', 'health', 'exercise', 'diet', 'workout', 'fitness', '헬스', '영양', '수면', '스트레스'],
        responses: [
            "건강과 웰빙은 중요한 주제입니다! 💪\n\n종합적인 건강 관리:\n\n1. 운동\n• 주 3-5회, 30분 이상의 중강도 운동\n• 유산소 + 근력 운동 조합\n• 일상 속 활동량 증가 (계단 이용, 걷기 등)\n\n2. 영양\n• 균형 잡힌 식단: 단백질, 탄수화물, 지방의 적절한 비율\n• 충분한 수분 섭취 (하루 2L 이상)\n• 가공식품 줄이기\n\n3. 수면\n• 7-9시간의 충분한 수면\n• 일정한 수면 시간 유지\n• 취침 전 블루라이트 차단\n\n4. 정신 건강\n• 명상, 마인드풀니스\n• 스트레스 관리 기법\n• 필요시 전문가 상담",
            "건강한 라이프스타일을 위한 조언입니다! 🌟\n\n핵심 요소:\n• 규칙적인 운동 루틴\n• 영양가 있는 식사\n• 충분한 수면과 휴식\n• 스트레스 관리\n\n기억하세요: 작은 변화부터 시작하는 것이 중요합니다. 갑작스러운 변화보다 지속 가능한 습관 형성이 더 효과적이에요.\n\n구체적인 목표가 있으신가요?"
        ]
    },

    // 학습 & 교육
    learning: {
        keywords: ['공부', '학습', '공부법', 'study', 'learning', '암기', '기억', '시험', '자격증', '교육', '온라인 강의', '강좌'],
        responses: [
            "효과적인 학습 방법을 알려드릴게요! 📚\n\n과학적으로 검증된 학습법:\n\n1. 능동적 회상 (Active Recall)\n• 단순히 읽지 말고 기억을 떠올리는 연습\n• 플래시카드 활용 (Anki 추천)\n\n2. 간격 반복 (Spaced Repetition)\n• 일정 간격으로 복습\n• 망각 곡선을 고려한 학습 스케줄\n\n3. 파인만 테크닉\n• 개념을 아주 단순하게 설명해보기\n• 이해하지 못한 부분 파악\n\n4. 다양한 자료 활용\n• 비디오, 책, 실습, 토론 등\n• 멀티모달 학습\n\n5. 메타인지\n• 자신의 학습 과정을 모니터링\n• 취약점 파악 및 개선",
            "학습 효율을 높이는 방법입니다! 🎯\n\n핵심 전략:\n• Pomodoro 타이머로 집중력 유지\n• Cornell 노트 필기법\n• Mind Map으로 개념 연결\n• 스터디 그룹 활용\n\n가장 중요한 것은 '꾸준함'입니다. 매일 조금씩이라도 학습하는 습관을 들이세요.\n\n어떤 과목이나 분야를 공부하고 계신가요?"
        ]
    },

    // 과학
    science: {
        keywords: ['과학', '물리', '화학', '생물', '지구과학', '우주', 'quantum', '양자', '상대성', 'dna', '유전', '진화', 'science', 'physics', 'chemistry', 'biology'],
        responses: [
            "과학적 주제에 대해 설명드릴게요! 🔬\n\n과학의 주요 분야:\n• 물리학: 물질과 에너지의 기본 원리 연구\n• 화학: 물질의 구성과 변화\n• 생물학: 생명체의 구조와 기능\n• 지구과학: 지구 시스템과 우주\n\n최근 주목받는 분야:\n- 양자 컴퓨팅\n- CRISPR 유전자 편집\n- 인공지능과 뇌과학\n- 기후 변화 연구\n\n구체적으로 어떤 주제가 궁금하신가요?",
            "과학은 우리 주변의 모든 것을 설명합니다! 🌍\n\n알아두면 좋은 핵심 개념:\n• 과학적 방법론: 관찰 → 가설 → 실험 → 검증\n• 에너지 보존 법칙\n• 진화론과 자연선택\n• 양자역학의 기초\n\n복잡한 개념도 쉽게 설명해드릴 수 있어요. 어떤 것이 궁금하신가요?"
        ]
    },

    // 수학
    math: {
        keywords: ['수학', 'math', '미적분', '대수', '기하', '통계', '확률', '방정식', '함수', 'calculus', 'algebra', 'statistics'],
        responses: [
            "수학 관련 질문이군요! 📐\n\n수학의 주요 영역:\n• 대수학: 방정식, 함수, 행렬\n• 기하학: 도형, 공간, 벡터\n• 미적분학: 변화율, 적분, 극한\n• 통계학: 데이터 분석, 확률\n• 이산수학: 그래프 이론, 조합론\n\n수학은 논리적 사고력과 문제 해결 능력을 키워줍니다. 특히 프로그래밍, 데이터 과학, 금융 등에서 필수적이에요.\n\n어떤 수학 문제로 도움이 필요하신가요?"
        ]
    },

    // 글쓰기 & 커뮤니케이션
    writing: {
        keywords: ['글쓰기', '작문', '에세이', '이메일', '보고서', 'writing', 'essay', 'email', '글', '작성', '문서', '프레젠테이션', '발표'],
        responses: [
            "효과적인 글쓰기 전략을 공유합니다! ✍️\n\n좋은 글의 조건:\n1. 명확한 목적과 대상\n2. 논리적인 구조\n3. 구체적인 예시와 근거\n4. 간결하고 명확한 문장\n\n글쓰기 프로세스:\n• 브레인스토밍 → 개요 작성 → 초안 → 수정/퇴고 → 최종\n\n장르별 팁:\n• 에세이: 서론-본론-결론 구조\n• 비즈니스 이메일: 간결하고 목적 중심\n• 보고서: 데이터와 분석 포함\n• 블로그: 독자 참여 유도\n\n어떤 종류의 글을 쓰고 계신가요?",
            "글쓰기 실력 향상을 위한 조언입니다! 📝\n\n핵심 원칙:\n• 하루 10분이라도 매일 쓰기\n• 많이 읽고 좋은 문장 따라하기\n• 퇴고의 중요성: 초안은 rough해도 OK\n• 피드백 받기\n\n추천 도구:\n- Grammarly (문법 검사)\n- Hemingway Editor (가독성)\n- Notion (문서 정리)\n\n어떤 도움이 필요하신가요?"
        ]
    },

    // 창의성 & 아이디어
    creativity: {
        keywords: ['아이디어', '창의', '브레인스토밍', 'creative', 'creativity', 'innovation', '혁신', '상상', '영감', 'inspiration'],
        responses: [
            "창의성을 키우는 방법을 알려드릴게요! 💡\n\n창의적 사고 기법:\n\n1. SCAMPER\n• Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse\n\n2. 마인드맵\n• 중심 주제에서 가지를 뻗어나가며 연관 아이디어 탐색\n\n3. 역발상\n• 의도적으로 반대 관점에서 생각하기\n\n4. 제약 조건 활용\n• 제한된 자원/시간이 오히려 창의성을 촉진\n\n5. 교차 도메인 사고\n• 다른 분야의 개념을 접목\n\n어떤 분야에서 아이디어가 필요하신가요?"
        ]
    },

    // 진로 & 커리어
    career: {
        keywords: ['취업', '이직', '면접', '이력서', 'resume', 'career', 'job', '커리어', '연봉', '직장', '자기개발', '경력'],
        responses: [
            "커리어 개발에 대한 조언입니다! 🚀\n\n취업/이직 준비:\n1. 이력서/포트폴리오\n• 성과 중심으로 작성\n• 수치화된 결과 포함\n• GitHub, 블로그 등 온라인 존재감\n\n2. 면접 준비\n• 기술 면접: 알고리즘, 시스템 디자인\n• 행동 면접: STAR 기법 활용\n• 회사 리서치 철저히\n\n3. 네트워킹\n• LinkedIn 적극 활용\n• 컨퍼런스, 밋업 참여\n• 정보성 인터뷰\n\n4. 지속적 학습\n• 온라인 강의 (Coursera, Udemy)\n• 자격증 취득\n• 사이드 프로젝트",
            "성공적인 커리어를 위한 전략입니다! 📈\n\n핵심 요소:\n• 자신만의 전문성 개발\n• 지속적인 학습과 성장\n• 인맥 관리의 중요성\n• 워라밸 균형\n\n현재 어떤 분야에서 일하고 계시거나 취업을 준비 중이신가요?"
        ]
    },

    // 재무 & 경제
    finance: {
        keywords: ['돈', '투자', '주식', '비트코인', '저축', '재테크', 'finance', 'investment', 'economy', '경제', '금융', '부동산'],
        responses: [
            "재무 관리와 투자에 대해 설명드릴게요! 💰\n\n기본 원칙:\n1. 비상금 확보 (3-6개월 생활비)\n2. 고금리 부채 우선 상환\n3. 분산 투자\n4. 장기적 관점 유지\n\n투자 옵션:\n• 주식: 개별 종목 또는 ETF\n• 채권: 안정적 수익\n• 부동산: REITs 포함\n• 현금성 자산: 예금, MMF\n\n주의사항:\n• 레버리지 주의\n• FOMO에 휩쓸리지 않기\n• 꾸준한 학습 필요",
            "현명한 재무 관리를 위한 조언입니다! 📊\n\n재정 관리 50/30/20 규칙:\n• 50%: 필수 지출\n• 30%: 개인 지출\n• 20%: 저축 및 투자\n\n초보 투자자라면:\n1. 소액으로 시작\n2. 인덱스 펀드/ETF 고려\n3. 정기적 투자 (DCA)\n4. 장기 보유 전략\n\n도움이 되셨나요?"
        ]
    },

    // 철학 & 심리
    philosophy: {
        keywords: ['철학', '심리', '마음', 'philosophy', 'psychology', '사상', '윤리', '의미', '행복'],
        responses: [
            "철학과 심리학은 인간 이해의 핵심입니다! 🧠\n\n주요 철학 사상:\n• 스토아학파: 통제 가능한 것에 집중\n• 실존주의: 개인의 자유와 책임\n• 공리주의: 최대 다수의 최대 행복\n\n심리학 인사이트:\n• 인지 편향: 우리의 판단은 완벽하지 않다\n• 성장 마인드셋: 능력은 발전할 수 있다는 믿음\n• 자기결정이론: 자율성, 유능감, 관계성의 중요성\n\n더 깊이 탐구하고 싶은 주제가 있나요?"
        ]
    },

    // 기본 응답 - 카테고리 매칭 실패시
    default: {
        keywords: [],
        responses: [
            "흥미로운 질문이네요! 🤔 이 주제에 대해 더 자세히 알려주실 수 있나요? 구체적인 내용이나 상황을 말씀해주시면 더 정확하고 도움이 되는 답변을 드릴 수 있어요.",
            "좋은 질문입니다! 이에 대해 더 깊이 있는 답변을 드리기 위해, 어떤 측면에 특히 관심이 있으신지 여쭤봐도 될까요? 관련 정보나 맥락을 추가로 알려주시면 더 도움이 되는 답변을 준비하겠습니다.",
            "질문해주셔서 감사합니다! 이 주제에 대해 제가 알고 있는 정보를 바탕으로 답변드리고 싶은데요. 조금 더 구체적인 내용이나 범위를 알려주시면 더 유용한 정보를 제공해드릴 수 있을 것 같아요.",
            "이해했습니다. 이 주제는 여러 각도에서 접근할 수 있는데요. 실용적인 관점에서 도움이 필요하신가요, 아니면 이론적인 설명이 필요하신가요? 방향을 알려주시면 그에 맞춰 설명드리겠습니다.",
            "흥미로운 주제를 질문해주셨네요! 이 분야에 대해 다양한 정보를 공유해드릴 수 있어요. 혹시 특별히 궁금한 세부 주제나 해결하고 싶은 문제가 있으신가요?"
        ]
    }
};

// 지식 베이스 검색 함수
function searchKnowledgeBase(query) {
    const lowerQuery = query.toLowerCase();
    
    // 각 카테고리별로 키워드 매칭 점수 계산
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [category, data] of Object.entries(knowledgeBase)) {
        if (category === 'default') continue;
        
        let score = 0;
        for (const keyword of data.keywords) {
            if (lowerQuery.includes(keyword)) {
                score += keyword.length; // 더 긴 키워드에 가중치
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = category;
        }
    }
    
    // 매칭된 카테고리의 응답 반환, 없으면 default
    if (bestMatch && bestScore > 0) {
        const responses = knowledgeBase[bestMatch].responses;
        return {
            category: bestMatch,
            response: responses[Math.floor(Math.random() * responses.length)]
        };
    }
    
    const defaultResponses = knowledgeBase.default.responses;
    return {
        category: 'default',
        response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
}
