const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "././" : "/",
  pages: {
    index: {
      entry: "playground/main.js",
      template: "public/index.html"
    }
  },
  transpileDependencies: false,
  runtimeCompiler: true,
  parallel: true,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@packages": resolve("packages"),
        "@utils": resolve("utils")
      }
    }
  },
  chainWebpack(config) {
    config.module.rule("svg").exclude.add(resolve("packages/bpmn-icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("packages/bpmn-icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "[name]"
      })
      .end();
  }
});
