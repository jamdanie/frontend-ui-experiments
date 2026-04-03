import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initCursor } from "./ui/cursor.js";
import { initLiquidCursor } from "./effects/liquidCursor.js";
import { createHeroScene } from "./scene/heroScene.js";
import { createHeroScroll } from "./motion/heroScroll.js";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

initCursor();
initLiquidCursor();

async function initApp() {
  const heroScene = await createHeroScene({
    canvas: document.getElementById("webgl"),
    modelUrl: `${import.meta.env.BASE_URL}model/console.glb`
  });

  createHeroScroll(heroScene);
}

initApp().catch((error) => {
  console.error("Failed to initialize app:", error);
});