import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' ,threshold: 1024}),
    compression({ algorithm: 'brotliCompress' , threshold: 1024})],
    server: {
      port: 4201
    }
})
