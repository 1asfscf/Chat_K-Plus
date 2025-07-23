// --- 모달 로직 (기존 그대로) ---
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

// --- 모바일 햄버거 메뉴 & 드로어 추가 ---
if (window.innerWidth <= 768) {
  const burger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');

  // 백드롭 생성
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  document.body.append(backdrop);

  burger.addEventListener('click', () => {
    drawer.classList.toggle('open');
    backdrop.classList.toggle('visible');
  });

  backdrop.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
  });
}
