# Chat K plus - v1.3.0

> 빠른 검색과 대화에 최적화된 KRL V10 기반 AI 어시스턴트

## 📋 업데이트 내역 (2026-06-08)

### 🎨 UI/UX 전면 개선
#### 메인 인터페이스
- 검색뷰 / 채팅뷰 전환 애니메이션 최적화
- 모바일 퍼스트 반응형 레이아웃 구현
- 다크모드 기본 테마 적용

#### 채팅 시스템
- 메시지 버블 디자인 (user-msg / ai-msg)
- 실시간 타이핑 인디케이터 (분석 중 → 검색 중 → 확인 중 → 생성 중)
- 자동 스크롤 및 iOS 키보드 대응
- URL 자동 링크 변환 + 외부 링크 경고 모달

#### 입력 시스템
- 자동 높이 조절 textarea (최대 120px)
- Enter 전송 / Shift+Enter 줄바꿈
- 전송 버튼 상태 관리 (active/disabled)
- **멈추기 버튼 추가** - 추론 중 즉시 중단 가능

#### 사이드바
- PC 전용 접기/펼치기 기능
- localStorage 상태 저장
- 단축키 지원 (Ctrl+K / Cmd+K)
- 네비게이션: 홈 / 새 채팅 / 시간표

### ⚙️ 핵심 시스템 구현

#### 1. System 객체 (핵심 엔진)
```javascript
const System = {
    isThinking: false,
    switchView(),      // 뷰 전환
    addMessage(),      // 메시지 렌더링
    runReasoning(),    // AI 추론 엔진
    updateSendButton() // 입력 상태 관리
}

핫픽스: 객체 종료 구문 수정, 메서드 스코프 정리

2. DB 시스템
•  40+ 사전 학습 데이터베이스
•  카테고리: AI 소개, 중국 정보, 공식 사이트, 다음 검색어
•  퍼지 매칭 알고리즘 (정확도 → 느슨한 검색)

3. 정책 필터 시스템
•  중국 공산당/시진핑 관련 비판 내용 자동 차단
•  정규식 기반 2단계 필터링
•  정책 위반 시 경고 스타일 적용

4. 시간표 시스템
•  localStorage 기반 개인 시간표
•  요일별 CRUD 기능
•  길게 누르기 삭제 (모바일)
•  채팅 명령어 연동 ("오늘 수업 뭐야", "내일 시간표")

🔧 기술 스택
•  Vanilla JavaScript (프레임워크 없음)
•  CSS3 Flexbox/Grid
•  localStorage API
•  DOMContentLoaded 이벤트 기반 초기화

🐛 버그 수정 (v1.3.0)
•  Critical: System 객체 SyntaxError 해결
•  Critical: updateSendButton 스코프 오류 수정
•  추론 중단 시 상태 복원 로직 추가
•  사이드바 토글 상태 유지 버그 수정

📱 지원 환경
•  iOS Safari 14+
•  Android Chrome 90+
•  PC Chrome/Edge/Firefox
•  반응형: 320px ~ 1920px

⌨️ 단축키
•  Ctrl+K / Cmd+K: 검색창 포커스
•  ESC: 모달 닫기
•  Enter: 전송
•  Shift+Enter: 줄바꿈

📦 파일 구조
/
├── index.html
├── style.css
├── script.js (System 3 핵심)
└── README.md

🔄 다음 업데이트 예정
추론 기능 안정화 및 더욱 높은 지식베이스
한츨더 나아진 V10 인터페이스

Version: 1.3.0  
Build: 20260608  
Developer: 성민 (@alpha.seongmin_3)
