<template>
  <div class="contact-page">
    <!-- Header -->
    <AppHeader 
      :mobile-menu-open="mobileMenuOpen" 
      @toggle-mobile-menu="toggleMobileMenu" 
    />
    
    <!-- Mobile Menu -->
    <MobileMenu :is-open="mobileMenuOpen" @close="mobileMenuOpen = false" />
    
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="contact-hero-content">
          <h1 class="contact-title">Let's Connect</h1>
          <p class="contact-subtitle">Share your thoughts, commission requests, or just say hello</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="contact-main">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-section">
            <div class="contact-card">
              <h2 class="form-title">Send a Message</h2>
              <p class="form-description">I'd love to hear from you! Whether it's about my artwork, a potential commission, or just to chat about art.</p>
              
              <form @submit.prevent="handleSubmit" class="contact-form">
                <!-- Name Field -->
                <div class="form-group">
                  <label for="name" class="form-label">Name *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    :class="{ 'error': errors.name }"
                    placeholder="Your full name"
                    required
                    maxlength="100"
                  />
                  <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </div>

                <!-- Email Field -->
                <div class="form-group">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    :class="{ 'error': errors.email }"
                    placeholder="your.email@example.com"
                    required
                  />
                  <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                </div>

                <!-- Subject Field -->
                <div class="form-group">
                  <label for="subject" class="form-label">Subject</label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    class="form-input"
                    placeholder="What's this about?"
                    maxlength="200"
                  />
                  <div class="char-counter">{{ form.subject.length }}/200</div>
                </div>

                <!-- Message Field -->
                <div class="form-group">
                  <label for="message" class="form-label">Message *</label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    class="form-textarea"
                    :class="{ 'error': errors.message }"
                    placeholder="Tell me about your thoughts, ideas, or commission requests..."
                    required
                    maxlength="2000"
                    rows="6"
                  ></textarea>
                  <div class="char-counter">{{ form.message.length }}/2000</div>
                  <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="submit-button"
                  :disabled="isSubmitting"
                  :class="{ 'loading': isSubmitting }"
                >
                  <span v-if="!isSubmitting">Send Message</span>
                  <span v-else class="loading-content">
                    <div class="button-spinner"></div>
                    Sending...
                  </span>
                </button>

                <!-- Success Message -->
                <div v-if="showSuccess" class="success-message">
                  <UIcon name="i-heroicons-check-circle" class="success-icon" />
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>Thanks for reaching out! I'll get back to you soon.</p>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="submitError" class="error-message">
                  <UIcon name="i-heroicons-exclamation-triangle" class="error-icon" />
                  <div>
                    <strong>Oops! Something went wrong.</strong>
                    <p>{{ submitError }}</p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="contact-info-section">
            <div class="contact-card">
              <h2 class="info-title">Get in Touch</h2>
              
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="method-icon">
                    <UIcon name="i-heroicons-envelope" />
                  </div>
                  <div class="method-content">
                    <h3>Email</h3>
                    <p>Preferred for commissions and detailed inquiries</p>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">
                    <UIcon name="i-heroicons-chat-bubble-left-ellipsis" />
                  </div>
                  <div class="method-content">
                    <h3>Quick Message</h3>
                    <p>Use the form for questions or just to say hi!</p>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">
                    <UIcon name="i-heroicons-heart" />
                  </div>
                  <div class="method-content">
                    <h3>Commission Work</h3>
                    <p>Custom paintings and digital art pieces available</p>
                  </div>
                </div>
              </div>

              <div class="response-info">
                <h3>Response Time</h3>
                <p>I typically respond within 24-48 hours. For commission inquiries, I'll provide detailed information about pricing, timeline, and the creative process.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Call to Action -->
    <CallToAction />
  </div>
</template>

<script setup>
// Head meta
useHead({
  title: 'Contact Misia - Commission Art & Get in Touch',
  meta: [
    { name: 'description', content: 'Get in touch with Misia for custom art commissions, questions about her work, or just to connect about art and creativity.' }
  ]
})

// Mobile menu state
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Form state
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const submitError = ref('')

// Form validation
const validateForm = () => {
  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.message = ''

  let isValid = true

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.length > 100) {
    errors.name = 'Name must be less than 100 characters'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Message validation
  if (!form.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (form.message.length > 2000) {
    errors.message = 'Message must be less than 2000 characters'
    isValid = false
  }

  return isValid
}

// Form submission
const { submitContactMessage } = useStrapi()

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''
  showSuccess.value = false

  try {
    await submitContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || null,
      message: form.message.trim()
    })

    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    
    showSuccess.value = true
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Contact form submission error:', error)
    submitError.value = error.message || 'Unable to send message. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}
</script>