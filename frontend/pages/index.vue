<template>
  <div>
    <!-- MODERN GLASSMORPHISM NAVIGATION -->
    <AppHeader
      :mobile-menu-open="mobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
    />

    <!-- MOBILE MENU -->
    <MobileMenu
      :is-open="mobileMenuOpen"
      @close="closeMobileMenu"
    />

    <!-- BRUTAL MODERN HERO SECTION -->
    <HeroSection />

    <!-- FEATURED ARTWORKS WITH GLASSMORPHISM -->
    <ArtworkGallery
      :artworks="data?.data || []"
      :pending="pending"
      :error="error"
      @refresh="refresh"
      @toggle-favorite="toggleFavorite"
      @share-artwork="shareArtwork"
    />

    <!-- ENHANCED CALL TO ACTION -->
    <CallToAction />

  </div>
</template>

<script setup>
// Import composables
const { 
  artworks, 
  isLoading, 
  error,
  loadArtworks,
  toggleFavorite,
  shareArtwork
} = useArtwork()


// Mobile menu state
const mobileMenuOpen = ref(false)


// Load artworks on page load
await loadArtworks()

// Computed properties for template
const data = computed(() => ({
  data: artworks.value
}))
const pending = computed(() => isLoading.value)
const refresh = loadArtworks

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}



// Use composable functions directly for artwork interactions
// toggleFavorite and shareArtwork are already imported from useArtwork()






// SEO
useHead({
  title: "Exceptional Misia's Art Portfolio - Modern Art Collection",
  meta: [
    { name: 'description', content: 'Discover an exceptional collection of contemporary paintings and digital art. Experience color, emotion, and creativity through a modern lens.' },
    { name: 'keywords', content: 'modern art, contemporary artist, paintings, digital art, creative portfolio, art collection' },
    { property: 'og:title', content: "Exceptional Misia's Art Portfolio" },
    { property: 'og:description', content: 'Experience art that speaks to the soul through vibrant colors and emotional storytelling.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>