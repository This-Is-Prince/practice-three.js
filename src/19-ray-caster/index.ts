import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

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
// Mousemove
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width - 0.5) * 2;
  mouse.y = -(e.clientY / sizes.height - 0.5) * 2;
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
// Meshes
// const object1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 });
// object1.geometry.translate(-2, 0, 0);
// const object2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 });
// object2.geometry.translate(0, 0, 0);
// const object3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 });
// object3.geometry.translate(2, 0, 0);
// scene.add(object1, object2, object3);

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.position.x = -2;
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object2.position.x = 2;
scene.add(object1, object2, object3);

/**
 * RayCaster
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-100000000, 0);

// const origin = new THREE.Vector3(-3, 0, 0);
// const direction = new THREE.Vector3(10, 0, 0);
// direction.normalize();
// raycaster.set(origin, direction);

// const intersectObject = raycaster.intersectObject(object1);
// console.log(intersectObject);
// const intersectObjects = raycaster.intersectObjects([
//   object1,
//   object2,
//   object3,
// ]);
// console.log(intersectObjects);

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
camera.position.set(0, 0, 3);
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
// Clock
const clock = new THREE.Clock();
let currentIntersect: THREE.Intersection | null;

// Tick
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  // const origin = new THREE.Vector3(-3, 0, 0);
  // const direction = new THREE.Vector3(10, 0, 0);
  // direction.normalize();
  // raycaster.set(origin, direction);
  const objectsToTest = [object1, object2, object3];
  for (let object of objectsToTest) {
    object.material.color.set(0xff0000);
  }
  const intersectObjects = raycaster.intersectObjects(objectsToTest);
  for (const intersectObject of intersectObjects) {
    if (intersectObject.object instanceof THREE.Mesh) {
      intersectObject.object.material.color.set(0x0000ff);
    }
  }
  if (intersectObjects.length) {
    if (currentIntersect === null) {
      console.log("mouse enter");
    }
    currentIntersect = intersectObjects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
