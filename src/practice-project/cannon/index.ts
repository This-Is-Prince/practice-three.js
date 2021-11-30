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
// world.allowSleep = true;
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);
// Disable friction by default
world.defaultContactMaterial.friction = 0;
let is = 0;

let wheelBodies: CANNON.Body[] = [];
let vehicle: CANNON.RaycastVehicle;
let wheels: THREE.Mesh[];
let chassisBody: CANNON.Body;
let chassis: THREE.Mesh;

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./static/models/cannon/cannon.glb", (gltf) => {
  const cannon = new THREE.Group();
  const cannonObject = [...gltf.scene.children] as THREE.Mesh[];
  chassis = new THREE.Mesh();

  let frontLeftWheel = new THREE.Mesh();
  let frontRightWheel = new THREE.Mesh();
  let backLeftWheel = new THREE.Mesh();
  let backRightWheel = new THREE.Mesh();

  cannonObject.forEach((object) => {
    switch (object.name) {
      case "Cannon":
        chassis = object;
        break;
      case "Front_Left_Wheel":
        frontLeftWheel = object;
        break;
      case "Back_Left_Wheel":
        backLeftWheel = object;
        break;
      case "Back_Right_Wheel":
        backRightWheel = object;
        break;
      case "Front_Right_Wheel":
        frontRightWheel = object;
        break;
    }
    cannon.add(object);
  });
  cannon.scale.set(0.25, 0.25, 0.25);

  scene.add(cannon);

  // Physics
  let min = chassis.geometry.boundingBox?.min!;
  let max = chassis.geometry.boundingBox?.max!;
  let x = (Math.abs(min.x) + Math.abs(max.x)) / 2;
  let y = (Math.abs(min.y) + Math.abs(max.y)) / 2;
  let z = (Math.abs(min.z) + Math.abs(max.z)) / 2;
  console.log(z);

  // Build The Car Chassis
  const chassisShape = new CANNON.Box(new CANNON.Vec3(x, y, z));
  chassisBody = new CANNON.Body({
    mass: 150,
    shape: chassisShape,
    position: new CANNON.Vec3(0, 2, 0),
    angularVelocity: new CANNON.Vec3(0, 0.5, 0),
  });

  // Create The Vehicle
  vehicle = new CANNON.RaycastVehicle({
    chassisBody,
  });

  // Wheel Options
  const wheelOptions = {
    radius: 0.75,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 1.4,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 0, 1),
    chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };
  wheels = [] as THREE.Mesh[];

  wheelOptions.chassisConnectionPointLocal.set(
    frontLeftWheel.position.x,
    frontLeftWheel.position.y,
    frontLeftWheel.position.z
  );
  wheels.push(frontLeftWheel);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(
    frontRightWheel.position.x,
    frontRightWheel.position.y,
    frontRightWheel.position.z
  );
  wheels.push(frontRightWheel);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(
    backLeftWheel.position.x,
    backLeftWheel.position.y,
    backLeftWheel.position.z
  );
  wheels.push(backLeftWheel);
  vehicle.addWheel(wheelOptions);

  wheelOptions.chassisConnectionPointLocal.set(
    backRightWheel.position.x,
    backRightWheel.position.y,
    backRightWheel.position.z
  );
  wheels.push(backRightWheel);
  vehicle.addWheel(wheelOptions);

  vehicle.addToWorld(world);

  // Add the wheel bodies
  const wheelMaterial = new CANNON.Material("wheel");

  vehicle.wheelInfos.forEach((wheel) => {
    const cylinderShape = new CANNON.Cylinder(
      wheel.radius,
      wheel.radius,
      wheel.radius / 2,
      20
    );
    const wheelBody = new CANNON.Body({
      mass: 0,
      material: wheelMaterial,
    });

    wheelBody.type = CANNON.Body.KINEMATIC;
    wheelBody.collisionFilterGroup = 0; // turn off collisions

    const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0);
    wheel.chassisConnectionPointLocal;
    wheelBody.addShape(
      cylinderShape,
      wheel.chassisConnectionPointLocal,
      quaternion
    );
    wheelBodies.push(wheelBody);
    world.addBody(wheelBody);
  });

  // Update the wheel bodies
  // world.addEventListener("postStep", () => {
  //   chassis.position.set(
  //     chassisBody.position.x,
  //     chassisBody.position.y,
  //     chassisBody.position.z
  //   );
  //   chassis.quaternion.set(
  //     chassisBody.quaternion.x,
  //     chassisBody.quaternion.y,
  //     chassisBody.quaternion.z,
  //     chassisBody.quaternion.w
  //   );

  //   for (let i = 0; i < vehicle.wheelInfos.length; i++) {
  //     vehicle.updateWheelTransform(i);
  //     const transform = vehicle.wheelInfos[i].worldTransform;
  //     const wheelBody = wheelBodies[i];
  //     const wheel = wheels[i];
  //     wheelBody.position.copy(transform.position);
  //     wheel.position.set(
  //       transform.position.x,
  //       transform.position.y,
  //       transform.position.z
  //     );

  //     // if (is < 5) {
  //     //   console.log(transform.position);
  //     // }

  //     wheelBody.quaternion.copy(transform.quaternion);
  //     wheel.quaternion.set(
  //       transform.quaternion.x,
  //       transform.quaternion.y,
  //       transform.quaternion.z,
  //       transform.quaternion.w
  //     );
  //   }
  //   // if (is < 50) {
  //   //   console.log(chassisBody.position);
  //   //   console.log("space");
  //   // }

  //   is++;
  // });

  // Ground
  const groundMaterial = new CANNON.Material("ground");
  const groundShape = new CANNON.Plane();
  const ground = new CANNON.Body({
    shape: groundShape,
    mass: 0,
    material: groundMaterial,
    position: new CANNON.Vec3(0, 0, 0),
  });
  ground.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(ground);

  const wheel_ground = new CANNON.ContactMaterial(
    wheelMaterial,
    groundMaterial,
    { friction: 0.3, restitution: 0.5, contactEquationStiffness: 10 }
  );
  world.addContactMaterial(wheel_ground);

  // Keybindings
  // Add force on keydown
  document.addEventListener("keydown", (event) => {
    const maxSteerVal = 0.5;
    const maxForce = 1000;
    const brakeForce = 1000000;

    switch (event.key) {
      case "w":
      case "ArrowUp":
        vehicle.applyEngineForce(-maxForce, 2);
        vehicle.applyEngineForce(-maxForce, 3);
        break;

      case "s":
      case "ArrowDown":
        vehicle.applyEngineForce(maxForce, 2);
        vehicle.applyEngineForce(maxForce, 3);
        break;

      case "a":
      case "ArrowLeft":
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
        break;

      case "d":
      case "ArrowRight":
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
        break;

      case "b":
        vehicle.setBrake(brakeForce, 0);
        vehicle.setBrake(brakeForce, 1);
        vehicle.setBrake(brakeForce, 2);
        vehicle.setBrake(brakeForce, 3);
        break;
    }
  });

  // Reset force on keyup
  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
        break;

      case "s":
      case "ArrowDown":
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
        break;

      case "a":
      case "ArrowLeft":
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;

      case "d":
      case "ArrowRight":
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
        break;

      case "b":
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);
        break;
    }
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
const clock = new THREE.Clock();
let lastTime = 0;

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastTime;
  lastTime = elapsedTime;

  // Physics
  world.step(1 / 60, deltaTime, 3);

  if (chassis && chassisBody) {
    chassis.position.set(
      chassisBody.position.x,
      chassisBody.position.y,
      chassisBody.position.z
    );
    chassis.quaternion.set(
      chassisBody.quaternion.x,
      chassisBody.quaternion.y,
      chassisBody.quaternion.z,
      chassisBody.quaternion.w
    );

    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i);
      const transform = vehicle.wheelInfos[i].worldTransform;
      const wheelBody = wheelBodies[i];
      const wheel = wheels[i];
      wheelBody.position.copy(transform.position);
      wheel.position.set(
        transform.position.x,
        transform.position.y,
        transform.position.z
      );

      // if (is < 5) {
      //   console.log(transform.position);
      // }

      wheelBody.quaternion.copy(transform.quaternion);
      wheel.quaternion.set(
        transform.quaternion.x,
        transform.quaternion.y,
        transform.quaternion.z,
        transform.quaternion.w
      );
    }
    // if (is < 50) {
    //   console.log(chassisBody.position);
    //   console.log("space");
    // }

    is++;
  }

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
