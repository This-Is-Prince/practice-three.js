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

/**
 *  Scene
 */
const scene = new THREE.Scene();

/**
 * Utils
 */
const copyFromBodyToMesh = (body: CANNON.Body, mesh: THREE.Mesh) => {
  const { x, y, z } = body.position;
  mesh.position.set(x, y, z);
  const { x: rX, y: rY, z: rZ, w } = body.quaternion;
  mesh.quaternion.set(rX, rY, rZ, w);
};

/**
 * Floor
 */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

/**
 * Physics
 **/

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -10, 0);
world.defaultContactMaterial.friction = 0;

// Physics Materials
const groundMaterial = new CANNON.Material("groundMaterial");
const wheelMaterial = new CANNON.Material("wheelMaterial");
const wheelGroundContactMaterial = new CANNON.ContactMaterial(
  wheelMaterial,
  groundMaterial,
  {
    friction: 0.3,
    restitution: 0,
    contactEquationStiffness: 1000,
  }
);
world.addContactMaterial(wheelGroundContactMaterial);

// ground physics Body
const groundBody = new CANNON.Body({
  mass: 0, // mass = 0 makes the body static
  material: groundMaterial,
  shape: new CANNON.Plane(),
  quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
});
world.addBody(groundBody);

let chassisBody: CANNON.Body;
let chassisMesh: THREE.Mesh;

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./static/models/car/car.glb", (gltf) => {
  // All Car Meshes
  const meshes = [...gltf.scene.children] as THREE.Mesh[];

  // Car Chassis Mesh
  chassisMesh = new THREE.Mesh();

  // Car Wheel Meshes
  let front_Left_Wheel = new THREE.Mesh();
  let front_Right_Wheel = new THREE.Mesh();
  let back_Left_Wheel = new THREE.Mesh();
  let back_Right_Wheel = new THREE.Mesh();

  // Differentiating all meshes
  for (let mesh of meshes) {
    switch (mesh.name) {
      case "Chassis":
        chassisMesh = mesh;
        break;
      case "Front_Left_Wheel":
        front_Left_Wheel = mesh;
        break;
      case "Front_Right_Wheel":
        front_Right_Wheel = mesh;
        break;
      case "Back_Left_Wheel":
        back_Left_Wheel = mesh;
        break;
      case "Back_Right_Wheel":
        back_Right_Wheel = mesh;
        break;
    }
  }
  // Adding chassis into scene
  scene.add(chassisMesh);
  console.log(chassisMesh);

  // Chassis Bounding Box
  const chassisBoundingBox = chassisMesh.geometry.boundingBox!;
  const max = chassisBoundingBox.max;
  const min = chassisBoundingBox.min;
  const x = Math.max(Math.abs(max.x), Math.abs(min.x));
  const y = Math.max(Math.abs(max.y), Math.abs(min.y));
  const z = Math.max(Math.abs(max.z), Math.abs(min.z));

  // Car Physics Body
  const chassisShape = new CANNON.Box(new CANNON.Vec3(x, y, z));
  chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 4, 0);
  chassisBody.angularVelocity.set(0, 0, 0); // initial velocity

  // Parent vehicle object
  const vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
    indexRightAxis: 2, // z
    indexUpAxis: 1, // y
    indexForwardAxis: 0, // x
  });

  // wheel options
  const options = {
    radius: 0.18,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 45,
    suspensionRestLength: 0.4,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.5,
    maxSuspensionForce: 200000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 0, 1),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.25,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };
  const wheelVisuals: THREE.Mesh[] = [];

  const wheelX = Math.abs(front_Right_Wheel.position.x);
  const wheelZ = Math.abs(front_Right_Wheel.position.z);

  // Front Right Wheel
  options.chassisConnectionPointLocal.set(-wheelX, 0, -wheelZ);
  vehicle.addWheel(options);
  wheelVisuals.push(front_Right_Wheel);

  // Front Left Wheel
  options.chassisConnectionPointLocal.set(-wheelX, 0, wheelZ);
  vehicle.addWheel(options);
  wheelVisuals.push(front_Left_Wheel);

  // Back Right Wheel
  options.chassisConnectionPointLocal.set(wheelX, 0, -wheelZ);
  vehicle.addWheel(options);
  wheelVisuals.push(back_Right_Wheel);

  // Back Left Wheel
  options.chassisConnectionPointLocal.set(wheelX, 0, wheelZ);
  vehicle.addWheel(options);
  wheelVisuals.push(back_Left_Wheel);

  // Add vehicle to physics world;
  vehicle.addToWorld(world);

  // Car Wheels Body
  const wheelBodies: CANNON.Body[] = [];
  vehicle.wheelInfos.forEach((wheel, index) => {
    // Wheel Body
    const shape = new CANNON.Cylinder(wheel.radius, wheel.radius, 0.13, 32);
    const body = new CANNON.Body({ mass: 1, material: wheelMaterial });
    body.addShape(shape);
    wheelBodies.push(body);

    // Wheel Meshes
    const wheelMesh = wheelVisuals[index];
    scene.add(wheelMesh);
  });

  // update the wheels to match the physics
  world.addEventListener("postStep", function () {
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i);
      let t = vehicle.wheelInfos[i].worldTransform;
      // update wheel physics
      wheelBodies[i].position.copy(t.position);
      wheelBodies[i].quaternion.copy(t.quaternion);
      // update wheel visuals
      copyFromBodyToMesh(wheelBodies[i], wheelVisuals[i]);
    }
  });
  function navigate(e: KeyboardEvent) {
    if (e.type != "keydown" && e.type != "keyup") return;
    let keyup = e.type == "keyup";
    vehicle.setBrake(0, 0);
    vehicle.setBrake(0, 1);
    vehicle.setBrake(0, 2);
    vehicle.setBrake(0, 3);

    let engineForce = 800,
      maxSteerVal = 0.6;
    switch (e.code) {
      case "Space": // break
        vehicle.setBrake(10, 0);
        vehicle.setBrake(10, 1);
        vehicle.setBrake(10, 2);
        vehicle.setBrake(10, 3);
        break;
      case "ArrowUp": // forward
        vehicle.applyEngineForce(keyup ? 0 : engineForce, 2);
        vehicle.applyEngineForce(keyup ? 0 : engineForce, 3);
        break;

      case "ArrowDown": // backward
        vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2);
        vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3);
        break;

      case "ArrowRight": // right
        vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 2);
        vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 3);
        break;

      case "ArrowLeft": // left
        vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 2);
        vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 3);
        break;
    }
  }

  window.addEventListener("keydown", navigate);
  window.addEventListener("keyup", navigate);
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
camera.position.z = -10;
camera.position.y = 1;
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
const clock = new THREE.Clock();
let lastTime = 0;

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastTime;
  lastTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  // update the chassis position
  if (chassisBody && chassisMesh) {
    copyFromBodyToMesh(chassisBody, chassisMesh);
    chassisMesh.position.y -= 0.25;
  }

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
