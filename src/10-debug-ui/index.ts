import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true });
// gui.hide();

/**
 * Window Events
 */

// Resize
window.addEventListener("resize", () => {
  // Update Size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Full screen
// const exitFullScreen = async () => {
//   await document.exitFullscreen();
// };
// const goFulLScreen = async () => {
//   await canvas.requestFullscreen();
// };
// window.addEventListener("dblclick", () => {
//   if (document.fullscreenElement) {
//     exitFullScreen();
//   } else {
//     goFulLScreen();
//   }
// });

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Param
 */
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { y: Math.PI * 2 + mesh.rotation.y, duration: 1 });
  },
};
/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
mesh.visible = true;
scene.add(mesh);

// Debug
// gui.add(mesh.position, "x", -3, 3, 0.0001);
gui.add(mesh.position, "x").min(-3).max(3).step(0.0001).name("mesh position x");
gui.add(mesh.position, "y").min(-3).max(3).step(0.0001).name("mesh position y");
gui.add(mesh.position, "z").min(-3).max(3).step(0.0001).name("mesh position z");

gui.add(mesh, "visible");
// gui.add(material, "wireframe");
gui.add(mesh.material, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
  material.color = new THREE.Color(parameters.color);
});
gui.add(parameters, "spin");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
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
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Next Frame
 */
const tick = () => {
  // Update Controls
  controls.update();

  //   Render
  renderer.render(scene, camera);

  // Request Animation Frame
  window.requestAnimationFrame(tick);
};
tick();
