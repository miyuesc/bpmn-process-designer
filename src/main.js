import Vue from "vue";
import App from "./App.vue";
import store from "../packages/store";

// 加载基础ElementUI
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "../packages/theme/element-variables.scss";

import { vuePlugin } from "../packages/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);

import "../packages/theme/index.scss";

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
