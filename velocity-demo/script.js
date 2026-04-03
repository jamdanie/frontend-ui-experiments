window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const slides = [
    { src: "assets/p1.jpg", label: "ARC-01", rotate: -7, titleX: 0, titleY: 0 },
    { src: "assets/p2.jpg", label: "NEON-02", rotate: 5, titleX: 26, titleY: -8 },
    { src: "assets/p3.jpg", label: "FROST-03", rotate: -4, titleX: -12, titleY: 8 },
    { src: "assets/p4.jpg", label: "GHOST-04", rotate: 6, titleX: 18, titleY: 5 },
    { src: "assets/p5.jpg", label: "VIOLET-05", rotate: -8, titleX: -22, titleY: -5 },
    { src: "assets/p6.jpg", label: "VOID-06", rotate: 7, titleX: 14, titleY: 6 }
  ];

  const hero = document.getElementById("hero");
  const stage = document.getElementById("card-stage");
  const frontCard = document.getElementById("card-front");
  const frontImg = document.getElementById("image-front");

  const ghost1 = document.getElementById("ghost-1");
  const ghost2 = document.getElementById("ghost-2");
  const ghost3 = document.getElementById("ghost-3");
  const ghost4 = document.getElementById("ghost-4");

  const heroTitle = document.getElementById("hero-title");
  const activePill = document.getElementById("active-pill");
  const variantItems = Array.from(document.querySelectorAll(".variant-item"));

  const inkA = document.querySelector(".ink-a");
  const inkB = document.querySelector(".ink-b");
  const inkC = document.querySelector(".ink-c");
  const inkD = document.querySelector(".ink-d");

  let currentIndex = 0;
  let mouseX = 0;
  let mouseY = 0;
  let currentMX = 0;
  let currentMY = 0;
  let hovering = false;

  frontImg.src = slides[0].src;
  ghost1.src = slides[1]?.src || slides[0].src;
  ghost2.src = slides[2]?.src || slides[0].src;
  ghost3.src = slides[3]?.src || slides[0].src;
  ghost4.src = slides[4]?.src || slides[0].src;

  // Intro
  gsap.from(".eyebrow", {
    y: 20,
    opacity: 0,
    duration: 0.55,
    ease: "power3.out"
  });

  gsap.from(heroTitle, {
    y: 100,
    opacity: 0,
    duration: 0.95,
    ease: "power4.out",
    delay: 0.05
  });

  gsap.from(".subcopy", {
    y: 16,
    opacity: 0,
    duration: 0.55,
    ease: "power3.out",
    delay: 0.16
  });

  gsap.from(".meta-row", {
    y: 14,
    opacity: 0,
    duration: 0.55,
    ease: "power3.out",
    delay: 0.24
  });

  gsap.from(stage, {
    x: 120,
    y: 40,
    scale: 0.8,
    rotation: -12,
    opacity: 0,
    duration: 1.05,
    ease: "power4.out",
    delay: 0.08
  });

  // Ambient motion
  gsap.to(stage, {
    y: -18,
    duration: 2.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(inkA, {
    x: 30,
    y: -16,
    rotation: -22,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(inkB, {
    x: -24,
    y: 18,
    rotation: 21,
    duration: 3.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(inkC, {
    x: 8,
    y: -16,
    scale: 1.2,
    duration: 3.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(inkD, {
    x: 16,
    y: 8,
    rotation: 14,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  // Mouse parallax
  function animateMouse() {
    currentMX += (mouseX - currentMX) * 0.08;
    currentMY += (mouseY - currentMY) * 0.08;

    gsap.set(stage, {
      rotationY: currentMX * 13,
      rotationX: currentMY * -11,
      x: currentMX * 30,
      y: currentMY * 16
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
    gsap.to(stage, {
      scale: 1.04,
      duration: 0.28,
      ease: "power2.out"
    });
  });

  hero.addEventListener("mouseleave", () => {
    hovering = false;
    gsap.to(stage, {
      scale: 1,
      duration: 0.28,
      ease: "power2.out"
    });
  });

  function setActiveVariant(index) {
    variantItems.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });

    gsap.to(activePill, {
      opacity: 0,
      y: 10,
      duration: 0.14,
      onComplete: () => {
        activePill.textContent = slides[index].label;
        gsap.to(activePill, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    });
  }

  function updateScene(progress) {
    const total = slides.length - 1;
    const exact = progress * total;
    const baseIndex = Math.floor(exact);
    const nextIndex = Math.min(baseIndex + 1, total);
    const mix = exact - baseIndex;

    const currentSlide = slides[baseIndex];
    const nextSlide = slides[nextIndex];

    if (baseIndex !== currentIndex) {
      currentIndex = baseIndex;
      setActiveVariant(baseIndex);
      frontCard.classList.add("flash");
      setTimeout(() => frontCard.classList.remove("flash"), 180);
    }

    frontImg.src = currentSlide.src;
    ghost1.src = slides[Math.min(baseIndex + 1, total)].src;
    ghost2.src = slides[Math.min(baseIndex + 2, total)].src;
    ghost3.src = slides[Math.min(baseIndex + 3, total)].src;
    ghost4.src = slides[Math.min(baseIndex + 4, total)].src;

    gsap.set(frontCard, {
      rotation: currentSlide.rotate + (nextSlide.rotate - currentSlide.rotate) * mix,
      x: -10 + mix * 30,
      y: Math.sin(progress * Math.PI * 6) * 8,
      scale: 1 + mix * 0.04
    });

    gsap.set(heroTitle, {
      x: currentSlide.titleX + (nextSlide.titleX - currentSlide.titleX) * mix,
      y: currentSlide.titleY + (nextSlide.titleY - currentSlide.titleY) * mix
    });

    gsap.set(".ghost-1", {
      opacity: 0.24,
      x: 28 + mix * 28,
      y: 10 + mix * 8,
      rotation: 2 + mix * 6,
      scale: 0.98 - mix * 0.03,
      filter: "blur(2px)"
    });

    gsap.set(".ghost-2", {
      opacity: 0.18,
      x: 68 + mix * 34,
      y: 18 + mix * 10,
      rotation: 5 + mix * 8,
      scale: 0.94 - mix * 0.03,
      filter: "blur(4px)"
    });

    gsap.set(".ghost-3", {
      opacity: 0.12,
      x: 112 + mix * 40,
      y: 26 + mix * 12,
      rotation: 8 + mix * 10,
      scale: 0.9 - mix * 0.03,
      filter: "blur(6px)"
    });

    gsap.set(".ghost-4", {
      opacity: 0.08,
      x: 150 + mix * 46,
      y: 32 + mix * 14,
      rotation: 12 + mix * 12,
      scale: 0.86 - mix * 0.03,
      filter: "blur(8px)"
    });

    gsap.set(inkA, {
      xPercent: mix * 28
    });

    gsap.set(inkB, {
      xPercent: mix * -22
    });

    gsap.set(inkC, {
      scale: 1 + mix * 0.4
    });

    gsap.set(inkD, {
      xPercent: mix * 18
    });
  }

  ScrollTrigger.create({
    trigger: ".site-shell",
    start: "top top",
    end: "+=600%",
    scrub: true,
    pin: ".hero",
    pinSpacing: false,
    onUpdate: (self) => {
      updateScene(self.progress);
    }
  });

  gsap.to(".hero-copy", {
    y: -34,
    ease: "none",
    scrollTrigger: {
      trigger: ".site-shell",
      start: "top top",
      end: "+=600%",
      scrub: true
    }
  });
});