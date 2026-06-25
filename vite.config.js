import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base relative: indispensable pour que les assets se chargent dans la WebView Capacitor
export default defineConfig({
  plugins: [vue()],
  base: './'
})
