<template>
  <div v-if="isOpen" class="share-modal-overlay" @click="$emit('close')">
    <div class="share-modal" @click.stop>
      <!-- Header -->
      <div class="share-modal-header">
        <h3 class="share-modal-title">Share this artwork</h3>
        <button @click="$emit('close')" class="share-modal-close">
          <UIcon name="i-heroicons-x-mark" />
        </button>
      </div>

      <!-- Artwork Preview -->
      <div class="share-modal-preview" v-if="artwork">
        <div class="preview-image">
          <NuxtImg
            :src="getArtworkImageUrl(artwork, 'thumbnail')"
            :alt="artwork.title"
            class="preview-img"
          />
        </div>
        <div class="preview-content">
          <h4 class="preview-title">{{ artwork.title }}</h4>
          <p class="preview-description">{{ artwork.category }}</p>
        </div>
      </div>

      <!-- Social Platforms -->
      <div class="share-platforms">
        <button
          v-for="platform in socialPlatforms"
          :key="platform.key"
          @click="handlePlatformClick(platform)"
          class="platform-button"
          :class="{ 'copy-button': platform.key === 'copy' }"
        >
          <div class="platform-icon" :style="{ backgroundColor: platform.color }">
            <UIcon :name="platform.icon" />
          </div>
          <span class="platform-name">{{ platform.name }}</span>
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="shareSuccess" class="share-success-message">
        <UIcon name="i-heroicons-check-circle" class="success-icon" />
        <span>Link copied to clipboard!</span>
      </div>
    </div>
  </div>
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

const emit = defineEmits(['close'])

// Composables
const { shareToSocial, copyToClipboard, getSocialPlatforms, shareSuccess } = useSocialShare()
const { getArtworkImageUrl } = useArtwork()

// Social platforms
const socialPlatforms = getSocialPlatforms()

// Share data
const shareData = computed(() => {
  if (!props.artwork) return null
  
  return {
    title: `${props.artwork.title} by Misia`,
    text: `Check out this beautiful artwork: "${props.artwork.title}"`,
    url: `${window.location.origin}/artwork/${props.artwork.slug}`
  }
})

// Handle platform click
const handlePlatformClick = async (platform) => {
  if (!shareData.value) return

  if (platform.key === 'copy') {
    await copyToClipboard(shareData.value.url)
    // Auto-close modal after copying
    setTimeout(() => {
      emit('close')
    }, 2000)
  } else {
    shareToSocial(platform.key, shareData.value)
    emit('close')
  }
}

// Close on escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.share-modal {
  background: var(--gradient-glass);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.share-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.share-modal-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--coral-pink);
  margin: 0;
}

.share-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.share-modal-preview {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
}

.preview-image {
  flex-shrink: 0;
}

.preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.preview-content {
  flex: 1;
  min-width: 0;
}

.preview-title {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.8rem;
}

.share-platforms {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.platform-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.platform-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.platform-button.copy-button:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.platform-button:hover .platform-icon {
  transform: scale(1.1);
}

.platform-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}

.share-success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-lg);
  color: #16a34a;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  animation: fadeInUp 0.3s ease-out;
}

.success-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .share-modal {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .share-platforms {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .platform-button {
    padding: 0.75rem 0.25rem;
  }
  
  .platform-icon {
    width: 32px;
    height: 32px;
  }
  
  .platform-name {
    font-size: 0.7rem;
  }
}
</style>