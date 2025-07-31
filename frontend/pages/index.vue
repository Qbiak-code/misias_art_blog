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
// Mobile menu state
const mobileMenuOpen = ref(false)

// Lightbox state
const lightboxOpen = ref(false)
const selectedArtwork = ref(null)

// Comment form state
const showCommentForm = ref(false)
const commentSubmitting = ref(false)
const commentFormRef = ref(null)
const commentForm = ref({
  authorName: '',
  authorEmail: '',
  content: ''
})

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
  showCommentForm.value = false
  // Reset comment form
  commentForm.value = {
    authorName: '',
    authorEmail: '',
    content: ''
  }
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
    
    if (commentFormRef.value) {
      // Check if we're on mobile (viewport width <= 768px)
      const isMobile = window.innerWidth <= 768
      
      if (isMobile) {
        // On mobile, scroll the form into view with smooth behavior
        commentFormRef.value.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }
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

// Comment submission
const submitComment = async () => {
  if (!selectedArtwork.value || commentSubmitting.value) return
  
  try {
    commentSubmitting.value = true
    
    const response = await $fetch('/api/comments', {
      baseURL: config.public.strapiUrl,
      method: 'POST',
      body: {
        data: {
          content: commentForm.value.content,
          authorName: commentForm.value.authorName,
          authorEmail: commentForm.value.authorEmail,
          artwork: selectedArtwork.value.id,
          approved: false // Comments require moderation
        }
      }
    })
    
    // Reset form
    commentForm.value = {
      authorName: '',
      authorEmail: '',
      content: ''
    }
    showCommentForm.value = false
    
    // Show success message
    console.log('Comment submitted successfully! It will appear after moderation.')
    // TODO: Add toast notification
    
  } catch (error) {
    console.error('Failed to submit comment:', error)
    // TODO: Add error notification
  } finally {
    commentSubmitting.value = false
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

const getApprovedComments = (artwork) => {
  if (!artwork.comments) {
    return []
  }
  
  // Handle different Strapi response structures
  let comments = []
  if (artwork.comments.data) {
    comments = artwork.comments.data
  } else if (Array.isArray(artwork.comments)) {
    comments = artwork.comments
  }
  
  // Filter for approved comments only
  return comments.filter(comment => {
    // Handle both direct attribute access and nested attributes
    const approved = comment.approved !== undefined ? comment.approved : comment.attributes?.approved
    return approved === true
  }).sort((a, b) => {
    // Sort by creation date, newest first
    const dateA = new Date(a.createdAt || a.attributes?.createdAt)
    const dateB = new Date(b.createdAt || b.attributes?.createdAt)
    return dateB - dateA
  })
}

const getCommentContent = (comment) => {
  return comment.content || comment.attributes?.content || ''
}

const getCommentAuthor = (comment) => {
  return comment.authorName || comment.attributes?.authorName || 'Anonymous'
}

const getCommentDate = (comment) => {
  return comment.createdAt || comment.attributes?.createdAt || new Date().toISOString()
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