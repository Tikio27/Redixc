import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  publicDir: fileURLToPath(new URL("../../public", import.meta.url)),
  server: { fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] } },
});
