import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    host: "localhost",
    strictPort: true,
  },

  build: {
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
