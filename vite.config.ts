import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

/** Sin `VITE_API_URL`, la aplicación pide `/api` en su mismo dominio. */
const API_PROXY = { "/api": process.env.API_PROXY || "http://127.0.0.1:3000" }

export default defineConfig(({ mode }) => {
  const isDev = mode === "development"

  return {
    base: "/",
    build: {
      sourcemap: isDev ? "inline" : false,
      minify: !isDev,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT || "8443"),
      strictPort: true,
      proxy: API_PROXY,
    },
    preview: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT || "8443"),
      strictPort: true,
      proxy: API_PROXY,
      // Enlace temporal para mostrar la aplicación desde el computador.
      allowedHosts: [".trycloudflare.com"],
    },
  }
})
