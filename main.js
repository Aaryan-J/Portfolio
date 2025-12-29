import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById("three-canvas");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.5, 3);
camera.lookAt(0, 0.5, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 2, 2);
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Resize helper
function resizeRendererToDisplaySize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

// Load Model
let wrapper = new THREE.Object3D();
scene.add(wrapper);
let model = null;

const loader = new GLTFLoader();
loader.load(
  "Assets/models/character.glb",
  (gltf) => {
    model = gltf.scene;

    // Auto-scale model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const desiredHeight = 4; // adjust to fit torso/head nicely
    const scaleFactor = desiredHeight / (size.y || 1);
    model.scale.multiplyScalar(scaleFactor);

    // Center model in wrapper
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Add to wrapper
    wrapper.add(model);

    // Position wrapper in world
    wrapper.position.set(0, -1, 0);

    console.log("Model loaded and ready");
  },
  undefined,
  (error) => console.error("Error loading GLTF model:", error)
);

// ----- Mouse rotation -----
let isMouseDown = false;
let previousMouseX = 0;
const rotationSpeed = 0.01; // adjust sensitivity

const hint = document.getElementById('drag-hint');

canvas.addEventListener("mouseenter", () => {
  hint.classList.add('hidden');
});

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  previousMouseX = e.clientX;
  hint.classList.add('hidden');
});
canvas.addEventListener("mouseup", () => isMouseDown = false);
canvas.addEventListener("mouseleave", () => {
    isMouseDown = false
    hint.classList.remove('hidden');
});

canvas.addEventListener("mousemove", (e) => {
  if (!isMouseDown || !model) return;
  const deltaX = e.clientX - previousMouseX;
  previousMouseX = e.clientX;
  wrapper.rotation.y += deltaX * rotationSpeed;
});

// ----- Animate -----
function animate() {
  requestAnimationFrame(animate);
  resizeRendererToDisplaySize();
  renderer.render(scene, camera);
}
resizeRendererToDisplaySize();
animate();

// Handle window resize
window.addEventListener("resize", resizeRendererToDisplaySize);