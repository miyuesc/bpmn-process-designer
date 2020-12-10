const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      config.externals = {
        vue: "Vue",
        "vue-router": "VueRouter",
        "element-ui": "elementUI",
        "bpmn-js": "BpmnModeler"
      };
    }
  }
};
