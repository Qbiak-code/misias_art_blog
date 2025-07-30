<template>
  <div>
    <!-- This is where all your pages will be rendered -->
    <NuxtPage />
  </div>
</template>

<script setup>
// Import your custom CSS
import './assets/css/main.css'

// Global head configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>