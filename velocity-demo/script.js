gsap.registerPlugin(ScrollTrigger);

/* =========================
   IMAGE LIST (MATCH YOUR FILES)
========================= */

const images = [
  "p1.jpg",
  "p2.jpg",
  "p3.jpg",
  "p4.jpg",
  "p5.jpg",
  "p6.jpg"
];

const img = document.getElementById("product-image");

/* =========================
   INIT
========================= */

let currentIndex = 0;
img.src = images[currentIndex];

/* =========================
   IMAGE CHANGE FUNCTION
========================= */

function changeImage(index) {
  if (index === currentIndex) return;

  currentIndex = index;

  // glitch on
  img.classList.add("glitch");

  gsap.to(img, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      img.src = images[index];

      gsap.to(img, {
        opacity: 1,
        duration: 0.4,
        onComplete: () => {
          setTimeout(() => {
            img.classList.remove("glitch");
          }, 150);
        }
      });
    }
  });
}

/* =========================
   SMOOTH SCROLL CONTROL (BUTTERMAX STYLE)
========================= */

gsap.to({}, {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "+=3000",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const index = Math.floor(progress * images.length);
      changeImage(index);
    }
  }
});

/* =========================
   MOUSE PARALLAX
========================= */

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  gsap.to(img, {
    rotationY: x,
    rotationX: -y,
    duration: 0.5,
    ease: "power2.out"
  });
});

/* =========================
   HOVER GLITCH
========================= */

img.addEventListener("mouseenter", () => {
  img.classList.add("glitch");
});

img.addEventListener("mouseleave", () => {
  img.classList.remove("glitch");
});