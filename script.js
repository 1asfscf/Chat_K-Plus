// ===== 2026년형 점검 페이지 =====
(function() {
  'use strict';

  // 실제 남은 일수 계산
  const targetDate = new Date(2026, 5, 15); // 2026년 6월 15일
  const startDate = new Date(2026, 3, 1);   // 2026년 4월 1일
  const now = new Date();

  let progress = 73;

  if (now < targetDate && now > startDate) {
    const total = targetDate - startDate;
    const elapsed = now - startDate;
    progress = Math.min(99, Math.floor((elapsed / total) * 100));
  } else if (now >= targetDate) {
    progress = 100;
  }

  // DOM 업데이트
  const percentEl = document.getElementById('progressPercent');
  const fillEl = document.getElementById('progressFill');

  if (percentEl) {
    percentEl.textContent = progress;
  }

  if (fillEl) {
    fillEl.style.width = `${progress}%`;
  }

  // 약간의 그리드 카드 지연 애니메이션
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + idx * 120);
  });

  // 콘솔에 영감 메시지 (기술적 감성)
  console.log('%c✦ NOVA — 2026. 새로운 시작 ✦', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('Meta AI에서 영감을 받았으나, 독창적인 디자인과 정체성을 가진 점검 페이지입니다.');

  // 히어로 타이틀 타이핑 효과 (옵션)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !heroTitle.innerHTML.includes('span')) {
    const original = heroTitle.innerHTML;
    heroTitle.style.opacity = '0';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 1s';
      heroTitle.style.opacity = '1';
    }, 200);
  }
})();
