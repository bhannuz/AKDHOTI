// ================================
// Western-Style Invitation
// Music-Enhanced Version
// ================================

const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const card = document.getElementById("card");
const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const particlesContainer = document.getElementById("particles");

let isPlaying = false;

// ================================
// Music Control
// ================================

musicToggle.addEventListener("click", () => {
    if (isPlaying) {
        music.pause();
        isPlaying = false;
    } else {
        music.play().catch(() => {
            console.log("Music playback blocked. Enable sound in browser.");
        });
        isPlaying = true;
    }
    updateMusicUI();
});

function updateMusicUI() {
    if (isPlaying) {
        musicStatus.textContent = "On";
        musicToggle.classList.add("playing");
    } else {
        musicStatus.textContent = "Off";
        musicToggle.classList.remove("playing");
    }
}

// ================================
// Open Invitation
// ================================

openBtn.addEventListener("click", () => {
    cover.style.display = "none";
    card.style.display = "block";
    
    // Auto-play music when card opens
    if (!isPlaying) {
        music.play().catch(() => {
            console.log("Music blocked until user interaction.");
        });
        isPlaying = true;
        updateMusicUI();
    }
    
    // Start decorative particles
    startParticles();
});

// ================================
// Decorative Particles
// ================================

function startParticles() {
    const flowers = ['🌹', '🌸', '🌺', '💐', '🌻'];
    const interval = setInterval(() => {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = (3 + Math.random() * 3) + "s";
        particle.style.opacity = (0.3 + Math.random() * 0.4).toString();
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 7000);
    }, 400);
    
    // Stop particles after 15 seconds
    setTimeout(() => {
        clearInterval(interval);
    }, 15000);
}

// ================================
// Initialize
// ================================

document.addEventListener("DOMContentLoaded", () => {
    updateMusicUI();
    
    // Optional: Add keyboard support for music control
    document.addEventListener("keydown", (e) => {
        if (e.key === "m" || e.key === "M") {
            musicToggle.click();
        }
    });
});

// ================================
// Music Metadata
// ================================

music.addEventListener("loadedmetadata", () => {
    console.log("Music loaded and ready to play");
});

music.addEventListener("error", () => {
    console.log("Error loading music file. Ensure music.mp3 exists in the same directory.");
});

// Update UI when music ends
music.addEventListener("ended", () => {
    if (music.loop) {
        console.log("Music loop started");
    }
});
