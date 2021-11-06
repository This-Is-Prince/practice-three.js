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
 * Loaders
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

/**
 * Textures
 */

// Door
const doorColorTexture = textureLoader.load("./static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const doorNormalTexture = textureLoader.load(
  "./static/textures/door/normal.jpg"
);
const doorHeightTexture = textureLoader.load(
  "./static/textures/door/height.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);
// doorColorTexture.generateMipmaps = false;
// doorColorTexture.minFilter = THREE.NearestFilter;
// doorColorTexture.magFilter = THREE.NearestFilter;

// doorAlphaTexture.generateMipmaps = false;
// doorAlphaTexture.minFilter = THREE.NearestFilter;
// doorAlphaTexture.magFilter = THREE.NearestFilter;

// doorNormalTexture.generateMipmaps = false;
// doorNormalTexture.minFilter = THREE.NearestFilter;
// doorNormalTexture.magFilter = THREE.NearestFilter;

// doorAmbientOcclusionTexture.generateMipmaps = false;
// doorAmbientOcclusionTexture.minFilter = THREE.NearestFilter;
// doorAmbientOcclusionTexture.magFilter = THREE.NearestFilter;

// doorHeightTexture.generateMipmaps = false;
// doorHeightTexture.minFilter = THREE.NearestFilter;
// doorHeightTexture.magFilter = THREE.NearestFilter;

// doorMetalnessTexture.generateMipmaps = false;
// doorMetalnessTexture.minFilter = THREE.NearestFilter;
// doorMetalnessTexture.magFilter = THREE.NearestFilter;

// doorRoughnessTexture.generateMipmaps = false;
// doorRoughnessTexture.minFilter = THREE.NearestFilter;
// doorRoughnessTexture.magFilter = THREE.NearestFilter;

// Bricks
const brickColorTexture = textureLoader.load(
  "./static/textures/bricks/color.jpg"
);
const brickNormalTexture = textureLoader.load(
  "./static/textures/bricks/normal.jpg"
);
const brickRoughnessTexture = textureLoader.load(
  "./static/textures/bricks/roughness.jpg"
);
const brickAmbientOcclusionTexture = textureLoader.load(
  "./static/textures/bricks/ambientOcclusion.jpg"
);

// brickColorTexture.generateMipmaps = false;
// brickColorTexture.minFilter = THREE.NearestFilter;
// brickColorTexture.magFilter = THREE.NearestFilter;

// brickNormalTexture.generateMipmaps = false;
// brickNormalTexture.minFilter = THREE.NearestFilter;
// brickNormalTexture.magFilter = THREE.NearestFilter;

// brickRoughnessTexture.generateMipmaps = false;
// brickRoughnessTexture.minFilter = THREE.NearestFilter;
// brickRoughnessTexture.magFilter = THREE.NearestFilter;

// brickAmbientOcclusionTexture.generateMipmaps = false;
// brickAmbientOcclusionTexture.minFilter = THREE.NearestFilter;
// brickAmbientOcclusionTexture.magFilter = THREE.NearestFilter;

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 3, 20);
scene.add(directionalLight);

/**
 * Material
 */
const floorMaterial = new THREE.MeshStandardMaterial();

/**
 * Objects
 */
// floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House
const debugObj = {
  color: 0xca8f5e,
};
const house = new THREE.Group();
house.position.y = 2;
scene.add(house);
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(5, 4, 5),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    transparent: true,
    aoMap: brickAmbientOcclusionTexture,
    roughnessMap: brickRoughnessTexture,
    normalMap: brickNormalTexture,
    roughness: 0.5,
  })
);
wall.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(wall.geometry.attributes.uv.array, 2)
);
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 4),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
  })
);
door.position.z = 2.5 + 0.01;

house.add(wall, door);

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
camera.position.set(1.5, 3.5, 8);

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

  // Renderer
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();

/**
 * ALL Debugging
 */
// Main Camera
const cameraGUI = gui.addFolder("Main Camera");
cameraGUI.add(camera.position, "x").min(-10).max(10).step(0.0001);
cameraGUI.add(camera.position, "y").min(-10).max(10).step(0.0001);
cameraGUI.add(camera.position, "z").min(-10).max(10).step(0.0001);

// Lights
const lightGUI = gui.addFolder("Lights");
// Directional Light
const directionalLightGUI = lightGUI.addFolder("Directional Light");
directionalLightGUI
  .add(directionalLight.position, "x")
  .min(-20)
  .max(20)
  .step(1)
  .name("Position X");
directionalLightGUI
  .add(directionalLight.position, "y")
  .min(-20)
  .max(20)
  .step(1)
  .name("Position Y");
directionalLightGUI
  .add(directionalLight.position, "z")
  .min(-20)
  .max(20)
  .step(1)
  .name("Position Z");
