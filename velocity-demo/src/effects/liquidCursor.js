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
  let targetX = mouseX;
  let targetY = mouseY;

  let rafId = 0;

  const blobs = [];
  const maxBlobs = 24;

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
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 42);

    blobs.push({
      x,
      y,
      dx,
      dy,
      life: 1,
      radius: 24 + speed * 0.55,
      stretch: 1 + speed * 0.018,
      angle: Math.atan2(dy, dx || 0.001),
      drift: 0.985 + Math.random() * 0.008
    });

    if (blobs.length > maxBlobs) {
      blobs.shift();
    }
  }

  function drawBlob(blob) {
    ctx.save();
    ctx.translate(blob.x, blob.y);
    ctx.rotate(blob.angle);
    ctx.scale(blob.stretch, 1 / Math.max(blob.stretch, 0.001));

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.radius);
    gradient.addColorStop(0, `rgba(255,255,255,${0.09 * blob.life})`);
    gradient.addColorStop(0.22, `rgba(255,255,255,${0.055 * blob.life})`);
    gradient.addColorStop(0.55, `rgba(255,255,255,${0.02 * blob.life})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, blob.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function onResize() {
    resize();
  }

  function onMouseMove(event) {
    const dx = event.clientX - mouseX;
    const dy = event.clientY - mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;

    addBlob(mouseX, mouseY, dx, dy);
  }

  function drawBackgroundGlow() {
    const glow = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 120);
    glow.addColorStop(0, "rgba(255,255,255,0.035)");
    glow.addColorStop(0.45, "rgba(255,255,255,0.018)");
    glow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 120, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    targetX += (mouseX - targetX) * 0.16;
    targetY += (mouseY - targetY) * 0.16;

    ctx.clearRect(0, 0, width, height);

    drawBackgroundGlow();

    for (let i = blobs.length - 1; i >= 0; i -= 1) {
      const blob = blobs[i];

      blob.life -= 0.032;
      blob.x += blob.dx * 0.018;
      blob.y += blob.dy * 0.018;
      blob.dx *= blob.drift;
      blob.dy *= blob.drift;
      blob.radius *= 0.996;

      if (blob.life <= 0.01 || blob.radius <= 2) {
        blobs.splice(i, 1);
        continue;
      }

      drawBlob(blob);
    }

    const ambientBlob = {
      x: targetX,
      y: targetY,
      dx: 0,
      dy: 0,
      life: 0.36,
      radius: 34,
      stretch: 1,
      angle: 0
    };

    drawBlob(ambientBlob);

    rafId = window.requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  animate();
}