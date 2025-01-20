// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Disable server-side rendering (ensures client-side only)
  nitro: {
    preset: 'static', // Use Nitro's static preset for generating static files
  },
  typescript: {
    strict: true, // Ensures TypeScript type safety
  },
  runtimeConfig: {
    public: {
      // Define any public environment variables here
    },
  },
  modules: ['@nuxtjs/tailwindcss'], // Keep your modules
});
