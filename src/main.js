import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')

function prepareHotReload() {
    console.clear();
    console.log("Hot reloading...");
    // trigger an Event
    window.dispatchEvent(new Event("hotreload"));
}

if (module.hot) { // todo: fix webstorm pseudo errors
    module.hot.accept();

    module.hot.addStatusHandler((status) => {
        if (status === "prepare") prepareHotReload();
    });
}

// window.onbeforeunload = function () {
//     window.scrollTo(0, 0);
//     window.location.reload(true);
//     return true;
// }
