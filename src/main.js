import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 加载基础ElementUI
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "element-ui/lib/theme-chalk/index.css";

new Vue({
    router: new VueRouter({
        mode: "history"
    }),
    render: h => h(App)
}).$mount("#app");
