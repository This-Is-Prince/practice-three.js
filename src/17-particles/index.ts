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

let particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  // vertexColors: true,
});

let particlesGeometry = new THREE.BufferGeometry();
let particles: THREE.Points;
const noOfParticle = 1000;
let positions = new Float32Array(noOfParticle * 3);
let colors = new Float32Array(noOfParticle * 3);

// const makeCircle = (radius: number, thickness: number) => {
//   for (let i = 0; i < noOfParticle; i++) {
//     let index = i * 3;
//     let rnd = Math.random();
//     let x = Math.sin(rnd * Math.PI * 2);
//     let z = Math.cos(rnd * Math.PI * 2);

//     let rnd1 = Math.random() * thickness;
//     x = x * radius * (rnd1 + 1);
//     z = z * radius * (rnd1 + 1);
//     positions[index + 0] = x;
//     positions[index + 1] = 0;
//     positions[index + 2] = z;
//   }
// };
// makeCircle(1, 0);
// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );
// particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

const galaxyParameters = {
  noOfParticles: 100000,
  noOfSubDivision: 18,
  radius: 10,
  height: 0.1,
  subDivisionThickness: 0.25,
  bending: 3,
  insideColor: 0xff6030,
  outsideColor: 0x1b3984,
};
const makeGalaxy = () => {
  // Remove Previous Particles
  if (particles !== undefined) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(particles);
  }

  particlesGeometry = new THREE.BufferGeometry();
  positions = new Float32Array(galaxyParameters.noOfParticles * 3);
  colors = new Float32Array(galaxyParameters.noOfParticles * 3);

  const insideColor = new THREE.Color(galaxyParameters.insideColor);
  const outsideColor = new THREE.Color(galaxyParameters.outsideColor);

  // Calculate Positions of particles
  for (let i = 0; i < galaxyParameters.noOfParticles; i++) {
    let index = i * 3;

    // Distance From Center Of Galaxy (radius)
    let distanceFromCenterOfGalaxy = Math.random() * galaxyParameters.radius;
    // Find How Many SubDivision
    let whichSubDivision = i % galaxyParameters.noOfSubDivision;
    let rnd = Math.random();
    // Angle For Each Subdivision
    let angleOfSubDivision =
      Math.PI * 2 * (whichSubDivision / galaxyParameters.noOfSubDivision) +
      (Math.random() - 0.5) *
        galaxyParameters.subDivisionThickness *
        (rnd < 0.5 ? 0.2 : 1) +
      Math.pow(distanceFromCenterOfGalaxy, galaxyParameters.bending) * 0.01;
    // x Position
    positions[index + 0] =
      Math.cos(angleOfSubDivision) * distanceFromCenterOfGalaxy;
    // y Position
    positions[index + 1] = (Math.random() - 0.5) * galaxyParameters.height;
    // z Position
    positions[index + 2] =
      Math.sin(angleOfSubDivision) * distanceFromCenterOfGalaxy;

    // Colors
    const mixedColor = insideColor.clone();
    mixedColor.lerp(
      outsideColor,
      distanceFromCenterOfGalaxy / galaxyParameters.radius
    );
    colors[index + 0] = mixedColor.r;
    colors[index + 1] = mixedColor.g;
    colors[index + 2] = mixedColor.b;
  }
  // SetAttribute in Buffer Geometry
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  // New Particles
  particles = new THREE.Points(particlesGeometry, particlesMaterial);

  // Adding in Scene
  scene.add(particles);
};
// Making Galaxy
// makeGalaxy();
// Make Galaxy Debug GUI
// gui
//   .add(galaxyParameters, "noOfParticles")
//   .min(500)
//   .max(100000)
//   .step(100)
//   .onFinishChange(makeGalaxy);
// gui
//   .add(galaxyParameters, "noOfSubDivision")
//   .min(2)
//   .max(20)
//   .step(1)
//   .onFinishChange(makeGalaxy);
// gui
//   .add(galaxyParameters, "radius")
//   .min(1)
//   .max(20)
//   .step(0.0001)
//   .onFinishChange(makeGalaxy);
// gui
//   .add(galaxyParameters, "height")
//   .min(0)
//   .max(1)
//   .step(0.0001)
//   .onFinishChange(makeGalaxy);
// gui
//   .add(galaxyParameters, "subDivisionThickness")
//   .min(0)
//   .max(0.5)
//   .step(0.0001)
//   .onFinishChange(makeGalaxy);
// gui
//   .add(galaxyParameters, "bending")
//   .min(1)
//   .max(5)
//   .step(1)
//   .onFinishChange(makeGalaxy);
// gui.addColor(galaxyParameters, "insideColor").onFinishChange(makeGalaxy);
// gui.addColor(galaxyParameters, "outsideColor").onFinishChange(makeGalaxy);

/**
 * Stars
 */
const starsParameters = {
  noOfStars: 1000,
  maxDistanceFromCenter: 10,
};
const makeStars = () => {
  //Destroy Old Stars
  if (particles !== undefined) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(particles);
  }
  positions = new Float32Array(starsParameters.noOfStars * 3);
  particlesGeometry = new THREE.BufferGeometry();

  for (let i = 0; i < starsParameters.noOfStars; i++) {
    let index = i * 3;
    positions[index + 0] =
      (Math.random() - 0.5) * starsParameters.maxDistanceFromCenter;
    positions[index + 1] =
      (Math.random() - 0.5) * starsParameters.maxDistanceFromCenter;
    positions[index + 2] =
      (Math.random() - 0.5) * starsParameters.maxDistanceFromCenter;
  }

  // set attribute
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
};
makeStars();

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
// camera.position.set(0, 10, 0);
camera.position.set(0, 0, 5);
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
