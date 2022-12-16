<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import UnityWebgl from 'unity-webgl';

const canvasRef = ref(null);
let unityComponent = null;

onMounted(() => {
  if (!unityComponent) {
    unityComponent = new UnityWebgl(canvasRef.value, {
      loaderUrl: "/unity/Build/WebGL.loader.js",
      dataUrl: "/unity/Build/WebGL.data",
      frameworkUrl: "/unity/Build/WebGL.framework.js",
      codeUrl: "/unity/Build/WebGL.wasm",
    });
  }
});
onBeforeUnmount(() => {
  if (unityComponent) {
    unityComponent.destroy();
    unityComponent = null;
  }
});
</script>

<template>
  <div>
    <canvas id="canvas" ref="canvasRef"/>
  </div>
</template>

<style>
#canvas {
  height: 100%;
  width: auto;
  max-width: 100%;
  /*aspect-ratio: 1.3/1;*/
}
div {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: black;
}
</style>
