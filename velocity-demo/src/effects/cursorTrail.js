export function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let currentX = mouseX;
  let currentY = mouseY;

  let velocityX = 0;
  let velocityY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // smooth follow
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;

    velocityX = dx * 0.15;
    velocityY = dy * 0.15;

    currentX += velocityX;
    currentY += velocityY;

    // stretch based on velocity
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
    const stretch = 1 + speed * 0.015;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    ring.style.transform = `
      translate(${currentX}px, ${currentY}px)
      translate(-50%, -50%)
      scale(${stretch}, ${1 / stretch})
    `;

    requestAnimationFrame(animate);
  }

  animate();

  // hover interactions
  document.querySelectorAll(".hover-target").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-hover");
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-hover");
    });
  });
}