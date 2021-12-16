import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Audio
 */
// fetch audio file
const audio = new Audio("./static/sounds/The_Rains_of_Castamere.m4a");

// AudioContext
const audioContext = new AudioContext();
const track = audioContext.createMediaElementSource(audio);

// PannerNode
const pannerNode = audioContext.createPanner();

track.connect(pannerNode).connect(audioContext.destination);
audio.addEventListener("ended", () => {
  isClicked = false;
});

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Window Events
 */
// Window resize
window.addEventListener("resize", () => {
  // Update sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  updateRenderer();
});

// Window Mouse Events
const mouse = new THREE.Vector2(-2, -2);
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width - 0.5) * 2;
  mouse.y = -((e.clientY / sizes.height - 0.5) * 2);
});

window.addEventListener(
  "click",
  () => {
    if (isMouseOver) {
      isClicked = !isClicked;
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      if (isClicked) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  },
  false
);

/**
 * GUI
 */
const gui = new dat.GUI();

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
scene.add(mesh);

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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * RayCasting
 */
const rayCasting = new THREE.Raycaster();

/**
 * Animations
 */
// prev mesh object
let isMouseOver = false;
let isClicked = false;

// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Cast A Ray
  rayCasting.setFromCamera(mouse, camera);

  const obj = rayCasting.intersectObjects([mesh]);
  if (obj.length > 0) {
    isMouseOver = true;
  } else {
    isMouseOver = false;
  }

  // Update Panner
  // OrientationX
  pannerNode.orientationX.value = camera.rotation.x;
  pannerNode.orientationY.value = camera.rotation.y;
  pannerNode.orientationZ.value = camera.rotation.z;
  // OrientationY
  pannerNode.positionX.value = camera.position.x;
  pannerNode.positionY.value = camera.position.y;
  pannerNode.positionZ.value = camera.position.z;

  // Update Controls
  controls.update();

  // Renderer
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
};
tick();
