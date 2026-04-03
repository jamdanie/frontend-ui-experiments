export function initCursor() {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const hoverTargets = document.querySelectorAll(".hover-target");

  if (!cursorDot || !cursorRing) return;
  if (window.innerWidth <= 768) return;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  hoverTargets.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorRing.classList.add("is-hover");
    });

    item.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-hover");
    });
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.38;
    dotY += (mouseY - dotY) * 0.38;
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}