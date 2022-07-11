import "./index.css";
import * as THREE from "three";

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/**
 * Sizes
 */
const sizes = { width: 0, height: 0 };
const updateSizes = () => {
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
};
updateSizes();
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Events
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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const updateRenderer = () => {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const width = (sizes.width * pixelRatio) | 0;
  const height = (sizes.height * pixelRatio) | 0;
  renderer.setSize(width, height, false);
};
updateRenderer();

/**
 * Camera
 */
const fov = 75;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio(), near, far);
camera.position.z = 2;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

/**
 * Box
 */
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
// const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); //greenish blue
// const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

type MakeInstanceType = (
  geometry: THREE.BoxGeometry,
  color: THREE.ColorRepresentation,
  x: number
) => THREE.Mesh;
const makeInstance: MakeInstanceType = (geometry, color, x) => {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
};
const cubes = [
  makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];

/**
 * Animate
 */
const render = (time: number) => {
  // Time in milliseconds
  time *= 0.001; //convert time to seconds

  // Animate Cube
  //   cube.rotation.set(time, time, 0);
  cubes.forEach((cube, index) => {
    const speed = 1 + index * 0.1;
    const rot = time * speed;
    cube.rotation.set(rot, rot, 0);
  });

  // Rendering scene using camera
  renderer.render(scene, camera);
  // Run render on Next Frame
  requestAnimationFrame(render);
  1;
};

// Calling render first Time
requestAnimationFrame(render);
