<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Conflict Detected</span>
        </DialogTitle>
        <DialogDescription>
          Someone else has modified this RFQ while you were editing. Please review the changes below and choose how to proceed.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Conflict Summary -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="font-medium text-amber-800">
              {{ conflictFields.length }} field(s) have been modified by another user
            </span>
          </div>
        </div>

        <!-- Field Comparisons -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Field Comparisons</h3>
          
          <div v-for="field in conflictFields" :key="field.key" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="flex items-center space-x-2 mb-3">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="font-medium text-gray-900">{{ field.label }}</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Your Version -->
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700">Your Version</span>
                </div>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <span class="text-gray-900 font-medium">{{ field.yourValue }}</span>
                </div>
              </div>
              
              <!-- Current Version -->
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700">Current Version</span>
                </div>
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <span class="text-gray-900 font-medium">{{ field.currentValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Non-conflicting fields info -->
        <div v-if="nonConflictFields.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium text-green-800">
              {{ nonConflictFields.length }} field(s) have no conflicts and will be saved normally
            </span>
          </div>
        </div>
      </div>

      <DialogFooter class="flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          @click="handleDiscardChanges"
          class="w-full sm:w-auto"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Discard My Changes
        </Button>
        
        <Button 
          @click="handleForceSave"
          class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Force Save (Overwrite)
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConflictField {
  key: string
  label: string
  yourValue: string | number
  currentValue: string | number
}

interface Props {
  open: boolean
  conflictData: ConflictField[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'discard-changes': []
  'force-save': []
}>()

// Separate conflicting and non-conflicting fields
const conflictFields = computed(() => props.conflictData)
const nonConflictFields = computed(() => {
  // This would be calculated based on all fields minus conflicting ones
  // For now, we'll show a static message
  return []
})

const handleDiscardChanges = () => {
  emit('discard-changes')
  emit('update:open', false)
}

const handleForceSave = () => {
  // Show confirmation dialog for force save
  if (confirm('Are you sure you want to overwrite the current changes? This action cannot be undone.')) {
    emit('force-save')
    emit('update:open', false)
  }
}
</script>
