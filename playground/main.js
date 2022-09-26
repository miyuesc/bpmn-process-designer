import Vue from "vue";
import App from "./App.vue";
import store from "../packages/store";

import "@packages/bpmn-icons";

// 加载基础ElementUI
import ElementUI from "element-ui";
Vue.use(ElementUI, { size: "small" });
import "../packages/theme/element-variables.scss";

import { vuePlugin } from "../packages/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);

import Common from "@packages/components/common";
Vue.use(Common);

import ResetPopover from "../utils/resetPopover";
Vue.directive("r-popover", ResetPopover);

import "../packages/theme/index.scss";

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
