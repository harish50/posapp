import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/Restaurant\/items/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
      includeAssets: ['vite.svg', 'assets/preact.svg'],
      manifest: {
        name: 'POS App',
        short_name: 'POS',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#007bff',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://fakerestaurantapi.runasp.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
