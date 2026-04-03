import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------
   LENIS SMOOTH SCROLL
-------------------------------------------- */
const lenis = new Lenis({
  lerp: 0.085,
  smoothWheel: true,
  infinite: false
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

/* --------------------------------------------
   CUSTOM CURSOR
-------------------------------------------- */
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll(".hover-target");

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

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* --------------------------------------------
   THREE SETUP
-------------------------------------------- */
const canvas = document.getElementById("webgl");
const hero = document.getElementById("hero");

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const modelRig = new THREE.Group();
scene.add(modelRig);

let model = null;
let targetMouseX = 0;
let targetMouseY = 0;
let smoothMouseX = 0;
let smoothMouseY = 0;
let scrollProgress = 0;
let baseRotationY = -0.28;
let baseRotationX = 0.08;
let baseScale = 1;

/* --------------------------------------------
   LIGHTING
-------------------------------------------- */
const ambient = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 2.8);
key.position.set(4, 5, 8);
scene.add(key);

const fill = new THREE.DirectionalLight(0xcfd6ff, 1.3);
fill.position.set(-6, 1, 6);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffffff, 2.0);
rim.position.set(-5, 3, -5);
scene.add(rim);

/* --------------------------------------------
   MODEL HELPERS
-------------------------------------------- */
function refineMaterials(root) {
  root.traverse((child) => {
    if (child.isMesh && child.material) {
      child.castShadow = false;
      child.receiveShadow = false;

      if ("roughness" in child.material && child.material.roughness !== undefined) {
        child.material.roughness = Math.min(child.material.roughness + 0.05, 1);
      }

      if ("metalness" in child.material && child.material.metalness !== undefined) {
        child.material.metalness = Math.max(child.material.metalness, 0.15);
      }

      child.material.envMapIntensity = 1.25;
    }
  });
}

function fitModelToView(object3D) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  object3D.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  // Larger than before on purpose so it feels premium and dominant
  const desired = window.innerWidth < 768 ? 4.4 : 5.8;
  baseScale = desired / maxDim;
  object3D.scale.setScalar(baseScale);

  // Slight vertical drop so the object sits in the optical center
  object3D.position.y -= size.y * baseScale * 0.06;

  updateCamera();
}

function updateCamera() {
  camera.aspect = window.innerWidth / window.innerHeight;

  if (window.innerWidth < 560) {
    camera.fov = 36;
    camera.position.set(0, 0.08, 9.8);
  } else if (window.innerWidth < 900) {
    camera.fov = 34;
    camera.position.set(0, 0.12, 9.1);
  } else {
    camera.fov = 32;
    camera.position.set(0, 0.16, 8.5);
  }

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
}

/* --------------------------------------------
   LOAD GLB
-------------------------------------------- */
const loader = new GLTFLoader();

loader.load(
  "./model/console.glb",
  (gltf) => {
    model = gltf.scene;
    refineMaterials(model);
    modelRig.add(model);

    fitModelToView(model);

    model.rotation.set(baseRotationX, baseRotationY, 0.02);

    buildHeroTimeline();
  },
  undefined,
  (error) => {
    console.error("Error loading GLB:", error);
  }
);

/* --------------------------------------------
   MOUSE INPUT
-------------------------------------------- */
window.addEventListener("mousemove", (event) => {
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;

  targetMouseX = (x - 0.5) * 0.16;
  targetMouseY = (y - 0.5) * 0.1;
});

/* --------------------------------------------
   PARALLAX ELEMENTS
-------------------------------------------- */
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

/* --------------------------------------------
   HERO TIMELINE
-------------------------------------------- */
function buildHeroTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=220%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      }
    }
  });

  tl.to(
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
      model.position,
      {
        y: model.position.y - 0.22,
        ease: "none"
      },
      0
    )
    .to(
      model.scale,
      {
        x: baseScale * 1.08,
        y: baseScale * 1.08,
        z: baseScale * 1.08,
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

/* --------------------------------------------
   RENDER LOOP
-------------------------------------------- */
const clock = new THREE.Clock();

function tick() {
  const elapsed = clock.getElapsedTime();

  smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
  smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

  modelRig.position.y = Math.sin(elapsed * 0.42) * 0.03;

  if (model) {
    const idleY = Math.sin(elapsed * 0.32) * 0.03;
    const idleX = Math.cos(elapsed * 0.25) * 0.01;

    const targetRotY = baseRotationY + (scrollProgress * 0.55) + idleY + smoothMouseX;
    const targetRotX = baseRotationX + (scrollProgress * 0.06) + idleX - smoothMouseY;
    const targetRotZ = smoothMouseX * 0.08;

    model.rotation.y += (targetRotY - model.rotation.y) * 0.05;
    model.rotation.x += (targetRotX - model.rotation.x) * 0.05;
    model.rotation.z += (targetRotZ - model.rotation.z) * 0.04;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

/* --------------------------------------------
   RESIZE
-------------------------------------------- */
window.addEventListener("resize", () => {
  updateCamera();
  ScrollTrigger.refresh();
});