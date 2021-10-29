import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

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
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./static/textures/matcaps/8.png");
/**
 * Font Loader
 */
const fontLoader = new FontLoader();
fontLoader.load("./static/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
  let count = 500;
  for (let i = 0; i < count; i++) {
    const torus = new THREE.Mesh(torusGeometry, material);

    // Position
    torus.position.x = (Math.random() - 0.5) * 100;
    torus.position.y = (Math.random() - 0.5) * 100;
    torus.position.z = (Math.random() - 0.5) * 100;

    // Rotation
    torus.rotation.x = Math.PI * Math.random();
    torus.rotation.y = Math.PI * Math.random();
    torus.rotation.z = Math.PI * Math.random();

    // Scale
    let scaleFactor = Math.random();
    torus.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Adding Torus into scene
    scene.add(torus);
  }
});

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
const renderer = new THREE.WebGLRenderer({ canvas });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

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
