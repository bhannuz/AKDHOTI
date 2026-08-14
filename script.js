document.addEventListener("DOMContentLoaded", () => {
    // Smooth fade-in presentation on page load
    const container = document.querySelector(".invitation-container");
    if (container) {
        container.style.opacity = "0";
        container.style.transition = "opacity 1s ease-in-out, transform 0.8s ease-out";
        container.style.transform = "translateY(15px)";

        setTimeout(() => {
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        }, 150);
    }
});
