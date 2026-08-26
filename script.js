// 1. Scroll Unfold Toggle Action
const openBtn = document.getElementById('openBtn');
const scrollCard = document.getElementById('scrollCard');

openBtn.addEventListener('click', () => {
  scrollCard.classList.toggle('open');
  openBtn.textContent = scrollCard.classList.contains('open') ? 'Close Invitation' : 'Open Invitation';
});

// 2. Interactive Gold Scratch Foil Layer
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function initCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#d4af37');
  gradient.addColorStop(0.5, '#fff3a8');
  gradient.addColorStop(1, '#aa7c11');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#4a0000';
  ctx.font = 'bold 16px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Scratch Here ✨', canvas.width / 2, canvas.height / 2);
}

function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
canvas.addEventListener('touchmove', scratch);
canvas.addEventListener('touchend', () => isDrawing = false);

window.addEventListener('load', initCanvas);

// 3. Falling Flower Animation
const fallingContainer = document.getElementById('fallingContainer');
const petals = ['🌸', '🌼', '✨', '🌺'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'falling-item';
  petal.textContent = petals[Math.floor(Math.random() * petals.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = Math.random() * 3 + 4 + 's';
  petal.style.fontSize = Math.random() * 10 + 15 + 'px';
  
  fallingContainer.appendChild(petal);
  
  setTimeout(() => {
    petal.remove();
  }, 7000);
}

setInterval(createPetal, 350);

// 4. View Counter Tracker
fetch('https://api.counterapi.dev/v1/traditional_invitation_event_2026/visits/up')
  .then(res => res.json())
  .then(data => console.log('Total Views:', data.count))
  .catch(err => console.error('Tracker error:', err));
