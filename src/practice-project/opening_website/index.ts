import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import vertexShader from "./shaders/index-1/vertex.vs.glsl?raw";
import fragmentShader from "./shaders/index-1/fragment.fs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

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
 * Font Loader
 */
let geometry: TextGeometry;
let material: THREE.RawShaderMaterial;
const fontLoader = new FontLoader();
fontLoader.load("./static/fonts/helvetiker_regular.typeface.json", (font) => {
  geometry = new TextGeometry("P", {
    font,
    size: 0.4,
    height: 0.2,
  });
  //   const count = geometry.attributes.position.count;
  //   const randoms = new Float32Array(count);
  //   for (let i = 0; i < count; i++) {
  //     randoms[i] = Math.random();
  //   }
  //   geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  geometry.center();
  material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const text = new THREE.Mesh(geometry, material);
  scene.add(text);
});

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
camera.position.set(0, 0, 1);
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
let index = 0;

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Material
  if (material) {
    material.uniforms.uTime.value = elapsedTime;
    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);
    // for (let i = 0; i < count; i++) {
    //   randoms[i] = Math.random();
    // }
    randoms[index % count] = Math.random() * 0.1;
    index++;
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
  }

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
