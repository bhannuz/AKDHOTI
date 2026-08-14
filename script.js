const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const container = document.querySelector('.container');

// 1. Set canvas size to match its container exactly
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

// 2. Define the "scratchable" surface (e.g., matte gold foil)
context.fillStyle = '#C0A060'; // Gold color for the foil
context.fillRect(0, 0, canvas.width, canvas.height);

// Add text instruction over the foil
context.fillStyle = '#fff';
context.font = '24px Arial';
context.textAlign = 'center';
context.fillText('SCRATCH HERE TO REVEAL', canvas.width / 2, canvas.height / 2);

let isScratching = false;

// 3. Define the scratch function
function scratch(x, y) {
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, 25, 0, Math.PI * 2); // Defines brush size
    context.fill();
}

// 4. Input listeners (Mouse and Touch)
canvas.addEventListener('mousedown', (e) => { isScratching = true; });
canvas.addEventListener('mouseup', () => { isScratching = false; });
canvas.addEventListener('mouseleave', () => { isScratching = false; });

// Touch events (for mobile)
canvas.addEventListener('touchstart', (e) => { isScratching = true; e.preventDefault(); });
canvas.addEventListener('touchend', () => { isScratching = false; });

// Movement detection
canvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();
});
