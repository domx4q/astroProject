<template>
<!--  <nav>-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--  </nav>-->
  <router-view/>
</template>
<script>
import { ClientJS } from 'clientjs';
export default {
  name: 'app',
  data() {
    return {
      client: new ClientJS(),
    };
  },
  mounted() {
    this.getClientInformation();
  },
  computed: {},
  methods: {
    getClientInformation() {
      const client = new ClientJS();
      const out = {
        os: client.getOS(),
        "os-version": client.getOSVersion(),
        // "fingerprint": client.getFingerprint(),
        "user-agent": client.getUserAgent(),
        browser: client.getBrowser(),
        "browser-version": client.getBrowserVersion(),
        engine: client.getEngine(),
        "engine-version": client.getEngineVersion(),
        cpu: client.getCPU(),
        isMobile: client.isMobile(),
        isAndroid: client.isMobileAndroid(),
        isIOS: client.isMobileIOS(),
        screen: client.getScreenPrint(),
        // "fonts": client.getFonts(),
        isLocaleStorage: client.isLocalStorage(),
        isSessionStorage: client.isSessionStorage(),
        isCookie: client.isCookie(),
        "time-zone": client.getTimeZone(),
        language: client.getLanguage(),
        "sys-language": client.getSystemLanguage(),
      };
      this.$store.state.client = out;
    },
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  /*background-color: hsl(226, 48%, 17%);*/
}
html {
  height: 100%; /*normally i would prefer 100vh, but then on mobile when the address bar is visible it will cut off*/
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

/*nav {*/
/*  padding: 30px;*/
/*}*/

/*nav a {*/
/*  font-weight: bold;*/
/*  color: #2c3e50;*/
/*}*/

/*nav a.router-link-exact-active {*/
/*  color: #42b983;*/
/*}*/
</style>
