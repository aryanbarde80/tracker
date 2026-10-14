import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The public Supabase credentials are inlined into the bundle at build
  // time. A production build without them ships an app that throws during
  // boot (see issue #91), so fail the build instead of deploying a white
  // screen.
  if (mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const missing = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
      .filter(key => !env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required build environment: ${missing.join(', ')}. `
        + 'Set them in .env for local builds or as repository secrets for deploys.',
      );
    }
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
