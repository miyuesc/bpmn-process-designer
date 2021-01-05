const CompressionWebpackPlugin = require("compression-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: IS_PROD ? "././" : "/",
  productionSourceMap: false,
  configureWebpack: config => {
    // 生产环境相关配置
    if (IS_PROD) {
      //gzip压缩
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      );
    }
  }
};
