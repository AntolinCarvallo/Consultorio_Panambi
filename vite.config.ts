import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { spawn, type ChildProcess } from "node:child_process";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

function consultorioApi() {
  let child: ChildProcess | undefined;
  return {
    name: "consultorio-api",
    configureServer() {
      if (child) return;
      child = spawn(process.execPath, ["server/index.js"], {
        stdio: "inherit",
        env: process.env,
      });
      const stop = () => {
        if (child && !child.killed) child.kill();
      };
      process.on("exit", stop);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    consultorioApi(),
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
