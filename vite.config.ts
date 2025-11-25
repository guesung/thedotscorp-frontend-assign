import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, type InlineConfig, type UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    dts({
      rollupTypes: true,
      copyDtsFiles: false,
      insertTypesEntry: false,
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
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
      entry: './src/index.ts',
      name: 'TheDotCorpFrontendAssign',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`,
    },
    outDir: './dist',
    cssCodeSplit: false, // CSS를 하나의 파일로 번들링
    minify: 'esbuild', // 또는 'terser' 또는 true
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)].flatMap(dependency => [
        dependency,
        new RegExp(`^${dependency}(/.*)?$`),
      ]),
      output: {
        assetFileNames: 'index.css', // CSS 파일명 지정
      },
    },
  },
} as VitestConfigExport);
