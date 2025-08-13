// Efek touch screen minimalis hanya di section .hero

(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Cek jika sudah ada canvas touch, jangan duplikat
  if (hero.querySelector('.hero-touch-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-touch-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = 2;
  canvas.style.pointerEvents = 'none'; // <-- ubah di sini!
  hero.appendChild(canvas);

  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';

  const ctx = canvas.getContext('2d');
  let width = hero.offsetWidth;
  let height = hero.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  function getCSSVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
  }
  const color1 = getCSSVar('--primary', '#5e2f8b').trim();
  const color2 = getCSSVar('--primary-light', '#7d4eac').trim();

  const particles = [];
  const maxParticles = 24;

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle(x, y) {
    const colors = [color1, color2];
    particles.push({
      x,
      y,
      r: randomBetween(3, 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: randomBetween(-0.7, 0.7),
      vy: randomBetween(-0.7, 0.7),
      alpha: 1,
      decay: randomBetween(0.018, 0.028)
    });
    if (particles.length > maxParticles) particles.shift();
  }

  function handlePointer(e) {
    let rect = hero.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches.length) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    if (x >= 0 && y >= 0 && x <= width && y <= height) {
      createParticle(x, y);
    }
  }
  hero.addEventListener('mousemove', handlePointer);
  hero.addEventListener('touchmove', handlePointer);

  function resizeCanvas() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  animate();
})();