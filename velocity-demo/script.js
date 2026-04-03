window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const images = [
    "./p1.jpg",
    "./assets/p2.jpg",
    "./assets/p3.jpg",
    "./assets/p4.jpg",
    "./assets/p5.jpg",
    "./assets/p6.jpg"
  ];

  const panels = document.querySelectorAll(".panel");
  const hero = document.getElementById("hero");
  const imageStage = document.getElementById("image-stage");
  const frontImage = document.getElementById("image-front");
  const backImage = document.getElementById("image-back");
  const shapeA = document.querySelector(".shape-a");
  const shapeB = document.querySelector(".shape-b");
  const shapeC = document.querySelector(".shape-c");

  let currentIndex = 0;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;
  let transitionLock = false;

  frontImage.src = images[0];
  backImage.src = images[0];

  // --------------------------------------------------
  // Floating idle motion
  // --------------------------------------------------
  gsap.to(imageStage, {
    y: -14,
    duration: 2.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(shapeA, {
    x: 22,
    y: -10,
    rotation: -8,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(shapeB, {
    x: -18,
    y: 10,
    rotation: 23,
    duration: 3.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  gsap.to(shapeC, {
    x: 10,
    y: 8,
    rotation: 4,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  // --------------------------------------------------
  // Mouse-based parallax and tilt
  // --------------------------------------------------
  function animateMouse() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    gsap.set(imageStage, {
      rotationY: currentX * 10,
      rotationX: currentY * -10,
      x: currentX * 18,
      y: currentY * 14
    });

    gsap.set(backImage, {
      x: 18 + currentX * 10,
      y: 20 + currentY * 10
    });

    requestAnimationFrame(animateMouse);
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  animateMouse();

  // --------------------------------------------------
  // Hover pulse
  // --------------------------------------------------
  hero.addEventListener("mouseenter", () => {
    isHovering = true;
    frontImage.classList.add("hover-glitch");

    gsap.to(imageStage, {
      scale: 1.03,
      duration: 0.35,
      ease: "power2.out"
    });
  });

  hero.addEventListener("mouseleave", () => {
    isHovering = false;
    frontImage.classList.remove("hover-glitch");

    gsap.to(imageStage, {
      scale: 1,
      duration: 0.35,
      ease: "power2.out"
    });
  });

  // --------------------------------------------------
  // Better image transition
  // --------------------------------------------------
  function switchImage(nextIndex) {
    if (nextIndex === currentIndex || transitionLock) return;
    transitionLock = true;

    const nextSrc = images[nextIndex];
    backImage.src = frontImage.src;

    gsap.killTweensOf([frontImage, backImage, imageStage]);

    frontImage.classList.add("glitch-flash");

    gsap.set(backImage, {
      opacity: 0.35,
      scale: 0.95,
      rotation: -4,
      filter: "blur(12px) drop-shadow(0 35px 50px rgba(0,0,0,0.15))"
    });

    gsap.to(backImage, {
      opacity: 0.12,
      scale: 0.92,
      rotation: -8,
      duration: 0.55,
      ease: "power2.out"
    });

    gsap.to(imageStage, {
      rotationZ: nextIndex % 2 === 0 ? -2.5 : 2.5,
      scale: 1.04,
      duration: 0.18,
      ease: "power2.out",
      onComplete: () => {
        frontImage.src = nextSrc;

        gsap.fromTo(
          frontImage,
          {
            opacity: 0,
            scale: 1.12,
            rotation: nextIndex % 2 === 0 ? 8 : -8,
            filter:
              "blur(14px) contrast(1.35) saturate(1.45) drop-shadow(6px 0 0 rgba(255,0,80,0.24)) drop-shadow(-6px 0 0 rgba(0,180,255,0.20))"
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            filter: "drop-shadow(0 40px 65px rgba(0, 0, 0, 0.26))",
            duration: 0.58,
            ease: "power3.out",
            onComplete: () => {
              frontImage.classList.remove("glitch-flash");

              gsap.to(imageStage, {
                rotationZ: 0,
                scale: isHovering ? 1.03 : 1,
                duration: 0.35,
                ease: "power2.out"
              });

              currentIndex = nextIndex;
              transitionLock = false;
            }
          }
        );
      }
    });

    // Accent shapes also react
    gsap.to(shapeA, {
      x: nextIndex * 6,
      duration: 0.45,
      ease: "power2.out"
    });

    gsap.to(shapeB, {
      y: nextIndex % 2 === 0 ? 8 : -8,
      duration: 0.45,
      ease: "power2.out"
    });

    gsap.to(shapeC, {
      x: nextIndex % 2 === 0 ? 14 : -6,
      duration: 0.45,
      ease: "power2.out"
    });
  }

  // --------------------------------------------------
  // Scroll-based switching
  // --------------------------------------------------
  panels.forEach((panel, index) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top center",
      end: "bottom center",
      onEnter: () => switchImage(index),
      onEnterBack: () => switchImage(index)
    });
  });

  // --------------------------------------------------
  // Pin hero for a Buttermax-like feel
  // --------------------------------------------------
  ScrollTrigger.create({
    trigger: ".page-shell",
    start: "top top",
    end: "+=500%",
    pin: ".hero",
    pinSpacing: false
  });
});