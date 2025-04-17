document.addEventListener('DOMContentLoaded', function () {
  // ----------------- 자동 전환 배너 이미지 관련 -----------------
  const firstImageSrc = 'https://img.makeshop.co.kr/4/29457/202504/be565292ad4c3d90c670a84df580d0f5.png';
  const secondImageSrc = 'https://img.makeshop.co.kr/4/29457/202504/49e801664229d24660af75c502a1baf6.jpg';
  const toggleImage = document.getElementById('toggleImage');

  setInterval(function () {
    toggleImage.classList.add('fade-out');
    toggleImage.addEventListener('transitionend', function handler() {
      if (toggleImage.getAttribute('data-state') === 'first') {
        toggleImage.src = secondImageSrc;
        toggleImage.setAttribute('data-state', 'second');
      } else {
        toggleImage.src = firstImageSrc;
        toggleImage.setAttribute('data-state', 'first');
      }
      setTimeout(() => {
        toggleImage.classList.remove('fade-out');
      }, 50);
      toggleImage.removeEventListener('transitionend', handler);
    });
  }, 5000);

  // ----------------- 로그인 모달 관련 이벤트 -----------------
  const profileIcon = document.querySelector('.profile-icon');
  const loginModal = document.getElementById('loginModal');
  const closeBtn = document.querySelector('.modal .close');
  const buyButton = document.querySelector('.buy-button');
  const menuButtons = document.querySelectorAll('.menu-button');
  const cartButton = document.querySelector('.cart-button');

  // 프로필 아이콘 클릭 시 모달 열기
  profileIcon.addEventListener('click', function () {
    loginModal.style.display = 'block';
  });

  // 메뉴 버튼 클릭 시 모달 열기
  menuButtons.forEach(button => {
    button.addEventListener('click', function () {
      loginModal.style.display = 'block';
    });
  });

  // 구매하기 버튼 클릭 시 모달 열기
  if (buyButton) {
    buyButton.addEventListener('click', function () {
      loginModal.style.display = 'block';
    });
  }

  // 장바구니 버튼 클릭 시 모달 열기
  if (cartButton) {
    cartButton.addEventListener('click', function () {
      loginModal.style.display = 'block';
    });
  }

  // 모달 외부 클릭 시 모달 닫기
  window.addEventListener('click', function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  // 닫기(X) 버튼 클릭 시 모달 닫기
  closeBtn.addEventListener('click', function () {
    loginModal.style.display = 'none';
  });

  // ----------------- 로그인 기능 구현 (임시) -----------------
  // 임시 계정 정보
  const validUsername = 'admin';
  const validPassword = '1234';

  // 로그인 폼 요소 선택 (모달 내의 폼)
  const loginForm = document.querySelector('#loginModal form');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const usernameInput = document.querySelector('#username').value.trim();
    const passwordInput = document.querySelector('#password').value;

    if (usernameInput === validUsername && passwordInput === validPassword) {
      alert('로그인 성공!');
      // 인증 성공 시 profile.html 페이지로 리다이렉션
      window.location.href = 'profile.html';
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  });
});
