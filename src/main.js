import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import router from "./router"
import store from "./store"

import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { plugin, defaultConfig } from "@formkit/vue";
import { de } from "@formkit/i18n";
import "@formkit/themes/genesis";

import { Icon } from "@iconify/vue";

const formkitConfig = defaultConfig({
    theme: "genesis",
    locales: { de },
    locale: "de",
})


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
