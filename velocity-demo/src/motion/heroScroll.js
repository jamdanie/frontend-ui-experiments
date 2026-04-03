import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createHeroScroll(heroScene) {
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById("hero");

  document.querySelectorAll("[data-speed]").forEach((el) => {
    const speed = Number(el.dataset.speed || 0.08);

    gsap.to(el, {
      y: () => window.innerHeight * speed * 1.6,
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
      end: "+=220%",
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
        yPercent: 18,
        opacity: 0.55,
        ease: "none"
      },
      0
    )
    .to(
      ".hero-side",
      {
        yPercent: 12,
        opacity: 0.25,
        ease: "none"
      },
      0
    )
    .to(
      ".model-backlight",
      {
        scale: 1.18,
        opacity: 1,
        ease: "none"
      },
      0
    )
    .to(
      heroScene.model.position,
      {
        y: heroScene.model.position.y - 0.22,
        ease: "none"
      },
      0
    )
    .to(
      heroScene.model.scale,
      {
        x: heroScene.baseScale * 1.08,
        y: heroScene.baseScale * 1.08,
        z: heroScene.baseScale * 1.08,
        ease: "none"
      },
      0
    );

  gsap.fromTo(
    ".hero-copy",
    {
      opacity: 0,
      y: 26
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.15
    }
  );
}
