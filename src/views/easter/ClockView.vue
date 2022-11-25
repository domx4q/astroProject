<template>
  <canvas v-if="mode==='fancy'" ref="fluid-canvas"></canvas>
  <div class="clockHolder" :class="mode">
    <div class="clock">
      {{ timeString }}
    </div>
  </div>
</template>

<script>
import WebGLFluid from 'webgl-fluid';

export default {
  name: "ClockView",
  data() {
    return {
      time: new Date(),
      mode: "normal",

      alreadyMounted: false,
    }
  },
  computed: {
    timeString() {
      return this.time.toLocaleTimeString()
    }
  },
  created() {
    const query = this.$route.query;
    // check if f is in query
    if ("f" in query) {
      console.log("fancy mode");
      this.mode = "fancy";
    } else {
      this.mode = "normal";
    }
  },
  mounted() {
    this.alreadyMounted = true;
    setInterval(() => {
      this.time = new Date()
    }, 100) // don't use 1000, because then the clock will only update every second which can skip a second

    if (this.mode === "fancy") {
      this.initFluid();
    }
  },
  methods: {
    changeMode() {
      if (this.mode === "normal") {
        this.mode = "fancy"
      } else if (this.mode === "fancy") {
        this.mode = "normal"
      }
    },
    initFluid() {
      const canvas = document.querySelector('canvas');
      WebGLFluid(canvas, {
        IMMEDIATE: true, // Whether to trigger multiple random splats when initialized
        TRIGGER: 'click', // Can be change to 'click'
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    }
  },
}
</script>

<style scoped>
.clockHolder, canvas {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17em;
  font-weight: bold;
  height: 100%;
  width: 100%;
  z-index: 9900; /*to hide the badges*/

  /*fix the edges of the font on round spots*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.clockHolder.normal {
  color: white;
  background-color: black;
}
.clockHolder.fancy {
  background-color: transparent;
  pointer-events: none;
  color: white;
}
.clock {
  position: relative;
  z-index: 9905;
}
</style>
