export function initLiquidCursor() {
  const canvas = document.getElementById("liquid-cursor-canvas");
  if (!canvas) return;
  if (window.innerWidth <= 768) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let currentX = mouseX;
  let currentY = mouseY;

  const particles = [];
  const maxParticles = 36;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnSplash(x, y, dx, dy) {
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 45);

    if (speed < 0.5) return;

    const count = Math.max(2, Math.min(5, Math.floor(speed * 0.12)));

    for (let i = 0; i < count; i += 1) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
      const velocity = 0.6 + Math.random() * (speed * 0.12);

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: 18 + Math.random() * 20 + speed * 0.18,
        life: 1,
        decay: 0.018 + Math.random() * 0.016
      });
    }

    while (particles.length > maxParticles) {
      particles.shift();
    }
  }

  function drawParticle(p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    gradient.addColorStop(0, `rgba(255,255,255,${0.18 * p.life})`);
    gradient.addColorStop(0.25, `rgba(255,255,255,${0.12 * p.life})`);
    gradient.addColorStop(0.6, `rgba(255,255,255,${0.05 * p.life})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCoreGlow() {
    const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 42);
    gradient.addColorStop(0, "rgba(255,255,255,0.24)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.14)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.04)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 42, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHalo() {
    const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 110);
    gradient.addColorStop(0, "rgba(255,255,255,0.06)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.035)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 110, 0, Math.PI * 2);
    ctx.fill();
  }

  function onMouseMove(event) {
    const dx = event.clientX - mouseX;
    const dy = event.clientY - mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;

    spawnSplash(mouseX, mouseY, dx, dy);
  }

  function animate() {
    currentX += (mouseX - currentX) * 0.18;
    currentY += (mouseY - currentY) * 0.18;

    ctx.clearRect(0, 0, width, height);

    drawHalo();

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.radius *= 0.992;
      p.life -= p.decay;

      if (p.life <= 0.02 || p.radius <= 1.5) {
        particles.splice(i, 1);
        continue;
      }

      drawParticle(p);
    }

    drawCoreGlow();

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  animate();
}