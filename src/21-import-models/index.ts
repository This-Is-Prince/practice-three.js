import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
// Resize
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
 * GLTF Loader
 */
const gltfLoader = new GLTFLoader();

/**
 * FlightHelmet Model
 */
gltfLoader.load(
  "./static/models/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    // console.log(gltf.scene);
    // scene.add(gltf.scene.children[0]);

    // Don't Do This
    // for (let child of gltf.scene.children) {
    //   scene.add(child);
    // }

    while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0]);
    }
  }
);

/**
 * Duck Model
 */
// ---- 1.type
// const model = gltfLoader.load("./static/models/Duck/glTF/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene.children[0]);
// });

// ---- 2.type
// gltfLoader.load("./static/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
//   scene.add(gltf.scene.children[0]);
// });

// ---- 3.type
// gltfLoader.load("./static/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene.children[0]);
// });

// ---- 4.type
// gltfLoader.load("./static/models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
//   scene.add(gltf.scene.children[0]);
// });

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5 })
);
floor.receiveShadow = true;
floor.rotation.x = Math.PI * -0.5;
scene.add(floor);

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.top = 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Animation
 */
// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
