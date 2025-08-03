/**
 * useSocialShare - Hybrid social sharing composable
 * Provides native mobile sharing + desktop social buttons + clipboard fallback
 */

export const useSocialShare = () => {
  const shareSuccess = ref(false)
  const shareError = ref('')

  /**
   * Check if native sharing is available
   */
  const isNativeShareAvailable = computed(() => {
    return process.client && navigator.share && navigator.canShare
  })

  /**
   * Check if device is mobile
   */
  const isMobile = computed(() => {
    if (!process.client) return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  })

  /**
   * Main share function - chooses best sharing method
   */
  const shareArtwork = async (artwork) => {
    if (!artwork) return

    const shareData = {
      title: `${artwork.title} by Misia`,
      text: `Check out this beautiful artwork: "${artwork.title}"`,
      url: `${window.location.origin}/artwork/${artwork.slug}`
    }

    try {
      // Try native sharing first (mobile preferred)
      if (isNativeShareAvailable.value && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        return { success: true, method: 'native' }
      }

      // Fallback to desktop sharing options
      if (isMobile.value) {
        // Mobile without native share - copy to clipboard
        await copyToClipboard(shareData.url)
        return { success: true, method: 'clipboard' }
      } else {
        // Desktop - show social buttons modal
        return { success: true, method: 'desktop', shareData }
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled native share
        return { success: false, cancelled: true }
      }

      console.error('Share error:', error)
      // Final fallback - copy to clipboard
      try {
        await copyToClipboard(shareData.url)
        return { success: true, method: 'clipboard' }
      } catch {
        return { success: false, error: 'Unable to share' }
      }
    }
  }

  /**
   * Copy URL to clipboard with user feedback
   */
  const copyToClipboard = async (url) => {
    await navigator.clipboard.writeText(url)
    
    shareSuccess.value = true
    setTimeout(() => {
      shareSuccess.value = false
    }, 3000)
  }

  /**
   * Share to specific social platform
   */
  const shareToSocial = (platform, shareData) => {
    const { title, text, url } = shareData
    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(`${title} - ${text}`)

    const socialUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      tumblr: `https://www.tumblr.com/share/link?url=${encodedUrl}&name=${encodeURIComponent(title)}&description=${encodeURIComponent(text)}`
    }

    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  /**
   * Get sharing options for desktop
   */
  const getSocialPlatforms = () => [
    { key: 'facebook', name: 'Facebook', icon: 'i-heroicons-share', color: '#1877F2' },
    { key: 'twitter', name: 'Twitter', icon: 'i-heroicons-chat-bubble-left-ellipsis', color: '#1DA1F2' },
    { key: 'pinterest', name: 'Pinterest', icon: 'i-heroicons-photo', color: '#E60023' },
    { key: 'reddit', name: 'Reddit', icon: 'i-heroicons-chat-bubble-oval-left', color: '#FF4500' },
    { key: 'linkedin', name: 'LinkedIn', icon: 'i-heroicons-briefcase', color: '#0A66C2' },
    { key: 'copy', name: 'Copy Link', icon: 'i-heroicons-clipboard', color: '#6B7280' }
  ]

  /**
   * Clear success/error states
   */
  const clearShareState = () => {
    shareSuccess.value = false
    shareError.value = ''
  }

  return {
    // State
    shareSuccess: readonly(shareSuccess),
    shareError: readonly(shareError),
    
    // Computed
    isNativeShareAvailable,
    isMobile,
    
    // Actions
    shareArtwork,
    shareToSocial,
    copyToClipboard,
    getSocialPlatforms,
    clearShareState
  }
}