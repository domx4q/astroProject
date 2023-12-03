<template>
  <div id="main">
    <UnityRenderer :module="module" />
  </div>
</template>

<script>
import UnityRenderer from "@/components/unityRenderer.vue";

export default {
  name: 'FullscreenUnityRenderer',
  components: {
    UnityRenderer
  },
  props: {
    module: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
#main {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: black;
}
</style>
