const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const wrapper = document.querySelector('.card-wrapper');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;

let isScratching = false;
let musicStarted = false;
let cleared = false;

// Array of celebratory items (Chocolates, Pastries, Teddy Bears, Flowers)
const celebrationItems = ['🍫', '🧁', '🍰', '🧸', '🌹', '🍩', '🍫', '🧸'];

// --- DRAW ENVELOPE OVERLAY ---
function drawEnvelope() {
    context.fillStyle = '#4a050c';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#d4af37';
    context.lineWidth = 2;

    // Top Flap
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width / 2, canvas.height * 0.42);
    context.lineTo(canvas.width, 0);
    context.stroke();

    // Bottom Flap
    context.beginPath();
    context.moveTo(0, canvas.height);
    context.lineTo(canvas.width / 2, canvas.height * 0.42);
    context.lineTo(canvas.width, canvas.height);
    context.stroke();

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.42;
    
    // Gold Wax Seal
    context.fillStyle = '#d4af37';
    context.beginPath();
    context.arc(centerX, centerY, 38, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#fff8dc';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 34, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = '#380207';
    context.font = 'bold 20px serif';
    context.textAlign = 'center';
    context.fillText('✉️', centerX, centerY + 7);

    // Prompt Banner
    const bannerY = canvas.height - 110;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.45)';
    context.fillRect(15, bannerY, canvas.width - 30, 60);
    context.strokeStyle = '#d4af37';
    context.lineWidth = 1.5;
    context.strokeRect(15, bannerY, canvas.width - 30, 60);

    context.fillStyle = '#ffffff';
    context.font = 'bold 15px Marcellus, sans-serif';
    context.fillText('✨ SCRATCH FULL ENVELOPE ✨', centerX, bannerY + 28);
    
    context.fillStyle = '#d4af37';
    context.font = '11px Marcellus, sans-serif';
    context.fillText('Rub across screen to reveal invitation', centerX, bannerY + 48);
}

drawEnvelope();

// --- AUDIO CONTROLS ---
function startAudio() {
    if (!musicStarted) {
        bgMusic.play().then(() => {
            musicStarted = true;
            musicToggle.textContent = '🔊 Music On';
        }).catch(() => {});
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🔊 Music On';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇 Muted';
    }
});

// --- SCRATCH MECHANICS ---
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function scratch(e) {
    if (!isScratching || cleared) return;
    startAudio();

    const { x, y } = getCoordinates(e);
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, 26, 0, Math.PI * 2);
    context.fill();

    checkScratchPercentage();
}

function checkScratchPercentage() {
    if (cleared) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const totalSampled = pixels.length / 16;
    if (transparentPixels / totalSampled > 0.55) {
        cleared = true;
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 800);

        startCelebrationShower();
    }
}

// --- MIXED CELEBRATION SHOWER EFFECT ---
function startCelebrationShower() {
    let itemsCreated = 0;
    const interval = setInterval(() => {
        createFallingItem();
        itemsCreated++;
        if (itemsCreated >= 70) {
            clearInterval(interval);
        }
    }, 85);
}

function createFallingItem() {
    const item = document.createElement('div');
    item.className = 'falling-item';
    
    const randomSymbol = celebrationItems[Math.floor(Math.random() * celebrationItems.length)];
    item.innerHTML = randomSymbol;
    
    item.style.left = Math.random() * 100 + 'vw';
    item.style.animationDuration = (Math.random() * 2.5 + 3.5) + 's';
    
    document.body.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, 6500);
}

// Mouse Listeners
canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', () => isScratching = false);

// Touch Listeners
canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); e.preventDefault(); });
canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); });
canvas.addEventListener('touchend', () => isScratching = false);