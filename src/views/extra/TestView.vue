<template>
  <div id="main">
    <ThemeSwitch only-logic/>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";

export default {
  name: "TestView",
  components: {ThemeSwitch},
  emits: [],
  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>

<style scoped>
#main {
  background-color: #fff;
  width: 100%;
  height: 100vh
}
</style>
