import "../../style.css";
import * as THREE from "three";
// import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUi
 */
// const gui = new dat.GUI();

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
 * Textures
 */
const cubeTexturesLoader = new THREE.CubeTextureLoader();
const cubeTextures = cubeTexturesLoader.load([
  "../../../static/textures/environmentMaps/0/px.jpg",
  "../../../static/textures/environmentMaps/0/nx.jpg",
  "../../../static/textures/environmentMaps/0/py.jpg",
  "../../../static/textures/environmentMaps/0/ny.jpg",
  "../../../static/textures/environmentMaps/0/pz.jpg",
  "../../../static/textures/environmentMaps/0/nz.jpg",
]);

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = cubeTextures;
scene.environment = cubeTextures;

/**
 * Sizes
 */
const sizes = { width: 0, height: 0 };
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(ambientLight, directionalLight);
/**
 * Objects
 */

scene.add(
  new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      envMap: cubeTextures,
      envMapIntensity: 0,
    })
  )
);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(0, 0, 3);
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
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Tick
 */
// const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
