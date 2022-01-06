const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === "production";

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CDN = {
  externals: {
    vue: "Vue",
    "element-ui": "ELEMENT",
    x2js: "X2JS",
    "bpmn-js/lib/Modeler": "BpmnJS"
  },
  css: [],
  js: [
    "https://unpkg.com/bpmn-js@8.8.3/dist/bpmn-modeler.production.min.js",
    "https://unpkg.com/x2js@3.4.2/dist/x2js.min.js",
    "https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js",
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/index.min.js"
  ]
};

module.exports = {
  publicPath: IS_PROD ? "././" : "/", // 打包相对路径
  productionSourceMap: false,
  devServer: {
    port: 8100,
    proxy: {
      "^/user/": {
        target: "http://localhost:3000/user",
        changeOrigin: true, //是否允许跨域
        pathRewrite: {
          "^/user": "/"
        }
      }
    }
  },
  chainWebpack: config => {
    // ============注入cdn start============
    config.plugin("html").tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (IS_PROD) args[0].cdn = CDN;
      return args;
    });
    // ============注入cdn start============

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config => config.devtool("source-map"));

    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          // elementUI: {
          //   name: "chunk-element-ui", // split elementUI into a single package
          //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          // },
          commons: {
            name: "chunk-components",
            test: resolve("package"), // can customize your rules
            minChunks: 1, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  },
  configureWebpack: config => {
    // 生产环境相关配置
    if (IS_PROD) {
      // cdn
      config.externals = CDN.externals;

      // 代码混淆
      config.plugins.push(new TerserPlugin());
      config.plugins.push(
        new CompressionPlugin({
          algorithm: "gzip", // 使用gzip压缩
          test: /\.js$|\.html$|\.css$/, // 匹配文件名
          // filename: "[path].gz", // 压缩后的文件名(保持原文件名，后缀加.gz)
          minRatio: 1, // 压缩率小于1才会压缩
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
        })
      );
    }
  }
};
