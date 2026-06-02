// app.js: 최소 프론트 로직 (서버 /api/chat 에 POST 요청)
const messagesEl = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('input');

function appendMessage(text, who='ai', meta=''){
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  if(meta){
    const m = document.createElement('div');
    m.className = 'meta';
    m.textContent = meta;
    div.appendChild(m);
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

const sessionId = localStorage.getItem('chat_session') || crypto.randomUUID();
localStorage.setItem('chat_session', sessionId);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  appendMessage(text, 'user');
  input.value = '';
  const loadingEl = document.createElement('div');
  loadingEl.className = 'msg ai';
  loadingEl.textContent = '생성 중...';
  messagesEl.appendChild(loadingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({sessionId, message: text})
    });
    if(!res.ok){
      throw new Error('서버 오류');
    }
    const data = await res.json();
    loadingEl.textContent = data.reply || '응답이 없습니다.';
  } catch(err){
    loadingEl.textContent = '오류가 발생했습니다.';
    console.error(err);
  }
});
