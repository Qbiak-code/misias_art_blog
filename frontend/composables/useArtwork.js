/**
 * useArtwork - Artwork state management composable
 * Manages artwork data, filtering, favorites, and gallery interactions
 */

export const useArtwork = () => {
  const { fetchArtworks, getImageUrl } = useStrapi()
  const config = useRuntimeConfig()

  // Reactive state
  const artworks = ref([])
  const selectedArtwork = ref(null)
  const currentCategory = ref('all')
  const isLoading = ref(false)
  const error = ref(null)

  // Available categories
  const categories = ref([
    { key: 'all', label: 'All Artworks' },
    { key: 'Paintings', label: 'Paintings' },
    { key: 'Digital Art', label: 'Digital Art' },
    { key: 'Experimental', label: 'Experimental' }
  ])

  /**
   * Load artworks from Strapi
   * @param {boolean} forceRefresh - Force refresh even if data exists
   */
  const loadArtworks = async (forceRefresh = false) => {
    if (artworks.value.length > 0 && !forceRefresh) {
      return artworks.value
    }

    try {
      isLoading.value = true
      error.value = null

      const { data, error: fetchError } = await fetchArtworks()
      
      if (fetchError.value) {
        throw fetchError.value
      }

      artworks.value = data.value?.data || []
      return artworks.value
    } catch (err) {
      error.value = err
      console.error('Error loading artworks:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get filtered artworks based on current category
   */
  const filteredArtworks = computed(() => {
    if (currentCategory.value === 'all') {
      return artworks.value
    }
    return artworks.value.filter(artwork => 
      artwork.category === currentCategory.value
    )
  })

  /**
   * Get featured artworks
   */
  const featuredArtworks = computed(() => {
    return artworks.value.filter(artwork => artwork.featured === true)
  })

  /**
   * Set current category filter
   * @param {string} category - Category to filter by
   */
  const setCategory = (category) => {
    currentCategory.value = category
  }

  /**
   * Select an artwork (for lightbox, etc.)
   * @param {object} artwork - Artwork object
   */
  const selectArtwork = (artwork) => {
    selectedArtwork.value = artwork
  }

  /**
   * Clear selected artwork
   */
  const clearSelection = () => {
    selectedArtwork.value = null
  }

  /**
   * Track view for an artwork
   * @param {string} artworkId - Artwork ID
   */
  const trackView = async (artworkId) => {
    if (!artworkId || !process.client) return

    try {
      const { data } = await $fetch(`/api/artworks/${artworkId}/view`, {
        method: 'POST',
        baseURL: config.public.strapiUrl
      })
      
      // Update local artwork data with new view count
      if (data?.views) {
        const artworkIndex = artworks.value.findIndex(artwork => 
          artwork.id === artworkId || artwork.documentId === artworkId
        )
        
        if (artworkIndex !== -1) {
          artworks.value[artworkIndex].views = data.views
        }
      }
      
      return data
    } catch (error) {
      console.warn('Failed to track view:', error)
      // Don't throw error - view tracking should be non-blocking
    }
  }

  /**
   * Get artwork by slug or ID
   * @param {string} identifier - Artwork slug or ID
   * @returns {object|null}
   */
  const getArtworkByIdentifier = (identifier) => {
    return artworks.value.find(artwork => 
      artwork.slug === identifier || 
      artwork.id === identifier ||
      artwork.documentId === identifier
    )
  }

  /**
   * Get artwork image URL with specific format
   * @param {object} artwork - Artwork object
   * @param {string} format - Image format (thumbnail, small, medium, large)
   * @returns {string|null}
   */
  const getArtworkImageUrl = (artwork, format = 'medium') => {
    if (!artwork?.image) return null
    return getImageUrl(artwork.image, format)
  }

  /**
   * Get artwork thumbnail URL
   * @param {object} artwork - Artwork object
   * @returns {string|null}
   */
  const getArtworkThumbnail = (artwork) => {
    return getArtworkImageUrl(artwork, 'thumbnail')
  }

  /**
   * Share artwork using hybrid social sharing system
   * @param {object} artwork - Artwork object
   */
  const shareArtwork = async (artwork) => {
    if (!artwork) return
    
    // Use the social sharing composable
    const { shareArtwork: hybridShare } = useSocialShare()
    return await hybridShare(artwork)
  }

  /**
   * Get artwork stats (comments count, views, etc.)
   * @param {object} artwork - Artwork object
   * @returns {object}
   */
  const getArtworkStats = (artwork) => {
    if (!artwork) return { commentsCount: 0, views: 0 }
    
    return {
      commentsCount: artwork.comments?.length || 0,
      views: artwork.views || 0,
      isFeatured: artwork.featured || false,
      category: artwork.category || 'Uncategorized'
    }
  }

  /**
   * Format view count for display
   * @param {number} views - View count
   * @returns {string}
   */
  const formatViewCount = (views) => {
    if (!views || views === 0) return '0 views'
    if (views === 1) return '1 view'
    if (views < 1000) return `${views} views`
    if (views < 1000000) return `${(views / 1000).toFixed(1)}k views`
    return `${(views / 1000000).toFixed(1)}M views`
  }

  return {
    // State
    artworks: readonly(artworks),
    selectedArtwork: readonly(selectedArtwork),
    currentCategory: readonly(currentCategory),
    isLoading: readonly(isLoading),
    error: readonly(error),
    categories: readonly(categories),

    // Computed
    filteredArtworks,
    featuredArtworks,

    // Actions
    loadArtworks,
    setCategory,
    selectArtwork,
    clearSelection,
    trackView,
    getArtworkByIdentifier,
    getArtworkImageUrl,
    getArtworkThumbnail,
    shareArtwork,
    getArtworkStats,
    formatViewCount
  }
}