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
  "./static/fonts/helvetiker_regular.typeface.json",
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
        0.4,
        0.2
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
 * Objects To Update
 **/
let objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

/**
 * Physics
 **/
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);

// Physics Material
const groundMaterial = new CANNON.Material("groundMaterial");
const textMaterial = new CANNON.Material("textMaterial");

// Physics Body
const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  mass: 0,
  material: groundMaterial,
  position: new CANNON.Vec3(0, 0, 0),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// Physics contact materials
const textGroundContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  textMaterial,
  { friction: 0.1, restitution: 0.3 }
);
world.addContactMaterial(textGroundContactMaterial);

// Add Body to physics world
world.addBody(groundBody);

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
  });

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
