<template>
  <Teleport to="body">
    <div class="lightbox-overlay" :class="{ open: isOpen }" @click="$emit('close')">
      <div class="lightbox-modal" @click.stop v-if="artwork">
        <button @click="$emit('close')" class="lightbox-close">
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
        </button>

        <!-- Image Section -->
        <div class="lightbox-image-section">
          <div v-if="imageUrl" class="image-container">
            <NuxtImg
                :src="imageUrl"
                :alt="artwork.title"
                class="lightbox-image"
            />
          </div>
        </div>

        <!-- Content Section with Fixed Header -->
        <div class="lightbox-content-section">
          <!-- Fixed Header -->
          <div class="content-header-fixed">
            <!-- Mobile Layout -->
            <div class="mobile-header">
              <div class="title-row">
                <h2 class="artwork-title">{{ artwork.title }}</h2>
                <span class="artwork-category" :class="getCategoryClass(artwork.category)">
                  {{ artwork.category }}
                </span>
              </div>
              <div class="date-row" v-if="artwork.createdAt">
                <p class="artwork-date-text">
                  {{ formatDate(artwork.createdAt) }}
                </p>
                <div class="action-buttons-inline">
                  <button @click="$emit('toggle-favorite', artwork)" class="action-btn">
                    <UIcon name="i-heroicons-heart" class="h-4 w-4" />
                  </button>
                  <button @click="$emit('share-artwork', artwork)" class="action-btn">
                    <UIcon name="i-heroicons-share" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Desktop Layout -->
            <div class="desktop-header">
              <h2 class="artwork-title">{{ artwork.title }}</h2>
              <p v-if="artwork.createdAt" class="artwork-date-text">
                {{ formatDate(artwork.createdAt) }}
              </p>
              <div class="artwork-meta-row">
                <span class="artwork-category" :class="getCategoryClass(artwork.category)">
                  {{ artwork.category }}
                </span>
                <div class="action-buttons-inline">
                  <button @click="$emit('toggle-favorite', artwork)" class="action-btn">
                    <UIcon name="i-heroicons-heart" class="h-4 w-4" />
                  </button>
                  <button @click="$emit('share-artwork', artwork)" class="action-btn">
                    <UIcon name="i-heroicons-share" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Scrollable Content -->
          <div class="content-scroll-area">
            <!-- Description -->
            <div class="content-description">
              <p>{{ cleanDescription }}</p>
            </div>

            <!-- Comments Section -->
            <div class="content-comments">
              <div class="comments-header-simple">
                <h3>Comments ({{ approvedComments.length }})</h3>
                <button @click="toggleCommentForm" class="toggle-form-btn">
                  <UIcon :name="showCommentForm ? 'i-heroicons-chevron-up' : 'i-heroicons-plus'" class="h-4 w-4" />
                  {{ showCommentForm ? 'Cancel' : 'Add Comment' }}
                </button>
              </div>

              <!-- Comment Form -->
              <div v-if="showCommentForm" ref="commentFormRef" class="quick-comment-form">
                <form @submit.prevent="handleSubmitComment">
                  <div class="form-grid">
                    <input v-model="commentForm.authorName" type="text" required maxlength="100" placeholder="Name" />
                    <input v-model="commentForm.authorEmail" type="email" required placeholder="Email" />
                  </div>
                  <textarea v-model="commentForm.content" required maxlength="1000" rows="3" placeholder="Your thoughts..."></textarea>
                  <div class="form-bottom">
                    <span class="char-counter">{{ commentForm.content.length }}/1000</span>
                    <button type="submit" class="submit-btn" :disabled="commentSubmitting">
                      <UIcon v-if="commentSubmitting" name="i-heroicons-arrow-path" class="animate-spin" />
                      {{ commentSubmitting ? 'Posting...' : 'Post Comment' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Comments List -->
              <div class="comments-list-simple">
                <div v-if="approvedComments.length === 0" class="empty-comments">
                  <p>No comments yet. Share your thoughts!</p>
                </div>
                <div v-else class="comment-items">
                  <div v-for="comment in approvedComments" :key="comment.id" class="comment-simple">
                    <div class="comment-header-simple">
                      <strong>{{ getCommentAuthor(comment) }}</strong>
                      <span>{{ formatDate(getCommentDate(comment)) }}</span>
                    </div>
                    <p>{{ getCommentContent(comment) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  artwork: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'toggle-favorite', 'share-artwork', 'submit-comment'])

// Local state for comment form
const showCommentForm = ref(false)
const commentSubmitting = ref(false)
const commentFormRef = ref(null)
const commentForm = ref({
  authorName: '',
  authorEmail: '',
  content: ''
})

// Computed properties
const imageUrl = computed(() => getImageUrl(props.artwork))
const cleanDescription = computed(() => getCleanDescription(props.artwork))
const approvedComments = computed(() => getApprovedComments(props.artwork))

// Helper functions
const getImageUrl = (artwork) => {
  if (!artwork?.image) return null

  const config = useRuntimeConfig()

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
  return null
}

const getCleanDescription = (artwork) => {
  if (!artwork?.description) {
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

  return 'A beautiful artwork waiting to tell its story.'
}

const getApprovedComments = (artwork) => {
  if (!artwork?.comments) return []

  // Handle different Strapi response structures
  let comments = []
  if (artwork.comments.data) {
    comments = artwork.comments.data
  } else if (Array.isArray(artwork.comments)) {
    comments = artwork.comments
  }

  // Filter for approved comments only
  return comments.filter(comment => {
    const approved = comment.approved !== undefined ? comment.approved : comment.attributes?.approved
    return approved === true
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt || a.attributes?.createdAt)
    const dateB = new Date(b.createdAt || b.attributes?.createdAt)
    return dateB - dateA
  })
}

const getCategoryClass = (category) => {
  const classes = {
    'Paintings': 'category-paintings',
    'Digital Art': 'category-digital',
    'Experimental': 'category-experimental'
  }
  return classes[category] || 'category-paintings'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

// Comment form methods
const toggleCommentForm = async () => {
  showCommentForm.value = !showCommentForm.value

  if (showCommentForm.value) {
    await nextTick()
    if (commentFormRef.value) {
      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        commentFormRef.value.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }
  }
}

const handleSubmitComment = async () => {
  if (!props.artwork || commentSubmitting.value) return

  commentSubmitting.value = true

  const commentData = {
    ...commentForm.value,
    artwork: props.artwork.id
  }

  // Emit to parent to handle API call
  emit('submit-comment', commentData)

  // Reset form
  commentForm.value = {
    authorName: '',
    authorEmail: '',
    content: ''
  }
  showCommentForm.value = false
  commentSubmitting.value = false
}

// Watch for lightbox closing to reset form
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    showCommentForm.value = false
    commentForm.value = {
      authorName: '',
      authorEmail: '',
      content: ''
    }
    commentSubmitting.value = false
  }
})
</script>
