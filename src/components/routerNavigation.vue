<template>
  <div id="wrapper" v-if="show">
    <router-link
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      class="router-link"
    >
      {{ route.name }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: "routerNavigation",
  data() {
    return {
      routes: [
        { name: "Planetenapp", path: "/", routerName: "home" },
        { name: "Sternenkarte", path: "/stars", routerName: "stars" },
        { name: "Sonnenkuppel", path: "/sun", routerName: "sun" },
      ],
    };
  },
  computed: {
    show() {
      const query = new URLSearchParams(window.location.search);
      let easter = false;
      if (this.$route.name) { // this is necessary to avoid errors when the component is not mounted
        easter = this.$route.fullPath.includes("easter");
      }
      return !["not-found", "overview"].includes(this.$route.name) && !query.has("no-nav") && !easter;
    },
  },
}
</script>

<style scoped>
#wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  gap: 30px;
  font-size: 1.2em;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  color: hsl(216, 78%, 55%);
}
</style>
