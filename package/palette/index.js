import MyPropertiesPalette from "./ProcessPalette.vue";

MyPropertiesPalette.install = function(Vue) {
  Vue.component(MyPropertiesPalette.name, MyPropertiesPalette);
};

export default MyPropertiesPalette;
