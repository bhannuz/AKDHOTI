document.getElementById('envelope').addEventListener('click', function() {
    // Hide envelope
    this.style.display = 'none';
    
    // Show and animate the card
    const card = document.getElementById('invitation');
    card.classList.add('open');
});
