import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { plugin, defaultConfig } from "@formkit/vue";
import { createProPlugin, inputs } from "@formkit/pro";
import { createAutoAnimatePlugin } from "@formkit/addons";
import { de } from "@formkit/i18n";
import "@formkit/pro/genesis";

import "@/assets/styles/formkit.css"; // own modified genesis theme (mostly to add dark mode)

import { Icon } from "@iconify/vue";
import axios from "axios";

const pro = createProPlugin("fk-452f513989", inputs);
const formkitConfig = defaultConfig({
  theme: "genesis",
  locales: { de },
  locale: "de",
  plugins: [
    pro,
    createAutoAnimatePlugin({
      autoAnimate: true,
    }),
  ],
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(autoAnimatePlugin);
app.use(plugin, formkitConfig);
app.component("Icon", Icon);

function prepareHotReload() {
  console.clear();
  console.log("Hot reloading...");
  // trigger an Event
  window.dispatchEvent(new Event("hotreload"));
}

if (module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler((status) => {
    if (status === "prepare") prepareHotReload();
  });
}

if (process.env.IS_ELECTRON) {
  import("../package.json").then((pkg) => {
    const currentVersion = pkg.version;

    axios
      .get("https://api.github.com/repos/domx4q/astroProject/releases/latest")
      .then((r) => {
        const tag = r.data.tag_name;
        if (tag !== currentVersion) {
          let version = tag;
          if (tag.startsWith("v")) {
            version = tag.substring(1);
          }
          const [major, minor, patch] = version.split(".");
          const [currentMajor, currentMinor, currentPatch] =
            currentVersion.split(".");

          if (major > currentMajor) {
            router.push({ name: "update", params: { version: tag } });
          } else if (major === currentMajor && minor > currentMinor) {
            router.push({ name: "update", params: { version: tag } });
          } else if (
            major === currentMajor &&
            minor === currentMinor &&
            patch > currentPatch
          ) {
            router.push({ name: "update", params: { version: tag } });
          } else {
            console.log("No update available");
          }
        }
      })
      .catch((e) => {});
  });
}

app.mount("#app");
