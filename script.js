// 1) 공통: 로그인 모달 로직 (변경 없음)
const loginBtn = document.querySelector('.login-btn');
const modal    = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

loginBtn.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
});

// 2) 모바일 전용: 햄버거 메뉴 & 네비 드로어
(function() {
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  let initialized = false;
  let burger, drawer, backdrop;

  function initMobileUI() {
    if (initialized) return;
    initialized = true;

    burger = document.querySelector('.hamburger');
    drawer = document.querySelector('.nav-drawer');

    // 백드롭
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);

    burger.addEventListener('click', toggleDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // CSS 클래스 토글로 모바일 전용 스타일 활성화
    document.body.classList.add('mobile-mode');
  }

  function destroyMobileUI() {
    if (!initialized) return;
    initialized = false;

    // 이벤트 제거
    burger.removeEventListener('click', toggleDrawer);
    backdrop.removeEventListener('click', closeDrawer);
    backdrop.remove();

    // 모바일 전용 스타일 해제
    document.body.classList.remove('mobile-mode');
  }

  function toggleDrawer() {
    drawer.classList.toggle('open');
    backdrop.classList.toggle('visible');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
  }

  function handleBreakpoint(e) {
    if (e.matches) initMobileUI();
    else destroyMobileUI();
  }

  // 초기 바인딩 및 리스너 등록
  mobileQuery.addListener(handleBreakpoint);
  handleBreakpoint(mobileQuery);
})();
