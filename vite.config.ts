import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ibge": {
        target: "https://servicodados.ibge.gov.br",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
