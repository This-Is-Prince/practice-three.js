import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

/**
 * Font Loader
 */
let wheelPosition = 0,
  radius = 3,
  characters = "Hi My Name Is Prince Kumar",
  prevPosition: THREE.Vector3[] = [],
  size = 0.2,
  height = 0.2;

let characterMeshes: THREE.Mesh[] = [];

const fontLoader = new FontLoader();
fontLoader.load(
  "../../../static/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    characters.split("").forEach((char) => {
      const geometry = new TextGeometry(char, {
        font,
        size,
        height,
        curveSegments: 12,
      });

      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      // Position
      mesh.position.x = (Math.random() - 0.5) * radius;
      mesh.position.y = (Math.random() - 0.5) * radius;
      mesh.position.z = (Math.random() - 0.5) * radius;
      // Rotation
      mesh.rotation.x = Math.PI * 2 * Math.random();
      mesh.rotation.y = Math.PI * 2 * Math.random();
      mesh.rotation.z = Math.PI * 2 * Math.random();
      prevPosition.push(mesh.position.clone());
      characterMeshes.push(mesh);
      scene.add(mesh);
    });
  }
);

/**
 * Window Events
 */
document.addEventListener(
  "wheel",
  (e) => {
    let duration = 1;
    if (e.deltaY > 0) {
      wheelPosition++;
      const halfLen = characterMeshes.length / 2;
      characterMeshes.forEach((characterMesh, index) => {
        gsap.to(characterMesh.position, {
          x:
            index < halfLen
              ? (index - halfLen / 2) * (size + 0.1)
              : (index - halfLen * 1.5) * (size + 0.1),
          y: index < halfLen ? 0.25 : -0.25,
          z: 0,
          duration,
        });
        gsap.to(characterMesh.rotation, {
          x: 0,
          y: (halfLen - index) / halfLen,
          z: 0,
          duration,
        });
      });
    } else {
      wheelPosition--;
      characterMeshes.forEach((characterMesh) => {
        gsap.to(characterMesh.position, {
          x: (Math.random() - 0.5) * radius,
          y: (Math.random() - 0.5) * radius,
          z: (Math.random() - 0.5) * radius,
          duration,
        });
        gsap.to(characterMesh.rotation, {
          x: Math.PI * 2 * Math.random(),
          y: Math.PI * 2 * Math.random(),
          z: Math.PI * 2 * Math.random(),
          duration,
        });
      });
    }
    return false;
  },
  true
);

window.addEventListener("resize", () => {
  // Update sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  updateRenderer();
});

/**
 * GUI
 */
const gui = new dat.GUI();

/**
 * Scene
 */
const scene = new THREE.Scene();

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
controls.enabled = false;
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
 * Animations
 */
// Clock
const clock = new THREE.Clock();

// Tick
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  // Renderer
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
};
tick();
