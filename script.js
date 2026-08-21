document.addEventListener('DOMContentLoaded', () => {
  const scrollCard = document.getElementById('scrollCard');
  const openBtn = document.getElementById('openBtn');
  const bgMusic = document.getElementById('bgMusic');
  const canvas = document.getElementById('scratchCanvas');
  const cardImage = document.getElementById('cardImage');
  const ctx = canvas.getContext('2d');
  
  let isOpen = false;
  let isScratching = false;
  let fallingInterval = null;

  // Initialize Scratch Coating
  function initScratchCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Gold layer
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay text cue
    ctx.fillStyle = '#5c4033';
    ctx.font = 'bold 16px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here 🪙', canvas.width / 2, canvas.height / 2);
  }

  // Scratch Action Logic
  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scratch Event Listeners
  ['mousedown', 'touchstart'].forEach(evt => 
    canvas.addEventListener(evt, (e) => { isScratching = true; scratch(e); })
  );
  ['mousemove', 'touchmove'].forEach(evt => 
    canvas.addEventListener(evt, scratch)
  );
  ['mouseup', 'mouseleave', 'touchend'].forEach(evt => 
    canvas.addEventListener(evt, () => isScratching = false)
  );

  // Start Falling Animation
  function startFallingItems() {
    if (fallingInterval) return;
    const container = document.getElementById('fallingContainer');
    const items = ['🌸', '🌺', '🌹', '🍫', '🍩'];
    
    fallingInterval = setInterval(() => {
      const item = document.createElement('div');
      item.classList.add('falling-item');
      item.innerText = items[Math.floor(Math.random() * items.length)];
      item.style.left = Math.random() * 100 + 'vw';
      item.style.animationDuration = Math.random() * 3 + 3 + 's';
      item.style.fontSize = Math.random() * 15 + 20 + 'px';
      
      container.appendChild(item);

      setTimeout(() => item.remove(), 6000);
    }, 300);
  }

  // Stop & Clear Falling Animation
  function stopFallingItems() {
    clearInterval(fallingInterval);
    fallingInterval = null;
    const container = document.getElementById('fallingContainer');
    if (container) container.innerHTML = '';
  }

  // Card Open/Close Event
  openBtn.addEventListener('click', () => {
    isOpen = !isOpen;

    if (isOpen) {
      scrollCard.classList.add('open');
      openBtn.textContent = 'Close Scroll';
      
      // Play Music on Open
      if (bgMusic) {
        bgMusic.play().catch(err => console.log("Audio play error:", err));
      }

      // Trigger Falling Items on Open
      startFallingItems();

    } else {
      scrollCard.classList.remove('open');
      openBtn.textContent = 'Open Scroll';

      // Pause Music on Close
      if (bgMusic) {
        bgMusic.pause();
      }

      // Stop Falling Items on Close
      stopFallingItems();
    }
  });

  // Ensure canvas fits image after loading
  if (cardImage.complete) {
    initScratchCanvas();
  } else {
    cardImage.addEventListener('load', initScratchCanvas);
  }
});
