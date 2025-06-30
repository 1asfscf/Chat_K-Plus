// script.js 파일 내용

// 햄버거 메뉴 토글 기능
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // 키보드 접근성을 위한 Enter/Spacebar 이벤트 처리
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      nav.classList.toggle('open');
    }
  });
}


// 메인 배너 슬라이드 기능
// 배너에 표시될 데이터 (이미지, 제목, 설명)
const bannerImages = [
  {
    src: 'https://img.tving.com/uploaded_images/contents/2022/10/20221020105128_0.jpg',
    title: '지리산',
    desc: '하늘과 만나는 곳, 여수저 지속의 경계'
  },
  {
    src: 'https://img.tving.com/uploaded_images/contents/2023/01/20230110123456_0.jpg',
    title: '두 번째 슬라이드',
    desc: '설명 문구가 들어갑니다'
  },
  {
    src: 'https://img.tving.com/uploaded_images/contents/2023/02/20230210123456_0.jpg',
    title: '세 번째 슬라이드',
    desc: '추가 설명 문구'
  }
];

const bannerImg = document.querySelector('.banner-img');
const bannerTitle = document.querySelector('.banner-title');
const bannerDesc = document.querySelector('.banner-desc');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

let currentIndex = 0; // 현재 활성화된 슬라이드 인덱스
let slideInterval; // 자동 슬라이드를 위한 인터벌 ID

// 배너 내용 업데이트 함수
function updateBanner(index) {
  // 인덱스 유효성 검사 및 순환 로직
  if (index < 0) {
    index = bannerImages.length - 1;
  } else if (index >= bannerImages.length) {
    index = 0;
  }

  // 이미지, 제목, 설명 업데이트
  if (bannerImg) {
    bannerImg.src = bannerImages[index].src;
    bannerImg.alt = bannerImages[index].title;
  }
  if (bannerTitle) {
    bannerTitle.textContent = bannerImages[index].title;
  }
  if (bannerDesc) {
    bannerDesc.textContent = bannerImages[index].desc;
  }

  // 점(dot) 활성화 상태 업데이트 및 접근성 속성 설정
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.setAttribute('aria-selected', i === index);
    dot.tabIndex = i === index ? 0 : -1; // 현재 활성화된 점만 키보드 접근 가능
  });

  currentIndex = index; // 현재 인덱스 업데이트
}

// 다음 슬라이드로 이동
function nextSlide() {
  updateBanner(currentIndex + 1);
}

// 이전 슬라이드로 이동
function prevSlide() {
  updateBanner(currentIndex - 1);
}

// 자동 슬라이드 시작
function startAutoSlide() {
  stopAutoSlide(); // 기존 인터벌이 있다면 중지
  slideInterval = setInterval(nextSlide, 6000); // 6초마다 다음 슬라이드로
}

// 자동 슬라이드 중지
function stopAutoSlide() {
  clearInterval(slideInterval);
}

// 점(dot) 클릭 이벤트 리스너
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    updateBanner(parseInt(dot.dataset.index)); // data-index 속성 값으로 이동
    stopAutoSlide(); // 수동 조작 시 자동 슬라이드 중지
    startAutoSlide(); // 일정 시간 후 다시 자동 슬라이드 시작
  });
  // 키보드 접근성을 위한 Enter/Spacebar 이벤트 처리
  dot.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      updateBanner(parseInt(dot.dataset.index));
      stopAutoSlide();
      startAutoSlide();
    }
  });
});

// 오른쪽 화살표 클릭 이벤트 리스너
if (rightArrow) {
  rightArrow.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });
  // 키보드 접근성을 위한 Enter/Spacebar 이벤트 처리
  rightArrow.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    }
  });
}

// 왼쪽 화살표 클릭 이벤트 리스너
if (leftArrow) {
  leftArrow.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });
  // 키보드 접근성을 위한 Enter/Spacebar 이벤트 처리
  leftArrow.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    }
  });
}

// 페이지 로드 시 초기 배너 설정 및 자동 슬라이드 시작
if (bannerImg && bannerTitle && bannerDesc && dots.length > 0) {
  updateBanner(0);
  startAutoSlide();
}
