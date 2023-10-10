<template>
  <div id="planet">
    <img id="image" :alt="altText" :src="imgSrc" :title="altText">
  </div>
</template>

<script>
export default {
  name: "StarDiscPlanet",
  components: {},
  emits: [],
  data() {
    return {};
  },
  props: {
    imgSrc: {
      type: String,
      default: "",
    },
    altText: {
      type: String,
      default: "Planet",
    },
  },
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style scoped>
#planet {
  --size: 50px;

  width: var(--size);
  height: var(--size);
  overflow: hidden;
}

#image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
