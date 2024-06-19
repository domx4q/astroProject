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
      return !["not-found", "overview"].includes(this.$route.name) && !query.has("no-nav");
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

.router-link {
  text-decoration: none;
  color: hsl(216, 78%, 55%);
}
.router-link:hover {
  color: hsl(216, 78%, 45%);
}
.router-link:active {
  color: hsl(216, 78%, 35%);
}
.router-link:focus {
  color: hsl(216, 78%, 35%);
}
.router-link:visited {
  color: hsl(216, 78%, 55%);
}
</style>
