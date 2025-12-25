import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import { widgetDiscoveryPlugin } from './vite-plugin-widgets';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const widgetPort = Number(process.env.WIDGET_PORT || 4444);

if (isProd && !process.env.BASE_URL) {
  throw new Error(
    'BASE_URL environment variable is required for production builds. ' +
    'Set it to your public URL (e.g., BASE_URL=https://wishlist.yourdomain.com)'
  );
}

// Vite base must match where Express serves the assets
// Server serves assets at: app.use('/widgets', express.static(ASSETS_DIR))
// So in prod: BASE_URL + '/widgets/', in dev: localhost widget server
const baseUrl = isProd
  ? `${process.env.BASE_URL?.replace(/\/$/, '')}/widgets/`
  : `http://localhost:${widgetPort}/`;

console.log('Vite config - isProd:', isProd, 'BASE_URL:', process.env.BASE_URL, 'baseUrl:', baseUrl);

export default defineConfig({
  base: baseUrl,
  define: {
    __DEFINES__: JSON.stringify({}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    widgetDiscoveryPlugin(),
    tailwindcss(),
    ...(isProd
      ? [
          compression({
            algorithm: 'gzip',
            ext: '.gz',
          }),
          compression({
            algorithm: 'brotliCompress',
            ext: '.br',
          }),
        ]
      : []),
  ],
  server: {
    port: widgetPort,
    strictPort: true,
    cors: true,
    fs: {
      allow: ['..'],
    },
  },
  publicDir: '../assets',
  build: {
    target: 'es2023',
    outDir: '../assets',
    emptyOutDir: false,
    sourcemap: true,
    minify: isProd ? 'esbuild' : false,
    ...(isProd
      ? {
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }
      : {}),
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 500,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    target: 'es2023',
  },
});
