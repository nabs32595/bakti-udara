<template>
  <div class="min-h-screen" :class="backgroundColor">
    <!-- Header Slot -->
    <slot name="header"></slot>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" :class="{ 'bg-gray-50': isEditMode }">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Main Details (2/3 width) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information Slot -->
          <slot name="basic-info"></slot>

          <!-- Custom Sections Slot -->
          <slot name="custom-sections"></slot>

          <!-- Documents Slot -->
          <slot name="documents"></slot>
        </div>

        <!-- Right Column: Sidebar (1/3 width) -->
        <div class="space-y-6">
          <!-- Status Timeline Slot -->
          <slot name="status-timeline"></slot>

          <!-- Related Items Slot -->
          <slot name="related-items"></slot>

          <!-- Actions Slot -->
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Dialogs Slot -->
    <slot name="dialogs"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isEditMode?: boolean
  backgroundColor?: string
}>()
</script>

