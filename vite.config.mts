import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    open: true,
    port: 5173
  },

  preview: {
    port: 5173
  },

  build: {
    chunkSizeWarningLimit: 1600,
  }
});
