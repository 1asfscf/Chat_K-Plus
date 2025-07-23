const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', !expanded);
  if (mobileMenu.hasAttribute('hidden')) {
    mobileMenu.removeAttribute('hidden');
  } else {
    mobileMenu.setAttribute('hidden', '');
  }
});

// 모바일 하단 메뉴 버튼 클릭 시 active 상태 토글 (필요시)
const bottomNavButtons = document.querySelectorAll('.bottom-nav-btn');
bottomNavButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    bottomNavButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
