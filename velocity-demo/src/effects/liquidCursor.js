export function initLiquidCursor() {
  const canvas = document.getElementById("liquid-cursor-canvas");
  console.log("[liquidCursor] init called");

  if (!canvas) {
    console.error("[liquidCursor] canvas not found");
    return;
  }

  if (window.innerWidth <= 768) {
    console.warn("[liquidCursor] disabled on mobile width");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("[liquidCursor] 2D context not available");
    return;
  }

  console.log("[liquidCursor] canvas + context OK");

  let width = 0;
  let height = 0;
  let dpr = 1;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let currentX = mouseX;
  let currentY = mouseY;

  const particles = [];
  const maxParticles = 60;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    console.log("[liquidCursor] resized", { width, height, dpr });
  }

  function spawnParticles(x, y, dx, dy) {
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
    const count = Math.max(3, Math.min(8, Math.floor(speed * 0.18) || 3));

    for (let i = 0; i < count; i += 1) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
      const velocity = 0.8 + Math.random() * (speed * 0.16 + 1);

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: 14 + Math.random() * 24 + speed * 0.25,
        life: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }

    while (particles.length > maxParticles) {
      particles.shift();
    }
  }

  function drawParticle(p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${0.28 * p.life})`);
    gradient.addColorStop(0.35, `rgba(0, 0, 0, ${0.18 * p.life})`);
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${0.08 * p.life})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCore() {
    const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 46);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.38)");
    gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.22)");
    gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.09)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 46, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOuterHalo() {
    const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 140);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.10)");
    gradient.addColorStop(0.45, "rgba(0, 0, 0, 0.06)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 140, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDebugDot() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.95)";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  function onMouseMove(event) {
    const dx = event.clientX - mouseX;
    const dy = event.clientY - mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;

    spawnParticles(mouseX, mouseY, dx, dy);
  }

  function animate() {
    currentX += (mouseX - currentX) * 0.18;
    currentY += (mouseY - currentY) * 0.18;

    ctx.clearRect(0, 0, width, height);

    drawOuterHalo();

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

    drawCore();
    drawDebugDot();

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  animate();
}