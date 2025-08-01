export default defineNuxtConfig({
  compatibilityDate: '2025-07-30',
  devtools: { enabled: true },

  // Explicitly enable pages (should be default but let's be explicit)
  pages: true,

  components: {
    path: '~/components',
    pathPrefix: false,
  },

  // Add the required modules
  modules: [
    '@nuxt/ui',
    '@nuxt/image'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)

    // Public keys (exposed to client-side)
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  // App configuration
  app: {
    head: {
      title: "Misia's Art Portfolio",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A beautiful showcase of paintings and digital art' }
      ]
    }
  }
})