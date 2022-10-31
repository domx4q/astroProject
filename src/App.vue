<template>
<!--  <nav>-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--  </nav>-->
  <router-view/>
</template>
<script>
import { ClientJS } from "clientjs";
export default {
  name: "app",
  data() {
    return {
      client: new ClientJS(),
    };
  },
  mounted() {
    this.getClientInformation();
    this.getTheme();
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
    getTheme() {
      let theme;
      const url_Params = new URLSearchParams(window.location.search);
      if (url_Params.has("theme")) {
        theme = url_Params.get("theme");
      } else {
        theme = "auto";
      }
      if (theme === "auto") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          theme = "dark";
        } else {
          theme = "light";
        }
      }
      // add attribute to html element
      document.documentElement.setAttribute("data-theme", theme);
      this.$store.state.theme = theme;
    },
  },
}
</script>
<style>
#app {
  --bg-main-color: #fff;
  --bg-secondary-color: #d97221;

  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: "Kanit", "Impira", "Montserrat Alternates", "Roboto", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1b2831;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  background: linear-gradient(144deg, var(--bg-main-color), var(--bg-main-color), var(--bg-secondary-color)) no-repeat;
  background-size: 600% 600%;
  --animation-time: 100s;

  -webkit-animation: backgroundAnimation var(--animation-time) ease infinite;
  -moz-animation: backgroundAnimation var(--animation-time) ease infinite;
  animation: backgroundAnimation var(--animation-time) ease infinite;
}
html[data-theme="dark"] #app {
  --bg-main-color: #000000;
  --bg-secondary-color: #0036bd;

  color: #f8f8f8;

  /*region FormKit*/
  --fk-color-help: #dedede;
  --fk-color-input: #e7e7e7;
  /*endregion*/
}

@-webkit-keyframes backgroundAnimation {
  0%{background-position:0% 58%}
  50%{background-position:100% 43%}
  100%{background-position:0% 58%}
}
@-moz-keyframes backgroundAnimation {
  0%{background-position:0% 58%}
  50%{background-position:100% 43%}
  100%{background-position:0% 58%}
}
@keyframes backgroundAnimation {
  0%{background-position:0% 58%}
  50%{background-position:100% 43%}
  100%{background-position:0% 58%}
}
html[data-theme="dark"] option {
  color: #e7e7e7;
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
