import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // For Vercel deployment - use root base path
  // Can be overridden with VITE_BASE_URL environment variable for other deployments
  const base = process.env.VITE_BASE_URL || '/';
  const isProduction = process.env.NODE_ENV === 'production';
  
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
      sourcemap: !isProduction, // Disable sourcemaps in production for better performance
      emptyOutDir: true,
      manifest: true,
      minify: 'esbuild' as const,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@headlessui/react', '@heroicons/react', 'lucide-react'],
            'query-vendor': ['@tanstack/react-query']
          }
        }
      },
      chunkSizeWarningLimit: 1000
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