<template>
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
              <strong>Debug info:</strong> Ensure Strapi is running on {{ config.public.strapiUrl }}
            </p>
            <button @click="$emit('refresh')" class="btn-primary mt-6">
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="artworks?.length === 0" class="text-center py-20">
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

        <!-- Artwork Grid -->
        <div v-else class="artwork-grid">
          <NuxtLink
              v-for="(artwork, index) in artworks"
              :key="artwork.id"
              :to="`/artwork/${artwork.slug}`"
              class="artwork-card group"
              :class="getFloatingClass(index)"
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
                <!-- Hover overlay with magnifying glass -->
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

              <div class="artwork-category-container">
                <span class="artwork-category" :class="getCategoryClass(artwork.category)">
                  {{ artwork.category }}
                </span>
              </div>

              <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {{ getCleanDescription(artwork) }}
              </p>

              <!-- Comments Preview -->
              <div class="comments-preview mb-4">
                <div class="comments-count" v-if="getApprovedComments(artwork).length > 0">
                  <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="h-4 w-4 text-pink-peony" />
                  <span class="text-sm text-gray-500">
                      {{ getApprovedComments(artwork).length }} {{ getApprovedComments(artwork).length === 1 ? 'comment' : 'comments' }}
                    </span>
                </div>
                <div v-if="getApprovedComments(artwork).length > 0" class="latest-comment mt-2 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600 line-clamp-2">
                    "{{ getCommentContent(getApprovedComments(artwork)[0]) }}"
                  </p>
                  <span class="text-xs text-gray-400 mt-1 block">
                      - {{ getCommentAuthor(getApprovedComments(artwork)[0]) }}
                    </span>
                </div>
              </div>

              <!-- Modern Artwork Actions -->
              <div class="artwork-actions">
                <NuxtLink :to="`/artwork/${artwork.slug}`" class="artwork-action-btn primary">
                  <UIcon name="i-heroicons-eye" class="h-4 w-4" />
                  <span>View Details</span>
                </NuxtLink>
                <div class="artwork-action-icons">
                  <button @click.stop="$emit('toggle-favorite', artwork)" class="artwork-icon-btn" title="Add to favorites">
                    <UIcon name="i-heroicons-heart" class="h-4 w-4" />
                  </button>
                  <button @click.stop="$emit('share-artwork', artwork)" class="artwork-icon-btn" title="Share artwork">
                    <UIcon name="i-heroicons-share" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  artworks: {
    type: Array,
    default: () => []
  },
  pending: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  }
})

defineEmits(['refresh', 'toggle-favorite', 'share-artwork'])

const config = useRuntimeConfig()

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

const onImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
}
</script>
<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
