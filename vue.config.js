// const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/"
  // configureWebpack: config => {
  //   if (isProduction) {
  //     config.externals = {
  //       vue: "Vue",
  //       "vue-router": "VueRouter",
  //       "element-ui": "elementUI",
  //       "bpmn-js": "BpmnModeler"
  //     };
  //   }
  // }
};
