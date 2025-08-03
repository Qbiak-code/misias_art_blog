/**
 * useArtwork - Artwork state management composable
 * Manages artwork data, filtering, favorites, and gallery interactions
 */

export const useArtwork = () => {
  const { fetchArtworks, getImageUrl } = useStrapi()

  // Reactive state
  const artworks = ref([])
  const selectedArtwork = ref(null)
  const favorites = ref(new Set())
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
   * Toggle artwork as favorite
   * @param {string} artworkId - Artwork ID
   */
  const toggleFavorite = (artworkId) => {
    if (favorites.value.has(artworkId)) {
      favorites.value.delete(artworkId)
    } else {
      favorites.value.add(artworkId)
    }
    
    // Persist to localStorage
    localStorage.setItem('artwork-favorites', JSON.stringify([...favorites.value]))
  }

  /**
   * Check if artwork is favorited
   * @param {string} artworkId - Artwork ID
   * @returns {boolean}
   */
  const isFavorite = (artworkId) => {
    return favorites.value.has(artworkId)
  }

  /**
   * Load favorites from localStorage
   */
  const loadFavorites = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('artwork-favorites')
        if (stored) {
          const favArray = JSON.parse(stored)
          favorites.value = new Set(favArray)
        }
      } catch (err) {
        console.warn('Error loading favorites:', err)
      }
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
   * Share artwork
   * @param {object} artwork - Artwork object
   */
  const shareArtwork = async (artwork) => {
    if (!artwork) return

    const shareData = {
      title: artwork.title,
      text: `Check out this amazing artwork: ${artwork.title}`,
      url: window.location.origin + `/artwork/${artwork.slug || artwork.id}`
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        // You might want to show a toast notification here
        console.log('Link copied to clipboard!')
      }
    } catch (err) {
      console.warn('Error sharing artwork:', err)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        console.log('Link copied to clipboard!')
      } catch (clipboardErr) {
        console.error('Could not copy to clipboard:', clipboardErr)
      }
    }
  }

  /**
   * Get artwork stats (comments count, etc.)
   * @param {object} artwork - Artwork object
   * @returns {object}
   */
  const getArtworkStats = (artwork) => {
    if (!artwork) return { commentsCount: 0 }
    
    return {
      commentsCount: artwork.comments?.length || 0,
      isFeatured: artwork.featured || false,
      category: artwork.category || 'Uncategorized'
    }
  }

  // Initialize favorites on client-side
  if (process.client) {
    loadFavorites()
  }

  return {
    // State
    artworks: readonly(artworks),
    selectedArtwork: readonly(selectedArtwork),
    favorites: readonly(favorites),
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
    toggleFavorite,
    isFavorite,
    loadFavorites,
    getArtworkByIdentifier,
    getArtworkImageUrl,
    getArtworkThumbnail,
    shareArtwork,
    getArtworkStats
  }
}