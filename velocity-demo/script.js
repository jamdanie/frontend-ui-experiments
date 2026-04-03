import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

const sceneWrap = document.getElementById("sceneWrap");
const heroTitle = document.getElementById("heroTitle");
const activePill = document.getElementById("activePill");
const variantItems = Array.from(document.querySelectorAll(".variant"));

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

let mouseX = window.innerWidth * 0.5;
let mouseY = window.innerHeight * 0.5;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

document.addEventListener("mouseover", (e) => {
  const interactive = e.target.closest("a, button, .hero, .pill, .variant");
  document.body.classList.toggle("is-hovering", !!interactive);
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

/*
  CLOSER camera, but not too close.
  Smaller z = model appears bigger.
*/
camera.position.set(0, 0.22, 6.9);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
sceneWrap.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 1.9);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
keyLight.position.set(4.2, 4.2, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
rimLight.position.set(-4.5, -1.4, 3.4);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffffff, 1.2, 30);
fillLight.position.set(0, 1.2, 4.5);
scene.add(fillLight);

let model = null;
const modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new GLTFLoader();
loader.load(
  "./model/console.glb",
  (gltf) => {
    model = gltf.scene;
    modelGroup.add(model);

    /*
      START POSITION:
      - more centered
      - lower on the page
      - slightly larger
    */
    model.scale.set(1.18, 1.18, 1.18);
    model.position.set(1.05, -1.05, 0);
    model.rotation.set(0.16, -0.9, -0.12);
  },
  undefined,
  (error) => {
    console.error("Failed to load model:", error);
  }
);

const labels = [
  "ICECREAM-01",
  "ICECREAM-02",
  "ICECREAM-03",
  "ICECREAM-04",
  "ICECREAM-05",
  "ICECREAM-06"
];

const state = {
  progress: 0,
  targetPosX: 1.05,
  targetPosY: -1.05,
  targetScale: 1.18,
  targetRotX: 0.16,
  targetRotY: -0.9,
  targetRotZ: -0.12,
  activeIndex: 0
};

document.addEventListener("mousemove", (e) => {
  const nx = e.clientX / window.innerWidth - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;

  state.targetRotY = (-0.9 + state.progress * 0.55) + nx * 0.3;
  state.targetRotX = (0.16 - state.progress * 0.05) + ny * -0.15;
});

function setActiveVariant(index) {
  variantItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });

  gsap.to(activePill, {
    opacity: 0,
    y: 10,
    duration: 0.12,
    onComplete: () => {
      activePill.textContent = labels[index];
      gsap.to(activePill, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    }
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
    state.progress = self.progress;

    /*
      SCROLL CHOREOGRAPHY:
      starts lower + centered,
      then drifts slightly left/up as you scroll
    */
    state.targetPosX = 1.05 - self.progress * 0.65;
    state.targetPosY = -1.05 + self.progress * 0.28;
    state.targetScale = 1.18 + self.progress * 0.28;
    state.targetRotZ = -0.12 + Math.sin(self.progress * Math.PI * 4) * 0.05;

    gsap.to(heroTitle, {
      x: self.progress * 115 - 58,
      y: self.progress * -30,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-a", {
      x: self.progress * 120,
      rotation: -16 + self.progress * 13,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-b", {
      x: self.progress * -105,
      y: self.progress * 48,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-c", {
      scale: 1 + self.progress * 0.55,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-d", {
      x: self.progress * 78,
      duration: 0.18,
      overwrite: true
    });

    const idx = Math.min(labels.length - 1, Math.floor(self.progress * labels.length));
    if (idx !== state.activeIndex) {
      state.activeIndex = idx;
      setActiveVariant(idx);
    }
  }
});

gsap.from(".eyebrow", {
  y: 18,
  opacity: 0,
  duration: 0.55,
  ease: "power3.out"
});

gsap.from("#heroTitle", {
  y: 90,
  opacity: 0,
  duration: 0.95,
  ease: "power4.out",
  delay: 0.05
});

gsap.from(".subcopy", {
  y: 18,
  opacity: 0,
  duration: 0.55,
  ease: "power3.out",
  delay: 0.16
});

gsap.from(".meta", {
  y: 14,
  opacity: 0,
  duration: 0.55,
  ease: "power3.out",
  delay: 0.24
});

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.position.x += (state.targetPosX - model.position.x) * 0.08;
    model.position.y += (state.targetPosY - model.position.y) * 0.08;

    model.rotation.x += (state.targetRotX - model.rotation.x) * 0.08;
    model.rotation.y += (state.targetRotY - model.rotation.y) * 0.08;
    model.rotation.z += (state.targetRotZ - model.rotation.z) * 0.08;

    model.scale.x += (state.targetScale - model.scale.x) * 0.08;
    model.scale.y += (state.targetScale - model.scale.y) * 0.08;
    model.scale.z += (state.targetScale - model.scale.z) * 0.08;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});