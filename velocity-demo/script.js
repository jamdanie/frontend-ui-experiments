import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

const canvasWrap = document.getElementById("canvas-wrap");
const heroTitle = document.getElementById("hero-title");

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
  const interactive = e.target.closest("a, button, .hero, .active-pill");
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
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0.1, 5.2);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
canvasWrap.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(2.5, 3.5, 4.5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
rimLight.position.set(-3.5, -1.5, 2.5);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffffff, 1.2, 20);
fillLight.position.set(0, 1, 3);
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

    model.scale.set(2.3, 2.3, 2.3);
    model.position.set(1.15, -0.15, 0);
    model.rotation.set(0.18, -0.72, -0.16);
  },
  undefined,
  (error) => {
    console.error("Failed to load model:", error);
  }
);

const state = {
  scrollProgress: 0,
  targetRotX: 0,
  targetRotY: 0,
  targetPosX: 1.15,
  targetPosY: -0.15,
  targetScale: 2.3
};

document.addEventListener("mousemove", (e) => {
  const nx = e.clientX / window.innerWidth - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;

  state.targetRotY = -0.72 + nx * 0.55;
  state.targetRotX = 0.18 + ny * -0.28;
});

ScrollTrigger.create({
  trigger: ".scene-shell",
  start: "top top",
  end: "+=500%",
  scrub: true,
  pin: ".hero",
  pinSpacing: false,
  onUpdate: (self) => {
    state.scrollProgress = self.progress;

    state.targetPosX = 1.15 - self.progress * 0.75;
    state.targetPosY = -0.15 + self.progress * 0.25;
    state.targetScale = 2.3 + self.progress * 0.7;

    gsap.to(heroTitle, {
      x: self.progress * 110 - 55,
      y: self.progress * -36,
      duration: 0.2,
      overwrite: true
    });

    gsap.to(".ink-a", {
      x: self.progress * 120,
      rotation: -17 + self.progress * 14,
      duration: 0.2,
      overwrite: true
    });

    gsap.to(".ink-b", {
      x: self.progress * -110,
      y: self.progress * 50,
      duration: 0.2,
      overwrite: true
    });

    gsap.to(".ink-c", {
      scale: 1 + self.progress * 0.6,
      duration: 0.2,
      overwrite: true
    });

    gsap.to(".ink-d", {
      x: self.progress * 80,
      duration: 0.2,
      overwrite: true
    });
  }
});

gsap.from(".eyebrow", {
  y: 18,
  opacity: 0,
  duration: 0.55,
  ease: "power3.out"
});

gsap.from("#hero-title", {
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

gsap.from(".meta-row", {
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

    model.rotation.y += (state.targetRotY - model.rotation.y) * 0.08;
    model.rotation.x += (state.targetRotX - model.rotation.x) * 0.08;
    model.rotation.z += (-0.16 + Math.sin(state.scrollProgress * Math.PI * 4) * 0.08 - model.rotation.z) * 0.08;

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