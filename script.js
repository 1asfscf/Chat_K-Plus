const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');

let currentIndex = 0;
let slideInterval;

function showSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.setAttribute('aria-selected', i === index);
    dot.tabIndex = i === index ? 0 : -1;
  });
  currentIndex = index;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 6000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.dataset.index));
    stopAutoSlide();
    startAutoSlide();
  });
  dot.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showSlide(parseInt(dot.dataset.index));
      stopAutoSlide();
      startAutoSlide();
    }
  });
});

rightArrow.addEventListener('click', () => {
  nextSlide();
  stopAutoSlide();
  startAutoSlide();
});
rightArrow.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  }
});

leftArrow.addEventListener('click', () => {
  prevSlide();
  stopAutoSlide();
  startAutoSlide();
});
leftArrow.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  }
});

// 초기 실행
showSlide(0);
startAutoSlide();
