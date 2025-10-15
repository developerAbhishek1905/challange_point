import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://65.0.93.117',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
