import * as THREE from "three";
import gsap from "gsap";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

/**
 * Animation
 */

// GSAP
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 });

// Time
// let time = Date.now();

// Clock
const clock = new THREE.Clock();

const tick = () => {
  // >>>>>Time
  //   const time = Date.now();
  //   console.log(time);
  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - time;
  //   time = currentTime;
  //   console.log(deltaTime);

  // >>>>>Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // >>>>>Update Objects
  //   mesh.rotation.x += 0.01;
  //   mesh.rotation.y += 0.01;
  //   mesh.rotation.z += 0.01;
  //   mesh.rotation.y += 0.001 * deltaTime;
  //   mesh.rotation.y = elapsedTime * Math.PI * 2;
  //   mesh.position.y = Math.sin(elapsedTime * Math.PI * 2);
  //   mesh.position.x = Math.cos(elapsedTime * Math.PI * 2);

  //   camera.position.y = Math.sin(elapsedTime * Math.PI);
  //   camera.position.x = Math.cos(elapsedTime * Math.PI);
  //   camera.lookAt(mesh.position);

  // >>>>>Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();