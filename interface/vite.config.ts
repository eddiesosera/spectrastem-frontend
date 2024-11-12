import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    proxy: {
      "/api": {
        target: API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
});
