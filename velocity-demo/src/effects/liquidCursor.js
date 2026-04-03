export function initLiquidCursor() {
  const canvas = document.getElementById("liquid-cursor");
  if (!canvas || window.innerWidth <= 768) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const blobs = [];
  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let smoothX = mouseX;
  let smoothY = mouseY;
  let lastX = mouseX;
  let lastY = mouseY;
  let hovering = false;

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

  function pushBlob(x, y, dx, dy, force = 1) {
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);

    blobs.push({
      x,
      y,
      dx,
      dy,
      life: 1,
      radius: 24 + speed * 0.9 + (hovering ? 18 : 0),
      stretch: 1.35 + speed * 0.02
    });

    if (blobs.length > 32) {
      blobs.shift();
    }
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    const dx = mouseX - lastX;
    const dy = mouseY - lastY;

    pushBlob(mouseX, mouseY, dx, dy);
    lastX = mouseX;
    lastY = mouseY;
  });

  document.querySelectorAll(".hover-target").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      hovering = true;
    });

    el.addEventListener("mouseleave", () => {
      hovering = false;
    });
  });

  resize();

  function drawBlob(blob) {
    const angle = Math.atan2(blob.dy, blob.dx || 0.0001);

    ctx.save();
    ctx.translate(blob.x, blob.y);
    ctx.rotate(angle);

    const rx = blob.radius * blob.stretch;
    const ry = blob.radius * 0.7;

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0, `rgba(255,255,255,${0.11 * blob.life})`);
    grad.addColorStop(0.35, `rgba(255,255,255,${0.07 * blob.life})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    smoothX += (mouseX - smoothX) * 0.16;
    smoothY += (mouseY - smoothY) * 0.16;

    ctx.clearRect(0, 0, width, height);

    const idleBlob = {
      x: smoothX,
      y: smoothY,
      dx: mouseX - smoothX,
      dy: mouseY - smoothY,
      life: hovering ? 0.85 : 0.55,
      radius: hovering ? 42 : 28,
      stretch: hovering ? 1.15 : 1.05
    };

    drawBlob(idleBlob);

    for (let i = blobs.length - 1; i >= 0; i -= 1) {
      const blob = blobs[i];
      blob.life -= hovering ? 0.026 : 0.036;
      blob.x += blob.dx * 0.02;
      blob.y += blob.dy * 0.02;
      blob.radius *= 0.996;

      if (blob.life <= 0) {
        blobs.splice(i, 1);
        continue;
      }

      drawBlob(blob);
    }

    requestAnimationFrame(animate);
  }

  animate();
}