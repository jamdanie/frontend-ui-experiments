window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const slides = [
    "assets/p1.jpg",
    "assets/p2.jpg",
    "assets/p3.jpg",
    "assets/p4.jpg",
    "assets/p5.jpg",
    "assets/p6.jpg"
  ];

  const hero = document.querySelector(".hero");
  const stage = document.getElementById("card-stage");
  const front = document.getElementById("card-front");
  const frontImg = document.getElementById("image-front");

  // 🔥 CREATE GHOST TRAIL (THIS IS KEY)
  const ghosts = [];

  for (let i = 0; i < 4; i++) {
    const ghost = front.cloneNode(true);
    ghost.classList.remove("card-front");
    ghost.classList.add("ghost-layer");
    stage.appendChild(ghost);

    ghosts.push({
      el: ghost,
      img: ghost.querySelector("img")
    });
  }

  // INIT
  frontImg.src = slides[0];
  ghosts.forEach(g => (g.img.src = slides[0]));

  let progress = 0;

  // 🔥 SCROLL = CONTINUOUS CONTROL
  ScrollTrigger.create({
    trigger: ".site-shell",
    start: "top top",
    end: "+=600%",
    scrub: true,
    onUpdate: (self) => {
      progress = self.progress;
      updateScene(progress);
    }
  });

  function updateScene(p) {
    const total = slides.length - 1;
    const exact = p * total;

    const index = Math.floor(exact);
    const nextIndex = Math.min(index + 1, total);

    const mix = exact - index;

    frontImg.src = slides[index];

    // 🔥 MAIN PRODUCT MOTION
    gsap.set(front, {
      rotation: -6 + mix * 12,
      x: mix * 40 - 20,
      y: Math.sin(p * 6) * 12,
      scale: 1 + mix * 0.05
    });

    // 🔥 GHOST TRAIL
    ghosts.forEach((g, i) => {
      g.img.src = slides[nextIndex];

      const depth = (i + 1) * 0.25;

      gsap.set(g.el, {
        opacity: 0.2 - i * 0.04,
        scale: 1 - depth * 0.15,
        x: mix * (60 + i * 20),
        y: mix * (30 + i * 10),
        rotation: mix * (12 + i * 4),
        filter: `blur(${6 + i * 2}px)`
      });
    });

    // 🔥 TITLE DRIFT (IMPORTANT)
    gsap.set("#hero-title", {
      x: mix * 120 - 60,
      y: mix * -40
    });

    // 🔥 BLOB CHAOS
    gsap.set(".blob-a", {
      x: mix * 120,
      rotation: mix * 40
    });

    gsap.set(".blob-b", {
      x: mix * -100,
      y: mix * 50
    });

    gsap.set(".blob-c", {
      scale: 1 + mix * 0.8
    });
  }

  // 🔥 MOUSE DEPTH
  let mx = 0,
    my = 0;

  document.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to(stage, {
      rotationY: mx * 15,
      rotationX: -my * 12,
      duration: 0.4
    });
  });
});