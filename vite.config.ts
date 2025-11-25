import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, type InlineConfig, type UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import packageJson from './package.json';

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  build: {
    lib: {
      entry: './src/components/index.ts',
      name: 'TheDotCorpFrontendAssign',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`,
    },
    outDir: './dist',
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)].flatMap(dependency => [
        dependency,
        new RegExp(`^${dependency}(/.*)?$`),
      ]),
    },
  },
} as VitestConfigExport);
