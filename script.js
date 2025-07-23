// script.js
const loginBtn = document.querySelector('.login-btn');
const modal    = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');

loginBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});
