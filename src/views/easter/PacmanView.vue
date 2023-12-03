<template>
  <FullscreenUnityRenderer module="Pacman" />
</template>

<script>
import FullscreenUnityRenderer from "@/fullscreenUnityRenderer.vue";

export default {
  name: "PacmanView",
  components: {
    FullscreenUnityRenderer
  },
}
</script>
