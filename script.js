document.addEventListener('DOMContentLoaded', function () {
    // 스타일 동적으로 추가
    const style = document.createElement('style');
    style.innerHTML = `
        .slider {
            position: relative;
            max-width: 1200px;
            margin: 20px auto;
            overflow: hidden;
        }
        .slider img {
            width: 100%;
            height: auto;
            position: absolute;
            opacity: 0;
            transform: scale(0.98);
            transition: opacity 1s ease, transform 1s ease;
        }
        .slider img.active {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);

    // 자동 전환 배너 이미지 관련
    const images = document.querySelectorAll('.slider img');
    let currentIndex = 0;

    function showSlide(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            img.style.opacity = '0';
            img.style.transform = 'scale(0.98)';
        });

        images[index].classList.add('active');
        images[index].style.opacity = '1';
        images[index].style.transform = 'scale(1)';
    }

    // 초기 상태 설정
    showSlide(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }, 5000);

    // 로그인 모달 관련 이벤트
    const profileIcon = document.querySelector('.profile-icon');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.modal .close');
    const menuButtons = document.querySelectorAll('.menu-button');
    const cartButton = document.querySelector('.cart-icon');

    function openModal() {
        loginModal.style.display = 'block';
    }

    function closeModal() {
        loginModal.style.display = 'none';
    }

    profileIcon.addEventListener('click', openModal);
    menuButtons.forEach(button => button.addEventListener('click', openModal));
    if (cartButton) cartButton.addEventListener('click', openModal);

    window.addEventListener('click', function (event) {
        if (event.target === loginModal) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);

    // 로그인 기능 구현 (임시)
    const validUsername = 'admin';
    const validPassword = '1234';
    const loginForm = document.querySelector('#loginModal form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

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
