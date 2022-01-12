import * as THREE from "three";

// Canvas
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio());
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
