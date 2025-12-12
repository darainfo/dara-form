import { defineConfig } from 'vite';
import path from 'path';
import { commonConfig, MODULE_NAME, createAssetFileNames } from './vite.common.js';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    ...commonConfig,

    build: {
      outDir: isProd ? 'dist' : 'dist/unmin',
      emptyOutDir: false, // ES/CJS 빌드를 덮어쓰지 않기 위해 false
      sourcemap: true,
      minify: isProd ? 'esbuild' : false,

      lib: {
        entry: path.resolve(__dirname, 'src/index.umd.ts'),
        name: 'Daracl',
        formats: ['umd'],
        fileName:(format) => {
          if (format === 'umd') {
            return isProd ? `${MODULE_NAME}.min.umd.js` : `${MODULE_NAME}.umd.js`
          }
          return `${MODULE_NAME}.js`;
        }
      },
      rollupOptions: {
        output: {
          assetFileNames: createAssetFileNames(isProd)
        },
      },
    },
  };
});

