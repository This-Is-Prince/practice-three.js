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
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio(), near, far);
camera.position.z = 20;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 5);

scene.add(directionalLight);
scene.add(ambientLight);
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  wireframe: true,
});

/**
 * Geometry
 */
let geometry: THREE.BufferGeometry;
// 1.Box
{
  const width = 8;
  const height = 8;
  const depth = 8;
  const widthSegments = 4;
  const heightSegments = 4;
  const depthSegments = 4;
  geometry = new THREE.BoxGeometry(
    width,
    height,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
  );
}

/**
 * Mesh
 */
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Animate
 */
const render = (time: number) => {
  // Time in milliseconds
  time *= 0.001; //convert time to seconds

  // Animate Mesh
  mesh.rotation.x = 2 * Math.PI * time * 0.1;
  mesh.rotation.y = 2 * Math.PI * time * 0.1;
  mesh.rotation.z = 2 * Math.PI * time * 0.1;

  // Rendering scene using camera
  renderer.render(scene, camera);
  // Run render on Next Frame
  requestAnimationFrame(render);
  1;
};

// Calling render first Time
requestAnimationFrame(render);
