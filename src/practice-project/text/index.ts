import "../../style.css";
import * as dat from "dat.gui";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Fonts
 */
let font: Font;
const fontLoader = new FontLoader();
fontLoader.load(
  "../../../static/fonts/helvetiker_regular.typeface.json",
  (currFont) => {
    font = currFont;
  }
);

/**
 * Debug GUI
 */
const gui = new dat.GUI();
const parameters = {
  groundColor: 0xfff88d,
  fogColor: 0xcadee3,
  createText: () => {
    if (font) {
      const char = 65 + Math.floor(Math.random() * (91 - 65));
      generateCharacterMesh(
        {
          x: (Math.random() - 0.5) * 2,
          y: 3,
          z: (Math.random() - 0.5) * 2,
        },
        String.fromCharCode(char),
        0.8,
        0.4
      );
    }
  },
};
gui.addColor(parameters, "groundColor").onChange(() => {
  ground.material.color.set(parameters.groundColor);
});
gui.addColor(parameters, "fogColor").onChange(() => {
  scene.background = new THREE.Color(parameters.fogColor);
  scene.fog!.color.set(parameters.fogColor);
});
gui.add(parameters, "createText");

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(parameters.fogColor);
scene.fog = new THREE.Fog(parameters.fogColor, 1, 20);

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
 * Objects To Update
 **/
let objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

/**
 * Floor
 */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 10),
  new THREE.MeshStandardMaterial({ color: parameters.groundColor })
);
ground.position.set(0, 0, 0);
ground.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
ground.receiveShadow = true;
scene.add(ground);

/**
 * Physics
 **/
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);
world.allowSleep = true;
world.defaultContactMaterial.friction = 0;

// Physics Material
const defaultMaterial = new CANNON.Material("defaultMaterial");
// const groundMaterial = new CANNON.Material("groundMaterial");
// const textMaterial = new CANNON.Material("textMaterial");
// const wheelMaterial = new CANNON.Material("wheelMaterial");
// const chassisMaterial = new CANNON.Material("chassisMaterial");
const groundMaterial = defaultMaterial;
const textMaterial = defaultMaterial;
const wheelMaterial = defaultMaterial;
// const chassisMaterial = defaultMaterial;

// Physics Body
const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  mass: 0,
  material: groundMaterial,
  position: new CANNON.Vec3(0, 0, 0),
  quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
});

// Physics contact materials
// const textChassisContactMaterial = new CANNON.ContactMaterial(
//   chassisMaterial,
//   textMaterial,
//   { friction: 0.1, restitution: 0.2 }
// );
// const wheelGroundContactMaterial = new CANNON.ContactMaterial(
//   wheelMaterial,
//   groundMaterial,
//   {
//     friction: 0.3,
//     restitution: 0,
//     contactEquationStiffness: 1000,
//   }
// );
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.4,
    contactEquationStiffness: 1000,
  }
);
// world.addContactMaterial(wheelGroundContactMaterial);
world.addContactMaterial(defaultContactMaterial);

// Add Body to physics world
world.addBody(groundBody);

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../../../static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("../../../static/models/car/car.glb", (gltf) => {
  // All Car Meshes
  const meshes = [...gltf.scene.children] as THREE.Mesh[];

  // Car Chassis Mesh
  let chassisMesh = new THREE.Mesh();

  // Car Wheel Meshes
  let front_Left_Wheel = new THREE.Mesh();
  let front_Right_Wheel = new THREE.Mesh();
  let back_Left_Wheel = new THREE.Mesh();
  let back_Right_Wheel = new THREE.Mesh();

  // Differentiating all meshes
  for (let mesh of meshes) {
    mesh.castShadow = true;
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
  const chassisBody = new CANNON.Body({ mass: 150 });
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
  objectsToUpdate.push({ mesh: chassisMesh, body: chassisBody });
});

/**
 * Text
 */
interface PositionType {
  x: number;
  y: number;
  z: number;
}
type GenerateCharacterMeshFunType = (
  position: PositionType,
  char: string,
  size?: number,
  height?: number
) => void;

const material = new THREE.MeshNormalMaterial();
const generateCharacterMesh: GenerateCharacterMeshFunType = (
  { x, y, z },
  char,
  size = 0.4,
  height = 0.2
) => {
  const geometry = new TextGeometry(char, {
    size: size,
    height: height,
    font,
  });
  geometry.computeBoundingBox();
  geometry.center();
  const max = geometry.boundingBox!.max;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  scene.add(mesh);

  const body = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(max.x, max.y, max.z)),
    mass: 1,
    material: textMaterial,
  });
  body.position.set(x, y, z);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(3, 3, 3);
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 10;
directionalLight.castShadow = true;
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
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 1000);
camera.position.set(0, 3, 3);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
// Clock
const clock = new THREE.Clock();
let lastTime = 0;

// Tick
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastTime;
  lastTime = elapsedTime;

  // Physics
  world.step(1 / 60, deltaTime, 3);
  objectsToUpdate.forEach((object) => {
    copyFromBodyToMesh(object.body, object.mesh);
    if (object.mesh.name === "Chassis") {
      object.mesh.position.y -= 0.25;
    }
  });

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
