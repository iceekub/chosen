import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "",
  server: {
    port: 5274,
    proxy: {
      "/api": {
        target: "http://localhost:5261",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
