<template>
  <div>
    <!-- MODERN GLASSMORPHISM NAVIGATION -->
    <nav class="modern-nav">
      <div class="nav-content">
        <NuxtLink to="/" class="nav-logo">Misia's Art Portfolio</NuxtLink>
        <ul class="nav-links">
          <li><NuxtLink to="/" class="nav-link">Gallery</NuxtLink></li>
          <li><NuxtLink to="/about" class="nav-link">About</NuxtLink></li>
          <li><NuxtLink to="/contact" class="nav-link">Contact</NuxtLink></li>
        </ul>
        <button @click="toggleMobileMenu" class="md:hidden mobile-menu-button">
          <div class="hamburger-icon" :class="{ active: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </nav>

    <!-- MOBILE MENU -->
    <div class="mobile-menu-overlay" :class="{ open: mobileMenuOpen }" @click="closeMobileMenu"></div>
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <div class="mobile-menu-header">
        <div class="mobile-menu-logo">
          <span class="mobile-menu-title">Misia's Art</span>
          <span class="mobile-menu-subtitle">Portfolio</span>
        </div>
        <button @click="closeMobileMenu" class="mobile-close-button">
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
        </button>
      </div>
      
      <nav class="mobile-nav-container">
        <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <UIcon name="i-heroicons-squares-2x2" class="mobile-nav-icon" />
          <span>Gallery</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">
          <UIcon name="i-heroicons-user" class="mobile-nav-icon" />
          <span>About</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
        <NuxtLink to="/contact" class="mobile-nav-link" @click="closeMobileMenu">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="mobile-nav-icon" />
          <span>Contact</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
      </nav>
      
      <div class="mobile-menu-footer">
        <div class="mobile-footer-decoration"></div>
        <p class="mobile-footer-text">Art that speaks to the soul</p>
      </div>
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
        <div class="button-container flex flex-col sm:flex-row gap-8 justify-center items-center">
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
                @click="() => { console.log('Card clicked!'); openLightbox(artwork); }"
            >
              <!-- Artwork Image -->
              <div class="artwork-image">
                <!-- Display actual image if available -->
                <div v-if="getImageUrl(artwork)" class="relative">
                  <NuxtImg
                      :src="getImageUrl(artwork)"
                      :alt="artwork.title"
                      loading="lazy"
                      @error="onImageError"
                  />
                  <!-- Hover overlay with magnifying glass - FIXED -->
                  <div class="image-overlay">
                    <div class="magnify-icon">
                      <UIcon name="i-heroicons-magnifying-glass-plus" class="h-6 w-6 text-gray-800" />
                    </div>
                  </div>
                </div>
                <!-- Fallback for no image -->
                <div v-else class="aspect-square bg-gradient-to-br from-pink-peony/20 to-coral-pink/20 flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="h-20 w-20 text-white/60" />
                </div>
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
                  {{ getCleanDescription(artwork) }}
                </p>

                <!-- Modern Artwork Actions -->
                <div class="artwork-actions">
                  <button @click.stop="openLightbox(artwork)" class="artwork-action-btn primary">
                    <UIcon name="i-heroicons-eye" class="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <div class="artwork-action-icons">
                    <button @click.stop="toggleFavorite(artwork)" class="artwork-icon-btn" title="Add to favorites">
                      <UIcon name="i-heroicons-heart" class="h-4 w-4" />
                    </button>
                    <button @click.stop="shareArtwork(artwork)" class="artwork-icon-btn" title="Share artwork">
                      <UIcon name="i-heroicons-share" class="h-4 w-4" />
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
          <div class="button-container flex flex-col sm:flex-row gap-8 justify-center">
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

    <!-- LIGHTBOX MODAL - MOVED OUTSIDE MAIN CONTENT -->
    <Teleport to="body">
      <div class="lightbox-overlay" :class="{ open: lightboxOpen }" @click="closeLightbox">
        <div class="lightbox-content" @click.stop v-if="selectedArtwork">
          <button @click="closeLightbox" class="lightbox-close">
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
          </button>

          <div v-if="getImageUrl(selectedArtwork)">
            <NuxtImg
                :src="getImageUrl(selectedArtwork)"
                :alt="selectedArtwork.title"
                class="lightbox-image"
            />
          </div>

          <div class="lightbox-info">
            <div class="lightbox-header">
              <div class="lightbox-title-section">
                <h2 class="text-3xl font-bold mb-2 font-['Playfair_Display']"
                    style="background: linear-gradient(135deg, #f4a6cd 0%, #f4a261 50%, #e76f51 100%);
                           -webkit-background-clip: text;
                           -webkit-text-fill-color: transparent;
                           background-clip: text;">
                  {{ selectedArtwork.title }}
                </h2>
                <span class="artwork-category" :class="getCategoryClass(selectedArtwork.category)">
                  {{ selectedArtwork.category }}
                </span>
              </div>
              <div class="lightbox-actions">
                <button @click="toggleFavorite(selectedArtwork)" class="btn-secondary !p-3">
                  <UIcon name="i-heroicons-heart" class="h-5 w-5" />
                </button>
                <button @click="shareArtwork(selectedArtwork)" class="btn-secondary !p-3">
                  <UIcon name="i-heroicons-share" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="lightbox-description">
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ getCleanDescription(selectedArtwork) }}
              </p>
            </div>

            <div class="lightbox-meta">
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Category: {{ selectedArtwork.category }}</span>
                <span v-if="selectedArtwork.createdAt">Created: {{ formatDate(selectedArtwork.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// Mobile menu state
const mobileMenuOpen = ref(false)

// Lightbox state
const lightboxOpen = ref(false)
const selectedArtwork = ref(null)

// API connection
const config = useRuntimeConfig()

const { data, pending, error, refresh } = await useFetch('/api/artworks', {
  baseURL: config.public.strapiUrl,
  query: {
    'populate': '*'
  }
})

// Debug: Log the structure to understand image format
watchEffect(() => {
  if (data.value?.data?.length > 0) {
    console.log('Artwork structure:', JSON.stringify(data.value.data[0], null, 2))
    console.log('Image data:', data.value.data[0]?.image)
  }
})

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Lightbox functions
const openLightbox = (artwork) => {
  console.log('Opening lightbox for:', artwork.title) // Debug
  selectedArtwork.value = artwork
  lightboxOpen.value = true
  // Prevent background scrolling
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

const closeLightbox = () => {
  console.log('Closing lightbox') // Debug
  lightboxOpen.value = false
  selectedArtwork.value = null
  // Restore scrolling
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'
  }
}

// Artwork interaction functions
const toggleFavorite = (artwork) => {
  // Future: Add to favorites functionality
  console.log('Toggling favorite for:', artwork.title)
}

const shareArtwork = (artwork) => {
  // Future: Share functionality
  if (navigator.share) {
    navigator.share({
      title: artwork.title,
      text: getCleanDescription(artwork),
      url: window.location.href
    })
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    console.log('Link copied to clipboard!')
  }
}

// Helper functions
const getImageUrl = (artwork) => {
  // Handle different Strapi image response structures
  if (artwork?.image) {
    // Check for direct URL
    if (artwork.image.url) {
      return `${config.public.strapiUrl}${artwork.image.url}`
    }
    // Check for data array structure (Strapi v4+)
    if (artwork.image.data && artwork.image.data.length > 0) {
      return `${config.public.strapiUrl}${artwork.image.data[0].attributes.url}`
    }
    // Check for single data object structure
    if (artwork.image.data && artwork.image.data.attributes) {
      return `${config.public.strapiUrl}${artwork.image.data.attributes.url}`
    }
  }
  return null
}

const getCleanDescription = (artwork) => {
  if (!artwork.description) {
    return 'A captivating piece that explores the boundaries between imagination and reality.'
  }

  // Check if description is a string
  if (typeof artwork.description === 'string') {
    return artwork.description
  }

  // Handle Strapi rich text format
  if (Array.isArray(artwork.description)) {
    return artwork.description
        .map(block => {
          if (block.type === 'paragraph' && block.children) {
            return block.children.map(child => child.text || '').join('')
          }
          return ''
        })
        .join(' ')
        .trim()
  }

  // Handle single rich text object
  if (artwork.description.type === 'paragraph' && artwork.description.children) {
    return artwork.description.children.map(child => child.text || '').join('')
  }

  // Fallback
  return 'A beautiful artwork waiting to tell its story.'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const onImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
}

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

// Cleanup on unmount
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'
  }
})

// Handle escape key for lightbox
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && lightboxOpen.value) {
      closeLightbox()
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleEscape)

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  }
})

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

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>