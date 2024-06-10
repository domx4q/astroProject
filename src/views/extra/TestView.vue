<template>
  <div id="main">
    <h1>TestView</h1>
    <div id="sampleBox"></div>
    <ThemeSwitch only-logic />
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";

export default {
  name: "TestView",
  components: { ThemeSwitch },
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
  width: 100%;
  height: 100vh;
}
h1 {
  text-align: center;
  margin-top: 20px;
}
#sampleBox {
  width: 100px;
  height: 100px;
  background-color: #27e463;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
