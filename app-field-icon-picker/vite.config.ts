import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const reactAppEnv = loadEnv(mode, process.cwd(), 'REACT_APP_');
  const defineEnv: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  };
  for (const [key, value] of Object.entries(reactAppEnv)) {
    defineEnv[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'build',
      // Omit sourcemaps so the uploaded bundle stays under Contentful's uncompressed size limit.
      sourcemap: false,
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    define: defineEnv,
  };
});
