import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const environmentMap = cubeTextureLoader.load([
  "./static/textures/environmentMaps/0/px.jpg",
  "./static/textures/environmentMaps/0/nx.jpg",
  "./static/textures/environmentMaps/0/py.jpg",
  "./static/textures/environmentMaps/0/ny.jpg",
  "./static/textures/environmentMaps/0/pz.jpg",
  "./static/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load(
  "./static/models/LeePerrySmith/color.jpg"
);
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load(
  "./static/models/LeePerrySmith/normal.jpg"
);

// Material
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
});

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

const customUniforms = {
  uTime: { value: 0 },
};

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle){
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
      }
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
      #include <begin_vertex>

      objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
        #include <begin_vertex>

        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);

        transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
      #include <common>

      uniform float uTime;

      mat2 get2dRotateMatrix(float _angle){
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
      }
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
        #include <begin_vertex>

        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);

        transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

gltfLoader.load("./static/models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
  // Model
  const mesh = gltf.scene.children[0];
  mesh.rotation.y = Math.PI * 0.5;
  if (mesh instanceof THREE.Mesh) {
    mesh.material = material;
    mesh.customDepthMaterial = depthMaterial;
  }
  scene.add(mesh);

  // Update materials
  updateAllMaterials();
});

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
);
plane.rotation.y = Math.PI;
plane.position.set(0, -5, 5);
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(4, 1, -4);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Tick
 */
const clock = new THREE.Clock();
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Materials
  customUniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
