// ================================
// Western-Style Invitation
// Auto-Play Music + Interactive Scratch with Falling Flowers
// ================================

const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const card = document.getElementById("card");
const scratchLayer = document.getElementById("scratchLayer");
const scratchHint = document.querySelector(".scratch-hint");
const music = document.getElementById("music");
const particlesContainer = document.getElementById("particles");

let isScratchSetup = false;
let isScratchingActive = false;
const ctx = scratchLayer ? scratchLayer.getContext("2d") : null;

// ================================
// Auto-Play Music on Page Load
// ================================

function autoPlayMusic() {
    music.play().catch((error) => {
        console.log("Auto-play blocked by browser. Music will play when user interacts.");
        document.addEventListener("click", () => {
            music.play().catch((err) => {
                console.log("Music playback failed:", err);
            });
        }, { once: true });
    });
}

// Try to play music when page loads
window.addEventListener("load", () => {
    setTimeout(autoPlayMusic, 500);
});

// Also try on first user interaction
document.addEventListener("click", () => {
    if (music.paused) {
        music.play().catch(() => {
            console.log("Music playback failed");
        });
    }
}, { once: true });

// ================================
// Open Invitation
// ================================

openBtn.addEventListener("click", () => {
    cover.style.display = "none";
    card.style.display = "block";
    
    setupScratchLayer();
    
    if (music.paused) {
        music.play().catch(() => {
            console.log("Music playback blocked");
        });
    }
    
    startParticles();
});

// ================================
// Scratch Layer Setup
// ================================

function setupScratchLayer() {
    if (!scratchLayer || isScratchSetup) return;
    
    scratchLayer.width = card.offsetWidth;
    scratchLayer.height = card.offsetHeight;
    
    const gradient = ctx.createLinearGradient(0, 0, scratchLayer.width, scratchLayer.height);
    gradient.addColorStop(0, "#d4c5a9");
    gradient.addColorStop(1, "#c9a961");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scratchLayer.width, scratchLayer.height);
    
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#8b7355";
    for (let i = 0; i < scratchLayer.width; i += 20) {
        for (let j = 0; j < scratchLayer.height; j += 20) {
            ctx.fillRect(i, j, 10, 10);
        }
    }
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "rgba(245, 241, 232, 0.9)";
    ctx.font = "bold 20px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Rub to Reveal ✨", scratchLayer.width / 2, scratchLayer.height / 2);
    
    ctx.globalCompositeOperation = "destination-out";
    
    isScratchSetup = true;
    attachScratchEvents();
}

// ================================
// Scratch Events
// ================================

function attachScratchEvents() {
    scratchLayer.addEventListener("mousedown", () => {
        isScratchingActive = true;
    });
    
    scratchLayer.addEventListener("mouseup", () => {
        isScratchingActive = false;
        checkScratchProgress();
    });
    
    scratchLayer.addEventListener("mousemove", (e) => {
        if (!isScratchingActive) return;
        const rect = scratchLayer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratchPoint(x, y);
    });
    
    scratchLayer.addEventListener("mouseleave", () => {
        isScratchingActive = false;
    });
    
    scratchLayer.addEventListener("touchstart", (e) => {
        isScratchingActive = true;
        e.preventDefault();
    });
    
    scratchLayer.addEventListener("touchend", (e) => {
        isScratchingActive = false;
        checkScratchProgress();
        e.preventDefault();
    });
    
    scratchLayer.addEventListener("touchmove", (e) => {
        if (!isScratchingActive) return;
        e.preventDefault();
        
        const rect = scratchLayer.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        scratchPoint(x, y);
    });
}

// ================================
// Scratch Drawing (50px brush + Falling Flowers)
// ================================

function scratchPoint(x, y) {
    if (!ctx) return;
    
    // Larger brush size (50px radius = 100px diameter)
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Create falling flowers while scratching
    createScratchFlower(x, y);
}

function createScratchFlower(x, y) {
    // Create falling red rose petals
    const particle = document.createElement("div");
    particle.className = "scratch-flower";
    particle.innerHTML = '🌹';  // Only red roses
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.fontSize = (14 + Math.random() * 10) + "px";
    particle.style.opacity = (0.8 + Math.random() * 0.2).toString();
    particle.style.position = "absolute";
    particle.style.pointerEvents = "none";
    particle.style.animation = "scratchFlowerFall 2s ease-in forwards";
    particle.style.zIndex = "45";
    
    card.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

// ================================
// Check Scratch Progress
// ================================

function checkScratchProgress() {
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, scratchLayer.width, scratchLayer.height);
    const data = imageData.data;
    
    let transparentPixels = 0;
    
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            transparentPixels++;
        }
    }
    
    const totalPixels = scratchLayer.width * scratchLayer.height;
    const scratchPercentage = transparentPixels / totalPixels;
    
    if (scratchPercentage > 0.50) {
        revealCard();
    }
}

// ================================
// Reveal Card
// ================================

function revealCard() {
    if (!scratchLayer || !scratchLayer.style.transition) {
        scratchLayer.style.transition = "opacity 0.8s ease-out";
        scratchLayer.style.opacity = "0";
        scratchHint.classList.add("hidden");
        
        setTimeout(() => {
            scratchLayer.style.pointerEvents = "none";
        }, 800);
    }
}

// ================================
// Decorative Particles (Page Load)
// ================================

function startParticles() {
    const interval = setInterval(() => {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.innerHTML = '🌹';  // Only red roses
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = (3 + Math.random() * 3) + "s";
        particle.style.opacity = (0.3 + Math.random() * 0.4).toString();
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 7000);
    }, 400);
    
    setTimeout(() => {
        clearInterval(interval);
    }, 20000);
}

// ================================
// Initialize
// ================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded. Music will auto-play...");
});

music.addEventListener("loadedmetadata", () => {
    console.log("Music loaded and ready to play");
});

music.addEventListener("error", () => {
    console.log("Error loading music file. Ensure music.mp3 exists in the same directory.");
});

music.addEventListener("ended", () => {
    if (music.loop) {
        console.log("Music loop restarted");
    }
});
