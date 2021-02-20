const TerserPlugin = require("terser-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === "production";

const cdn = {
  externals: {
    vue: "Vue",
    "element-ui": "ELEMENT"
  },
  css: [],
  js: ["https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js", "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/index.min.js"]
};

module.exports = {
  publicPath: IS_PROD ? "././" : "/", // 打包相对路径
  productionSourceMap: false,
  devServer: {
    port: 8100
  },
  chainWebpack: config => {
    // ============注入cdn start============
    config.plugin("html").tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (IS_PROD) args[0].cdn = cdn;
      return args;
    });
    // ============注入cdn start============
  },
  configureWebpack: config => {
    // 生产环境相关配置
    if (IS_PROD) {
      // cdn
      config.externals = cdn.externals;

      // 代码混淆
      config.plugins.push(new TerserPlugin());
    }
  }
};
