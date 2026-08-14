const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const wrapper = document.querySelector('.card-wrapper');
const musicToggle = document.getElementById('musicToggle');

canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;

let isScratching = false;
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

// --- WEB AUDIO API SYNTHESIZER (TRADITIONAL + WESTERN DHOL FUSION) ---
let audioCtx = null;
let isPlaying = false;
let synthInterval = null;
let musicTimer = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 1. Synthesize Low Dhol Bass
function playDholBass(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.18);
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.18);
}

// 2. Synthesize Sharp Dhol Treble
function playDholTreble(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, time);
    osc.frequency.exponentialRampToValueAtTime(110, time + 0.08);
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
}

// 3. Synthesize Western Beat Cymbal
function playWesternBeat(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(900, time);
    gain.gain.setValueAtTime(0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.03);
}

// 4. Synthesize Traditional Flute Note
function playFluteNote(freq, time, duration) {
    if (!freq) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.22, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + duration);
}

// Traditional Festive Pentatonic Melody Notes (Hz)
const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, _: 0
};

const melodyPattern = [
    N.E5, N.D5, N.C5, N.A4, N.G4, N.A4, N.C5, N.D5,
    N.E5, N.E5, N.G5, N.E5, N.D5, N.C5, N.D5, N._
];

const dholBassPattern   = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
const dholTreblePattern = [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1];

function startAudio() {
    initAudio();
    if (isPlaying) return;
    isPlaying = true;
    musicToggle.textContent = '🔊 Music On';

    let step = 0;
    const stepTime = 0.12; // Speed of beat

    synthInterval = setInterval(() => {
        const now = audioCtx.currentTime;
        const currentStep = step % 16;

        if (dholBassPattern[currentStep]) playDholBass(now);
        if (dholTreblePattern[currentStep]) playDholTreble(now);
        playWesternBeat(now);

        const freq = melodyPattern[currentStep];
        if (freq) playFluteNote(freq, now, stepTime * 1.4);

        step++;
    }, stepTime * 1000);

    // Automatically stop synth after 1 minute (60,000 ms)
    clearTimeout(musicTimer);
    musicTimer = setTimeout(() => {
        stopAudio();
    }, 60000);
}

function stopAudio() {
    isPlaying = false;
    clearInterval(synthInterval);
    musicToggle.textContent = '🔇 Muted';
    clearTimeout(musicTimer);
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isPlaying) {
        startAudio();
    } else {
        stopAudio();
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