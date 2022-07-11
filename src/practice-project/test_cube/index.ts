import "../../style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Debug GUI
 */
const gui = new dat.GUI();
const parameters = {
  cubeColor: 0xfff88d,
  fogColor: 0xcadee3,
};
gui.addColor(parameters, "fogColor").onChange(() => {
  scene.background = new THREE.Color(parameters.fogColor);
  scene.fog!.color.set(parameters.fogColor);
});
gui.addColor(parameters, "cubeColor").onChange(() => {
  if (cube && cube.material instanceof THREE.MeshStandardMaterial) {
    cube.material.color.set(parameters.cubeColor);
  }
});

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(parameters.fogColor);
scene.fog = new THREE.Fog(parameters.fogColor, 1, 20);

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Mesh
 */
let cube: THREE.Mesh;

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../../../static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("../../../static/models/test_cube/cube.glb", (gltf) => {
  cube = gltf.scene.children[0] as THREE.Mesh;
  cube.material = new THREE.MeshStandardMaterial({
    color: parameters.cubeColor,
  });
  cube.position.x = -1;
  const cubeTemp = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xfff000 })
  );
  scene.add(cube, cubeTemp);
});

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 10;
directionalLight.castShadow = true;
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 1000);
camera.position.set(0, 3, 3);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animations
 */
// Clock
// const clock = new THREE.Clock();
// let lastTime = 0;

// Tick
const tick = () => {
  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();
  // const deltaTime = elapsedTime - lastTime;
  // lastTime = elapsedTime;

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
