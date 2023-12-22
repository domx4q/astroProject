<template>
  <div id="main">
    <UnityRenderer :module="module" :use-module-prefix="useModulePrefix" />
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
    useModulePrefix: {
      type: Boolean,
      default: false,
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
