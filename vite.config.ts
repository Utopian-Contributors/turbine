import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { splashScreen } from 'vite-plugin-splash-screen'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    splashScreen({
      logoSrc: 'logo.svg',
      loaderType: 'none',
    }),
  ],
  server: { port: 3000 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
