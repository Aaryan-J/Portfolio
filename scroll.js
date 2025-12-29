// Scroll fade-in effect
const faders = document.querySelectorAll('.fade-in');

function handleFadeIn() {
  const triggerBottom = window.innerHeight * 0.85;
  faders.forEach(fader => {
    const top = fader.getBoundingClientRect().top;
    if (top < triggerBottom) {
      fader.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleFadeIn);
handleFadeIn(); // run once on load
