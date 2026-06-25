import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base relative './' pour Capacitor (WebView file://), '/' pour le web (Vercel + PWA).
// Build natif : `npm run cap:build` (mode capacitor) — la PWA y est désactivée.
export default defineConfig(({ mode }) => {
  const isCapacitor = mode === 'capacitor'
  return {
    base: isCapacitor ? './' : '/',
    plugins: [
      vue(),
      VitePWA({
        disable: isCapacitor,
        registerType: 'autoUpdate',
        includeAssets: ['logo.svg'],
        manifest: {
          name: 'BadmintonPerf — Suivi de performances',
          short_name: 'BadmintonPerf',
          description: "Suivi et analyse des performances d'un joueur de badminton.",
          lang: 'fr',
          theme_color: '#0b3d2e',
          background_color: '#0b3d2e',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            { src: 'logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        }
      })
    ]
  }
})
