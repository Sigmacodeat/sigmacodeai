import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';
import type { PluginOption } from 'vite';
import { compression } from 'vite-plugin-compression2';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { brotliCompress } from 'zlib';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // In Dev (serve) die .env aus dem Workspace-Root laden, ohne async Config zu benötigen.
  // Plattformen wie Vercel/CI liefern ENV-Variablen, daher nur lokal notwendig.
  if (command === 'serve') {
    const rootEnv = loadEnv(mode, path.resolve(__dirname, '../../'), '');
    for (const [key, value] of Object.entries(rootEnv)) {
      if (process.env[key] === undefined) {
        process.env[key] = value as string;
      }
    }
  }

  return ({
  // Determine API target dynamically to avoid hardcoding ports
  // Priority: VITE_API_TARGET -> PORT -> 3081
  // Example: VITE_API_TARGET=http://localhost:3080
  //          PORT=3081 (docker-compose default)
  // Note: envDir is set to '../' so client VITE_* vars load from LibreChat_fresh/.env,
  // while process.env is hydrated from workspace root via dotenv above.
  // Custom root fields on the Vite config object are not allowed by the UserConfig type.
  // If you need to expose values, use `define` below or environment variables.
  server: {
    host: 'localhost',
    port: 3092,
    strictPort: false,
    open: true,
    proxy: (() => {
      // Important: never use process.env.PORT here, Vite may set it to the dev server port (e.g., 3092)
      // which would cause the proxy to target itself and create a loop.
      const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3081';
      return {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/oauth': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/dev-email': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-email/, '/api/dev/email'),
      },
    }; })(),
  },
  // Provide minimal shims for browser builds where some libs (e.g., sandpack) read process.env
  define: {
    'process.env': {},
  },
  // Set the directory where environment variables are loaded from and restrict prefixes
  envDir: '../',
  envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
  plugins: ([
    react({
      jsxRuntime: 'automatic',
    }),
    splitVendorChunkPlugin(),
    // Eigene kleine Helfer-Erweiterung
    sourcemapExclude({ excludeNodeModules: true }),
    // Gzip + Brotli für optimale Auslieferung
    compression({
      threshold: 10240,
      // default: gzip
    }),
    compression({
      threshold: 10240,
      algorithm: (input, options) =>
        new Promise((resolve, reject) =>
          brotliCompress(input, options as any, (err, result) =>
            err ? reject(err) : resolve(result),
          ),
        ),
      filename: (id) => `${id}.br`,
    }),
  ]) as PluginOption[],
  // publicDir in Build einschließen, damit Fonts/Assets bereitgestellt werden
  publicDir: './public',
  build: {
    // Nur in Dev Sourcemaps, in Prod deaktiviert
    sourcemap: command === 'serve',
    outDir: './dist',
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      treeshake: true,
      output: {
        // Sinnvolle Default-Namen
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0] && /(\.woff|\.woff2|\.eot|\.ttf|\.otf)$/.test(assetInfo.names[0])) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
        // Vendor-Splitting für bessere Caching-Charakteristik
        // Gruppiere die größten Abhängigkeiten in stabile Chunks
        manualChunks(id) {
          // 1) App-spezifische Gruppierung: Marketing-Quellen in stabilen Chunk bündeln
          //    So bleiben Marketing-Routen + Komponenten getrennt von App-Core und besser cachenbar.
          if (
            id.includes('/src/components/marketing/') ||
            id.includes('/src/routes/Marketing/')
          ) {
            return 'marketing';
          }

          // 2) Vendor-Splitting
          if (!id.includes('node_modules')) return undefined;

          const match = id.match(/node_modules\/(?:@[^/]+\/)?[^/]+/);
          const pkg = match ? match[0] : '';

          // Bekannt große/oft genutzte Pakete in eigene Chunks
          if (/node_modules\/react/.test(id)) return 'react';
          if (/node_modules\/(react-router|react-router-dom)/.test(id)) return 'router';
          if (/node_modules\/(i18next|react-i18next)/.test(id)) return 'i18n';
          if (/node_modules\/framer-motion/.test(id)) return 'motion';
          if (/node_modules\/@tanstack\/.+query/.test(id)) return 'query';
          if (/node_modules\/lucide-react/.test(id)) return 'icons';
          if (/node_modules\/(three|@react-three)/.test(id)) return 'three';
          if (/node_modules\/(monaco-editor|@monaco-editor)/.test(id)) return 'editor';

          // Fallback: ein generischer vendor-Chunk je Top-Level-Package
          if (pkg) {
            const name = pkg.replace('node_modules/', '').replace('@', '').replace('/', '_');
            return `vendor-${name}`;
          }
          return 'vendor';
        },
      },
      /**
       * Ignore "use client" warning seit wir kein SSR nutzen
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.message.includes('Error when using sourcemap')) {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1600,
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '~': path.join(__dirname, 'src'),
      $fonts: path.resolve(__dirname, 'public/fonts'),
      'micromark-extension-math': 'micromark-extension-llm-math',
      'unenv/mock/empty': path.resolve(__dirname, 'src/shims/empty.ts'),
      'unenv/node/inspector/promises': path.resolve(__dirname, 'src/shims/empty.ts'),
      'unenv/node/readline/promises': path.resolve(__dirname, 'src/shims/empty.ts'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@react-spring/web'
    ],
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/_variables.scss";`,
      },
    },
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  });
});

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}
export function sourcemapExclude(opts?: SourcemapExclude) {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes('node_modules')) {
        return {
          code,
          // https://github.com/rollup/rollup/blob/master/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: '' },
        };
      }
    },
  };
}
