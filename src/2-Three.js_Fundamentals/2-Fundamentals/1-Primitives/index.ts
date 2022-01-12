import * as THREE from "three";
import * as dat from "dat.gui";
import "../style.css";

/**
 * GUI
 */
const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/**
 * Sizes
 */
const sizes = { width: 0, height: 0 };
const updateSizes = () => {
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
};
updateSizes();
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Events
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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const updateRenderer = () => {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const width = (sizes.width * pixelRatio) | 0;
  const height = (sizes.height * pixelRatio) | 0;
  renderer.setSize(width, height, false);
};
updateRenderer();

/**
 * Camera
 */
const fov = 75;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio(), near, far);
camera.position.z = 20;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 5);

scene.add(directionalLight);
scene.add(ambientLight);
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
gui.add(material, "wireframe");

/**
 * Geometry
 */
let geometry: THREE.BufferGeometry;
let isMesh = true;
// 1.Box
{
  const width = 8;
  const height = 8;
  const depth = 8;
  const widthSegments = 4;
  const heightSegments = 4;
  const depthSegments = 4;
  geometry = new THREE.BoxGeometry(
    width,
    height,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
  );
}
// Circle
{
  const radius = 7;
  const segments = 24;
  geometry = new THREE.CircleGeometry(radius, segments);
  const thetaStart = 0;
  const thetaLength = Math.PI;
  geometry = new THREE.CircleGeometry(
    radius,
    segments,
    thetaStart,
    thetaLength
  );
}
// Cone
{
  const radius = 6;
  const height = 8;
  const radialSegments = 16;
  geometry = new THREE.ConeGeometry(radius, height, radialSegments);
  const heightSegments = 2;
  const openEnded = true;
  const thetaStart = 0;
  const thetaLength = Math.PI;
  geometry = new THREE.ConeGeometry(
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );
}
// Cylinder
{
  const radiusTop = 4;
  const radiusBottom = 4;
  const height = 8;
  const radialSegments = 12;
  geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments
  );
  const heightSegments = 2;
  const openEnded = true;
  const thetaStart = 0;
  const thetaLength = Math.PI;

  geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );
}
// Dodecahedron
{
  const radius = 7;
  const detail = 2;
  geometry = new THREE.DodecahedronGeometry(radius, detail);
}
// ExtrudeGeometry
// 1.
{
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSegments: 2,
    bevelSize: 2,
  });
}
// 2.
// {
//   const outline = new THREE.Shape(
//     [
//       [-2, -0.1],
//       [2, -0.1],
//       [2, 0.6],
//       [1.6, 0.6],
//       [1.6, 0.1],
//       [-2, 0.1],
//     ].map((p) => new THREE.Vector2(...p))
//   );

//   const x = -2.5;
//   const y = -5;
//   const shape = new THREE.CurvePath();
//   const points = [
//     [x + 2.5, y + 2.5],
//     [x + 2.5, y + 2.5],
//     [x + 2, y],
//     [x, y],
//     [x - 3, y],
//     [x - 3, y + 3.5],
//     [x - 3, y + 3.5],
//     [x - 3, y + 5.5],
//     [x - 1.5, y + 7.7],
//     [x + 2.5, y + 9.5],
//     [x + 6, y + 7.7],
//     [x + 8, y + 4.5],
//     [x + 8, y + 3.5],
//     [x + 8, y + 3.5],
//     [x + 8, y],
//     [x + 5, y],
//     [x + 3.5, y],
//     [x + 2.5, y + 2.5],
//     [x + 2.5, y + 2.5],
//   ].map((p) => new THREE.Vector3(...p, 0));

//   for (let i = 0; i < points.length; i += 3) {
//     const { 0: v0, 1: v1, 2: v2, 3: v3 } = points.slice(i, i + 4);
//     shape.add(new THREE.CubicBezierCurve3(v0, v1, v2, v3));
//   }
//   geometry = new THREE.ExtrudeGeometry(outline, {
//     steps: 100,
//     bevelEnabled: false,
//     extrudePath: shape,
//   });
// }

// IcosahedronGeometry
{
  const radius = 7;
  const detail = 2;
  geometry = new THREE.IcosahedronGeometry(radius, detail);
}

// Edges Geometry
{
  const size = 8;
  const widthSegments = 2;
  const heightSegments = 2;
  const depthSegments = 2;
  const boxGeometry = new THREE.BoxGeometry(
    size,
    size,
    size,
    widthSegments,
    heightSegments,
    depthSegments
  );
  const edges = new THREE.EdgesGeometry(boxGeometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  scene.add(line);
  isMesh = false;
}

/**
 * Mesh
 */
const mesh = new THREE.Mesh(geometry, material);
if (isMesh) {
  scene.add(mesh);
}

/**
 * Animate
 */
const render = (time: number) => {
  // Time in milliseconds
  time *= 0.001; //convert time to seconds

  // Animate Mesh
  if (isMesh) {
    mesh.rotation.x = 2 * Math.PI * time * 0.1;
    mesh.rotation.y = 2 * Math.PI * time * 0.1;
    mesh.rotation.z = 2 * Math.PI * time * 0.1;
  }

  // Rendering scene using camera
  renderer.render(scene, camera);
  // Run render on Next Frame
  requestAnimationFrame(render);
  1;
};

// Calling render first Time
requestAnimationFrame(render);
