import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react({
      // This enables JSX in .js files specifically
      include: /\.(jsx|js)$/,
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
  ],
  esbuild: {
    // This tells esbuild to handle JSX in .js files
    loader: {
      '.js': 'jsx',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  root: '',
  publicDir: 'public', // Fixed: removed leading slash
  build: {
    outDir: 'dist', // Fixed: removed leading slash
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      // Ensure public/data files are included in the build
      output: {
        assetFileNames: (assetInfo) => {
          // Keep the original path for data files
          if (assetInfo.name.includes('data/')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Copy the data directory explicitly to the build output
    copyPublicDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})