import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.svg", "robots.txt"],

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
              ["document", "script", "style"].includes(
                request.destination
              ),

            handler: "NetworkFirst",

            options: {
              cacheName: "assets-cache",

              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },
    }),
  ],
});