/**
 * Spotlight & 3D Tilt Manager
 * Tracks cursor position relative to cards for dynamic radial border illumination
 * and provides subtle 3D perspective tilt on interactive elements.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Spotlight border glow tracking
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-500px`);
      card.style.setProperty('--mouse-y', `-500px`);
    });
  });

  // 2. 3D Perspective Tilt on Hero Laptop Studio
  const laptopBox = document.getElementById('laptop-tilt-box');
  if (laptopBox) {
    laptopBox.addEventListener('mousemove', (e) => {
      const rect = laptopBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      laptopBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    laptopBox.addEventListener('mouseleave', () => {
      laptopBox.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  }
});
