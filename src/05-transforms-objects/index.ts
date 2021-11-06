import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUI
 */
const gui = new dat.GUI();

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update Sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  updateRenderer();
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 3, 4);
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 9;
directionalLight.shadow.camera.left = -4;
directionalLight.shadow.camera.bottom = -4;
directionalLight.shadow.camera.right = 4;
directionalLight.shadow.camera.top = 4;
directionalLight.castShadow = true;
scene.add(directionalLight);

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightHelper);

/**
 * Material
 */
const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});

/**
 * Meshes
 */
// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1), material);
scene.add(box);
box.castShadow = true;
box.position.y = 1;

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};

const aspectRatio = () => {
  return sizes.width / sizes.height;
};
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(-15, 5, 8);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Animation
 */

// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
