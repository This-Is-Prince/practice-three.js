import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/second/vertex.vs.glsl?raw";
import fragmentShader from "./shaders/second/fragment.fs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUI
 */
const gui = new dat.GUI();

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("./static/textures/flag-indian.png");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// const geometry = new THREE.BufferGeometry();

// let count = 1000;
// let positions = new Float32Array(count * 3);

// for (let i = 0; i < count; i++) {
//   let index = i * 3;
//   positions[index + 0] = Math.random() - 0.5;
//   positions[index + 1] = 0;
//   positions[index + 2] = Math.random() - 0.5;
// }
// geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Random Value
// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);

// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random();
// }

// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material
// <----- 1.way ----->

// const material = new THREE.RawShaderMaterial({
//   vertexShader: `
//   uniform mat4 projectionMatrix;
//   uniform mat4 viewMatrix;
//   uniform mat4 modelMatrix;

//   attribute vec3 position;

//   void main(){
//       gl_Position = projectionMatrix * viewMatrix *  modelMatrix *  vec4(position,1.0);
//   }
//   `,
//   fragmentShader: `
//   precision mediump float;

//   void main(){
// gl_FragColor=vec4(1.0,0.0,0.0,1.0);
//   }
//   `,
// });

// <----- 2.way ----->

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5),
    },
    uTime: {
      value: 0,
    },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
  // wireframe: true,
});

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("uFrequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("uFrequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(0.25, -0.25, 1);
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
const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Material
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
