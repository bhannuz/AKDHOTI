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
  let musicTimeout = null;

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

  // Scratch Action Logic (Increased radius to 45px for a larger scratch area)
  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2); // Radius increased from 22 to 45
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

  // Start Falling Animation (Flowers, Chocolates, Donuts)
  function startFallingItems() {
    stopFallingItems(); // Ensures no duplicate intervals running
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

  // Stop & Clear Falling Items
  function stopFallingItems() {
    if (fallingInterval) {
      clearInterval(fallingInterval);
      fallingInterval = null;
    }
    const container = document.getElementById('fallingContainer');
    if (container) container.innerHTML = '';
  }

  // Card Open/Close Event Handler
  openBtn.addEventListener('click', () => {
    isOpen = !isOpen;

    if (isOpen) {
      scrollCard.classList.add('open');
      openBtn.textContent = 'Close Scroll';
      
      // Play Audio & Set 60-Second Cutoff
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(err => console.log("Audio play error:", err));

        clearTimeout(musicTimeout);
        musicTimeout = setTimeout(() => {
          bgMusic.pause();
        }, 60000); // Stop exactly after 60 seconds
      }

      // Start falling elements only when opened
      startFallingItems();

    } else {
      scrollCard.classList.remove('open');
      openBtn.textContent = 'Open Scroll';

      // Pause audio and clear timer
      if (bgMusic) {
        bgMusic.pause();
        clearTimeout(musicTimeout);
      }

      // Stop and clear falling elements when closed
      stopFallingItems();
    }
  });

  // Guarantees clean state on page load
  stopFallingItems();

  // Resize canvas canvas once image loads
  if (cardImage.complete) {
    initScratchCanvas();
  } else {
    cardImage.addEventListener('load', initScratchCanvas);
  }
});
