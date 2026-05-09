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

// ── DIGITAL GLITCH LOOP (hero only) ──────────────────
function triggerGlitch() {
  const title = document.querySelector('.swoop-title');
  if (!title) return;
  title.classList.add('glitching');
  setTimeout(() => title.classList.remove('glitching'), 1100);
}
setInterval(triggerGlitch, 8000);
setTimeout(triggerGlitch, 2500); // first fire after letters land

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

// ── LIGHTBOX ──────────────────────────────────────────
const lb = document.createElement('div');
lb.className = 'lightbox';
lb.innerHTML = `
  <button class="lightbox-close" aria-label="Close">&#x2715;</button>
  <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#x2039;</button>
  <div class="lightbox-img-wrap">
    <img class="lightbox-img" src="" alt="" draggable="false">
    <div class="lightbox-shield"></div>
  </div>
  <div class="lightbox-label"></div>
  <button class="lightbox-nav lightbox-next" aria-label="Next">&#x203A;</button>
`;
document.body.appendChild(lb);

const lbImg   = lb.querySelector('.lightbox-img');
lbImg.addEventListener('contextmenu', e => e.preventDefault());
const lbLabel = lb.querySelector('.lightbox-label');
let lbThumbs = [];
let lbIdx    = 0;

function lbOpen(src, label, thumbs, idx) {
  lbImg.src = src;
  lbLabel.textContent = label || '';
  if (thumbs) { lbThumbs = thumbs; lbIdx = idx != null ? idx : 0; }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function lbClose() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 250);
}
function lbNav(dir) {
  if (!lbThumbs.length) return;
  lbIdx = (lbIdx + dir + lbThumbs.length) % lbThumbs.length;
  const t = lbThumbs[lbIdx];
  lbImg.src = t.dataset.src;
  lbLabel.textContent = t.dataset.label || '';
}

lb.querySelector('.lightbox-close').addEventListener('click', lbClose);
lb.querySelector('.lightbox-prev').addEventListener('click', e => { e.stopPropagation(); lbNav(-1); });
lb.querySelector('.lightbox-next').addEventListener('click', e => { e.stopPropagation(); lbNav(1); });
lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     lbClose();
  if (e.key === 'ArrowLeft')  lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

document.querySelectorAll('.player-stage').forEach(stage => {
  const hint = document.createElement('div');
  hint.className = 'player-expand';
  hint.innerHTML = '&#x2922;';
  stage.appendChild(hint);

  stage.addEventListener('click', e => {
    if (e.target.closest('.p-btn')) return;
    const img    = stage.querySelector('.player-main');
    const player = stage.closest('.player');
    const thumbs = Array.from(player.querySelectorAll('.thumb'));
    const idx    = thumbs.findIndex(t => t.classList.contains('active'));
    lbOpen(img.src, idx >= 0 ? (thumbs[idx].dataset.label || '') : '', thumbs, Math.max(0, idx));
  });
});
