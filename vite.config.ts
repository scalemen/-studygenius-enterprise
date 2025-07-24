import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include .jsx files
      include: "**/*.{jsx,tsx}",
    }),
  ],
  
  // Path resolution
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'ai-vendor': ['openai', '@anthropic-ai/sdk', '@google/generative-ai'],
          'utils-vendor': [
            'clsx',
            'tailwind-merge',
            'date-fns',
            'lodash',
            'uuid',
            'nanoid',
          ],
          'communication': ['socket.io-client', 'agora-rtc-react'],
          'editor': ['@tiptap/react', '@tiptap/core', '@tiptap/starter-kit'],
          'drawing': ['konva', 'react-konva'],
        },
      },
    },
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      '@tanstack/react-query',
      'socket.io-client',
      'wouter',
      'framer-motion',
      'lucide-react',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  
  // Preview server (for production builds)
  preview: {
    port: 3000,
    host: true,
    cors: true,
  },
  
  // Worker configuration
  worker: {
    format: 'es',
  },
  
  // JSON configuration
  json: {
    namedExports: true,
    stringify: false,
  },
  
  // Experimental features
  experimental: {
    renderBuiltUrl(filename: string) {
      return `/${filename}`;
    },
  },
});
