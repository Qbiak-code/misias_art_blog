<template>
  <section class="section relative overflow-hidden">
    <div class="container">
      <div class="cta-section floating-3">
        <!-- Decorative Elements -->
        <div class="cta-decoration"></div>

        <div class="cta-content">
          <div class="cta-header">
            <h2 class="cta-title">
              Let's Create Together
            </h2>
            <div class="cta-subtitle-wrapper">
              <p class="cta-subtitle">
                Whether you're interested in commissioning a piece, collaborating on a project,
                or simply want to share your thoughts about art—I'd love to hear from you.
              </p>
            </div>
          </div>

          <div class="cta-actions">
            <NuxtLink to="/contact" class="cta-btn primary">
              <div class="cta-btn-icon">
                <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="h-5 w-5" />
              </div>
              <div class="cta-btn-content">
                <span class="cta-btn-title">Start a Conversation</span>
                <span class="cta-btn-desc">Get in touch about your ideas</span>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 cta-btn-arrow" />
            </NuxtLink>

            <NuxtLink to="/about" class="cta-btn secondary">
              <div class="cta-btn-icon">
                <UIcon name="i-heroicons-user" class="h-5 w-5" />
              </div>
              <div class="cta-btn-content">
                <span class="cta-btn-title">Learn My Story</span>
                <span class="cta-btn-desc">Discover the artist behind the art</span>
              </div>
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 cta-btn-arrow" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// CTA section is purely presentational - no props needed
// Uses existing CTA CSS classes with glassmorphism and gradient effects
</script>
