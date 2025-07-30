<template>
  <div>
    <!-- MODERN GLASSMORPHISM NAVIGATION -->
    <nav class="modern-nav">
      <div class="nav-content">
        <NuxtLink to="/" class="nav-logo">Misia's Portfolio</NuxtLink>
        <ul class="nav-links">
          <li><NuxtLink to="/" class="nav-link">Gallery</NuxtLink></li>
          <li><NuxtLink to="/about" class="nav-link">About</NuxtLink></li>
          <li><NuxtLink to="/contact" class="nav-link">Contact</NuxtLink></li>
        </ul>
        <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
          <UIcon name="i-heroicons-bars-3" class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <!-- MOBILE MENU -->
    <div class="mobile-menu-overlay" :class="{ open: mobileMenuOpen }" @click="closeMobileMenu"></div>
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <div class="flex justify-between items-center mb-8">
        <span class="font-bold text-xl">Menu</span>
        <button @click="closeMobileMenu" class="p-2 hover:bg-gray-100 rounded-lg">
          <UIcon name="i-heroicons-x-mark" class="h-6 w-6" />
        </button>
      </div>
      <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Gallery</NuxtLink>
      <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">About</NuxtLink>
      <NuxtLink to="/contact" class="mobile-nav-link" @click="closeMobileMenu">Contact</NuxtLink>
    </div>

    <!-- BRUTAL MODERN HERO SECTION -->
    <section class="hero-section">
      <div class="hero-content floating-1">
        <h1 class="hero-title">
          Art That
          <span class="block">Speaks</span>
        </h1>
        <p class="hero-subtitle">
          Discover a vibrant world where color meets emotion,
          and every brushstroke tells a story of boundless creativity.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <NuxtLink to="/gallery" class="btn-primary">
            <UIcon name="i-heroicons-eye" class="h-5 w-5" />
            Explore Collection
          </NuxtLink>
          <NuxtLink to="/about" class="btn-secondary">
            <UIcon name="i-heroicons-heart" class="h-5 w-5" />
            Meet the Artist
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FEATURED ARTWORKS WITH GLASSMORPHISM -->
    <section class="section">
      <div class="container">
        <div class="glass-card floating-2 section-inner">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-5xl font-bold font-['Playfair_Display'] mb-8"
                style="background: linear-gradient(135deg, #f4a6cd 0%, #f4a261 50%, #e76f51 100%);
                       -webkit-background-clip: text;
                       -webkit-text-fill-color: transparent;
                       background-clip: text;
                       line-height: 1.2;
                       padding: 0.2rem 0;">
              Latest Creations
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Each piece is a journey through color, texture, and emotion—discover the stories behind the art.
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="text-center py-20">
            <div class="glass-card p-8 max-w-md mx-auto">
              <div class="relative">
                <UIcon name="i-heroicons-arrow-path"
                       class="animate-spin h-16 w-16 mx-auto mb-6"
                       style="color: #f4a6cd" />
                <div class="absolute inset-0 bg-gradient-to-r from-pink-peony to-coral-pink opacity-20 rounded-full blur-xl"></div>
              </div>
              <h3 class="text-2xl font-semibold mb-4">Loading Masterpieces</h3>
              <p class="text-gray-600">Preparing something beautiful for you...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-20">
            <div class="glass-card p-10 max-w-lg mx-auto">
              <UIcon name="i-heroicons-exclamation-triangle"
                     class="h-16 w-16 mx-auto mb-6"
                     style="color: #e76f51" />
              <h3 class="text-2xl font-bold mb-4">Unable to Load Gallery</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">{{ error.message }}</p>
              <p class="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <strong>Debug info:</strong> Ensure Strapi is running on {{ $config.public.strapiUrl }}
              </p>
              <button @click="refresh()" class="btn-primary mt-6">
                <UIcon name="i-heroicons-arrow-path" class="h-5 w-5" />
                Try Again
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="data?.data?.length === 0" class="text-center py-20">
            <div class="glass-card p-10 max-w-lg mx-auto">
              <div class="relative mb-8">
                <UIcon name="i-heroicons-photo" class="h-20 w-20 mx-auto text-gray-300" />
                <div class="absolute inset-0 bg-gradient-to-r from-pink-peony to-mustard opacity-10 rounded-full blur-2xl"></div>
              </div>
              <h3 class="text-2xl font-bold mb-4">Canvas Awaits</h3>
              <p class="text-gray-600 leading-relaxed">
                The gallery is ready for your first masterpiece. Add artwork through your Strapi admin panel to get started!
              </p>
            </div>
          </div>

          <!-- MODERN ARTWORK GRID -->
          <div v-else class="artwork-grid">
            <article
                v-for="(artwork, index) in data?.data || []"
                :key="artwork.id"
                class="artwork-card group"
                :class="getFloatingClass(index)"
                @click="viewArtwork(artwork)"
            >
              <!-- Artwork Image Placeholder -->
              <div class="artwork-image">
                <div class="absolute inset-0 bg-gradient-to-br from-pink-peony/20 to-coral-pink/20"></div>
                <UIcon name="i-heroicons-photo" class="h-20 w-20 text-white/60 z-10" />
                <!-- Future: Replace with actual image -->
                <!-- <NuxtImg v-if="artwork.image" :src="artwork.image.url" :alt="artwork.title" /> -->
              </div>

              <!-- Artwork Content -->
              <div class="artwork-content">
                <h3 class="artwork-title group-hover:text-coral-pink transition-colors duration-300">
                  {{ artwork.title }}
                </h3>

                <span class="artwork-category" :class="getCategoryClass(artwork.category)">
                  {{ artwork.category }}
                </span>

                <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {{ artwork.description || 'A captivating piece that explores the boundaries between imagination and reality.' }}
                </p>

                <!-- Artwork Actions -->
                <div class="flex justify-between items-center pt-4 border-t border-white/10">
                  <button class="text-coral-pink hover:text-pink-peony font-medium transition-colors flex items-center gap-2">
                    <UIcon name="i-heroicons-eye" class="h-4 w-4" />
                    View Details
                  </button>
                  <div class="flex gap-3">
                    <button class="p-2 rounded-full hover:bg-pink-peony/10 transition-colors duration-200 group/btn">
                      <UIcon name="i-heroicons-heart" class="h-4 w-4 group-hover/btn:text-pink-peony transition-colors" />
                    </button>
                    <button class="p-2 rounded-full hover:bg-pink-peony/10 transition-colors duration-200 group/btn">
                      <UIcon name="i-heroicons-share" class="h-4 w-4 group-hover/btn:text-pink-peony transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="section">
      <div class="container">
        <div class="glass-card floating-3 section-inner text-center max-w-4xl mx-auto">
          <h2 class="text-4xl font-bold mb-8 font-['Playfair_Display']"
              style="background: linear-gradient(135deg, #f4a6cd 0%, #f4a261 50%, #e76f51 100%);
                     -webkit-background-clip: text;
                     -webkit-text-fill-color: transparent;
                     background-clip: text;
                     line-height: 1.2;
                     padding: 0.2rem 0;">
            Let's Create Together
          </h2>
          <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you're interested in commissioning a piece, collaborating on a project,
            or simply want to share your thoughts about art—I'd love to hear from you.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <NuxtLink to="/contact" class="btn-primary">
              <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="h-5 w-5" />
              Start a Conversation
            </NuxtLink>
            <NuxtLink to="/about" class="btn-secondary">
              <UIcon name="i-heroicons-user" class="h-5 w-5" />
              Learn My Story
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Mobile menu state
const mobileMenuOpen = ref(false)

// API connection
const config = useRuntimeConfig()

const { data, pending, error, refresh } = await useFetch('/api/artworks', {
  baseURL: config.public.strapiUrl,
  query: {
    'populate': '*'
  }
})

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Helper functions
const getCategoryClass = (category) => {
  const classes = {
    'Paintings': 'category-paintings',
    'Digital Art': 'category-digital',
    'Experimental': 'category-experimental'
  }
  return classes[category] || 'category-paintings'
}

const getFloatingClass = (index) => {
  const classes = ['floating-1', 'floating-2', 'floating-3']
  return classes[index % 3]
}

const viewArtwork = (artwork) => {
  // Future: Navigate to artwork detail page
  console.log('Viewing artwork:', artwork.title)
}

// SEO
useHead({
  title: 'Exceptional Artist Portfolio - Modern Art Collection',
  meta: [
    { name: 'description', content: 'Discover an exceptional collection of contemporary paintings and digital art. Experience color, emotion, and creativity through a modern lens.' },
    { name: 'keywords', content: 'modern art, contemporary artist, paintings, digital art, creative portfolio, art collection' },
    { property: 'og:title', content: 'Exceptional Artist Portfolio' },
    { property: 'og:description', content: 'Experience art that speaks to the soul through vibrant colors and emotional storytelling.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>