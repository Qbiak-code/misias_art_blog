<template>
  <nav class="modern-nav">
    <div class="nav-content">
      <NuxtLink to="/" class="nav-logo">Misia's Art Portfolio</NuxtLink>
      <ul class="nav-links">
        <li><NuxtLink to="/" class="nav-link">Gallery</NuxtLink></li>
        <li><NuxtLink to="/about" class="nav-link">About</NuxtLink></li>
        <li><NuxtLink to="/contact" class="nav-link">Contact</NuxtLink></li>
      </ul>
      <button @click="$emit('toggle-mobile-menu')" class="md:hidden mobile-menu-button">
        <div class="hamburger-icon" :class="{ active: mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-mobile-menu'])
</script>
