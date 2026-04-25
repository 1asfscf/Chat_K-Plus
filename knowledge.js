const knowledgeBase = {
    greetings: {
        keywords: ['안녕', '하이', '헬로', 'hi', 'hello', 'hey', '반가워', 'ㅎㅇ', 'greetings', 'good morning', 'good evening', 'good afternoon'],
        patterns: [/^\s*(?:안녕|하이|헬로|hi|hello|hey|반가워|ㅎㅇ)/i],
        priority: 10,
        responses: [
            "안녕하세요! 반가워요 😊 오늘은 어떤 이야기를 나눠볼까요?",
            "안녕하세요! Chat Got입니다. 무엇을 도와드릴까요?",
            "반갑습니다! 편하게 질문해주세요. 최선을 다해 답변드릴게요."
        ],
        followUp: "궁금한 점이나 도움이 필요한 일이 있으신가요?"
    },
    
    identity: {
        keywords: ['누구', '너는 누구', '이름', '정체', 'who are you', 'what are you', '자기소개', '소개', '너는', '챗봇', '만들었어', '만든', '제작자', '개발자'],
        patterns: [/(?:너는?|누구|정체|who\s+are\s+you|what\s+are\s+you|자기소개)/i],
        priority: 9,
        responses: [
            "저는 **Chat Got**이라는 AI 어시스턴트예요! 코딩, 학습, 글쓰기, 일상 대화 등 다양한 주제에서 도움을 드리고 있어요.\n\n특정 기술 스택이나 관심사가 있으시면 말씀해 주세요, 더 맞춤형으로 도와드릴 수 있어요.",
            "안녕하세요! 저는 Chat Got입니다. 사용자분들의 질문에 답변하고, 문제 해결을 돕는 것을 목표로 하고 있어요.\n\n어떤 분야에 관심이 있으신가요? 함께 이야기 나눠봐요!"
        ],
        followUp: "저에 대해 더 궁금한 점이 있으신가요?"
    },

    study: {
        keywords: ['공부', '학습', 'study', 'learning', '배우', '배움', '교육', '강의', '스터디', '자기계발'],
        patterns: [/(?:공부|학습|study|learning|배우|배움|교육|강의|스터디|자기계발)/i],
        priority: 8,
        responses: [
            "공부는 정말 중요한 주제예요. 효과적인 학습을 위해서는 **목표 설정 → 계획 수립 → 실행 → 복습**의 사이클이 핵심이에요.\n\n### 추천 학습법\n- **뽀모도로 기법**: 25분 집중 + 5분 휴식\n- **액티브 리콜**: 배운 내용을 스스로 설명해보기\n- **스페이스드 리피티션**: 점진적으로 복습 간격을 늘리기\n\n어떤 분야를 공부 중이신가요? 구체적으로 알려주시면 더 좋은 방법을 제안드릴게요.",
            "좋은 질문이에요! 공부의 핵심은 **지속 가능한 습관**을 만드는 거예요.\n\n### 효과적인 학습 전략\n1. **왜** 배우는지 명확히 하기\n2. 작은 목표로 나누어 실행하기\n3. 다양한 감각(시각, 청각, 촉각) 활용하기\n4. 정기적으로 복습하기\n\n지금 어떤 과목이나 기술을 배우고 계신가요?"
        ],
        followUp: "특정 과목이나 기술에 대해 더 자세히 알고 싶으신가요?"
    },

    study_tips: {
        keywords: ['공부 잘하는 법', '공부 비법', '공부 팁', '학습법', '공부 습관', '시험 공부', '자격증 공부', '집중', '몰입', '기억력'],
        patterns: [/(?:공부\s*(?:잘|비법|팁|법)|학습법|집중|몰입|기억력|시험\s*공부|자격증)/i],
        priority: 8,
        responses: [
            "효과적인 공부법에 대해 알려드릴게요!\n\n### 뇌과학 기반 학습법\n- **뽀모도로 기법**: 25분 집중 → 5분 휴식 (4회 후 15분 휴식)\n- **파킨슨의 법칙**: 시간을 정해두면 집중력이 높아져요\n- **피그말리온 효과**: 할 수 있다는 믿음이 실제 성과로 이어져요\n\n### 구체적 전략\n| 상황 | 추천 방법 |\n|------|----------|\n| 암기가 필요할 때 | 플래시카드 + 간격 반복 |\n| 이해가 어려울 때 | 남에게 설명해보기 (피그말리온 효과) |\n| 집중이 안 될 때 | 2분 타이머로 시작하기 |\n\n어떤 상황에서 가장 어려움을 겪고 계신가요?",
            "공부를 잘하려면 **자신에게 맞는 방법**을 찾는 게 가장 중요해요.\n\n### 핵심 원칙\n1. **수동적 읽기 금지** → 노트 필기, 요약, 질문 만들기\n2. **테스트 효과** → 시험보다 자주 스스로 테스트하기\n3. **인출 연습** → 책을 덮고 떠올려보기\n\n> 배운 것을 남에게 설명할 수 있을 때 비로소 이해한 것이다 - 리처드 파인만\n\n어떤 과목에서 특히 어려움을 겪고 계신가요?"
        ],
        followUp: "뽀모도로 타이머를 같이 설정해드릴까요?"
    },

    programming: {
        keywords: ['코드', '프로그래밍', '파이썬', 'python', '자바', 'java', '자바스크립트', 'javascript', '코딩', '개발', '알고리즘', '함수', '클래스', 'api', 'database', 'sql', 'react', 'vue', 'node', 'git', 'docker', '프론트엔드', '백엔드', '풀스택'],
        patterns: [/(?:코드|프로그래밍|코딩|개발|알고리즘|프론트엔드|백엔드|풀스택|python|java|javascript|react|vue|node|git|docker|sql|api)/i],
        priority: 8,
        responses: [
            "프로그래밍은 정말 매력적인 분야예요! 어떤 종류의 개발에 관심이 있으신가요?\n\n### 개발 분야별 로드맵\n- **웹 개발**: HTML/CSS → JavaScript → React/Vue → Node.js\n- **데이터 과학**: Python → Pandas → NumPy → 머신러닝\n- **모바일**: Flutter 또는 React Native\n- **게임**: Unity (C#) 또는 Unreal (C++)\n\n### 초보자 팁\n> 완벽한 코드보다 작동하는 코드가 낫다\n\n작은 프로젝트부터 시작해서 점진적으로 확장해보세요. 어떤 프로젝트를 만들고 싶으신가요?",
            "코딩을 시작하시는 건가요? 아니면 이미 경험이 있으신가요?\n\n### 추천 시작 포인트\n| 목표 | 추천 언어 | 예상 기간 |\n|------|----------|----------|\n| 웹사이트 만들기 | HTML/CSS/JS | 2~3개월 |\n| 데이터 분석 | Python | 1~2개월 |\n| 앱 만들기 | Flutter | 3~4개월 |\n| 게임 개발 | Unity/C# | 4~6개월 |\n\n### 학습 자원\n- **유튜브**: 코딩애플, 노마드코더\n- **문서**: MDN Web Docs, Python 공식 문서\n- **실습**: LeetCode, Programmers\n\n어떤 프로젝트를 구상 중이신가요? 구체적으로 알려주시면 로드맵을 짜드릴게요!"
        ],
        followUp: "특정 언어나 프레임워크에 대해 더 알고 싶으신가요?"
    },

    python: {
        keywords: ['파이썬', 'python', 'pip', 'django', 'flask', 'numpy', 'pandas', 'tensorflow', 'pytorch', 'matplotlib', 'seaborn'],
        patterns: [/(?:파이썬|python|django|flask|numpy|pandas|tensorflow|pytorch|matplotlib)/i],
        priority: 9,
        responses: [
            "파이썬은 정말 다재다능한 언어예요! 데이터 분석, 웹 개발, 자동화, AI까지 다 할 수 있죠.\n\n### 파이썬 활용 분야\n```python\n# 데이터 분석 예시\nimport pandas as pd\n\ndf = pd.read_csv('data.csv')\nprint(df.describe())  # 기초 통계\n```\n\n### 추천 학습 순서\n1. **기초 문법**: 변수, 조건문, 반복문, 함수\n2. **자료구조**: 리스트, 딕셔너리, 튜플, 세트\n3. **객체지향**: 클래스, 상속, 다형성\n4. **라이브러리**: NumPy → Pandas → Matplotlib\n5. **프레임워크**: Django(웹) 또는 TensorFlow(AI)\n\n어떤 용도로 파이썬을 사용하고 싶으신가요?",
            "파이썬의 가장 큰 장점은 **읽기 쉬운 문법**과 **방대한 생태계**예요!\n\n### 인기 라이브러리\n| 분야 | 라이브러리 |\n|------|-----------|\n| 데이터 분석 | Pandas, NumPy |\n| 시각화 | Matplotlib, Seaborn, Plotly |\n| 웹 개발 | Django, Flask, FastAPI |\n| 머신러닝 | Scikit-learn, TensorFlow, PyTorch |\n| 자동화 | Selenium, BeautifulSoup |\n\n### 파이썬 팁\n```python\n# 리스트 컴프리헨션 (Pythonic한 코드)\nsquares = [x**2 for x in range(10)]\n\n# 딕셔너리 기본값 처리\nfrom collections import defaultdict\ncounts = defaultdict(int)\n```\n\n특정 라이브러리 사용법이 궁금하신가요?"
        ],
        followUp: "간단한 파이썬 예제 코드를 보여드릴까요?"
    },

    javascript: {
        keywords: ['자바스크립트', 'javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript', 'ts', 'frontend', 'next.js', 'express'],
        patterns: [/(?:자바스크립트|javascript|js|typescript|ts|react|vue|angular|next\.js|express|node\.?js|frontend)/i],
        priority: 9,
        responses: [
            "자바스크립트는 웹의 근간을 이루는 언어예요! 프론트엔드부터 백엔드까지 풀스택 개발이 가능하죠.\n\n### JavaScript 생태계\n```javascript\n// Modern JavaScript (ES6+)\nconst fetchData = async () => {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n};\n```\n\n### 학습 로드맵\n1. **기초**: 변수, 함수, DOM 조작\n2. **ES6+**: 화살표 함수, 구조분해, async/await\n3. **TypeScript**: 타입 시스템\n4. **프레임워크**: React → Next.js\n5. **백엔드**: Node.js + Express\n\n### 2024 트렌드\n- **Next.js 14** (App Router)\n- **tRPC** (타입 안전한 API)\n- **Bun** (빠른 JS 런타임)\n\n어떤 프로젝트를 구상 중이신가요?",
            "JavaScript 생태계는 정말 빠르게 발전하고 있어요!\n\n### 성능 최적화 팁\n```javascript\n// 메모이제이션\nconst memoize = (fn) => {\n    const cache = new Map();\n    return (...args) => {\n        const key = JSON.stringify(args);\n        return cache.get(key) || cache.set(key, fn(...args)).get(key);\n    };\n};\n```\n\n### 추천 도구\n| 용도 | 도구 |\n|------|------|\n| 번들러 | Vite, esbuild |\n| 테스팅 | Vitest, Playwright |\n| 스타일링 | Tailwind CSS |\n| 상태관리 | Zustand, Jotai |\n\nTypeScript를 함께 사용하시는 걸 추천드려요. 어떤 프로젝트를 만들고 계신가요?"
        ],
        followUp: "React나 Vue 중 어떤 걸 배우고 싶으신가요?"
    },

    productivity: {
        keywords: ['생산성', '시간관리', 'productivity', 'time management', 'gtd', 'pomodoro', '뽀모도로', '계획', '목표', '효율', '루틴', '습관'],
        patterns: [/(?:생산성|시간관리|productivity|time\s*management|gtd|pomodoro|뽀모도로|계획|목표|효율|루틴|습관)/i],
        priority: 7,
        responses: [
            "생산성은 **시스템**의 문제예요. 의지가 아니라 환경과 습관을 바꿔야 해요.\n\n### 핵심 전략\n1. **MIT (Most Important Task)**: 매일 아침 가장 중요한 일 1~3개만 정하기\n2. **시간 블로킹**: 캘린더에 작업 시간을 미리 할당\n3. **2분 규칙**: 2분이면 끝나는 일은 즉시 처리\n\n### 뽀모도로 기법 상세\n```\n집중 25분 → 휴식 5분 (1세트)\n4세트 후 → 긴 휴식 15~30분\n```\n\n### 추천 도구\n- **노트**: Notion, Obsidian\n- **타이머**: Forest, 뽀모도로 타이머\n- **습관**: Habitica, Streaks\n\n어떤 부분에서 가장 시간을 낭비하고 계신가요?",
            "생산성의 적은 **완벽주의**와 **멀티태스킹**이에요.\n\n### 뇌과학적 팁\n- **의사결정 피로** 줄이기: 아침에 중요한 결정하기\n- **플로우 상태** 만들기: 방해 요소 제거 (알림 끄기)\n- **파킨슨의 법칙**: 일은 주어진 시간만큼 늘어난다\n\n### 주간 계획 템플릿\n| 요일 | MIT 1 | MIT 2 | MIT 3 |\n|------|-------|-------|-------|\n| 월 | | | |\n| 화 | | | |\n\n> 계획은 중요하지만, 계획 자체는 중요하지 않다 - 드와이트 D. 아이젠하워\n\n요즘 가장 해결하고 싶은 생산성 문제가 뭔가요?"
        ],
        followUp: "뽀모도로 타이머를 같이 시작해볼까요?"
    },

    health: {
        keywords: ['건강', '운동', '다이어트', '식단', 'health', 'exercise', 'diet', 'workout', 'fitness', '헬스', '영양', '수면', '스트레스', '명상', '요가'],
        patterns: [/(?:건강|운동|다이어트|식단|health|exercise|diet|workout|fitness|헬스|영양|수면|스트레스|명상|요가)/i],
        priority: 7,
        responses: [
            "건강은 모든 것의 기초예요! 꾸준한 습관이 가장 중요해요.\n\n### 운동 추천\n| 목표 | 주 3회 루틴 |\n|------|------------|\n| 체중 감량 | 유산소 30분 + 근력 20분 |\n| 근육 증가 | 근력 45분 + 단백질 섭취 |\n| 유연성 | 요가/스트레칭 30분 |\n\n### 수면 개선\n- **취침 시간 고정**: 주말에도 ±1시간 유지\n- **블루라이트 차단**: 취침 1시간 전 스마트폰 금지\n- **온도**: 18~20도가 최적\n\n### 식단 팁\n> 먹는 것이 약이 되게 하라 - 히포크라테스\n\n- 단백질: 체중kg x 1.2~1.6g\n- 수분: 하루 2L 이상\n- 가공식품 줄이기\n\n어떤 건강 목표가 있으신가요?"
        ],
        followUp: "운동 루틴을 같이 짜드릴까요?"
    },

    science: {
        keywords: ['과학', '물리', '화학', '생물', '지구과학', '우주', 'quantum', '양자', '상대성', 'dna', '유전', '진화', 'science', 'physics', 'chemistry', 'biology', 'black hole', '빅뱅'],
        patterns: [/(?:과학|물리|화학|생물|지구과학|우주|quantum|양자|상대성|dna|유전|진화|black\s*hole|빅뱅)/i],
        priority: 7,
        responses: [
            "과학은 우리 주변의 모든 현상을 이해하는 열쇠예요!\n\n### 흥미로운 과학 사실\n- **양자얽힘**: 두 입자가 어떤 거리에 있어도 순간적으로 영향을 줘요\n- **DNA**: 인간의 DNA를 펼치면 태양까지 왕복 600번 갈 수 있어요\n- **빅뱅**: 우주가 138억 년 전에 시작됐어요\n\n### 추천 학습 순서\n| 단계 | 주제 |\n|------|------|\n| 입문 | 천문학, 진화론 |\n| 중급 | 양자역학, 상대성이론 |\n| 심화 | 현대물리학, 생명과학 |\n\n특별히 관심 있는 과학 분야가 있으신가요?",
            "과학을 재미있게 배우는 방법은 **일상과 연결**하는 거예요!\n\n### 예시\n- **무지개**: 빛의 굴절과 분산\n- **스마트폰**: 터치스크린의 정전기 원리\n- **비행기**: 베르누이의 원리\n\n> 과학은 단순히 사실을 아는 것이 아니라, 사실을 생각하는 방식이다 - 칼 세이건\n\n어떤 과학 현상이 궁금하신가요?"
        ],
        followUp: "특정 과학 주제를 더 깊이 파고들어볼까요?"
    },

    math: {
        keywords: ['수학', 'math', '미적분', '대수', '기하', '통계', '확률', '방정식', '함수', 'calculus', 'algebra', 'statistics', 'geometry', '선형대수'],
        patterns: [/(?:수학|math|미적분|대수|기하|통계|확률|방정식|함수|calculus|algebra|statistics|geometry|선형대수)/i],
        priority: 7,
        responses: [
            "수학은 논리적 사고를 키워주는 훌륭한 도구예요!\n\n### 수학의 실생활 활용\n| 분야 | 활용 예시 |\n|------|----------|\n| 확률 | 날씨 예보, 게임 전략 |\n| 미적분 | 자동차 속도 변화, 경제 성장률 |\n| 선형대수 | AI/머신러닝, 그래픽스 |\n| 통계 | 여론조사, 데이터 분석 |\n\n### 공부 팁\n> 수학은 보는 것이 아니라, 하는 것이다\n\n- 공식 외우기보다 **증명 과정** 이해하기\n- **직관**과 **엄밀함**의 균형 잡기\n- 다양한 문제 풀어보기\n\n어떤 수학 개념이 궁금하신가요?",
            "수학이 어렵게 느껴질 때는 **작은 단계**부터 시작해보세요!\n\n### 학습 전략\n1. **개념 이해** → 정의와 직관적 의미 파악\n2. **예제 풀이** → 기본 문제로 패턴 익히기\n3. **응용 문제** → 난이도를 점진적으로 높이기\n4. **교수법** → 남에게 설명해보기\n\n### 유용한 공식\n```\n이차방정식 근의 공식: x = (-b ± sqrt(b^2-4ac)) / 2a\n피타고라스 정리: a^2 + b^2 = c^2\n오일러 공식: e^(i*pi) + 1 = 0\n```\n\n어떤 문제로 막히셨나요? 같이 풀어볼까요?"
        ],
        followUp: "특정 문제나 개념을 같이 풀어볼까요?"
    },

    writing: {
        keywords: ['글쓰기', '작문', '에세이', '이메일', '보고서', 'writing', 'essay', 'email', '글', '작성', '문서', '프레젠테이션', '발표', '블로그'],
        patterns: [/(?:글쓰기|작문|에세이|이메일|보고서|writing|essay|email|블로그|프레젠테이션|발표)/i],
        priority: 7,
        responses: [
            "글쓰기는 생각을 정리하는 가장 강력한 방법이에요!\n\n### 효과적인 글쓰기 구조\n1. **두괄식**: 핵심을 먼저 전달\n2. **PREP**: Point → Reason → Example → Point\n3. **스토리텔링**: 문제 → 과정 → 해결 → 교훈\n\n### 이메일 템플릿\n```\n제목: [행동 요청] [내용] - [기한]\n\n안녕하세요 [이름]님,\n\n[핵심 내용 한 줄]\n\n[상세 내용]\n\n[요청사항]\n\n감사합니다.\n[이름]\n```\n\n어떤 종류의 글을 쓰고 계신가요?",
            "좋은 글은 **독자를 생각**하는 데서 시작해요!\n\n### 독자 분석 체크리스트\n- [ ] 독자는 누구인가?\n- [ ] 독자가 알고 싶은 것은?\n- [ ] 독자가 행동해야 할 것은?\n\n### 초고 작성 팁\n> 완벽한 초고는 없다. 쓰고 고치는 게 글쓰기다\n\n1. **프리라이팅**: 10분 동안 멈추지 않고 쓰기\n2. **구조화**: 핵심 → 근거 → 예시 → 결론\n3. **다듬기**: 불필요한 말 삭제, 구체적 예시 추가\n\n어떤 주제로 글을 쓰고 계신가요?"
        ],
        followUp: "초고를 같이 다듬어볼까요?"
    },

    career: {
        keywords: ['취업', '이직', '면접', '이력서', 'resume', 'career', 'job', '커리어', '연봉', '직장', '자기개발', '경력', '포트폴리오'],
        patterns: [/(?:취업|이직|면접|이력서|resume|career|job|커리어|연봉|직장|포트폴리오)/i],
        priority: 7,
        responses: [
            "커리어는 마라톤이에요. 단기 스펙보다 **장기적인 성장**이 중요해요.\n\n### 이력서 작성 팁\n- **STAR 기법**: Situation → Task → Action → Result\n- **수치화**: 매출 증대 → 매출 30% 증대\n- **맞춤형**: 지원 기업의 JD에 맞춰 수정\n\n### 면접 준비\n| 유형 | 준비 방법 |\n|------|----------|\n| 기술 면접 | 프로젝트 경험 정리 |\n| 인성 면접 | 3가지 강점/약점 준비 |\n| 임원 면접 | 기업 비전과 연결 |\n\n현재 어떤 단계에 계신가요?"
        ],
        followUp: "이력서나 자기소개서를 같이 검토해드릴까요?"
    },

    finance: {
        keywords: ['돈', '투자', '주식', '비트코인', '저축', '재테크', 'finance', 'investment', 'economy', '경제', '금융', '부동산', '연금', '보험'],
        patterns: [/(?:돈|투자|주식|비트코인|저축|재테크|finance|investment|economy|경제|금융|부동산|연금|보험)/i],
        priority: 6,
        responses: [
            "재무 관리는 **장기적인 관점**에서 접근하는 게 중요해요.\n\n### 기본 원칙\n1. **긴급자금**: 3~6개월 생활비를 먼저 마련\n2. **자동 저축**: 월급 받자마자 저축부터\n3. **분산 투자**: 모든 계란을 한 바구니에 담지 않기\n\n### 투자 옵션 비교\n| 상품 | 위험도 | 예상 수익률 | 특징 |\n|------|--------|------------|------|\n| 예금 | 낮음 | 2~4% | 안전 |\n| 채권 | 중간 | 3~5% | 안정적 |\n| 주식 | 높음 | 7~10% | 변동성 |\n| 코인 | 매우 높음 | ? | 투기성 |\n\n> 남들이 두려워할 때 탐욕스럽고, 남들이 탐욕스러울 때 두려워하라 - 워런 버핏\n\n어떤 재무 목표가 있으신가요?"
        ],
        followUp: "투자 포트폴리오를 간단히 분석해드릴까요?"
    },

    creativity: {
        keywords: ['아이디어', '창의', '브레인스토밍', 'creative', 'creativity', 'innovation', '혁신', '상상', '영감', 'inspiration', '디자인', '예술'],
        patterns: [/(?:아이디어|창의|브레인스토밍|creative|creativity|innovation|혁신|영감|디자인|예술)/i],
        priority: 6,
        responses: [
            "창의력은 **훈련**으로 키울 수 있어요!\n\n### 창의력 기법\n1. **SCAMPER**: Substitute → Combine → Adapt → Modify → Put → Eliminate → Reverse\n2. **6색 모자**: 사실(흰) → 감정(빨강) → 비판(검정) → 긍정(노랑) → 창의(초록) → 통제(파랑)\n3. **마인드맵**: 중심 주제에서 가지치기\n\n### 영감 얻는 방법\n- 다른 분야의 책 읽기\n- 일상에서 왜? 질문하기\n- 제한 조건을 주고 생각하기\n\n어떤 아이디어가 필요하신가요?"
        ],
        followUp: "브레인스토밍을 같이 해볼까요?"
    },

    emotions: {
        keywords: ['기분', '우울', '스트레스', '슬퍼', '화나', '불안', '걱정', '힘들어', '피곤', '심심', '행복', '기쁨', '우울증', '번아웃'],
        patterns: [/(?:기분|우울|스트레스|슬퍼|화나|불안|걱정|힘들어|피곤|심심|번아웃|우울증)/i],
        priority: 10,
        responses: [
            "지금 힘드신가요? 괜찮아요, 그런 날도 있는 거예요. 😊\n\n### 마음 돌보기\n- **호흡 운동**: 4-7-8 호흡 (숨 들이마시기 4초 → 참기 7초 → 내쉬기 8초)\n- **감사 일기**: 하루 3가지 감사한 일 적기\n- **산책**: 15분만 걸어도 기분이 나아져요\n\n### 누군가와 이야기하기\n- 친구나 가족에게 전화하기\n- 상담사와 상담하기 (129 정신건강 상담전화)\n\n> 비가 그치면 무지개가 뜬다\n\n지금 어떤 기분이 드시나요? 편하게 이야기해주세요.",
            "마음이 무겁군요. 잠깐 쉬어가도 괜찮아요.\n\n### 간단한 명상법\n1. 편안한 자세로 앉기\n2. 눈을 감고 호흡에 집중\n3. 생각이 떠오르면 부드럽게 호흡으로 돌아오기\n4. 3분만 해도 효과가 있어요\n\n### 도움 받기\n- **정신건강 상담전화**: 129\n- **자살예방 상담전화**: 1393\n- **청소년 상담전화**: 1388\n\n혼자가 아니에요. 어떤 일이 있으신가요?"
        ],
        followUp: "좀 더 이야기를 나눠볼까요?"
    },

    weather: {
        keywords: ['날씨', '비', '눈', '더워', '추워', '기온', 'weather', 'rain', 'snow', 'hot', 'cold'],
        patterns: [/(?:날씨|비|눈|더워|추워|기온|weather|rain|snow)/i],
        priority: 5,
        responses: [
            "날씨 이야기는 언제나 좋죠! 😊\n\n오늘 날씨가 어떤가요? 날씨에 따라 기분도 달라지는 것 같아요.\n\n- 맑은 날: 산책이나 야외 활동 추천\n- 비 오는 날: 실내 독서나 영화 감상\n- 추운 날: 따뜻한 음료와 함께 휴식\n\n오늘은 어떤 날씨인가요?"
        ],
        followUp: "오늘 기분은 어떠세요?"
    },

    food: {
        keywords: ['밥', '먹', '음식', '맛집', '요리', '레시피', '배고파', '점심', '저녁', '아침', 'food', 'cook', 'recipe', 'restaurant'],
        patterns: [/(?:밥|먹|음식|맛집|요리|레시피|배고파|점심|저녁|아침|food|cook|recipe)/i],
        priority: 5,
        responses: [
            "음식 이야기는 언제나 즐겁죠! 🍽️\n\n### 간단한 추천\n- **바쁜 날**: 샌드위치 또는 샐러드\n- **여유로운 날**: 집에서 파스타 만들기\n- **특별한 날**: 좋아하는 레스토랑 방문\n\n### 초보자용 레시피\n**계란볶음밥**\n1. 밥 1공기, 계란 2개 준비\n2. 계란을 먼저 스크램블 에그로 익히기\n3. 밥과 함께 볶기\n4. 소금, 간장으로 간 맞추기\n\n오늘 뭐 드실 예정인가요?"
        ],
        followUp: "레시피를 더 자세히 알려드릴까요?"
    },

    thanks: {
        keywords: ['고마워', '감사', 'thank', 'thanks', '고맙', '도움됐어', '유용했어', '좋은 정보'],
        patterns: [/(?:고마워|감사|thank|고맙|도움|유용)/i],
        priority: 10,
        responses: [
            "천만에요! 도움이 되셨다니 기뻐요 😊\n\n더 궁금한 점이 있으시면 언제든지 물어보세요. 계속해서 도와드릴게요!",
            "별말씀을요! 제가 도움이 될 수 있어서 다행이에요.\n\n다음에는 어떤 이야기를 나눠볼까요?"
        ],
        followUp: "또 다른 질문이 있으신가요?"
    },

    goodbye: {
        keywords: ['잘가', '안녕', 'bye', 'goodbye', 'see you', '나중에', '다음에', '수고', '잘 자', '좋은 밤'],
        patterns: [/(?:잘가|안녕\s*히\s*가세요|bye|goodbye|see\s*you|나중에|다음에|잘\s*자|좋은\s*밤)/i],
        priority: 10,
        responses: [
            "안녕히 가세요! 좋은 하루 보내세요 😊\n\n다음에 또 만나요!",
            "잘 가요! 필요하실 때 언제든지 찾아주세요.\n\n좋은 밤 되세요!"
        ],
        followUp: null
    },

    help: {
        keywords: ['도움', 'help', '뭐 할 수 있어', '뭐 해', '기능', '사용법', '명령어', '가이드'],
        patterns: [/(?:도움|help|뭐\s*할\s*수|뭐\s*해|기능|사용법|명령어|가이드)/i],
        priority: 9,
        responses: [
            "제가 도와드릴 수 있는 것들을 소개해드릴게요!\n\n### 대화 주제\n- **학습**: 공부법, 특정 과목 설명\n- **프로그래밍**: 코드 리뷰, 언어 추천, 디버깅\n- **생산성**: 시간관리, 습관 형성\n- **글쓰기**: 이메일, 보고서, 에세이\n- **일상**: 날씨, 음식, 기분 이야기\n\n### 단축키\n- Ctrl/Cmd + N: 새 대화\n- Enter: 메시지 전송\n- Shift + Enter: 줄바꿈\n\n어떤 주제로 이야기 나눠볼까요?"
        ],
        followUp: "특정 주제를 선택해주세요!"
    },

    default: {
        keywords: [],
        patterns: [],
        priority: 0,
        responses: [
            "흥미로운 질문이네요! 이 주제에 대해 좀 더 구체적으로 알려주실 수 있나요?\n\n예를 들어:\n- 어떤 배경에서 궁금해지셨는지\n- 어떤 답변을 기대하시는지\n\n더 자세히 말씀해주시면 최선을 다해 도와드릴게요!",
            "좋은 질문이에요! 제가 더 정확한 정보를 드리기 위해 조금만 더 설명해주실 수 있을까요?\n\n관련된 키워드나 상황을 알려주시면 더 도움이 될 것 같아요.",
            "이해했어요. 이 내용은 다양한 관점에서 생각해볼 수 있는데요.\n\n혹시 특별히 집중하고 싶은 부분이 있으실까요? 예를 들어:\n- 기초 개념 설명\n- 실제 활용 예시\n- 심화 내용\n\n어떤 방향으로 알려드릴까요?"
        ],
        followUp: "조금 더 구체적으로 설명해주실 수 있나요?"
    }
};

// 대화 맥락 관리
class ConversationContext {
    constructor() {
        this.history = [];
        this.lastCategory = null;
        this.messageCount = 0;
    }

    addMessage(role, content, category) {
        this.history.push({ role, content, category, time: Date.now() });
        if (category && category !== 'default') {
            this.lastCategory = category;
        }
        this.messageCount++;
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    getRecentTopics() {
        const topics = this.history
            .filter(m => m.category && m.category !== 'default')
            .map(m => m.category);
        return [...new Set(topics)].slice(-3);
    }

    isFollowUp(query) {
        const followUpPatterns = [
            /^(?:그|그럼|그리고|또|더|자세히|구체적으로|예시|예를 들어|왜|어떻게|무엇|뭐)/,
            /^(?:네|응|어|맞아|그래|좋아|알겠어|알겠습니다)/,
            /[?؟]$/,
            /^(?:그거|저거|이거|그것|저것|이것)/
        ];
        return followUpPatterns.some(p => p.test(query.trim()));
    }

    getContextualHint() {
        if (this.lastCategory && knowledgeBase[this.lastCategory] && knowledgeBase[this.lastCategory].followUp) {
            return knowledgeBase[this.lastCategory].followUp;
        }
        return null;
    }
}

function searchKnowledgeBase(query, context) {
    const lowerQuery = query.toLowerCase().trim();
    
    let bestMatch = null;
    let bestScore = 0;
    let matchedPattern = false;

    for (const category in knowledgeBase) {
        if (category === 'default') continue;
        
        const data = knowledgeBase[category];
        let score = 0;
        
        for (let i = 0; i < data.patterns.length; i++) {
            if (data.patterns[i].test(query)) {
                score += 100 * (data.priority || 1);
                matchedPattern = true;
            }
        }
        
        if (!matchedPattern) {
            for (let i = 0; i < data.keywords.length; i++) {
                if (lowerQuery.indexOf(data.keywords[i].toLowerCase()) !== -1) {
                    score += data.keywords[i].length * (data.priority || 1);
                }
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = category;
        }
    }

    if (context && context.isFollowUp(query) && context.lastCategory) {
        const lastCat = context.lastCategory;
        if (knowledgeBase[lastCat] && bestScore < 50) {
            bestMatch = lastCat;
            bestScore = 50;
        }
    }

    if (bestMatch && bestScore > 0) {
        const responses = knowledgeBase[bestMatch].responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        return {
            category: bestMatch,
            response: response,
            followUp: knowledgeBase[bestMatch].followUp,
            score: bestScore
        };
    }

    const defaultResponses = knowledgeBase.default.responses;
    let defaultResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    if (context && context.lastCategory) {
        const hint = context.getContextualHint();
        if (hint) {
            defaultResponse = defaultResponse + '\n\n참고: ' + hint;
        }
    }

    return {
        category: 'default',
        response: defaultResponse,
        followUp: knowledgeBase.default.followUp,
        score: 0
    };
}
