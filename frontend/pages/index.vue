<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="p-6">
      <nav class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold text-slate-800">
          Artist Portfolio
        </h1>
        <div class="flex gap-6">
          <NuxtLink to="/" class="text-slate-600 hover:text-slate-800">Gallery</NuxtLink>
          <NuxtLink to="/about" class="text-slate-600 hover:text-slate-800">About</NuxtLink>
          <NuxtLink to="/contact" class="text-slate-600 hover:text-slate-800">Contact</NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="watercolour-card floating max-w-4xl mx-auto text-center p-12 mb-12">
        <h2 class="text-5xl font-bold text-slate-800 mb-6">
          Welcome to My Art World
        </h2>
        <p class="text-xl text-slate-600 mb-8">
          Discover a collection of paintings and digital art that explores color, emotion, and creativity.
        </p>
        <UButton size="lg" class="bg-gradient-to-r from-blue-500 to-purple-500">
          <UIcon name="i-heroicons-eye" class="mr-2" />
          View Gallery
        </UButton>
      </div>

      <!-- Test API Connection -->
      <div class="watercolour-card p-6">
        <h3 class="text-2xl font-bold mb-4">Latest Artworks</h3>
        <div v-if="pending" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto mb-4" />
          <p>Loading artworks...</p>
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-600">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 mx-auto mb-4" />
          <p>{{ error.message }}</p>
          <p class="text-sm mt-2">Make sure Strapi is running on {{ $config.public.strapiUrl }}</p>
        </div>
        <div v-else-if="data?.data?.length === 0" class="text-center py-8 text-slate-600">
          <UIcon name="i-heroicons-photo" class="h-8 w-8 mx-auto mb-4" />
          <p>No artworks found. Add some content in your Strapi admin panel!</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="artwork in data?.data || []"
              :key="artwork.id"
              class="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-all"
          >
            <h4 class="font-semibold text-lg mb-2">{{ artwork.title }}</h4>
            <p class="text-slate-600 text-sm mb-2">{{ artwork.category }}</p>
            <p class="text-slate-700">{{ artwork.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Test connection to Strapi
const config = useRuntimeConfig()

const { data, pending, error } = await useFetch('/api/artworks', {
  baseURL: config.public.strapiUrl,
  query: {
    'populate': '*'
  }
})

// SEO
useHead({
  title: 'Artist Portfolio - Home',
  meta: [
    { name: 'description', content: 'Welcome to my artistic journey featuring paintings and digital art.' }
  ]
})
</script>