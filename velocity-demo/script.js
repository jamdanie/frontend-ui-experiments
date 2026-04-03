window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const slides = [
  { src: "assets/p1.jpg", label: "ARC-01", bg: "#ffffff", rotate: -3 },
  { src: "assets/p2.jpg", label: "NEON-02", bg: "#ffffff", rotate: 3 },
  { src: "assets/p3.jpg", label: "FROST-03", bg: "#ffffff", rotate: -2 },
  { src: "assets/p4.jpg", label: "GHOST-04", bg: "#ffffff", rotate: 2 },
  { src: "assets/p5.jpg", label: "VIOLET-05", bg: "#ffffff", rotate: -4 },
  { src: "assets/p6.jpg", label: "VOID-06", bg: "#ffffff", rotate: 3 }
];
  const panels = document.querySelectorAll(".panel");
  const hero = document.getElementById("hero");
  const heroTitle = document.getElementById("hero-title");
  const activeLabel = document.getElementById("active-label");

  const cardStage = document.getElementById("card-stage");
  const cardFront = document.getElementById("card-front");
  const cardBack = document.getElementById("card-back");
  const imageFront = document.getElementById("image-front");
  const imageBack = document.getElementById("image-back");

  const blobA = document.querySelector(".blob-a");
  const blobB = document.querySelector(".blob-b");
  const blobC = document.querySelector(".blob-c");

  let currentIndex = 0;
  let transitionLock = false;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let hovering = false;

  imageFront.src = slides[0].src;
  imageBack.src = slides[0].src;
  activeLabel.textContent = slides[0].label;

  gsap.from(".eyebrow", {
    y: 18,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out"
  });

  gsap.from(heroTitle, {
    y: 70,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.08
  });

  gsap.from(".subcopy", {
    y: 18,
    opacity: 0,
    duration: 0.65,
    ease: "power3.out",
    delay: 0.18
  });

  gsap.from(".meta-row", {
    y: 14,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out",
    delay: 0.26
  });

  gsap.from(cardStage, {
    scale: 0.86,
    opacity: 0,
    rotation: -8,
    duration: 1,
    ease: "power3.out",
    delay: 0.08
  });

  gsap.to(cardStage, {
    y: -12,
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobA, {
    x: 18,
    y: -10,
    rotation: -8,
    duration: 4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobB, {
    x: -16,
    y: 10,
    rotation: 20,
    duration: 3.3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobC, {
    x: 8,
    y: -10,
    scale: 1.08,
    duration: 3.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  function animateMouse() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    gsap.set(cardStage, {
      rotationY: currentX * 10,
      rotationX: currentY * -10,
      x: currentX * 18,
      y: currentY * 12
    });

    gsap.set(cardBack, {
      x: 18 + currentX * 10,
      y: 18 + currentY * 8
    });

    requestAnimationFrame(animateMouse);
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  animateMouse();

  hero.addEventListener("mouseenter", () => {
    hovering = true;
    gsap.to(cardStage, {
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  hero.addEventListener("mouseleave", () => {
    hovering = false;
    gsap.to(cardStage, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  function updateScene(index) {
    const slide = slides[index];

    gsap.to("body", {
      backgroundColor: slide.bg,
      duration: 0.45,
      ease: "power2.out"
    });

    gsap.to(heroTitle, {
      x: index % 2 === 0 ? 0 : 12,
      y: index % 2 === 0 ? 0 : -4,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(activeLabel, {
      opacity: 0,
      y: 10,
      duration: 0.16,
      onComplete: () => {
        activeLabel.textContent = slide.label;
        gsap.to(activeLabel, {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out"
        });
      }
    });
  }

  function switchImage(nextIndex) {
    if (transitionLock || nextIndex === currentIndex) return;
    transitionLock = true;

    const nextSlide = slides[nextIndex];
    imageBack.src = imageFront.src;

    gsap.to(cardBack, {
      opacity: 0.12,
      scale: 0.94,
      rotation: nextIndex % 2 === 0 ? -8 : 8,
      duration: 0.45,
      ease: "power2.out"
    });

    cardFront.classList.add("flash");

    gsap.to(cardFront, {
      rotation: nextSlide.rotate,
      scale: 1.03,
      duration: 0.18,
      ease: "power2.out",
      onComplete: () => {
        imageFront.src = nextSlide.src;

        gsap.fromTo(
          cardFront,
          {
            opacity: 0.5,
            scale: 1.10,
            rotation: nextSlide.rotate * 2,
            filter: "blur(10px)"
          },
          {
            opacity: 1,
            scale: hovering ? 1.03 : 1,
            rotation: nextSlide.rotate,
            filter: "blur(0px)",
            duration: 0.62,
            ease: "power3.out",
            onComplete: () => {
              cardFront.classList.remove("flash");
              currentIndex = nextIndex;
              transitionLock = false;
            }
          }
        );
      }
    });

    updateScene(nextIndex);
  }

  panels.forEach((panel, index) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top center",
      end: "bottom center",
      onEnter: () => switchImage(index),
      onEnterBack: () => switchImage(index)
    });
  });

  ScrollTrigger.create({
    trigger: ".site-shell",
    start: "top top",
    end: "+=500%",
    pin: ".hero",
    pinSpacing: false
  });

  gsap.to(".hero-copy", {
    y: -28,
    ease: "none",
    scrollTrigger: {
      trigger: ".site-shell",
      start: "top top",
      end: "+=500%",
      scrub: true
    }
  });
});