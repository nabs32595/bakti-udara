<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Actions</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <!-- Edit Mode Actions -->
      <template v-if="isEditMode">
        <Button
          class="w-full bg-gray-800 hover:bg-gray-900 text-white"
          @click="$emit('save')"
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </Button>
        <Button variant="outline" class="w-full" @click="$emit('cancel')" :disabled="isSubmitting">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </Button>
      </template>

      <!-- View Mode Actions -->
      <template v-else>
        <Button class="w-full" @click="$emit('edit')">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit PO
        </Button>
      </template>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps<{
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

defineEmits<{
  'edit': []
  'save': []
  'cancel': []
}>()
</script>
