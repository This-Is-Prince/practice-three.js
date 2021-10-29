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
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("./static/textures/minecraft.png");
const doorAlphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load(
  "./static/textures/door/height.jpg"
);
const doorNormalTexture = textureLoader.load(
  "./static/textures/door/normal.jpg"
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

// doorColorTexture.repeat.set(2, 3);
// doorColorTexture.wrapS = THREE.RepeatWrapping;
// doorColorTexture.wrapT = THREE.MirroredRepeatWrapping;
// doorColorTexture.center.set(0.5, 0.5);
// doorColorTexture.rotation = Math.PI * 0.25;

doorColorTexture.generateMipmaps = false;
doorColorTexture.minFilter = THREE.NearestFilter;
doorColorTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });

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
camera.position.set(0.5, 1, 0.5);
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
