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
const source = audioContext.createMediaElementSource(audio);

// PannerNode
const pannerNode = audioContext.createPanner();

// AnalyserNode
const analyserNode = audioContext.createAnalyser();

source
  .connect(pannerNode)
  .connect(analyserNode)
  .connect(audioContext.destination);

audio.addEventListener("ended", () => {
  isClicked = false;
  cube.material.color.set(0xff0000);
});

analyserNode.fftSize = 256;
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

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
        cube.material.color.set(0xffff00);
        audio.play();
      } else {
        audio.pause();
        cube.material.color.set(0xff0000);
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
 * Lights
 */
// AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 9;

directionalLight.position.set(0, 3, 3);

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(ambientLight, directionalLight);

// Debug;
gui.add(ambientLight, "intensity").min(0).max(10).step(0.01);
gui.add(directionalLight, "intensity").min(0).max(10).step(0.01);

/**
 * Input Cube
 */
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 3;
cube.castShadow = true;

/**
 * Ground
 */
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotateX(-Math.PI * 0.5);
ground.position.y = -1;
ground.receiveShadow = true;

/**
 * Music Meshes
 */
const bars: THREE.Mesh[] = [];
const createBars = () => {
  const barWidth = 0.2;
  for (let i = 0; i < bufferLength; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(barWidth, 0, barWidth);
    mesh.position.x = i;
    mesh.castShadow = true;
    scene.add(mesh);
    bars.push(mesh);
  }
};
createBars();

// Adding Meshes into scene
scene.add(cube, ground);

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
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

// Debug
gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    Linear: THREE.LinearToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
  })
  .onChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
  });
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(1);

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

  const obj = rayCasting.intersectObjects([cube]);
  analyserNode.getByteFrequencyData(dataArray);
  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i] * 0.05;
    bars[i].scale.y = barHeight;
  }
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
