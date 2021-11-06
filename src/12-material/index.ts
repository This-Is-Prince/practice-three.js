import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "./static/textures/environmentMaps/0/px.jpg",
  "./static/textures/environmentMaps/0/nx.jpg",
  "./static/textures/environmentMaps/0/py.jpg",
  "./static/textures/environmentMaps/0/ny.jpg",
  "./static/textures/environmentMaps/0/pz.jpg",
  "./static/textures/environmentMaps/0/nz.jpg",
]);

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const doorNormalTexture = textureLoader.load(
  "./static/textures/door/normal.jpg"
);
const doorHeightTexture = textureLoader.load(
  "./static/textures/door/height.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "./static/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "./static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./static/textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./static/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./static/textures/gradients/3.jpg");

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

/**
 * Materials
 */

// 1.MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0x00ff00);
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// 2.MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.flatShading=true;

// 3.MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// 4.MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

// 5.MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();
// material.color = new THREE.Color(0xff00ff);

// 6.MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// 7.MeshToonMaterial
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// 8.MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// EnvironmentMaps
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
});
material.envMap = environmentMapTexture;

// Scene
scene.background = environmentMapTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
gui.add(material, "envMapIntensity").min(0).max(1).step(0.0001);

/**
 * Objects
 */
// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);
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
camera.position.set(1, 1, 2);
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
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
