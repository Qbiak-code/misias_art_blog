# GitHub Copilot Instructions - Misia's Art Portfolio

## Project Context
You are working on a full-stack art portfolio blog for a young artist. This file provides context for GitHub Copilot to understand the project architecture and coding patterns.

**IMPORTANT**: Always read `/PROJECT_PROGRESS.md` and `/CLAUDE.md` for complete project context and current development state.

## Tech Stack
- **Frontend**: Nuxt 4.0.2 + @nuxt/ui + Tailwind CSS v4.0
- **Backend**: Strapi 5.20.0 CMS with SQLite (dev) / PostgreSQL (prod)
- **Design**: Water colour aesthetic with glassmorphism and brutalist elements

## Code Style & Patterns

### Vue.js Patterns
```vue
<!-- Component structure -->
<template>
  <div class="component-wrapper">
    <!-- Use semantic HTML -->
  </div>
</template>

<script setup>
// Use Composition API
// Import utilities from composables/
</script>

<style scoped>
/* Avoid - CSS goes in main.css or component-specific files */
</style>
```

### CSS Architecture
- **Main file**: `/frontend/assets/css/main.css` (currently 1200+ lines)
- **Naming**: Use BEM-style or semantic class names
- **Colors**: Use CSS custom properties defined in `:root`
- **Effects**: Glassmorphism with `backdrop-filter: blur()` and transparency

### Key CSS Variables
```css
:root {
    --pink-peony: #f4a6cd;
    --mustard: #f4a261;
    --coral-pink: #e76f51;
    --gradient-border: linear-gradient(135deg, #f4a6cd 0%, #f4a261 50%, #e76f51 100%);
}
```

### Design Patterns to Follow
- **Glassmorphism**: `background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(20px);`
- **Hover effects**: Smooth transitions with `transform` and `box-shadow`
- **Gradients**: Use `--gradient-border` for consistent branding
- **Spacing**: Follow established spacing patterns (1rem, 1.5rem, 2rem, 3rem)

## Current Architecture Issues
- **Single-file monolith**: Everything in `index.vue` (471 lines) - needs refactoring
- **CSS organization**: All styles in one file - should be split
- **No components**: Extract reusable components (buttons, cards, etc.)

## Strapi API Patterns
```javascript
// Fetch artwork with comments
const { data } = await $fetch('/api/artworks', {
  baseURL: config.public.strapiUrl,
  query: { populate: ['image', 'comments'] }
})

// Submit comment (requires moderation)
await $fetch('/api/comments', {
  method: 'POST',
  baseURL: config.public.strapiUrl,
  body: { data: commentData }
})
```

## Component Patterns to Generate

### Modern Button Component
```vue
<template>
  <button class="modern-btn" :class="variant">
    <div class="btn-icon" v-if="icon">
      <UIcon :name="icon" />
    </div>
    <span class="btn-text">{{ text }}</span>
    <UIcon name="i-heroicons-arrow-right" class="btn-arrow" v-if="showArrow" />
  </button>
</template>
```

### Glass Card Component
```vue
<template>
  <div class="glass-card floating-animation">
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>
```

## Current Development Priorities

### **NEXT: Comments System Implementation**
Based on PROJECT_PROGRESS.md, the comments system is the critical missing feature:

**Copilot should help with:**
- Comment form component boilerplate
- Comment display component patterns
- Form validation logic
- API integration code
- CSS for comment styling (following established patterns)

**Areas to avoid (let Claude handle):**
- Architecture decisions for comment moderation
- UX decisions for comment placement
- Complex state management patterns
- Integration with existing lightbox system

## Responsive Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) { /* Small tablets */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## Common Utility Patterns
```javascript
// Image URL handling for Strapi
const getImageUrl = (artwork) => {
  if (artwork?.image?.data?.attributes?.url) {
    return `${config.public.strapiUrl}${artwork.image.data.attributes.url}`
  }
  return null
}

// Clean rich text from Strapi
const getCleanDescription = (artwork) => {
  // Handle various Strapi rich text formats
}
```

## File Structure Context
```
frontend/
├── pages/
│   └── index.vue (main page - 471 lines, needs refactoring)
├── assets/css/
│   └── main.css (1200+ lines of styles)
├── components/ (empty - needs components)
└── composables/ (empty - needs utilities)
```

## Do Not Generate
- Documentation files (*.md) unless explicitly requested
- README files
- Complex architectural changes without discussion
- Breaking changes to existing working features

## When to Suggest Claude Code Instead
If you encounter:
- Complex architectural decisions
- UX/design pattern choices
- Debugging complex issues
- Planning refactoring strategies
- Integration challenges

Suggest: "This might be better handled by Claude Code for architectural planning."

---

**Last Updated**: July 31, 2025
**Current Focus**: Comments system implementation
**Architecture Status**: Single-file monolith, needs refactoring after core features complete