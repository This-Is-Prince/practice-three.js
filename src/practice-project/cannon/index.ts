import "../../style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 *  Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 *  Debug GUI
 */
const gui = new dat.GUI();
const parameters = {
  metalColor: 0xcccccc,
  woodColor: 0xcc6022,
};

/**
 *  Scene
 */
const scene = new THREE.Scene();

/**
 * Physics
 */
const world = new CANNON.World();
world.allowSleep = true;
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);

// Materials
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  { friction: 0.1, restitution: 0.7 }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./static/models/cannon/cannon.glb", (gltf) => {
  const cannon = new THREE.Group();
  const cannonObject = [...gltf.scene.children[0].children];
  cannonObject.forEach((object, index) => {
    object.castShadow = true;
    cannon.add(object);
  });
  cannon.scale.set(0.25, 0.25, 0.25);
  cannon.position.y = -0.4;
  scene.add(cannon);

  // Physics
  const chassis = cannonObject[3] as THREE.Mesh;
  let min = chassis.geometry.boundingBox?.min!;
  let max = chassis.geometry.boundingBox?.max!;
  let x = (Math.abs(min.x) + Math.abs(max.x)) / 2;
  let y = (Math.abs(min.y) + Math.abs(max.y)) / 2;
  let z = (Math.abs(min.z) + Math.abs(max.z)) / 2;

  if (chassis.material instanceof THREE.MeshStandardMaterial) {
    chassis.material.color.set(0xffffff);
  }

  // Build The Car Chassis
  const chassisShape = new CANNON.Box(new CANNON.Vec3(x, y, z));
  const chassisBody = new CANNON.Body({
    mass: 150,
    shape: chassisShape,
    position: new CANNON.Vec3(0, 4, 0),
    angularVelocity: new CANNON.Vec3(0, 0.5, 0),
  });

  // Create The Vehicle
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody,
  });
});

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 5;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0xff00ff })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.6;
scene.add(floor);

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
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.z = 3;
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animations
 */
const tick = () => {
  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
