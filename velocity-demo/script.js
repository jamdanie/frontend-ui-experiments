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
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// MUCH farther back
camera.position.set(0, 0, 12.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
sceneWrap.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
rimLight.position.set(-4, -1, 3);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffffff, 1.0, 30);
fillLight.position.set(0, 1.2, 4.5);
scene.add(fillLight);

let model = null;

// animate this parent group only
const heroGroup = new THREE.Group();
scene.add(heroGroup);

const loader = new GLTFLoader();
loader.load(
  "./model/console.glb",
  (gltf) => {
    model = gltf.scene;

    // center model by bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    // MUCH SMALLER normalized size
    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizedScale = 1.75 / maxDim;
    model.scale.setScalar(normalizedScale);

    // local model tilt
    model.rotation.set(0.08, -0.45, -0.05);

    heroGroup.add(model);

   // PERFECT CENTER BASE POSITION
heroGroup.position.set(0, -0.4, 0);   // <-- centered + slightly lowered
heroGroup.rotation.set(0.02, -0.05, 0);
heroGroup.scale.setScalar(0.9);
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

const state = {
  progress: 0,
  targetX: 0.95,
  targetY: -1.45,
  targetScale: 1,
  targetRotX: 0.03,
  targetRotY: -0.12,
  targetRotZ: 0,
  activeIndex: 0
};

document.addEventListener("mousemove", (e) => {
  const nx = e.clientX / window.innerWidth - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;

  state.targetRotY = (-0.12 + state.progress * 0.12) + nx * 0.14;
  state.targetRotX = (0.03 - state.progress * 0.02) + ny * -0.08;
});

ScrollTrigger.create({
  trigger: ".site-shell",
  start: "top top",
  end: "+=600%",
  scrub: true,
  pin: ".hero",
  pinSpacing: false,
  onUpdate: (self) => {
    state.progress = self.progress;

    // very restrained movement
    // KEEP MODEL CENTERED LIKE BUTTERMAX
state.targetX = 0;
state.targetY = -0.4 + self.progress * 0.1;
state.targetScale = 0.9 + self.progress * 0.05;
    state.targetRotZ = Math.sin(self.progress * Math.PI * 4) * 0.02;

    gsap.to(heroTitle, {
      x: self.progress * 85 - 42,
      y: self.progress * -20,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-a", {
      x: self.progress * 90,
      rotation: -16 + self.progress * 10,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-b", {
      x: self.progress * -75,
      y: self.progress * 32,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-c", {
      scale: 1 + self.progress * 0.32,
      duration: 0.18,
      overwrite: true
    });

    gsap.to(".ink-d", {
      x: self.progress * 55,
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
    heroGroup.position.x += (state.targetX - heroGroup.position.x) * 0.08;
    heroGroup.position.y += (state.targetY - heroGroup.position.y) * 0.08;

    heroGroup.rotation.x += (state.targetRotX - heroGroup.rotation.x) * 0.08;
    heroGroup.rotation.y += (state.targetRotY - heroGroup.rotation.y) * 0.08;
    heroGroup.rotation.z += (state.targetRotZ - heroGroup.rotation.z) * 0.08;

    heroGroup.scale.x += (state.targetScale - heroGroup.scale.x) * 0.08;
    heroGroup.scale.y += (state.targetScale - heroGroup.scale.y) * 0.08;
    heroGroup.scale.z += (state.targetScale - heroGroup.scale.z) * 0.08;
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