/**
 * useStrapi - Centralized Strapi API composable
 * Provides reusable functions for interacting with the Strapi backend
 */

export const useStrapi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.strapiUrl

  /**
   * Generic function to make API calls to Strapi
   * @param {string} endpoint - The API endpoint (e.g., '/api/artworks')
   * @param {object} options - Additional fetch options
   * @returns {Promise} - Fetch promise with data, pending, error, refresh
   */
  const strapiApi = (endpoint, options = {}) => {
    return useFetch(endpoint, {
      baseURL,
      ...options
    })
  }

  /**
   * Fetch all artworks with population
   * @param {object} query - Query parameters
   * @returns {Promise} - Artworks data
   */
  const fetchArtworks = (query = { populate: '*' }) => {
    return strapiApi('/api/artworks', { query })
  }

  /**
   * Fetch single artwork by slug or ID
   * @param {string} identifier - Artwork slug or ID
   * @returns {Promise} - Single artwork data
   */
  const fetchArtwork = (identifier) => {
    return strapiApi(`/api/artworks/${identifier}`, {
      query: { populate: '*' }
    })
  }

  /**
   * Fetch comments for a specific artwork
   * @param {string} artworkId - Artwork ID
   * @returns {Promise} - Comments data
   */
  const fetchComments = (artworkId) => {
    return strapiApi('/api/comments', {
      query: {
        'filters[artwork][id][$eq]': artworkId,
        'filters[approved][$eq]': true,
        'populate': 'artwork',
        'sort': 'createdAt:desc'
      }
    })
  }

  /**
   * Submit a new comment
   * @param {object} commentData - Comment form data
   * @returns {Promise} - Submit response
   */
  const submitComment = async (commentData) => {
    try {
      const response = await $fetch('/api/comments', {
        baseURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          data: commentData
        }
      })
      return { success: true, data: response }
    } catch (error) {
      console.error('Error submitting comment:', error)
      return { success: false, error }
    }
  }

  /**
   * Submit a contact message
   * @param {object} messageData - Contact form data
   * @returns {Promise} - Submit response
   */
  const submitContactMessage = async (messageData) => {
    try {
      const response = await $fetch('/api/contact-messages', {
        baseURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          data: messageData
        }
      })
      return { success: true, data: response }
    } catch (error) {
      console.error('Error submitting contact message:', error)
      return { success: false, error }
    }
  }

  /**
   * Fetch artist statement
   * @returns {Promise} - Artist statement data
   */
  const fetchArtistStatement = () => {
    return strapiApi('/api/artist-statement', {
      query: { populate: '*' }
    })
  }

  /**
   * Build Strapi media URL
   * @param {object} media - Strapi media object
   * @returns {string} - Full media URL
   */
  const getMediaUrl = (media) => {
    if (!media?.url) return null
    
    // Handle both direct URLs and relative paths
    if (media.url.startsWith('http')) {
      return media.url
    }
    
    return `${baseURL}${media.url}`
  }

  /**
   * Get image with specific format (thumbnail, small, medium, large)
   * @param {object} image - Strapi image object
   * @param {string} format - Image format size
   * @returns {string} - Image URL
   */
  const getImageUrl = (image, format = 'medium') => {
    if (!image) return null
    
    // Try to get the specific format
    const formatImage = image.formats?.[format]
    if (formatImage) {
      return getMediaUrl(formatImage)
    }
    
    // Fallback to original image
    return getMediaUrl(image)
  }

  return {
    // API functions
    strapiApi,
    fetchArtworks,
    fetchArtwork,
    fetchComments,
    submitComment,
    submitContactMessage,
    fetchArtistStatement,
    
    // Utility functions
    getMediaUrl,
    getImageUrl,
    
    // Config
    baseURL
  }
}