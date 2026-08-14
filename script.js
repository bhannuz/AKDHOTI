const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

canvas.width = 340;
canvas.height = 560;

let isScratching = false;
let musicStarted = false;
let cleared = false;

// --- DRAW GRAND ROYAL ENVELOPE OVERLAY ---
function drawEnvelope() {
    // Envelope Background (Royal Crimson)
    context.fillStyle = '#6b0f1a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Envelope Flap Lines
    context.strokeStyle = '#d4af37';
    context.lineWidth = 2;

    // Top Flap Triangle
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width / 2, canvas.height * 0.45);
    context.lineTo(canvas.width, 0);
    context.stroke();

    // Side Flap Lines
    context.beginPath();
    context.moveTo(0, canvas.height);
    context.lineTo(canvas.width / 2, canvas.height * 0.45);
    context.lineTo(canvas.width, canvas.height);
    context.stroke();

    // Gold Wax Seal Circle in Center
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.45;
    
    context.fillStyle = '#d4af37';
    context.beginPath();
    context.arc(centerX, centerY, 42, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#fff8dc';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 38, 0, Math.PI * 2);
    context.stroke();

    // Seal Text / Emblem
    context.fillStyle = '#6b0f1a';
    context.font = 'bold 20px serif';
    context.textAlign = 'center';
    context.fillText('✉️', centerX, centerY + 7);

    // Scratch Instructions
    context.fillStyle = '#ffffff';
    context.font = 'bold 15px Marcellus, serif';
    context.fillText('SCRATCH THE ENVELOPE', centerX, canvas.height - 70);
    
    context.fillStyle = '#d4af37';
    context.font = '12px Marcellus, serif';
    context.fillText('to reveal the invitation', centerX, canvas.height - 48);
}

drawEnvelope();

// --- AUDIO CONTROLS ---
function startAudio() {
    if (!musicStarted) {
        bgMusic.play().then(() => {
            musicStarted = true;
            musicToggle.textContent = '🔊 Music On';
        }).catch(() => {
            // Audio autoplay blocked until user interaction
        });
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

// Auto-reveal card after ~45% scratch
function checkScratchPercentage() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 16) { // Sample every 4th pixel
        if (pixels[i] === 0) transparentPixels++;
    }

    const totalSampled = pixels.length / 16;
    if (transparentPixels / totalSampled > 0.45) {
        cleared = true;
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 800);
    }
}

// Mouse Listeners
canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', () => isScratching = false);

// Touch Listeners (Mobile)
canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); e.preventDefault(); });
canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); });
canvas.addEventListener('touchend', () => isScratching = false);
