import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true });
const parameters = {
  fogColor: 0x83c4d9,
  groundColor: 0xf2d395,
  oddColor: 0xe5ff65,
  evenColor: 0xaa00ff,
};
gui.addColor(parameters, "fogColor").onChange(() => {
  scene.background = new THREE.Color(parameters.fogColor);
  scene.fog!.color.set(parameters.fogColor);
});
gui.addColor(parameters, "groundColor").onChange(() => {
  ground.material.color.set(parameters.groundColor);
});

gui.addColor(parameters, "oddColor").onChange(() => {
  oddMaterial.color.set(parameters.oddColor);
});
gui.addColor(parameters, "evenColor").onChange(() => {
  evenMaterial.color.set(parameters.evenColor);
});

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(parameters.fogColor);
scene.fog = new THREE.Fog(parameters.fogColor, 1, 15);

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.left = -3;
directionalLight.shadow.camera.right = 3;
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.bottom = -3;
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("./static/fonts/helvetiker_regular.typeface.json", (font) => {
  // Size Of Text
  let size = 0.5;
  let height = 0.4;
  // Material
  const textMaterial = new THREE.MeshNormalMaterial();

  /**
   * CSS
   */
  // CSS Geometry
  const cssGeometry = new TextGeometry("CSS", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  cssGeometry.center();
  cssGeometry.translate(0, size / 2, 0);
  // CSS Mesh
  const cssMesh = new THREE.Mesh(cssGeometry, oddMaterial);
  cssMesh.position.x = -1;
  cssMesh.rotateY(Math.PI * 0.1);
  cssMesh.castShadow = true;

  /**
   * HTML
   */
  // HTML Geometry
  const htmlGeometry = new TextGeometry("HTML", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  htmlGeometry.center();
  htmlGeometry.translate(0, size / 2, 0);
  // HTML Mesh
  const htmlMesh = new THREE.Mesh(htmlGeometry, oddMaterial);
  htmlMesh.position.x = 1;
  htmlMesh.rotateY(-Math.PI * 0.1);
  htmlMesh.castShadow = true;

  /**
   * Typescript
   */
  // Typescript Geometry
  const typescriptGeometry = new TextGeometry("TYPESCRIPT", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  typescriptGeometry.center();
  typescriptGeometry.translate(0, size / 2, 0);
  // Typescript Mesh
  const typescriptMesh = new THREE.Mesh(typescriptGeometry, evenMaterial);
  typescriptMesh.position.set(0, size, -0.1);
  typescriptMesh.castShadow = true;

  /**
   * THREE
   */
  // THREE Geometry
  const three_js_Geometry = new TextGeometry("THREE-JS", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  three_js_Geometry.center();
  three_js_Geometry.translate(0, size / 2, 0);
  // THREE Mesh
  const three_js_Mesh = new THREE.Mesh(three_js_Geometry, oddMaterial);
  three_js_Mesh.position.y = size * 2;
  three_js_Mesh.rotateY(Math.PI * 0.1);

  three_js_Mesh.castShadow = true;

  /**
   * React
   */
  // React Geometry
  const reactGeometry = new TextGeometry("REACT", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  reactGeometry.center();
  reactGeometry.translate(0, size / 2, 0);
  // React Mesh
  const reactMesh = new THREE.Mesh(reactGeometry, evenMaterial);
  reactMesh.position.y = size * 3;
  reactMesh.rotateY(-Math.PI * 0.1);
  reactMesh.castShadow = true;

  /**
   * Blender
   */
  // Blender Geometry
  const blenderGeometry = new TextGeometry("BLENDER", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  blenderGeometry.center();
  blenderGeometry.translate(0, size / 2, 0);
  // Blender Mesh
  const blenderMesh = new THREE.Mesh(blenderGeometry, oddMaterial);
  blenderMesh.position.y = size * 4;
  blenderMesh.rotateY(Math.PI * 0.1);
  blenderMesh.castShadow = true;

  /**
   * NODE.JS
   */
  // NODE.JS Geometry
  const node_js_Geometry = new TextGeometry("NODE-JS", {
    font,
    size,
    height,
    curveSegments: 12,
  });
  node_js_Geometry.center();
  node_js_Geometry.translate(0, size / 2, 0);
  // NODE.JS Mesh
  const node_js_Mesh = new THREE.Mesh(node_js_Geometry, evenMaterial);
  node_js_Mesh.position.y = size * 5;
  node_js_Mesh.rotateY(-Math.PI * 0.1);
  node_js_Mesh.castShadow = true;

  scene.add(
    cssMesh,
    htmlMesh,
    typescriptMesh,
    three_js_Mesh,
    reactMesh,
    blenderMesh,
    node_js_Mesh
  );
});

/**
 * Materials
 */
const groundMaterial = new THREE.MeshStandardMaterial({
  color: parameters.groundColor,
});
const evenMaterial = new THREE.MeshStandardMaterial({
  color: parameters.evenColor,
});

// Debug
gui
  .add(evenMaterial, "metalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("evenMetalness");
gui
  .add(evenMaterial, "roughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("evenRoughness");

const oddMaterial = new THREE.MeshStandardMaterial({
  color: parameters.oddColor,
});

// Debug
gui
  .add(oddMaterial, "metalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("oddMetalness");
gui
  .add(oddMaterial, "roughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("oddRoughness");

/**
 * Geometry
 */
const groundGeometry = new THREE.PlaneGeometry(10, 10);

/**
 * Objects
 */
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.rotateX(-Math.PI / 2);
scene.add(ground);

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
const aspectRatio = () => {
  return sizes.width / sizes.height;
};
updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(0, 2, 5);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
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
renderer.shadowMap.type = THREE.PCFShadowMap;

/**
 * Animations
 */
const clock = new THREE.Clock();
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  // Update Camera
  camera.position.y = Math.abs(Math.sin(elapsedTime - 2.5) * 2 + 3);
  camera.position.x = Math.sin(elapsedTime) * 6;
  camera.position.z = Math.cos(elapsedTime) * 6;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
