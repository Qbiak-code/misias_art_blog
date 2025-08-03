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
      @open-lightbox="openLightbox"
      @toggle-favorite="toggleFavorite"
      @share-artwork="shareArtwork"
    />

    <!-- ENHANCED CALL TO ACTION -->
    <CallToAction />

    <!-- LIGHTBOX MODAL - REDESIGNED FOR BETTER VIEWPORT HANDLING -->
    <ArtworkLightbox
      :is-open="lightboxOpen"
      :artwork="selectedArtwork"
      @close="closeLightbox"
      @toggle-favorite="toggleFavorite"
      @share-artwork="shareArtwork"
      @submit-comment="submitComment"
    />
  </div>
</template>

<script setup>
// Import composables
const { 
  artworks, 
  selectedArtwork, 
  isLoading, 
  error,
  loadArtworks,
  selectArtwork,
  clearSelection,
  toggleFavorite,
  shareArtwork
} = useArtwork()

const {
  commentForm,
  isSubmitting: commentSubmitting,
  showCommentForm,
  submitMessage,
  submitMessageType,
  handleSubmitComment,
  resetForm: resetCommentForm
} = useComments()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Lightbox state
const lightboxOpen = ref(false)

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

// Lightbox functions
const openLightbox = (artwork) => {
  console.log('Opening lightbox for:', artwork.title)
  selectArtwork(artwork)
  lightboxOpen.value = true
  // Set artwork for comments
  commentForm.value.artwork = artwork
  // Prevent background scrolling
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

const closeLightbox = () => {
  console.log('Closing lightbox')
  lightboxOpen.value = false
  clearSelection()
  showCommentForm.value = false
  resetCommentForm()
  // Restore scrolling
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'
  }
}

// Toggle comment form with smooth scrolling
const toggleCommentForm = async () => {
  showCommentForm.value = !showCommentForm.value
  
  // If opening the form, scroll to it smoothly (especially important on mobile)
  if (showCommentForm.value) {
    // Wait for the form to render
    await nextTick()
    
    const commentFormElement = document.querySelector('.comment-form')
    if (commentFormElement) {
      // Check if we're on mobile (viewport width <= 768px)
      const isMobile = window.innerWidth <= 768
      
      if (isMobile) {
        // On mobile, scroll the form into view with smooth behavior
        commentFormElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }
  }
}

// Use composable functions directly for artwork interactions
// toggleFavorite and shareArtwork are already imported from useArtwork()

// Comment submission - use composable function
const submitComment = async () => {
  const result = await handleSubmitComment()
  if (result.success) {
    showCommentForm.value = false
  }
}

// Helper functions - use composable utilities
const { getImageUrl } = useStrapi()

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

// Comment helper functions - using composables
const { getArtworkComments, loadArtworkComments, formatCommentDate } = useComments()

const getApprovedComments = async (artwork) => {
  if (!artwork?.id && !artwork?.documentId) return []
  
  const artworkId = artwork.id || artwork.documentId
  return await loadArtworkComments(artworkId)
}

const getCommentContent = (comment) => {
  return comment.content || comment.attributes?.content || ''
}

const getCommentAuthor = (comment) => {
  return comment.authorName || comment.attributes?.authorName || 'Anonymous'
}

const getCommentDate = (comment) => {
  const dateString = comment.createdAt || comment.attributes?.createdAt
  return formatCommentDate(dateString)
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