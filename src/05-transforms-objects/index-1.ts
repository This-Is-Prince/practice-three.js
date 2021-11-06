import * as THREE from "three";

// Canvas
const canvas = document.getElementById("myCanvas")!;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
 * Group
 */
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -2;
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube1, cube2, cube3);

/**
 * Objects
 */

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);

//------ Position ------
// mesh.position.y = 1;
// mesh.position.x = 1;
// mesh.position.z = 1;
// < Position Short Hand >
// mesh.position.set(0.7, -0.6, 1);

//------ Scale ------
// mesh.scale.set(2, 0.5, 0.5);

//------ Rotation ------
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// scene.add(mesh);

//------ Distances ------
// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)));
// mesh.position.normalize();
// console.log(mesh.position.length());

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// ----- Position -----
camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

//------ Distances ------
// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
