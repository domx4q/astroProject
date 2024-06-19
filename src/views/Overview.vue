<template>
  <ThemeSwitch only-logic/>
  <div id="background">
    <div id="main">
      <div v-for="route in routes" :key="route.name" class="app-container">
        <h2>{{ route.name }}</h2>
        <div class="app-wrapper">
          <iframe
              :ref="'i-'+ route.routerName"
              :src="route.path + '?no-nav&embed=true'"
              allow="fullscreen"
              frameborder="0"
              sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
        <div class="action-bar">
          <router-link :to="route.path" title="Zur Seite" class="router-link clean-button">
            <icon icon="bx:link"/>
          </router-link>
          <button class="clean-button qr-button" @click="openPopout(route.routerName)" title="QR-Code">
            <icon icon="pepicons:qr-code"/>
          </button>
          <button class="clean-button" @click="fullscreen(route.routerName)" title="Vollbild">
            <icon icon="bx:fullscreen"/>
          </button>
          <QRCode :change="popoutCounts[route.routerName]" :src="qrMappping[route.routerName]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/themeSwitch.vue";
import routerNavigation from "@/components/routerNavigation.vue";
import QRCode from "@/components/QRCode.vue";


export default {
  name: "Overview",
  components: {ThemeSwitch, QRCode},
  data() {
    return {
      routes: routerNavigation.data().routes,
      qrMappping: { // we cannot use mixins because webpack do not notice the usage here, so we need to copy the data
        "home": require("@/assets/qr-codes/main.png"),
        "stars": require("@/assets/qr-codes/stars.png"),
        "sun": require("@/assets/qr-codes/sun.png"),
      },
      popoutCounts: {
        "home": 0,
        "stars": 0,
        "sun": 0,
      },
    };
  },
  methods: {
    openPopout(name) {
      // a bit weird code because we need an update
      const old = this.popoutCounts[name];
      while (this.popoutCounts[name] === old) {
        this.popoutCounts[name] = Math.random().toString();
      }
    },
    fullscreen(name) {
      const iframe = this.$refs[`i-${name}`][0];
      iframe.requestFullscreen();
    },
  }
};
</script>

<style scoped>
#background {
  background-color: #717171;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: "Roboto", sans-serif;
}

#main {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px
}

.app-container {
  flex: 1 1 calc(33.333% - 20px);
  position: relative;
}

h2 {
  margin-bottom: 10px;
  margin-left: 10px;
}

.app-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  aspect-ratio: 1/1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.action-bar {
  position: absolute;
  bottom: -30px;
  right: 0;
  padding: 0 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  justify-content: right;
  gap: 10px;
}

.clean-button {
  background-color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  aspect-ratio: 1/1;
  width: 25px
}
</style>
