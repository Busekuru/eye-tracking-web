// public/features.js
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.feature-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => {
    c.style.opacity = 0;
    c.style.transform = 'translateY(20px)';
    io.observe(c);
  });
});