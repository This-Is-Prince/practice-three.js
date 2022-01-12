import * as THREE from "three";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio());
camera.position.z = 3;
scene.add(camera);

// Canvas
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Clock
const clock = new THREE.Clock();

// Animations
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, delay: 2, duration: 1 });

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Objects

  // Renderer
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
