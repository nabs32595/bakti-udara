<template>
  <div class="min-h-screen" :class="backgroundColor">
    <slot name="header" />

    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" :class="{ 'bg-gray-50': isEditMode }">
      <slot />
      <div class="mt-6">
        <slot name="actions" :entity-type="entityType" />
      </div>
    </div>

    <slot name="dialogs" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isEditMode?: boolean
    backgroundColor?: string
    /** 'rfq' | 'quotation' – which details page is shown (for actions slot) */
    entityType?: 'rfq' | 'quotation'
  }>(),
  { backgroundColor: 'bg-gray-50', entityType: 'rfq' }
)
</script>
