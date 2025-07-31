<template>
  <component
    :is="tag"
    :to="to"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <UIcon v-if="icon" :name="icon" class="h-5 w-5" />
    <slot>{{ text }}</slot>
    <UIcon v-if="showArrow" name="i-heroicons-arrow-right" class="btn-arrow" />
  </component>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: null
  }
})

defineEmits(['click'])

const tag = computed(() => {
  return props.to ? 'NuxtLink' : 'button'
})

const buttonClasses = computed(() => {
  return props.variant === 'primary' ? 'btn-primary' : 'btn-secondary'
})
</script>
