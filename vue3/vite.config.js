import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  switch (mode) {
    case "express":
      return {
        plugins: [vue()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
        build: {
          outDir: "../express/public",
        },
        base: "./",
      };
    case "laravel":
      return {
        plugins: [vue()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
        build: {
          outDir: "../laravel/public",
        },
        base: "./",
      };
    default:
      return {
        plugins: [vue()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
        server: {
          proxy: {
            "/api": {
              target: "http://localhost:9000",
              changeOrigin: true,
            },
          },
        },
      };
  }
});
