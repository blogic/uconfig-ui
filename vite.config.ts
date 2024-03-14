import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tsChecker from 'vite-plugin-checker';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    TanStackRouterVite(),
    /**
     * Slow, but very useful for development, ensures that your code is type-safe not only at IDE level,
     *  but also at build level.
     */
    tsChecker({
      typescript: true,
    }),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  define: {
    // Using this to get the version from package.json into the app
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
