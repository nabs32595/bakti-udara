<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Conflict Detected</span>
          </div>
          <div class="text-sm font-normal text-gray-600">
            {{ resolvedCount }} of {{ conflictFields.length }} field(s) resolved
          </div>
        </DialogTitle>
        <DialogDescription>
          Someone else has modified this RFQ while you were editing. Please review the changes below and select which version to keep for each field.
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
          
          <div v-for="field in conflictFields" :key="field.key" 
               class="border rounded-lg p-4 transition-all"
               :class="fieldSelections[field.key] 
                 ? 'border-green-300 bg-green-50/50' 
                 : 'border-gray-200 bg-gray-50'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <svg v-if="fieldSelections[field.key]" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span class="font-medium text-gray-900">{{ field.label }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Your Version -->
              <label 
                class="cursor-pointer space-y-2 p-4 rounded-lg border-2 transition-all"
                :class="fieldSelections[field.key] === 'yours' 
                  ? 'border-amber-400 bg-amber-50 shadow-sm' 
                  : 'border-amber-200 bg-amber-50/50 hover:border-amber-300'">
                <div class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    :name="`field-${field.key}`"
                    value="yours"
                    :checked="fieldSelections[field.key] === 'yours'"
                    @change="updateSelection(field.key, 'yours')"
                    class="w-4 h-4 text-amber-600 focus:ring-amber-500 focus:ring-2"
                  />
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span class="text-sm font-medium text-gray-700">Keep My Version</span>
                  </div>
                </div>
                <div class="p-3 bg-white border border-amber-200 rounded-md mt-2">
                  <span class="text-gray-900 font-medium">{{ field.yourValue }}</span>
                </div>
              </label>
              
              <!-- Current Version -->
              <label 
                class="cursor-pointer space-y-2 p-4 rounded-lg border-2 transition-all"
                :class="fieldSelections[field.key] === 'current' 
                  ? 'border-blue-400 bg-blue-50 shadow-sm' 
                  : 'border-blue-200 bg-blue-50/50 hover:border-blue-300'">
                <div class="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    :name="`field-${field.key}`"
                    value="current"
                    :checked="fieldSelections[field.key] === 'current'"
                    @change="updateSelection(field.key, 'current')"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span class="text-sm font-medium text-gray-700">Use Current Version</span>
                  </div>
                </div>
                <div class="p-3 bg-white border border-blue-200 rounded-md mt-2">
                  <span class="text-gray-900 font-medium">{{ field.currentValue }}</span>
                </div>
              </label>
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
          @click="handleApplySelectedChanges"
          :disabled="!allFieldsResolved"
          class="w-full sm:w-auto"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Apply Selected Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

interface ResolveConflict {
  key: string
  selectedValue: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'discard-changes': []
  'resolve-conflicts': [resolutions: ResolveConflict[]]
}>()

// Track selected version for each field: 'yours' | 'current'
const fieldSelections = ref<Record<string, 'yours' | 'current'>>({})

// Separate conflicting and non-conflicting fields
const conflictFields = computed(() => props.conflictData)
const nonConflictFields = computed(() => {
  // This would be calculated based on all fields minus conflicting ones
  // For now, we'll show a static message
  return []
})

// Count of resolved fields
const resolvedCount = computed(() => {
  return Object.keys(fieldSelections.value).filter(
    key => fieldSelections.value[key] !== undefined && fieldSelections.value[key] !== null
  ).length
})

// Check if all fields are resolved
const allFieldsResolved = computed(() => {
  return conflictFields.value.length > 0 && 
         resolvedCount.value === conflictFields.value.length
})

// Update selection for a specific field
const updateSelection = (fieldKey: string, selection: 'yours' | 'current') => {
  fieldSelections.value[fieldKey] = selection
}

// Reset selections when dialog opens with new conflict data
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    // Initialize selections (default to empty, requiring user to make explicit choice)
    fieldSelections.value = {}
  }
})

// Watch conflictData changes to reset selections
watch(() => props.conflictData, () => {
  if (props.open) {
    fieldSelections.value = {}
  }
}, { deep: true })

const handleDiscardChanges = () => {
  emit('discard-changes')
  emit('update:open', false)
}

const handleApplySelectedChanges = () => {
  if (!allFieldsResolved.value) {
    return
  }

  // Build resolution array with selected values
  const resolutions: ResolveConflict[] = conflictFields.value.map(field => {
    const selection = fieldSelections.value[field.key]
    return {
      key: field.key,
      selectedValue: selection === 'yours' ? field.yourValue : field.currentValue
    }
  })

  emit('resolve-conflicts', resolutions)
  emit('update:open', false)
}
</script>
