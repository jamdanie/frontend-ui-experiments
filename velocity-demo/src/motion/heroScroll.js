import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createHeroScroll(heroScene) {
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById("hero");

  document.querySelectorAll("[data-speed]").forEach((el) => {
    const speed = Number(el.dataset.speed || 0.04);

    gsap.to(el, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=190%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        heroScene.scrollProgress = self.progress;
      }
    }
  })
    .to(
      ".hero-copy",
      {
        yPercent: 10,
        opacity: 0.6,
        ease: "none"
      },
      0
    )
    .to(
      ".hero-meta-left",
      {
        yPercent: -6,
        opacity: 0.55,
        ease: "none"
      },
      0
    )
    .to(
      ".hero-meta-right",
      {
        yPercent: 8,
        opacity: 0.3,
        ease: "none"
      },
      0
    )
    .to(
      ".model-backlight",
      {
        scale: 1.12,
        opacity: 1,
        ease: "none"
      },
      0
    )
    .to(
      heroScene.model.position,
      {
        y: heroScene.model.position.y - 0.1,
        ease: "none"
      },
      0
    )
    .to(
      heroScene.model.scale,
      {
        x: heroScene.baseScale * 1.035,
        y: heroScene.baseScale * 1.035,
        z: heroScene.baseScale * 1.035,
        ease: "none"
      },
      0
    );

  gsap.fromTo(
    ".hero-copy",
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.12
    }
  );

  gsap.fromTo(
    ".hero-meta",
    {
      opacity: 0,
      y: 14
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.22,
      stagger: 0.06
    }
  );
}