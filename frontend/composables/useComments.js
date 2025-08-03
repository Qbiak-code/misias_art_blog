/**
 * useComments - Comment system composable
 * Manages comment submission, validation, and display for artworks
 */

export const useComments = () => {
  const { fetchComments, submitComment } = useStrapi()

  // Comment form state
  const commentForm = ref({
    authorName: '',
    authorEmail: '',
    content: '',
    artwork: null
  })

  // UI state
  const isSubmitting = ref(false)
  const showCommentForm = ref(false)
  const submitMessage = ref('')
  const submitMessageType = ref('') // 'success' | 'error'

  // Comments data
  const artworkComments = ref(new Map()) // Map<artworkId, comments[]>
  const loadingComments = ref(new Set()) // Set<artworkId>

  // Form validation rules
  const validationRules = {
    authorName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-'\.]+$/
    },
    authorEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    content: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  }

  /**
   * Validate a form field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {object} Validation result
   */
  const validateField = (field, value) => {
    const rules = validationRules[field]
    if (!rules) return { isValid: true, message: '' }

    // Required check
    if (rules.required && (!value || value.trim().length === 0)) {
      return {
        isValid: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    }

    // Length checks
    if (rules.minLength && value.length < rules.minLength) {
      return {
        isValid: false,
        message: `Must be at least ${rules.minLength} characters`
      }
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        isValid: false,
        message: `Must be no more than ${rules.maxLength} characters`
      }
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
      if (field === 'authorEmail') {
        return {
          isValid: false,
          message: 'Please enter a valid email address'
        }
      }
      if (field === 'authorName') {
        return {
          isValid: false,
          message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        }
      }
    }

    return { isValid: true, message: '' }
  }

  /**
   * Validate entire comment form
   * @returns {object} Validation result with errors
   */
  const validateForm = () => {
    const errors = {}
    let isValid = true

    for (const [field, value] of Object.entries(commentForm.value)) {
      if (field === 'artwork') continue // Skip artwork field
      
      const validation = validateField(field, value)
      if (!validation.isValid) {
        errors[field] = validation.message
        isValid = false
      }
    }

    return { isValid, errors }
  }

  /**
   * Get character count for content field
   */
  const contentCharCount = computed(() => {
    return commentForm.value.content.length
  })

  /**
   * Check if content is near limit
   */
  const isContentNearLimit = computed(() => {
    return contentCharCount.value > 900 // 90% of 1000 char limit
  })

  /**
   * Reset comment form
   */
  const resetForm = () => {
    commentForm.value = {
      authorName: '',
      authorEmail: '',
      content: '',
      artwork: null
    }
    submitMessage.value = ''
    submitMessageType.value = ''
  }

  /**
   * Submit comment
   * @returns {object} Submission result
   */
  const handleSubmitComment = async () => {
    if (isSubmitting.value) return { success: false, message: 'Already submitting...' }

    // Validate form
    const validation = validateForm()
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Please fix the form errors',
        errors: validation.errors
      }
    }

    if (!commentForm.value.artwork) {
      return {
        success: false,
        message: 'No artwork selected for comment'
      }
    }

    try {
      isSubmitting.value = true
      submitMessage.value = ''

      const commentData = {
        authorName: commentForm.value.authorName.trim(),
        authorEmail: commentForm.value.authorEmail.trim(),
        content: commentForm.value.content.trim(),
        artwork: commentForm.value.artwork.id || commentForm.value.artwork.documentId,
        approved: false // Comments require moderation
      }

      const result = await submitComment(commentData)

      if (result.success) {
        submitMessage.value = 'Comment submitted successfully! It will appear after moderation.'
        submitMessageType.value = 'success'
        
        // Reset form after short delay
        setTimeout(() => {
          resetForm()
        }, 2000)

        return {
          success: true,
          message: 'Comment submitted successfully'
        }
      } else {
        throw result.error || new Error('Failed to submit comment')
      }

    } catch (error) {
      console.error('Error submitting comment:', error)
      submitMessage.value = 'Failed to submit comment. Please try again.'
      submitMessageType.value = 'error'
      
      return {
        success: false,
        message: 'Failed to submit comment',
        error
      }
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Load comments for a specific artwork
   * @param {string} artworkId - Artwork ID
   * @returns {array} Comments array
   */
  const loadArtworkComments = async (artworkId) => {
    if (loadingComments.value.has(artworkId)) {
      return artworkComments.value.get(artworkId) || []
    }

    try {
      loadingComments.value.add(artworkId)

      const { data, error } = await fetchComments(artworkId)
      
      if (error.value) {
        throw error.value
      }

      const comments = data.value?.data || []
      artworkComments.value.set(artworkId, comments)
      
      return comments
    } catch (err) {
      console.error('Error loading comments:', err)
      return []
    } finally {
      loadingComments.value.delete(artworkId)
    }
  }

  /**
   * Get comments for a specific artwork
   * @param {string} artworkId - Artwork ID
   * @returns {array} Comments array
   */
  const getArtworkComments = (artworkId) => {
    return artworkComments.value.get(artworkId) || []
  }

  return {
    // Form state
    commentForm,
    isSubmitting: readonly(isSubmitting),
    showCommentForm: readonly(showCommentForm),
    submitMessage: readonly(submitMessage),
    submitMessageType: readonly(submitMessageType),

    // Computed
    contentCharCount,
    isContentNearLimit,

    // Form actions
    validateField,
    validateForm,
    resetForm,
    handleSubmitComment,

    // Comments data
    loadArtworkComments,
    getArtworkComments
  }
}