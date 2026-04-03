export function initLiquidCursor() {
  const canvas = document.getElementById("liquid-cursor-canvas");
  if (!canvas) return;
  if (window.innerWidth <= 768) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let mouseX = width * 0.5;
  let mouseY = height * 0.5;
  let currentX = mouseX;
  let currentY = mouseY;

  const blobs = [];

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

  function addBlob(x, y, dx, dy) {
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 50);

    blobs.push({
      x,
      y,
      dx,
      dy,
      life: 1,
      radius: 18 + speed * 0.7,
      stretch: 1 + speed * 0.02,
      angle: Math.atan2(dy, dx || 0.001)
    });
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (event) => {
    const dx = event.clientX - mouseX;
    const dy = event.clientY - mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;

    addBlob(mouseX, mouseY, dx, dy);
  });

  resize();

  function drawBlob(blob) {
    ctx.save();
    ctx.translate(blob.x, blob.y);
    ctx.rotate(blob.angle);
    ctx.scale(blob.stretch, 1 / Math.max(blob.stretch, 0.001));

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.radius);
    gradient.addColorStop(0, `rgba(255,255,255,${0.11 * blob.life})`);
    gradient.addColorStop(0.35, `rgba(255,255,255,${0.06 * blob.life})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, blob.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    currentX += (mouseX - currentX) * 0.2;
    currentY += (mouseY - currentY) * 0.2;

    ctx.clearRect(0, 0, width, height);

    for (let i = blobs.length - 1; i >= 0; i -= 1) {
      const blob = blobs[i];

      blob.life -= 0.03;
      blob.x += blob.dx * 0.015;
      blob.y += blob.dy * 0.015;

      if (blob.life <= 0) {
        blobs.splice(i, 1);
        continue;
      }

      drawBlob(blob);
    }

    const ambient = {
      x: currentX,
      y: currentY,
      dx: 0,
      dy: 0,
      life: 0.25,
      radius: 28,
      stretch: 1,
      angle: 0
    };

    drawBlob(ambient);

    requestAnimationFrame(animate);
  }

  animate();
}