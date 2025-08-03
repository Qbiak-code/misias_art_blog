<template>
  <div class="artwork-page">
    <!-- Header -->
    <AppHeader 
      :mobile-menu-open="mobileMenuOpen" 
      @toggle-mobile-menu="toggleMobileMenu" 
    />
    
    <!-- Mobile Menu -->
    <MobileMenu :is-open="mobileMenuOpen" @close="mobileMenuOpen = false" />
    
    <!-- Loading State -->
    <div v-if="pending" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Loading artwork...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <UIcon name="i-heroicons-exclamation-triangle" class="error-icon" />
        <h1>Artwork Not Found</h1>
        <p>Sorry, we couldn't find the artwork you're looking for.</p>
        <NuxtLink to="/" class="back-button">
          <UIcon name="i-heroicons-arrow-left" />
          Back to Gallery
        </NuxtLink>
      </div>
    </div>

    <!-- Artwork Content -->
    <main v-else-if="artwork" class="artwork-main">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <div class="container">
          <NuxtLink to="/" class="breadcrumb-link">Gallery</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ artwork.title }}</span>
        </div>
      </nav>

      <!-- Artwork Hero -->
      <section class="artwork-hero">
        <div class="container">
          <div class="artwork-grid">
            <!-- Image Section -->
            <div class="artwork-image-section">
              <div class="main-image-container">
                <NuxtImg
                  :src="getMediaUrl(artwork.image)"
                  :alt="artwork.title"
                  class="main-artwork-image"
                  loading="lazy"
                  format="webp"
                  quality="90"
                />
                
                <!-- Category Badge -->
                <div class="category-badge" v-if="artwork.category">
                  {{ artwork.category }}
                </div>
              </div>

              <!-- Additional Images -->
              <div v-if="artwork.additionalImages && artwork.additionalImages.length > 0" class="additional-images">
                <h3>More Views</h3>
                <div class="image-gallery">
                  <div 
                    v-for="(image, index) in artwork.additionalImages" 
                    :key="index"
                    class="gallery-thumb"
                    @click="openImageModal(image)"
                  >
                    <NuxtImg
                      :src="getMediaUrl(image)"
                      :alt="`${artwork.title} - view ${index + 1}`"
                      class="thumb-image"
                      loading="lazy"
                      format="webp"
                      quality="70"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Details Section -->
            <div class="artwork-details-section">
              <div class="artwork-header">
                <h1 class="artwork-title">{{ artwork.title }}</h1>
                
                <div class="artwork-actions">
                  <button @click="shareArtwork" class="action-button share">
                    <UIcon name="i-heroicons-share" />
                  </button>
                </div>
              </div>

              <!-- Description -->
              <div v-if="artwork.description" class="artwork-description">
                <h2>About This Piece</h2>
                <div class="description-content" v-html="getDescriptionText(artwork.description)"></div>
              </div>

              <!-- Artwork Info -->
              <div class="artwork-info">
                <div class="info-item">
                  <span class="info-label">Views</span>
                  <span class="info-value">{{ formatViewCount(artwork.views || 0) }}</span>
                </div>
                <div class="info-item" v-if="artwork.category">
                  <span class="info-label">Category</span>
                  <span class="info-value">{{ artwork.category }}</span>
                </div>
                <div class="info-item" v-if="artwork.createdAt">
                  <span class="info-label">Created</span>
                  <span class="info-value">{{ formatDate(artwork.createdAt) }}</span>
                </div>
                <div class="info-item" v-if="artwork.featured">
                  <span class="info-label">Featured</span>
                  <span class="info-value featured-badge">✨ Featured Artwork</span>
                </div>
              </div>

              <!-- Contact for Commission -->
              <div class="commission-cta">
                <h3>Interested in Similar Work?</h3>
                <p>Commission a custom piece inspired by this artwork</p>
                <NuxtLink to="/contact" class="commission-button">
                  <UIcon name="i-heroicons-chat-bubble-left-ellipsis" />
                  Get in Touch
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Comments Section -->
      <section class="comments-section">
        <div class="container">
          <div class="comments-container">
            <h2 class="comments-title">
              Comments 
              <span class="comments-count" v-if="approvedComments.length > 0">
                ({{ approvedComments.length }})
              </span>
            </h2>

            <!-- Comment Form -->
            <div class="comment-form-container">
              <h3>Leave a Comment</h3>
              <form @submit.prevent="submitComment" class="comment-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="comment-name">Name *</label>
                    <input
                      id="comment-name"
                      v-model="commentForm.name"
                      type="text"
                      required
                      maxlength="100"
                      placeholder="Your name"
                      class="form-input"
                      :class="{ error: commentErrors.name }"
                    />
                    <span v-if="commentErrors.name" class="error-text">{{ commentErrors.name }}</span>
                  </div>
                  <div class="form-group">
                    <label for="comment-email">Email *</label>
                    <input
                      id="comment-email"
                      v-model="commentForm.email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      class="form-input"
                      :class="{ error: commentErrors.email }"
                    />
                    <span v-if="commentErrors.email" class="error-text">{{ commentErrors.email }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="comment-content">Comment *</label>
                  <textarea
                    id="comment-content"
                    v-model="commentForm.content"
                    required
                    maxlength="1000"
                    placeholder="Share your thoughts about this artwork..."
                    class="form-textarea"
                    :class="{ error: commentErrors.content }"
                    rows="4"
                  ></textarea>
                  <div class="char-counter">{{ commentForm.content.length }}/1000</div>
                  <span v-if="commentErrors.content" class="error-text">{{ commentErrors.content }}</span>
                </div>

                <button 
                  type="submit" 
                  class="submit-comment-button"
                  :disabled="isSubmittingComment"
                >
                  <span v-if="!isSubmittingComment">Post Comment</span>
                  <span v-else class="loading-content">
                    <div class="button-spinner"></div>
                    Posting...
                  </span>
                </button>

                <p class="moderation-note">
                  Comments are moderated and will appear after approval.
                </p>
              </form>

              <!-- Comment Success/Error Messages -->
              <div v-if="commentSuccess" class="success-message">
                <UIcon name="i-heroicons-check-circle" />
                Comment submitted! It will appear after moderation.
              </div>
              <div v-if="commentError" class="error-message">
                <UIcon name="i-heroicons-exclamation-triangle" />
                {{ commentError }}
              </div>
            </div>

            <!-- Comments List -->
            <div class="comments-list" v-if="approvedComments.length > 0">
              <div 
                v-for="comment in approvedComments" 
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <UIcon name="i-heroicons-user-circle" />
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.authorName }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div v-else class="no-comments">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Artworks -->
      <section class="related-section" v-if="relatedArtworks.length > 0">
        <div class="container">
          <h2 class="related-title">More Artworks</h2>
          <div class="related-grid">
            <NuxtLink 
              v-for="relatedArtwork in relatedArtworks" 
              :key="relatedArtwork.id"
              :to="`/artwork/${relatedArtwork.slug}`"
              class="related-card"
            >
              <div class="related-image">
                <NuxtImg
                  :src="getMediaUrl(relatedArtwork.image)"
                  :alt="relatedArtwork.title"
                  class="related-artwork-image"
                  loading="lazy"
                  format="webp"
                  quality="80"
                />
              </div>
              <div class="related-content">
                <h3>{{ relatedArtwork.title }}</h3>
                <span class="related-category">{{ relatedArtwork.category }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Image Modal for Additional Images -->
    <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal" @click.stop>
        <button @click="closeImageModal" class="modal-close-button">
          <UIcon name="i-heroicons-x-mark" />
        </button>
        <NuxtImg
          v-if="selectedImage"
          :src="getMediaUrl(selectedImage)"
          :alt="artwork.title"
          class="modal-image"
          format="webp"
          quality="95"
        />
      </div>
    </div>

    <!-- Social Share Modal -->
    <SocialShareModal 
      :is-open="showShareModal" 
      :artwork="artwork"
      @close="showShareModal = false" 
    />
  </div>
</template>

<script setup>
// Get route params
const route = useRoute()
const slug = route.params.slug

// Head meta (will be updated when artwork loads)
useHead({
  title: 'Artwork - Misia\'s Art Portfolio',
  meta: [
    { name: 'description', content: 'View artwork details from Misia\'s art portfolio.' }
  ]
})

// Mobile menu state
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Composables
const { fetchArtwork, fetchArtworks, getMediaUrl, submitComment: strapiSubmitComment } = useStrapi()
const { trackView, formatViewCount } = useArtwork()

// Fetch artwork data
const { data: artworkResponse, pending, error } = await fetchArtwork(slug)

// Extract single artwork from response array
const artwork = computed(() => {
  if (artworkResponse.value?.data && artworkResponse.value.data.length > 0) {
    return artworkResponse.value.data[0]
  }
  return null
})

// Fetch related artworks (same category, excluding current)
const { data: allArtworks } = await fetchArtworks()
const relatedArtworks = computed(() => {
  if (!artwork.value || !allArtworks.value?.data) return []
  
  return allArtworks.value.data
    .filter(item => 
      item.id !== artwork.value.id && 
      item.category === artwork.value.category &&
      item.published
    )
    .slice(0, 3)
})

// Helper function to extract text from rich text description
const getDescriptionText = (description) => {
  if (!description) return ''
  
  // If it's already a string, return it
  if (typeof description === 'string') {
    return description
  }
  
  // Handle Strapi rich text format (array of blocks)
  if (Array.isArray(description)) {
    return description
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
  if (description.type === 'paragraph' && description.children) {
    return description.children.map(child => child.text || '').join('')
  }
  
  return ''
}

// Update head when artwork loads
watch(artwork, (newArtwork) => {
  if (newArtwork) {
    const descriptionText = getDescriptionText(newArtwork.description)
    useHead({
      title: `${newArtwork.title} - Misia's Art Portfolio`,
      meta: [
        { name: 'description', content: descriptionText ? 
          descriptionText.substring(0, 160) : 
          `View "${newArtwork.title}" from Misia's art portfolio.` 
        }
      ]
    })
  }
}, { immediate: true })

// Comments
const approvedComments = computed(() => {
  return artwork.value?.comments?.filter(comment => comment.approved) || []
})

// Comment form
const commentForm = reactive({
  name: '',
  email: '',
  content: ''
})

const commentErrors = reactive({
  name: '',
  email: '',
  content: ''
})

const isSubmittingComment = ref(false)
const commentSuccess = ref(false)
const commentError = ref('')

// Comment validation and submission
const validateComment = () => {
  commentErrors.name = ''
  commentErrors.email = ''
  commentErrors.content = ''

  let isValid = true

  if (!commentForm.name.trim()) {
    commentErrors.name = 'Name is required'
    isValid = false
  }

  if (!commentForm.email.trim()) {
    commentErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commentForm.email)) {
    commentErrors.email = 'Invalid email format'
    isValid = false
  }

  if (!commentForm.content.trim()) {
    commentErrors.content = 'Comment is required'
    isValid = false
  }

  return isValid
}

const submitComment = async () => {
  if (!validateComment()) return

  isSubmittingComment.value = true
  commentError.value = ''
  commentSuccess.value = false

  try {
    await strapiSubmitComment({
      content: commentForm.content.trim(),
      authorName: commentForm.name.trim(),
      authorEmail: commentForm.email.trim(),
      artwork: artwork.value.id
    })

    // Reset form
    commentForm.name = ''
    commentForm.email = ''
    commentForm.content = ''
    
    commentSuccess.value = true

    // Hide success message after 5 seconds
    setTimeout(() => {
      commentSuccess.value = false
    }, 5000)

  } catch (error) {
    commentError.value = error.message || 'Failed to submit comment'
  } finally {
    isSubmittingComment.value = false
  }
}

// Social sharing
const { shareArtwork: hybridShare, isMobile } = useSocialShare()
const showShareModal = ref(false)

const shareArtwork = async () => {
  if (!artwork.value) return

  const result = await hybridShare(artwork.value)
  
  if (result.method === 'desktop' && !isMobile.value) {
    // Show desktop social sharing modal
    showShareModal.value = true
  }
}

// Track view when artwork loads
watch(artwork, (newArtwork) => {
  if (newArtwork) {
    trackView(newArtwork.id)
  }
}, { immediate: true })

// Image modal for additional images
const showImageModal = ref(false)
const selectedImage = ref(null)

const openImageModal = (image) => {
  selectedImage.value = image
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = null
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 404 handling - check if no artwork found
watch([artworkResponse, error], ([response, err]) => {
  // If we have a response but no artworks in the data array, it means the slug doesn't exist
  if (response?.data && Array.isArray(response.data) && response.data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Artwork not found'
    })
  }
  
  // Handle other errors
  if (err && err.statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Artwork not found'
    })
  }
}, { immediate: true })
</script>