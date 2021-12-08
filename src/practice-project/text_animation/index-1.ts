import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Font Loader
 */
let wheelPosition = 0;
const skillsArr = [
  "Node.js",
  "React.js",
  "Three.js",
  "CSS",
  "HTML",
  "Typescript",
  "Express.js",
  "Mongoose.js",
];
let textMeshes: THREE.Mesh[] = [];
let font: Font;
const fontLoader = new FontLoader();
fontLoader.load(
  "./static/fonts/helvetiker_regular.typeface.json",
  (currFont) => {
    font = currFont;
    const material = new THREE.MeshNormalMaterial({});
    skillsArr.forEach((skill, index) => {
      const geometry = new TextGeometry(skill, {
        font,
        size: 0.4,
        height: 0.2,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      // let angle = Math.PI * 2 * (index / skillsArr.length);
      // mesh.position.x = Math.sin(angle) * 3;
      // mesh.position.y = Math.cos(angle) * 3;
      mesh.position.y = -index;
      textMeshes.push(mesh);
      scene.add(mesh);
    });
  }
);

/**
 * Window Events
 */
document.addEventListener(
  "wheel",
  (e) => {
    let duration = 1;
    if (e.deltaY > 0) {
      wheelPosition++;
      textMeshes.forEach((text) => {
        gsap.to(text.position, { y: text.position.y + 1, duration });
      });
    } else {
      wheelPosition--;
      textMeshes.forEach((text) => {
        gsap.to(text.position, { y: text.position.y - 1, duration });
      });
    }
    return false;
  },
  true
);

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
controls.enabled = false;
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

  // Update Controls
  controls.update();

  // Renderer
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
};
tick();
