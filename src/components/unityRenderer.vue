<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";
import UnityWebgl from "unity-webgl";

const canvasRef = ref(null);
let unityComponent = null;

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
  useModulePrefix: {
    type: Boolean,
    default: false,
  },
});
const module = props.module;

onMounted(() => {
  if (!unityComponent) {
    const publicPath = process.env.BASE_URL;
    let prefix = "WebGL";
    if (props.useModulePrefix) {
      prefix = module;
    }
    unityComponent = new UnityWebgl(canvasRef.value, {
      loaderUrl: `${publicPath}unity/${module}/Build/${prefix}.loader.js`,
      dataUrl: `${publicPath}unity/${module}/Build/${prefix}.data`,
      frameworkUrl: `${publicPath}unity/${module}/Build/${prefix}.framework.js`,
      codeUrl: `${publicPath}unity/${module}/Build/${prefix}.wasm`,
    });
  }
});
onBeforeUnmount(() => {
  if (unityComponent) {
    unityComponent.unload();
    unityComponent = null;
  }
});
</script>

<template>
  <canvas id="canvas" ref="canvasRef" />
</template>

<style>
#canvas {
  height: 100%;
  width: auto;
  max-width: 100%;
  /*aspect-ratio: 1.3/1;*/
}
</style>
