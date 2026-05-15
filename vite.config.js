import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Vite sert depuis la racine du projet.
  // Les fichiers JSX sont dans ./app/ — référencés dans index.html.
})
