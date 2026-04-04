export function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!dot || !ring) return;
  if (window.innerWidth <= 768) return;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;

  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  let stretchX = 1;
  let stretchY = 1;

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  window.addEventListener("mousemove", onMouseMove, { passive: true });

  function animateCursor() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);

    dotX += (mouseX - dotX) * 0.38;
    dotY += (mouseY - dotY) * 0.38;

    ringX += dx * 0.14;
    ringY += dy * 0.14;

    const targetStretchX = 1 + speed * 0.01;
    const targetStretchY = 1 - speed * 0.0045;

    stretchX += (targetStretchX - stretchX) * 0.14;
    stretchY += (targetStretchY - stretchY) * 0.14;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;

    window.requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll(".hover-target").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-hover");
    });

    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-hover");
    });
  });

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${relX * 0.08}px, ${relY * 0.08}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0px, 0px)";
    });
  });
}