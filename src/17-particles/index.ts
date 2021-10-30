import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
 * Objects
 */

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
});

const particlesGeometry = new THREE.BufferGeometry();
const noOfParticle = 1000;
let positions = new Float32Array(noOfParticle * 3);

const makeCircle = (radius: number, thickness: number) => {
  for (let i = 0; i < noOfParticle; i++) {
    let index = i * 3;
    let rnd = Math.random();
    let x = Math.sin(rnd * Math.PI * 2);
    let z = Math.cos(rnd * Math.PI * 2);

    let rnd1 = Math.random() * thickness;
    x = x * radius * (rnd1 + 1);
    z = z * radius * (rnd1 + 1);
    positions[index + 0] = x;
    positions[index + 1] = 0;
    positions[index + 2] = z;
  }
};
// makeCircle(1, 0);
const galaxyParameters = {
  noOfParticles: 100000,
  noOfSubDivision: 18,
  radius: 10,
  height: 0.1,
  subDivisionThickness: 0.25,
  bending: 3,
};
let particles: THREE.Points;
const makeGalaxy = () => {
  positions = new Float32Array(galaxyParameters.noOfParticles * 3);
  // Remove Previous Particles
  if (particles !== undefined) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(particles);
  }
  // Calculate Positions of particles
  for (let i = 0; i < galaxyParameters.noOfParticles; i++) {
    let index = i * 3;
    // Distance From Center Of Galaxy (radius)
    let distanceFromCenterOfGalaxy = Math.random() * galaxyParameters.radius;
    // Find How Many SubDivision
    let whichSubDivision = i % galaxyParameters.noOfSubDivision;
    // Angle For Each Subdivision
    let angleOfSubDivision =
      Math.PI * 2 * (whichSubDivision / galaxyParameters.noOfSubDivision) +
      (Math.random() - 0.5) * galaxyParameters.subDivisionThickness +
      Math.pow(distanceFromCenterOfGalaxy, galaxyParameters.bending) * 0.01;
    // x Position
    positions[index + 0] =
      Math.cos(angleOfSubDivision) * distanceFromCenterOfGalaxy;
    // y Position
    positions[index + 1] = (Math.random() - 0.5) * galaxyParameters.height;
    // z Position
    positions[index + 2] =
      Math.sin(angleOfSubDivision) * distanceFromCenterOfGalaxy;
  }
  // SetAttribute in Buffer Geometry
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  // New Particles
  particles = new THREE.Points(particlesGeometry, particlesMaterial);

  // Adding in Scene
  scene.add(particles);
};
// Making Galaxy
makeGalaxy();
// Make Galaxy Debug GUI
gui
  .add(galaxyParameters, "noOfParticles")
  .min(500)
  .max(100000)
  .step(100)
  .onFinishChange(makeGalaxy);
gui
  .add(galaxyParameters, "noOfSubDivision")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(makeGalaxy);
gui
  .add(galaxyParameters, "radius")
  .min(1)
  .max(20)
  .step(0.0001)
  .onFinishChange(makeGalaxy);
gui
  .add(galaxyParameters, "height")
  .min(0)
  .max(1)
  .step(0.0001)
  .onFinishChange(makeGalaxy);
gui
  .add(galaxyParameters, "subDivisionThickness")
  .min(0)
  .max(0.25)
  .step(0.0001)
  .onFinishChange(makeGalaxy);
gui
  .add(galaxyParameters, "bending")
  .min(1)
  .max(5)
  .step(1)
  .onFinishChange(makeGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};
const aspectRatio = () => sizes.width / sizes.height;
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(0, 10, 0);
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
// Clock
const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Objects

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
