import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Debug GUI
 */
const gui = new dat.GUI();

/**
 * Window Events
 */
// Resize
window.addEventListener("resize", () => {
  // Update SIzes
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
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Scene
 */
const scene = new THREE.Scene();
/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Geometry
 */
let obj = {
  count: 10000,
  size: 0.02,
  radius: 1,
  circle: 3,
};

let geometry: THREE.BufferGeometry;
let positions: Float32Array;
let material: THREE.PointsMaterial;
let points: THREE.Points;

const make = () => {
  // Destroy Old Points
  if (points !== undefined) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // Geometry
  geometry = new THREE.BufferGeometry();
  // Positions
  positions = new Float32Array(obj.count * 3);

  // Calculation points
  for (let i = 0; i < obj.count; i++) {
    let i3 = i * 3;

    let circle = i % obj.circle;
    let radius = Math.random() * circle;
    let spinAngle = radius;

    let x = Math.sin(spinAngle) * radius;
    let y = 0;
    let z = Math.cos(spinAngle) * radius;

    positions[i3 + 0] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Materials
  material = new THREE.PointsMaterial({
    size: obj.size,
    sizeAttenuation: true,
  });

  // Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
make();
gui.add(obj, "count").min(100).max(1000000).step(100).onFinishChange(make);
gui.add(obj, "size").min(0.001).max(0.1).step(0.0001).onFinishChange(make);
gui.add(obj, "radius").min(1).max(10).step(0.01).onFinishChange(make);
gui.add(obj, "circle").min(1).max(100).step(0.01).onFinishChange(make);

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
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 1000);
camera.position.y = 3;
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
const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // next frame
  window.requestAnimationFrame(tick);
};
tick();
