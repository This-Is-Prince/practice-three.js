import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

/**
 *Debug GUI
 */
const gui = new dat.GUI();

/**
 *Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 *Window Events
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
 *Scene
 */
const scene = new THREE.Scene();

/**
 * Textures
 */

// Loading Manager
const loadingManager = new THREE.LoadingManager();
// Texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager);
// -----------All Textures-----------

// ice_1
let ice_1_Texture = textureLoader.load("./static/example/ice-1.jfif");
ice_1_Texture.generateMipmaps = false;
ice_1_Texture.minFilter = THREE.NearestFilter;
ice_1_Texture.magFilter = THREE.NearestFilter;

// ice_2
let ice_2_Texture = textureLoader.load("./static/example/ice-2.jfif");
ice_2_Texture.generateMipmaps = false;
ice_2_Texture.minFilter = THREE.NearestFilter;
ice_2_Texture.magFilter = THREE.NearestFilter;

// ice_3
let ice_3_Texture = textureLoader.load("./static/example/ice-3.jpg");
ice_3_Texture.generateMipmaps = false;
ice_3_Texture.minFilter = THREE.NearestFilter;
ice_3_Texture.magFilter = THREE.NearestFilter;

// ice_4
let ice_4_Texture = textureLoader.load("./static/example/ice-4.jpg");
ice_4_Texture.generateMipmaps = false;
ice_4_Texture.minFilter = THREE.NearestFilter;
ice_4_Texture.magFilter = THREE.NearestFilter;

/**
 * Meshes
 */
// Floor
const floorSize = 1000;
ice_1_Texture.repeat.set(floorSize / 2, floorSize / 2);
ice_1_Texture.wrapS = THREE.MirroredRepeatWrapping;
ice_1_Texture.wrapT = THREE.MirroredRepeatWrapping;

const floorMaterial = new THREE.MeshStandardMaterial({
  map: ice_1_Texture,
});
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorSize, floorSize),
  floorMaterial
);
floor.rotation.x = Math.PI * -0.5;
floor.position.y = -0.01;
scene.add(floor);

// Wall
const wallMaterial = new THREE.MeshStandardMaterial({ map: ice_2_Texture });
ice_2_Texture.repeat.set(floorSize / 2, floorSize / 2);
ice_2_Texture.wrapS = THREE.MirroredRepeatWrapping;
ice_2_Texture.wrapT = THREE.MirroredRepeatWrapping;
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(floorSize, floorSize, 1),
  wallMaterial
);
wall.position.y = floorSize / 2;
scene.add(wall);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, floorSize, floorSize);
scene.add(directionalLight);

/**
 * Lights Debug
 */
// Light GUI
const lightGUI = gui.addFolder("Lights");
// Ambient Light GUI
const ambientLightGUI = lightGUI.addFolder("Ambient Light");
ambientLightGUI.add(ambientLight, "intensity").min(0).max(1).step(0.0001);
// Directional Light GUI
const directionalLightGUI = lightGUI.addFolder("Directional Light");
directionalLightGUI
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.0001);
directionalLightGUI.add(directionalLight, "visible");
directionalLightGUI
  .add(directionalLight.position, "x")
  .min(-floorSize)
  .max(floorSize)
  .step(0.5);
directionalLightGUI
  .add(directionalLight.position, "y")
  .min(-floorSize)
  .max(floorSize)
  .step(0.5);
directionalLightGUI
  .add(directionalLight.position, "z")
  .min(-floorSize)
  .max(floorSize)
  .step(0.5);

/**
 * Lights Helper
 */

/**
 *Sizes
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
 *Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 10000);
camera.position.set(1, 1, 2);
scene.add(camera);

/**
 *Controls
 */
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enableRotate = false;
orbitControls.enableZoom = false;
orbitControls.screenSpacePanning = false;
orbitControls.enablePan = true;
orbitControls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.RIGHT,
};

const trackballControls = new TrackballControls(camera, canvas);
trackballControls.noPan = true;
trackballControls.noRotate = true;
trackballControls.noZoom = false;
trackballControls.minDistance = 30;
trackballControls.maxDistance = 50;
trackballControls.dynamicDampingFactor = 0.075;
trackballControls.zoomSpeed = 0.15;

/**
 *Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 *Tick
 */
const tick = () => {
  // Update Controls
  let target = orbitControls.target;
  orbitControls.update();
  trackballControls.target.set(target.x, target.y, target.z);
  trackballControls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
