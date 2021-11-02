import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "./static/textures/environmentMaps/4/px.png",
  "./static/textures/environmentMaps/4/nx.png",
  "./static/textures/environmentMaps/4/py.png",
  "./static/textures/environmentMaps/4/ny.png",
  "./static/textures/environmentMaps/4/pz.png",
  "./static/textures/environmentMaps/4/nz.png",
]);

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.right = 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Physics
 */

// materials

// ------ 1.way

// const plasticMaterial = new CANNON.Material("concrete");
// const concreteMaterial = new CANNON.Material("plastic");
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   plasticMaterial,
//   concreteMaterial,
//   { friction: 0.1, restitution: 0.7 }
// );

// ------ 2.way
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  { friction: 0.1, restitution: 0.7 }
);

// World
// const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.8, 0) });
const world = new CANNON.World();
world.gravity = new CANNON.Vec3(0, -9.8, 0);

// --1.way
// world.addContactMaterial(concretePlasticContactMaterial);
// --2.way
world.addContactMaterial(defaultContactMaterial);
// --3.way
world.defaultContactMaterial = defaultContactMaterial;

// Sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   // --1.way
//   // material: plasticMaterial,
//   // --2.way
//   // material: defaultMaterial,
// });
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

// FLoor
const floorShape = new CANNON.Plane();
// const floorBody = new CANNON.Body({
//   mass: 0,
//   position: new CANNON.Vec3(0, 0, 0),
//   shape: floorShape,
// });
const floorBody = new CANNON.Body();
floorBody.mass = 0;

// --1.way
// floorBody.material = concreteMaterial;
// --2.way
// floorBody.material = defaultMaterial;

// floorBody.position = new CANNON.Vec3(0, 0, 0);
floorBody.addShape(floorShape);
// floorBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0);
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// Physics Debug GUI
const physicsGUI = gui.addFolder("Physics");
const gravityGUI = physicsGUI.addFolder("Gravity");
gravityGUI.add(world.gravity, "x").min(-20).max(20).step(0.0001);
gravityGUI.add(world.gravity, "y").min(-20).max(20).step(0.0001);
gravityGUI.add(world.gravity, "z").min(-20).max(20).step(0.0001);

/**
 * Objects
 */
// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.3,
    envMap: environmentMapTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
floor.receiveShadow = true;

// Sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     roughness: 0.4,
//     metalness: 0.3,
//     envMap: environmentMapTexture,
//   })
// );
// sphere.position.y = 0.5;
// sphere.castShadow = true;
// scene.add(sphere);

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
camera.position.set(-3, 3, 3);
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
 * Utils
 */
const objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
type PositionType = { x: number; y: number; z: number };
const createSphere = (radius: number, { x, y, z }: PositionType) => {
  // Three.js Mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 20),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    })
  );
  mesh.castShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);

  // Cannon.js Body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    shape,
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    material: defaultMaterial,
  });
  body.position.set(x, y, z);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};
createSphere(0.5, { x: 0, y: 3, z: 0 });

/**
 * Animate
 */
// Clock
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update Physics World And THREE.js

  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  world.step(1 / 60, deltaTime, 3);
  // const { x: xS, y: yS, z: zS } = sphereBody.position;
  // sphere.position.set(xS, yS, zS);

  for (let object of objectsToUpdate) {
    const { x, y, z } = object.body.position;
    object.mesh.position.set(x, y, z);
  }

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
