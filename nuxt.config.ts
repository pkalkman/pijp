import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 6800,
  },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss() as any],
  },
  runtimeConfig: {
    mongoURI: process.env.MONGODB_URI,
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext', // Gives Top Level await :)
      },
    },
  },
});
