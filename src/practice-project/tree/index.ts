import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Debug GUI
 */
const gui = new dat.GUI();
const parameters = {
  floorColor: 0xfcbc5d,
  treeTop: 0x27cc32,
  treeBottom: 0xcca913,
};

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
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./static/models/tree/tree.glb", (gltf) => {
  let treeTop = gltf.scene.children[0].children[0];
  let treeBottom = gltf.scene.children[0].children[1];

  gui.addColor(parameters, "treeTop").onChange(() => {
    if (treeTop instanceof THREE.Mesh) {
      if (treeTop.material instanceof THREE.MeshStandardMaterial) {
        treeTop.material.color.set(parameters.treeTop);
      }
    }
  });

  gui.addColor(parameters, "treeBottom").onChange(() => {
    if (treeBottom instanceof THREE.Mesh) {
      if (treeBottom.material instanceof THREE.MeshStandardMaterial) {
        treeBottom.material.color.set(parameters.treeBottom);
      }
    }
  });

  if (treeTop instanceof THREE.Mesh) {
    if (treeTop.material instanceof THREE.MeshStandardMaterial) {
      console.log(treeTop.material.color.getHexString());
    }
  }
  gltf.scene.scale.set(0.25, 0.25, 0.25);
  scene.add(gltf.scene);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: parameters.floorColor,
    roughness: 0.5,
  })
);
gui.addColor(parameters, "floorColor").onChange(() => {
  floor.material.color.set(parameters.floorColor);
});
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
let oldElapsedTime = 0;

// Tick
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
