// ── CURSOR TRAIL ──────────────────────────────────────
let lastTrail = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastTrail < 25) return;
  lastTrail = now;
  const p = document.createElement('div');
  p.className = 'trail-particle';
  p.style.left = e.clientX + 'px';
  p.style.top  = e.clientY + 'px';
  // randomise size slightly
  const size = 4 + Math.random() * 6;
  p.style.width  = size + 'px';
  p.style.height = size + 'px';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 700);
});

// ── GLITCH (hero only) ────────────────────────────────
function triggerGlitch() {
  const title = document.querySelector('.swoop-title');
  if (!title) return;
  title.classList.add('glitching');
  setTimeout(() => title.classList.remove('glitching'), 350);
}
setInterval(triggerGlitch, 8000);
setTimeout(triggerGlitch, 9000); // first fire after letters land

// ── 3D CARD TILT ──────────────────────────────────────
document.querySelectorAll('.print-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── SECTION SLIDE-IN ON SCROLL ────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── KEN BURNS — restart on photo change ───────────────
document.querySelectorAll('.player-main').forEach(img => {
  img.addEventListener('load', () => {
    img.style.animation = 'none';
    img.offsetHeight;
    img.style.animation = '';
  });
});
