export function initCursorTrail() {
  const canvas = document.getElementById("distortion-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const points = [];
  let mouseX = width * 0.5;
  let mouseY = height * 0.5;
  let lastX = mouseX;
  let lastY = mouseY;
  let active = false;

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

  function addPoint(x, y) {
    const dx = x - lastX;
    const dy = y - lastY;
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);

    points.push({
      x,
      y,
      dx,
      dy,
      speed,
      life: 1,
      size: 24 + speed * 0.9
    });

    lastX = x;
    lastY = y;
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    active = true;
    addPoint(mouseX, mouseY);
  });

  window.addEventListener("mouseleave", () => {
    active = false;
  });

  resize();

  function drawBlob(point) {
    const angle = Math.atan2(point.dy, point.dx || 0.0001);

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(angle);

    const w = point.size * 1.6;
    const h = Math.max(point.size * 0.55, 12);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    grad.addColorStop(0, `rgba(255,255,255,${0.14 * point.life})`);
    grad.addColorStop(0.35, `rgba(255,255,255,${0.08 * point.life})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = points.length - 1; i >= 0; i -= 1) {
      const p = points[i];
      p.life -= 0.03;
      p.x += p.dx * 0.02;
      p.y += p.dy * 0.02;

      if (p.life <= 0) {
        points.splice(i, 1);
        continue;
      }

      drawBlob(p);
    }

    if (active && points.length < 2) {
      addPoint(mouseX, mouseY);
    }

    requestAnimationFrame(animate);
  }

  animate();
}