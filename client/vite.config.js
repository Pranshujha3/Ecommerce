import { defineConfig} from "vite";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),],
    server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 👈 IMPORTANT: Make sure this matches your Backend Port
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    tailwindcss(),
  ],

  theme: {
    extend: {
      colors:{
        "primary-200" : "#ffbg00",
        "primary-100" : "#ffc929",
        "secondry-200" : "#00b050",
        "secondry-100" : "#0b1a78"
      },
    },
  },
})