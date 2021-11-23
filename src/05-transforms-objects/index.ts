import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;
scene.add(group);

// Cube-1
const cube_1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// Cube-2
const cube_2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube_2.position.x = -2;

// Cube-3
const cube_3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube_3.position.x = 2;

group.add(cube_1, cube_2, cube_3);

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

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

// Canvas
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
