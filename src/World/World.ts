import * as THREE from "three";
import "../style.css";
// Components
import { createCamera } from "./components/camera";
import { createCube } from "./components/cube";
import { createScene } from "./components/scene";

// Systems
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

interface SizesType {
  width: number;
  height: number;
}

class World {
  // Camera
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private resizer: Resizer;
  private sizes: SizesType;
  // 1. Create an instance of the World app
  constructor(container: HTMLDivElement) {
    this.render = this.render.bind(this);
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    container.append(this.renderer.domElement);

    const cube = createCube();
    this.scene.add(cube);

    this.resizer = new Resizer(this.camera, this.renderer);
    this.sizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };
    this.resizer.resize(this.sizes);

    const resizeEventHandler = () => {
      this.sizes.width = container.clientWidth;
      this.sizes.height = container.clientHeight;
      this.resizer.resize(this.sizes);
    };
    // Window Resize Events
    window.addEventListener("resize", resizeEventHandler);
  }
  // 2. Render the scene
  render() {
    // draw a single frame
    this.renderer.render(this.scene, this.camera);
    // Next Frame
    window.requestAnimationFrame(this.render);
  }
}

export { World, SizesType };
