import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
    proxy: {
      "/api": "http://localhost:8080",
      "/ws": {
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true,
      },
      "/uploads": "http://localhost:8080",
    },
  },
  define: {
    global: "window",
  },
});