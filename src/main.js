import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 加载基础ElementUI
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "element-ui/lib/theme-chalk/index.css";

import MyPD from "../package/index.js";
Vue.use(MyPD);
import "../package/theme/index.scss";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式

import clickoutside from "element-ui/src/utils/clickoutside";
Vue.directive("clickoutside", clickoutside);

new Vue({
  router: new VueRouter({
    mode: "history"
  }),
  render: h => h(App)
}).$mount("#app");
