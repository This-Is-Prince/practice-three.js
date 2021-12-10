import * as THREE from "three";
import { SizesType } from "../World";

class Resizer {
  constructor(
    private camera: THREE.PerspectiveCamera,
    private renderer: THREE.WebGLRenderer
  ) {}
  resize(sizes: SizesType) {
    // Set the camera's aspect ratio
    this.camera.aspect = sizes.width / sizes.height;

    // Update the camera's frustum
    this.camera.updateProjectionMatrix();

    // Update the size of the renderer AND the canvas
    this.renderer.setSize(sizes.width, sizes.height);

    // Set the pixel ratio (for mobile devices)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

export { Resizer };
