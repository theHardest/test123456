const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: false,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      },
    },
  },
});

