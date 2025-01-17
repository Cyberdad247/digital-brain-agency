import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), vue(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.mjs'],
  },
}));
