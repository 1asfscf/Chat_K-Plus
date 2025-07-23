const loginBtn = document.querySelector('.login-btn');
const modal    = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

// 백드롭 요소 생성 및 삽입
const backdrop = document.createElement('div');
backdrop.className = 'backdrop';
modal.appendChild(backdrop);

// 모달 열기
loginBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// 모달 닫기 함수
function hideModal() {
  modal.classList.add('hidden');
}

// 닫기 버튼, 백드롭 클릭, ESC 키로 닫기
closeBtn.addEventListener('click', hideModal);
backdrop.addEventListener('click', hideModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    hideModal();
  }
});
