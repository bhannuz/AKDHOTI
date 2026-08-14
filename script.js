const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

canvas.width = 340;
canvas.height = 560;

let isScratching = false;
let musicStarted = false;
let cleared = false;

// --- DRAW GRAND ROYAL ENVELOPE OVERLAY WITH PROMINENT TEXT ---
function drawEnvelope() {
    // 1. Royal Crimson Envelope Base
    context.fillStyle = '#6b0f1a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Gold Border & Flap Lines
    context.strokeStyle = '#d4af37';
    context.lineWidth = 2;

    // Top Flap Triangle
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width / 2, canvas.height * 0.42);
    context.lineTo(canvas.width, 0);
    context.stroke();

    // Bottom Side Lines
    context.beginPath();
    context.moveTo(0, canvas.height);
    context.lineTo(canvas.width / 2, canvas.height * 0.42);
    context.lineTo(canvas.width, canvas.height);
    context.stroke();

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.42;
    
    // 3. Gold Wax Seal Emblem
    context.fillStyle = '#d4af37';
    context.beginPath();
    context.arc(centerX, centerY, 40, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#fff8dc';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 36, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = '#6b0f1a';
    context.font = 'bold 22px serif';
    context.textAlign = 'center';
    context.fillText('✉️', centerX, centerY + 8);

    // 4. PROMINENT "SCRATCH ON ENVELOPE" BANNER TEXT
    const bannerY = canvas.height - 110;
    
    // Banner Background Box
    context.fillStyle = 'rgba(0, 0, 0, 0.35)';
    context.fillRect(20, bannerY, canvas.width - 40, 60);
    context.strokeStyle = '#d4af37';
    context.lineWidth = 1.5;
    context.strokeRect(20, bannerY, canvas.width - 40, 60);

    // Primary Banner Text
    context.fillStyle = '#ffffff';
    context.font = 'bold 16px Marcellus, sans-serif';
    context.fillText('✨ SCRATCH ON ENVELOPE ✨', centerX, bannerY + 28);
    
    // Secondary Sub-text
    context.fillStyle = '#d4af37';
    context.font = '12px Marcellus, sans-serif';
    context.fillText('Rub across the screen to reveal details', centerX, bannerY + 48);
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
    context.arc(x, y, 28, 0, Math.PI * 2);
    context.fill();

    checkScratchPercentage();
}

// Auto-reveal card & trigger Rose Flower Shower
function checkScratchPercentage() {
    if (cleared) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const totalSampled = pixels.length / 16;
    if (transparentPixels / totalSampled > 0.40) {
        cleared = true;
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 800);

        startRoseShower();
    }
}

// --- ROSE FLOWER SHOWER EFFECT ---
function startRoseShower() {
    let petalsCreated = 0;
    const interval = setInterval(() => {
        createPetal();
        petalsCreated++;
        if (petalsCreated >= 60) {
            clearInterval(interval);
        }
    }, 90);
}

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'rose-petal';
    petal.innerHTML = '🌹';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 2.5 + 3.5) + 's';
    petal.style.fontSize = (Math.random() * 14 + 18) + 'px';
    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 6500);
}

// Mouse Listeners
canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', () => isScratching = false);

// Touch Listeners (Mobile)
canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); e.preventDefault(); });
canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); });
canvas.addEventListener('touchend', () => isScratching = false);
