// ================================
// Dhoti Ceremony Invitation
// Envelope → Scratch → Card Reveal
// ================================

let isScratching = false;
let scratchPercentage = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeFlow();
    startParticles();
});

// ================================
// Main Flow Control
// ================================

function initializeFlow() {
    const openBtn = document.getElementById('openBtn');
    const envelopeBody = document.querySelector('.envelope-body');
    
    if (openBtn) {
        openBtn.addEventListener('click', openEnvelope);
    }
    
    if (envelopeBody) {
        envelopeBody.addEventListener('click', openEnvelope);
    }

    // Setup location modal
    setupLocationModal();
}

function openEnvelope() {
    const cover = document.getElementById('cover');
    const scratchContainer = document.getElementById('scratchContainer');
    
    if (cover) {
        cover.classList.add('hidden');
        // Fade out cover after animation
        setTimeout(() => {
            cover.style.display = 'none';
        }, 500);
    }
    
    if (scratchContainer) {
        scratchContainer.classList.add('active');
        setTimeout(() => {
            initializeScratchLayer();
        }, 100);
    }
}

// ================================
// Scratch Layer Implementation
// ================================

function initializeScratchLayer() {
    const canvas = document.getElementById('scratchLayer');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scratchContainer = document.getElementById('scratchContainer');
    
    // Set canvas size to match container
    canvas.width = scratchContainer.offsetWidth;
    canvas.height = scratchContainer.offsetHeight;
    
    // Create gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#8b7355');
    gradient.addColorStop(0.5, '#a0845f');
    gradient.addColorStop(1, '#6d5a47');
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add texture
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 50,
            Math.random() * 50
        );
    }
    
    // Add text
    ctx.fillStyle = '#f5f1e8';
    ctx.font = 'bold 32px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '16px "Cormorant Garamond", serif';
    ctx.fillText('Rub with your finger or mouse', canvas.width / 2, canvas.height / 2 + 40);
    
    // Setup scratch interaction
    setupScratch(canvas);
}

function setupScratch(canvas) {
    const ctx = canvas.getContext('2d');
    const eraserSize = 50;
    
    // Touch and Mouse events
    const events = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
    
    events.forEach(eventName => {
        canvas.addEventListener(eventName, handleScratchEvent, false);
    });
    
    function handleScratchEvent(e) {
        e.preventDefault();
        
        if (e.type.includes('up') || e.type.includes('end')) {
            isScratching = false;
            return;
        }
        
        if (e.type.includes('down') || e.type.includes('start')) {
            isScratching = true;
        }
        
        if (!isScratching) return;
        
        // Get mouse/touch position
        let x, y;
        if (e.touches) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        
        // Erase with circular motion
        ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
        
        // Check scratch percentage
        updateScratchPercentage(canvas, ctx);
    }
}

function updateScratchPercentage(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            transparentPixels++;
        }
    }
    
    scratchPercentage = (transparentPixels / (data.length / 4)) * 100;
    
    // If more than 40% is scratched, reveal invitation
    if (scratchPercentage > 40) {
        revealInvitation();
    }
}

function revealInvitation() {
    const scratchContainer = document.getElementById('scratchContainer');
    scratchContainer.classList.add('scratched');
    
    const card = document.querySelector('.invitation-card');
    if (card) {
        card.style.animation = 'cardAppear 0.8s ease-out';
    }
    
    // Remove scratch hint
    const hint = document.querySelector('.scratch-hint');
    if (hint) {
        hint.style.display = 'none';
    }
}

// ================================
// Flowers/Particles Animation
// ================================

function startParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Create flowers continuously for entire page lifetime
    const interval = setInterval(() => {
        createFlower(particlesContainer);
    }, 400);

    // Keep running - don't stop (entire ceremony duration)
    // Optionally stop after a very long time
    setTimeout(() => {
        clearInterval(interval);
    }, 300000); // 5 minutes
}

function createFlower(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerHTML = '🌹';
    
    // Random horizontal position (0-100vw)
    const randomLeft = Math.random() * window.innerWidth;
    particle.style.left = randomLeft + 'px';
    
    // Start from top (above viewport)
    particle.style.top = '-50px';
    
    // Random duration (4-7 seconds)
    const duration = (4 + Math.random() * 3);
    particle.style.animationDuration = duration + 's';
    
    // Random opacity
    particle.style.opacity = (0.3 + Math.random() * 0.5).toString();
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000 + 100);
}

// ================================
// Location Modal
// ================================

function setupLocationModal() {
    const locationBtn = document.getElementById('locationBtn');
    const locationModal = document.getElementById('locationModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (!locationBtn || !locationModal) return;

    locationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        locationModal.classList.add('show');
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            locationModal.classList.remove('show');
        });
    }

    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            locationModal.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            locationModal.classList.remove('show');
        }
    });
}
