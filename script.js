document.addEventListener('DOMContentLoaded', function () {
  // ----------------- 자동 전환 배너 이미지 관련 -----------------
  const firstImageSrc = 'https://img.makeshop.co.kr/4/29457/202504/be565292ad4c3d90c670a84df580d0f5.png';
  const secondImageSrc = 'https://img.makeshop.co.kr/4/29457/202505/e884ed9ac295c362bcc500ec35759ca6.jpg';
  const thirdImageSrc = 'https://img.makeshop.co.kr/4/29457/202505/e884ed9ac295c362bcc500ec35759ca6.jpg'; // 추가된 이미지
  const toggleImages = document.querySelectorAll('.slider img');

  let currentIndex = 0;
  const images = [firstImageSrc, secondImageSrc, thirdImageSrc];

  function showSlide(index) {
    toggleImages.forEach((img, i) => {
      img.style.display = (i === index) ? 'block' : 'none';
    });
  }

  setInterval(function () {
    currentIndex = (currentIndex + 1) % images.length; // 다음 이미지 인덱스
    showSlide(currentIndex);
  }, 5000); // 5초마다 슬라이드 전환

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
  const validUsername = 'admin';
  const validPassword = '1234';

  const loginForm = document.querySelector('#loginModal form');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const usernameInput = document.querySelector('#username').value.trim();
    const passwordInput = document.querySelector('#password').value;

    if (usernameInput === validUsername && passwordInput === validPassword) {
      alert('로그인 성공!');
      window.location.href = 'profile.html';
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  });
});
