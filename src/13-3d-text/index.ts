import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Debug GUI
 */
const gui = new dat.GUI();

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

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
axesHelper.visible = false;
scene.add(axesHelper);

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./static/textures/matcaps/1.png");

/**
 * Font Loader
 */
const fontLoader = new FontLoader();
fontLoader.load("./static/fonts/helvetiker_regular.typeface.json", (font) => {
  // Text Geometry Code Start
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // textGeometry.computeBoundingBox();
  // let bBox = textGeometry.boundingBox!;
  // textGeometry.translate(
  //   -(bBox.max.x - 0.02) * 0.5,
  //   -(bBox.max.y - 0.02) * 0.5,
  //   -(bBox.max.z - 0.03) * 0.5
  // );

  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcapTexture;
  // textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  let count = 1000;
  console.time("Donut");
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  // const donutMaterial = new THREE.MeshMatcapMaterial({
  //   matcap: matcapTexture,
  // });
  const donutMaterial = textMaterial;
  for (let i = 0; i < count; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    let scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
  console.timeEnd("Donut");

  // Text Geometry Code End
});

/**
 * Sizes
 */
const sizes = { width: 0, height: 0 };
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
const tick = () => {
  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
