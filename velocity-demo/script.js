gsap.registerPlugin(ScrollTrigger);

/* =========================
   CURSOR
========================= */

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* =========================
   THREE JS SETUP
========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

/* =========================
   LIGHTING
========================= */

const light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light2);

/* =========================
   LOAD MODEL
========================= */

let model;

const loader = new THREE.GLTFLoader();
loader.load(
  "model/console.glb",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1.2, 1.2, 1.2);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Model failed to load:", error);
  }
);

/* =========================
   MOUSE INTERACTION
========================= */

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* =========================
   SCROLL ANIMATION
========================= */

ScrollTrigger.create({
  trigger: ".spacer",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    if (model) {
      model.rotation.y = self.progress * Math.PI * 2;
      model.rotation.x = mouseY * 0.5;
    }
  }
});

/* =========================
   RENDER LOOP
========================= */

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
  }

  renderer.render(scene, camera);
}

animate();

/* =========================
   RESIZE
========================= */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});