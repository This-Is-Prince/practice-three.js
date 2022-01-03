import * as THREE from "three";
import "../style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Cursor
 */
// let cursor = new THREE.Vector2();
// window.addEventListener("mousemove", (event) => {
//   let x = (event.clientX / sizes.width - 0.5) * 2;
//   let y = -(event.clientY / sizes.height - 0.5) * 2;
//   cursor.set(x, y);
// });

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")! as HTMLCanvasElement;
const { clientHeight, clientWidth } = canvas;
const pixelRatio = Math.min(window.devicePixelRatio, 2);
canvas.width = (clientWidth * pixelRatio) | 0;
canvas.height = (clientHeight * pixelRatio) | 0;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};
const updateSize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSize();

// Orthographic Camera
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

// ---- Perspective Camera
const camera = new THREE.PerspectiveCamera(
  30,
  canvas.width / canvas.height,
  1.0,
  100
);

camera.position.set(3, 3, 7);
// camera.lookAt(mesh.position);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2;
controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

/**
 * Next Frame
 */

// Clock
const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Running This Function on Next Frame
  window.requestAnimationFrame(tick);
};
tick();
