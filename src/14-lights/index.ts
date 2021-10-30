import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Debug GUI
 */
const gui = new dat.GUI({ closed: true });

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Window Events
 */

// Resize
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const checkerBoard8x8Texture = textureLoader.load(
  "./static/textures/checkerboard-8x8.png"
);

/**
 * Color
 */

/**
 * Lights
 */
const lightGUI = gui.addFolder("Lights");

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.target.position.set(0, 0, 0);
directionalLight.position.set(1, 1, 0);

// Adding All Light into scene
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLight.target);

/**
 * All Lights GUI
 */
// AmbientLightGUI
const ambientLightGUI = lightGUI.addFolder("AmbientLight");
ambientLightGUI.add(ambientLight, "intensity").min(0).max(1).step(0.0001);
// Directional Light
const directionalLightGUI = lightGUI.addFolder("DirectionalLight");

directionalLightGUI
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.target.position, "x")
  .min(-5)
  .max(5)
  .step(0.0001)
  .name("tX");
directionalLightGUI
  .add(directionalLight.target.position, "y")
  .min(-5)
  .max(5)
  .step(0.0001)
  .name("tY");
directionalLightGUI
  .add(directionalLight.target.position, "z")
  .min(-5)
  .max(5)
  .step(0.0001)
  .name("tZ");

/**
 * Lights Helper
 */
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.25
);
scene.add(directionalLightHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

/**
 * Meshes
 */
// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

// Cube
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.set(1, 1, 2);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })!;
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Tick
 */
// Clock
const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  // Renderer
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
