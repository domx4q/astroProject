import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { plugin, defaultConfig } from "@formkit/vue";
import { createProPlugin, inputs } from "@formkit/pro";
import { createAutoAnimatePlugin, createFloatingLabelsPlugin, createAutoHeightTextareaPlugin } from "@formkit/addons";
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
    createFloatingLabelsPlugin({
      useAsDefault: false,
    }),
    createAutoHeightTextareaPlugin(),
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

app.mount("#app");
