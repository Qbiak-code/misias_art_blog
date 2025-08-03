<template>
  <section class="hero-section">
    <div class="hero-content floating-1">
      <h1 class="hero-title">
        Art That
        <span class="block">Speaks</span>
      </h1>
      <p class="hero-subtitle">
        Discover a vibrant world where color meets emotion,
        and every brushstroke tells a story of boundless creativity.
      </p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center items-center mt-12">
        <BaseButton
          variant="primary"
          to="/gallery"
          icon="i-heroicons-eye"
          text="Explore Collection"
        />
        <BaseButton
          variant="secondary"
          to="/about"
          icon="i-heroicons-heart"
          text="Meet the Artist"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// Hero section is purely presentational - no props needed for now
// Uses the existing BaseButton component we created in Phase 1
</script>
