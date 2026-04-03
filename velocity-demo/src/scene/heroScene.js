import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function createHeroScene({ canvas, modelUrl }) {
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

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(modelUrl);
  const model = gltf.scene;

  refineMaterials(model);
  modelRig.add(model);

  const state = {
    scene,
    renderer,
    camera,
    modelRig,
    model,
    scrollProgress: 0,
    baseRotationX: 0.08,
    baseRotationY: -0.28,
    baseScale: 1,
    targetMouseX: 0,
    targetMouseY: 0,
    smoothMouseX: 0,
    smoothMouseY: 0
  };

  fitModelToView(state);
  updateCamera(state);

  model.rotation.set(state.baseRotationX, state.baseRotationY, 0.02);

  const clock = new THREE.Clock();

  window.addEventListener("mousemove", (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    state.targetMouseX = (x - 0.5) * 0.16;
    state.targetMouseY = (y - 0.5) * 0.1;
  });

  window.addEventListener("resize", () => {
    updateCamera(state);
  });

  function tick() {
    const elapsed = clock.getElapsedTime();

    state.smoothMouseX += (state.targetMouseX - state.smoothMouseX) * 0.05;
    state.smoothMouseY += (state.targetMouseY - state.smoothMouseY) * 0.05;

    state.modelRig.position.y = Math.sin(elapsed * 0.42) * 0.03;

    const idleY = Math.sin(elapsed * 0.32) * 0.03;
    const idleX = Math.cos(elapsed * 0.25) * 0.01;

    const targetRotY =
      state.baseRotationY +
      state.scrollProgress * 0.55 +
      idleY +
      state.smoothMouseX;

    const targetRotX =
      state.baseRotationX +
      state.scrollProgress * 0.06 +
      idleX -
      state.smoothMouseY;

    const targetRotZ = state.smoothMouseX * 0.08;

    state.model.rotation.y += (targetRotY - state.model.rotation.y) * 0.05;
    state.model.rotation.x += (targetRotX - state.model.rotation.x) * 0.05;
    state.model.rotation.z += (targetRotZ - state.model.rotation.z) * 0.04;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();

  return state;
}

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

function fitModelToView(state) {
  const box = new THREE.Box3().setFromObject(state.model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  state.model.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const desired = window.innerWidth < 768 ? 4.4 : 5.8;

  state.baseScale = desired / maxDim;
  state.model.scale.setScalar(state.baseScale);
  state.model.position.y -= size.y * state.baseScale * 0.06;
}

function updateCamera(state) {
  state.camera.aspect = window.innerWidth / window.innerHeight;

  if (window.innerWidth < 560) {
    state.camera.fov = 36;
    state.camera.position.set(0, 0.08, 9.8);
  } else if (window.innerWidth < 900) {
    state.camera.fov = 34;
    state.camera.position.set(0, 0.12, 9.1);
  } else {
    state.camera.fov = 32;
    state.camera.position.set(0, 0.16, 8.5);
  }

  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
}