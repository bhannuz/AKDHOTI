// Single-Page Invitation Script
// ================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeInvitation();
});

// Main initialization function
function initializeInvitation() {
    // Show invitation card immediately
    const card = document.querySelector('.invitation-card');
    if (card) {
        card.classList.add('active');
    }

    // Start particles falling
    startParticles();

    // Setup modal for location
    setupLocationModal();
}

// ================================
// Particles/Flowers Animation
// ================================

function startParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Start flower animation immediately and run for 20 seconds
    const interval = setInterval(() => {
        createFlower(particlesContainer);
    }, 400);

    // Stop creating new flowers after 20 seconds
    setTimeout(() => {
        clearInterval(interval);
    }, 20000);
}

function createFlower(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerHTML = '🌹'; // Red rose flower
    
    // Random horizontal position (0-100vw)
    const randomLeft = Math.random() * 100;
    particle.style.left = randomLeft + 'vw';
    
    // Start from top of screen
    particle.style.top = '-30px';
    
    // Random animation duration (3-6 seconds)
    const duration = (3 + Math.random() * 3);
    particle.style.animationDuration = duration + 's';
    
    // Random opacity
    particle.style.opacity = (0.3 + Math.random() * 0.4).toString();
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// ================================
// Location Modal Handling
// ================================

function setupLocationModal() {
    const locationBtn = document.getElementById('locationBtn');
    const locationModal = document.getElementById('locationModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (!locationBtn || !locationModal) return;

    // Open modal when location button clicked
    locationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        locationModal.classList.add('show');
    });

    // Close modal when X button clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            locationModal.classList.remove('show');
        });
    }

    // Close modal when clicking outside the content
    locationModal.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            locationModal.classList.remove('show');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            locationModal.classList.remove('show');
        }
    });
}

// ================================
// Optional: Background Music
// ================================

function initializeMusic() {
    const audio = document.getElementById('music');
    if (!audio) return;

    // Autoplay with muted attribute for better browser support
    audio.muted = true;
    audio.play().catch(() => {
        console.log('Autoplay prevented by browser');
    });

    // Try to unmute after user interaction
    document.addEventListener('click', () => {
        audio.muted = false;
    }, { once: true });
}

// Call music initialization
// initializeMusic();
