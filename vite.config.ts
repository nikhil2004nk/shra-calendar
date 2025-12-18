import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // For GitHub Pages deployment
  const base = command === 'build' ? '/shra-calender/' : '/';
  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
      open: true,
      host: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    define: {
      'process.env': {}
    },
    preview: {
      port: 3001,
      open: true
    }
  };
});