import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragmentShader from "./shaders/index-1/fragment.fs.glsl?raw";
import vertexShader from "./shaders/index-1/vertex.vs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  updateRenderer();
});

/**
 * GUI
 */
const gui = new dat.GUI();

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("../../../static/textures/flag-indian.png");

/**
 * Objects
 */
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms: { uTexture: { value: texture }, progress: { value: 0 } },
});
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 2), material);
mesh.rotateX(-Math.PI * 0.5);
mesh.position.y = -1;
scene.add(mesh);

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
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Animations
 */
// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  //   Update material
  material.uniforms.progress.value = elapsedTime;
  // Update Controls
  controls.update();

  // Renderer
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
};
tick();
