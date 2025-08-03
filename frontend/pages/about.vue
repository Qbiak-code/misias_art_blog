<template>
  <div class="about-page">
    <!-- Header -->
    <AppHeader 
      :mobile-menu-open="mobileMenuOpen" 
      @toggle-mobile-menu="toggleMobileMenu" 
    />
    
    <!-- Mobile Menu -->
    <MobileMenu :is-open="mobileMenuOpen" @close="mobileMenuOpen = false" />
    
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="about-hero-content">
          <h1 class="about-title">About Misia</h1>
          <p class="about-subtitle">Young artist exploring the world through paint and pixels</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="about-main">
      <div class="container">
        <!-- Loading State -->
        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading artist statement...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>Sorry, we couldn't load the artist statement right now.</p>
          <button @click="refresh()" class="retry-button">Try Again</button>
        </div>

        <!-- Content -->
        <div v-else-if="artistStatement" class="about-content">
          <!-- Profile Section -->
          <div class="profile-section">
            <div class="profile-image-container" v-if="artistStatement.profileImage">
              <NuxtImg
                :src="getMediaUrl(artistStatement.profileImage)"
                :alt="`Profile photo of Misia`"
                class="profile-image"
                loading="lazy"
                format="webp"
                quality="80"
              />
            </div>
            <div class="profile-placeholder" v-else>
              <div class="profile-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Biography Section -->
          <div class="content-section" v-if="artistStatement.biography">
            <h2 class="section-title">Biography</h2>
            <div class="prose" v-html="artistStatement.biography"></div>
          </div>

          <!-- Artist Statement Section -->
          <div class="content-section" v-if="artistStatement.statement">
            <h2 class="section-title">Artist Statement</h2>
            <div class="prose" v-html="artistStatement.statement"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>The artist statement will be available soon.</p>
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
  title: 'About Misia - Young Artist Portfolio',
  meta: [
    { name: 'description', content: 'Learn about Misia, a talented young artist exploring creativity through paintings and digital art.' }
  ]
})

// Mobile menu state
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Fetch artist statement using composable
const { fetchArtistStatement, getMediaUrl } = useStrapi()
const { data: artistStatement, pending, error, refresh } = await fetchArtistStatement()
</script>