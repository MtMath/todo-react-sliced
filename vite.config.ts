import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "./src/app"),
      pages: path.resolve(__dirname, "./src/pages"),
      widgets: path.resolve(__dirname, "./src/widgets"),
      features: path.resolve(__dirname, "./src/features"),
      entities: path.resolve(__dirname, "./src/entities"),
      shared: path.resolve(__dirname, "./src/shared"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          bootstrap: ["bootstrap", "react-bootstrap"],
          datatable: ["react-data-table-component", "styled-components"],
        },
      },
    },
  },
});
