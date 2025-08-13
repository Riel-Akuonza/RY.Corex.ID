// Canvas interaktif latar belakang section .hero: animasi kubus melayang selamanya, lebih besar & tegas

(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Cek jika sudah ada canvas background, jangan duplikat
  if (hero.querySelector('.hero-bg-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-bg-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.90'; // sedikit lebih tegas
  hero.insertBefore(canvas, hero.firstChild);

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
  const color3 = getCSSVar('--background', '#f8f5fa').trim();

  const cubes = [];
  const maxCubes = 25; // lebih banyak

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createCube(x, y, size) {
    const colors = [color1, color2, color3];
    cubes.push({
      x: x !== undefined ? x : randomBetween(0, width),
      y: y !== undefined ? y : randomBetween(0, height),
      size: size !== undefined ? size : randomBetween(32, 64), // lebih besar
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
      angle: randomBetween(0, Math.PI * 2),
      vAngle: randomBetween(-0.012, 0.012),
      alpha: randomBetween(0.45, 0.85) // lebih tegas
    });
    if (cubes.length > maxCubes) cubes.shift();
  }

  // Inisialisasi kubus awal
  for (let i = 0; i < maxCubes; i++) createCube();

  // Event: mouse/touch di area hero saja, tambahkan kubus baru kecil
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
      createCube(x, y, randomBetween(18, 32));
    }
  }
  // Tidak perlu pointer event di canvas background, cukup di canvas touch screen

  function resizeCanvas() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);

  function drawCube(cube) {
    ctx.save();
    ctx.globalAlpha = cube.alpha;
    ctx.translate(cube.x, cube.y);
    ctx.rotate(cube.angle);
    ctx.fillStyle = cube.color;
    ctx.shadowColor = cube.color;
    ctx.shadowBlur = 30; // lebih tebal
    ctx.fillRect(-cube.size / 5, -cube.size / 5, cube.size, cube.size);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < cubes.length; i++) {
      const c = cubes[i];
      drawCube(c);
      c.x += c.vx;
      c.y += c.vy;
      c.angle += c.vAngle;
      if (c.x < -c.size) c.x = width + c.size;
      if (c.x > width + c.size) c.x = -c.size;
      if (c.y < -c.size) c.y = height + c.size;
      if (c.y > height + c.size) c.y = -c.size;
    }
    requestAnimationFrame(animate);
  }
  animate();
})();