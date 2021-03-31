import MyProcessDesigner from "./process-designer";
import MyProcessPenal from "./refactor";

const components = [MyProcessDesigner, MyProcessPenal];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.0.1",
  install,
  ...components
};
