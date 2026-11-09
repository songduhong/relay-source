import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/")) return "app-vendor";
          if (id.includes("@tanstack/react-query")) return "query";
          return "ui-vendor";
        }
      }
    }
  }
});
