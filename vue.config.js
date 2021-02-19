const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: IS_PROD ? "././" : "/",
  productionSourceMap: false,
  devServer: {
    port: 8100
  },
  configureWebpack: config => {
    // 生产环境相关配置
    if (IS_PROD) {
      config.externals = {
        vue: "Vue",
        "element-ui": "ELEMENT"
      };

      config.plugins.push(new TerserPlugin());
    }
  }
};
