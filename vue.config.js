const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
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
  }
});
