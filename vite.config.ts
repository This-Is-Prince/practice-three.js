const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "1-Three.js_Bruno_Simon": resolve(__dirname, "src/1-Three.js_Bruno_Simon/index.html"),
        "1-Three.js_Bruno_Simon/03-basic-scene": resolve(__dirname, "src/1-Three.js_Bruno_Simon/03-basic-scene/index.html"),
        "1-Three.js_Bruno_Simon/05-transforms-objects": resolve(__dirname, "src/1-Three.js_Bruno_Simon/05-transforms-objects/index.html"),
        "1-Three.js_Bruno_Simon/06-animations": resolve(__dirname, "src/1-Three.js_Bruno_Simon/06-animations/index.html"),
        "1-Three.js_Bruno_Simon/07-cameras": resolve(__dirname, "src/1-Three.js_Bruno_Simon/07-cameras/index.html"),
        "1-Three.js_Bruno_Simon/08-fullscreen-and-resizing": resolve(__dirname, "src/1-Three.js_Bruno_Simon/08-fullscreen-and-resizing/index.html"),
        "1-Three.js_Bruno_Simon/09-geometries": resolve(__dirname, "src/1-Three.js_Bruno_Simon/09-geometries/index.html"),
        "1-Three.js_Bruno_Simon/10-debug-ui": resolve(__dirname, "src/1-Three.js_Bruno_Simon/10-debug-ui/index.html"),
        "1-Three.js_Bruno_Simon/11-textures": resolve(__dirname, "src/1-Three.js_Bruno_Simon/11-textures/index.html"),
        "1-Three.js_Bruno_Simon/12-material": resolve(__dirname, "src/1-Three.js_Bruno_Simon/12-material/index.html"),
        "1-Three.js_Bruno_Simon/13-3d-text": resolve(__dirname, "src/1-Three.js_Bruno_Simon/13-3d-text/index.html"),
        "1-Three.js_Bruno_Simon/14-lights": resolve(__dirname, "src/1-Three.js_Bruno_Simon/14-lights/index.html"),
        "1-Three.js_Bruno_Simon/15-shadows": resolve(__dirname, "src/1-Three.js_Bruno_Simon/15-shadows/index.html"),
        "1-Three.js_Bruno_Simon/16-haunted-house": resolve(__dirname, "src/1-Three.js_Bruno_Simon/16-haunted-house/index.html"),
        "1-Three.js_Bruno_Simon/17-particles": resolve(__dirname, "src/1-Three.js_Bruno_Simon/17-particles/index.html"),
        "1-Three.js_Bruno_Simon/18-galaxy-generator": resolve(__dirname, "src/1-Three.js_Bruno_Simon/18-galaxy-generator/index.html"),
        "1-Three.js_Bruno_Simon/19-ray-caster": resolve(__dirname, "src/1-Three.js_Bruno_Simon/19-ray-caster/index.html"),
        "1-Three.js_Bruno_Simon/20-physics": resolve(__dirname, "src/1-Three.js_Bruno_Simon/20-physics/index.html"),
        "1-Three.js_Bruno_Simon/21-import-models": resolve(__dirname, "src/1-Three.js_Bruno_Simon/21-import-models/index.html"),
        "1-Three.js_Bruno_Simon/22-custom-models-with-blender": resolve(__dirname, "src/1-Three.js_Bruno_Simon/22-custom-models-with-blender/index.html"),
        "1-Three.js_Bruno_Simon/23-realistic-render": resolve(__dirname, "src/1-Three.js_Bruno_Simon/23-realistic-render/index.html"),
        "1-Three.js_Bruno_Simon/24-shaders": resolve(__dirname, "src/1-Three.js_Bruno_Simon/24-shaders/index.html"),
        "1-Three.js_Bruno_Simon/25-shader-patterns": resolve(__dirname, "src/1-Three.js_Bruno_Simon/25-shader-patterns/index.html"),
        "1-Three.js_Bruno_Simon/26-raging-sea": resolve(__dirname, "src/1-Three.js_Bruno_Simon/26-raging-sea/index.html"),
        "1-Three.js_Bruno_Simon/27-animated-galaxy": resolve(__dirname, "src/1-Three.js_Bruno_Simon/27-animated-galaxy/index.html"),
        "1-Three.js_Bruno_Simon/28-modified-materials": resolve(__dirname, "src/1-Three.js_Bruno_Simon/28-modified-materials/index.html"),
        "1-Three.js_Bruno_Simon/29-post-processing": resolve(__dirname, "src/1-Three.js_Bruno_Simon/29-post-processing/index.html"),
        "1-Three.js_Bruno_Simon/30-performance-tips": resolve(__dirname, "src/1-Three.js_Bruno_Simon/30-performance-tips/index.html"),
      },
    },
  },
});