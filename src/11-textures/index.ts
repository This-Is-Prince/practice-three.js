import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/**
 * Debug GUI
 */
const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("onStart");
// };
// loadingManager.onLoad = () => {
//   console.log("onLoad");
// };
// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };
// loadingManager.onError = () => {
//   console.log("onError");
// };

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("./static/textures/minecraft.png");
const alphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("./static/textures/door/height.jpg");
const normalTexture = textureLoader.load("./static/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const roughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);

// Transforming textures
// colorTexture.repeat.set(2, 3);
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// colorTexture.center.set(0.5, 0.5);
// colorTexture.rotation = Math.PI * 0.25;

// Minification and mip mapping
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */
const boxGeometry = new THREE.BoxGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
});

const box = new THREE.Mesh(boxGeometry, material);
scene.add(box);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(1, 1, 1);
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Tick
 */
const tick = () => {
  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
