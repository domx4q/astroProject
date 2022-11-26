<template>
  <router-view/>
  <ImportantPrompt v-if="updateExists">
    <template v-slot:title>
      <h2>Update verfügbar</h2>
    </template>
    <template v-slot:text>
      <p>Es ist eine neue Version von <b><u>{{appName}}</u></b> verfügbar. Bitte laden Sie die Seite neu, um die neue Version zu installieren.</p>
    </template>
    <template v-slot:buttons>
      <button @click="refreshApp">Neu laden</button>
    </template>
  </ImportantPrompt>
  <Transition enter-active-class="animate__animated animate__zoomInUp" leave-active-class="animate__animated animate__zoomOutDown" mode="in-out">
    <div id="previewBadge" class="badge" v-if="beta">Preview</div>
  </Transition>
</template>
<script>
import update from "@/mixins/update";
import defaults from "@/mixins/defaults";
import ImportantPrompt from "@/components/importantPrompt";

import { ClientJS } from "clientjs";
export default {
  name: "app",
  components: {
    ImportantPrompt
  },
  data() {
    return {
      client: new ClientJS(),
      appName: "Astro"
    };
  },
  mixins: [update, defaults],
  created() {
    // Read the data from the session storage to restore the state of the app (because when refreshing the page, the state is lost)
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState({ ...this.$store.state, ...JSON.parse(sessionStorage.getItem("store")) });
    }
    // Save the state of the app to the session storage before the page is unloaded
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
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
/*specific*/
#previewBadge {
  font-size: calc(0.8em * 3);
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(255, 77, 77, 0.4);
  padding: 0.2em;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
  border-radius: 0.6em;
  transform: translate(1.4em, 0.2em) rotate(-45deg);
  transform-origin: bottom left;
}
.badge, .overlay {
  z-index: 1000;
}

/*general*/
#app {
  --bg-main-color: #fff;
  --bg-secondary-color: #d97221;
  --text-color: #1b2831;

  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: "Kanit", "Impira", "Montserrat Alternates", "Roboto", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
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
  --text-color: #f8f8f8;

  --fk-color-help: #dedede;
  --fk-color-input: #e7e7e7;
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

hr {
  width: 100%;
}
/*make the scroll bars in chrome nicer*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track, ::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
::-webkit-scrollbar-button {
  display: none;
}
</style>
