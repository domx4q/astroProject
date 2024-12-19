<template>
  <canvas ref="fluid-canvas" />
</template>

<script>
import WebGLFluid from "webgl-fluid";

export default {
  name: "ColorsView",
  mounted() {
    this.initFluid();
  },
  methods: {
    initFluid() {
      const canvas = document.querySelector("canvas");
      WebGLFluid(canvas, {
        IMMEDIATE: true, // Whether to trigger multiple random splats when initialized
        TRIGGER: "hover", // Can be change to 'click'
        SIM_RESOLUTION: 128*4,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.1,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 0,
        SPLAT_RADIUS: 0.3,
        SPLAT_FORCE: 6000,
        SHADING: false,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 7,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: false,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    },
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
