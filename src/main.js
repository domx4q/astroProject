import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import { globals } from "@/default.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.config.globalProperties.$globals = globals;

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

app.mount('#app');
