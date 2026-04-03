window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const slides = [
    { src: "assets/p1.jpg", label: "ARC-01", bg: "#ffffff", rotate: -6, x: -30, y: -10 },
    { src: "assets/p2.jpg", label: "NEON-02", bg: "#ffffff", rotate: 6, x: 20, y: -8 },
    { src: "assets/p3.jpg", label: "FROST-03", bg: "#ffffff", rotate: -4, x: -16, y: 8 },
    { src: "assets/p4.jpg", label: "GHOST-04", bg: "#ffffff", rotate: 5, x: 18, y: 4 },
    { src: "assets/p5.jpg", label: "VIOLET-05", bg: "#ffffff", rotate: -7, x: -20, y: -4 },
    { src: "assets/p6.jpg", label: "VOID-06", bg: "#ffffff", rotate: 7, x: 15, y: 6 }
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
  const blobD = document.querySelector(".blob-d");

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
    duration: 0.55,
    ease: "power3.out"
  });

  gsap.from(heroTitle, {
    y: 90,
    opacity: 0,
    duration: 0.95,
    ease: "power4.out",
    delay: 0.06
  });

  gsap.from(".subcopy", {
    y: 16,
    opacity: 0,
    duration: 0.55,
    ease: "power3.out",
    delay: 0.18
  });

  gsap.from(".meta-row", {
    y: 14,
    opacity: 0,
    duration: 0.55,
    ease: "power3.out",
    delay: 0.26
  });

  gsap.from(cardStage, {
    scale: 0.8,
    opacity: 0,
    rotation: -14,
    x: 90,
    duration: 1.05,
    ease: "power4.out",
    delay: 0.08
  });

  gsap.to(cardStage, {
    y: -16,
    duration: 2.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobA, {
    x: 26,
    y: -12,
    rotation: -20,
    duration: 3.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobB, {
    x: -18,
    y: 14,
    rotation: 26,
    duration: 3.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobC, {
    x: 10,
    y: -14,
    scale: 1.16,
    duration: 3.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(blobD, {
    x: 12,
    y: 6,
    rotation: 11,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  function animateMouse() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    gsap.set(cardStage, {
      rotationY: currentX * 12,
      rotationX: currentY * -11,
      x: currentX * 26,
      y: currentY * 18
    });

    gsap.set(cardBack, {
      x: 26 + currentX * 12,
      y: 24 + currentY * 10
    });

    gsap.set(blobA, {
      xPercent: currentX * 7
    });

    gsap.set(blobB, {
      xPercent: currentX * -6
    });

    gsap.set(blobC, {
      yPercent: currentY * 7
    });

    gsap.set(blobD, {
      xPercent: currentX * 5
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
      scale: 1.04,
      duration: 0.28,
      ease: "power2.out"
    });
  });

  hero.addEventListener("mouseleave", () => {
    hovering = false;
    gsap.to(cardStage, {
      scale: 1,
      duration: 0.28,
      ease: "power2.out"
    });
  });

  function updateScene(index) {
    const slide = slides[index];

    gsap.to("body", {
      backgroundColor: slide.bg,
      duration: 0.35,
      ease: "power2.out"
    });

    gsap.to(heroTitle, {
      x: slide.x,
      y: slide.y,
      duration: 0.38,
      ease: "power2.out"
    });

    gsap.to(activeLabel, {
      opacity: 0,
      y: 10,
      duration: 0.14,
      onComplete: () => {
        activeLabel.textContent = slide.label;
        gsap.to(activeLabel, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    });

    gsap.to(blobA, {
      width: index % 2 === 0 ? 340 : 280,
      duration: 0.35,
      ease: "power2.out"
    });

    gsap.to(blobB, {
      width: index % 2 === 0 ? 220 : 170,
      duration: 0.35,
      ease: "power2.out"
    });

    gsap.to(blobC, {
      scale: index % 2 === 0 ? 1 : 1.22,
      duration: 0.35,
      ease: "power2.out"
    });
  }

  function switchImage(nextIndex) {
    if (transitionLock || nextIndex === currentIndex) return;
    transitionLock = true;

    const nextSlide = slides[nextIndex];
    imageBack.src = imageFront.src;

    gsap.to(cardBack, {
      opacity: 0.1,
      scale: 0.92,
      rotation: nextIndex % 2 === 0 ? -12 : 12,
      duration: 0.42,
      ease: "power2.out"
    });

    cardFront.classList.add("flash");

    gsap.to(cardFront, {
      rotation: nextSlide.rotate,
      scale: 1.05,
      x: nextSlide.x * 0.3,
      y: nextSlide.y * 0.3,
      duration: 0.16,
      ease: "power2.out",
      onComplete: () => {
        imageFront.src = nextSlide.src;

        gsap.fromTo(
          cardFront,
          {
            opacity: 0.45,
            scale: 1.14,
            rotation: nextSlide.rotate * 2,
            filter: "blur(12px)"
          },
          {
            opacity: 1,
            scale: hovering ? 1.04 : 1,
            rotation: nextSlide.rotate,
            filter: "blur(0px)",
            x: 0,
            y: 0,
            duration: 0.58,
            ease: "power4.out",
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
    y: -34,
    ease: "none",
    scrollTrigger: {
      trigger: ".site-shell",
      start: "top top",
      end: "+=500%",
      scrub: true
    }
  });

  gsap.to(cardStage, {
    y: -18,
    ease: "none",
    scrollTrigger: {
      trigger: ".site-shell",
      start: "top top",
      end: "+=500%",
      scrub: true
    }
  });
});