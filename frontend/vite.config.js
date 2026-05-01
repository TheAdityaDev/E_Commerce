import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
    watch: { usePolling: true },
    hmr: {
      protocol: "ws",
      host: "127.0.0.1",
      port: 5173
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // 👈 auto update SW
      includeAssets: ["favicon.svg", "robots.txt"], // optional
      historyApiFallback: true,
      manifest: {
        name: "My App",
        short_name: "App",
        description: "My Vite + React PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style",
            handler: "NetworkFirst", // 👈 online-first, fallback to cache
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
    }),
  ],
});
