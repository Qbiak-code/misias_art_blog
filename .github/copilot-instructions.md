# GitHub Copilot Instructions - Misia's Art Portfolio

## Project Context
You are working on a full-stack art portfolio blog for a young artist. This file provides context for GitHub Copilot to understand the project architecture and coding patterns.

**IMPORTANT**: Always read OMPLETE documentation `/PROJECT_PROGRESS.md` and `/CLAUDE.md` for complete project context and current development state before starting work.
- Read FULL PROJECT_PROGRESS.md (not just first 50 lines)
- Read FULL CLAUDE.md
- Check .context/ directory if it exists
- Look for "Recommended Next Steps" sections in documentation

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
- **Main file**: `/frontend/assets/css/main.css` (currently 1400+ lines)
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
- **Single-file monolith**: Everything in `index.vue` (471+ lines) - needs refactoring
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

### **NEXT: Component Extraction & Architecture**
Based on PROJECT_PROGRESS.md, the comments system is now complete. Current priorities:

**Copilot should help with:**
- Extracting reusable components from the monolithic `index.vue`
- Creating component boilerplate following established patterns
- CSS utilities and composables for common functionality
- Form validation patterns and API integration helpers
- Component-specific CSS organization

**Components ready for extraction:**
- Comment form and display components (styles already exist)
- Artwork card components with actions
- Mobile menu component
- CTA section component
- Lightbox component

**Areas to avoid (let Claude handle):**
- Major architectural restructuring decisions
- Complex state management patterns
- Routing and page structure changes
- Backend integration architecture

## Completed Features ✅
- **Comments System**: Full implementation with form, display, moderation support
- **Mobile Navigation**: Custom animated menu with glassmorphism
- **Lightbox System**: Image viewing with comments integration
- **CTA Section**: Modern design with gradient buttons
- **Responsive Design**: Mobile-first approach implemented

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

// Comments utilities (already implemented)
const getApprovedComments = (artwork) => {
  return artwork?.comments?.data?.filter(comment => 
    comment.attributes.approved
  ) || []
}
```

## File Structure Context
```
frontend/
├── pages/
│   └── index.vue (main page - 471+ lines, needs component extraction)
├── assets/css/
│   └── main.css (1400+ lines of styles, needs organization)
├── components/ (empty - ready for extracted components)
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
**Current Focus**: Component extraction and CSS organization
**Architecture Status**: Single-file monolith with complete feature set, ready for refactoring
