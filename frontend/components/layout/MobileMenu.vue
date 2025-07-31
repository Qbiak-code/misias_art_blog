<template>
  <div>
    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" :class="{ open: isOpen }" @click="$emit('close')"></div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: isOpen }">
      <div class="mobile-menu-header">
        <div class="mobile-menu-logo">
          <span class="mobile-menu-title">Misia's Art</span>
          <span class="mobile-menu-subtitle">Portfolio</span>
        </div>
        <button @click="$emit('close')" class="mobile-close-button">
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
        </button>
      </div>

      <nav class="mobile-nav-container">
        <NuxtLink to="/" class="mobile-nav-link" @click="$emit('close')">
          <UIcon name="i-heroicons-squares-2x2" class="mobile-nav-icon" />
          <span>Gallery</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" @click="$emit('close')">
          <UIcon name="i-heroicons-user" class="mobile-nav-icon" />
          <span>About</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
        <NuxtLink to="/contact" class="mobile-nav-link" @click="$emit('close')">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="mobile-nav-icon" />
          <span>Contact</span>
          <UIcon name="i-heroicons-chevron-right" class="mobile-nav-arrow" />
        </NuxtLink>
      </nav>

      <div class="mobile-menu-footer">
        <div class="mobile-footer-decoration"></div>
        <p class="mobile-footer-text">Art that speaks to the soul</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>
