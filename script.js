const loginBtn = document.querySelector('.login-btn');
const modal    = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

// 로그인 버튼 클릭 시 모달 열기
loginBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// 닫기 버튼 클릭 시 모달 닫기
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
});
