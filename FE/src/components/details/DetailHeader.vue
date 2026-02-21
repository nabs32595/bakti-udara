<template>
  <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          @click="goBack"
          class="flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Button>
        <div>
          <h1 class="text-lg font-semibold text-gray-900">{{ title }}</h1>
          <p class="text-xs text-gray-500">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Custom Badges Slot -->
        <slot name="badges">
          <Badge v-if="status" :class="statusBadgeClass">
            {{ status }}
          </Badge>
        </slot>
        <Badge v-if="isEditMode" class="bg-gray-200 text-gray-800 border-gray-300">
          Edit Mode
        </Badge>
      </div>
    </div>
    
    <!-- Collaborators Section -->
    <div v-if="entityType && entityId" class="mt-3">
      <CollaboratorsSection
        :entity-type="entityType"
        :entity-id="entityId"
        :is-edit-mode="isEditMode"
        :initial-collaborators="collaborators || []"
      />
    </div>
    
    <!-- Actions Slot (e.g., Collaborators) -->
    <div v-if="$slots.actions" class="mt-4 pt-4 border-t border-gray-200">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CollaboratorsSection from './CollaboratorsSection.vue'

const router = useRouter()

function goBack() {
  router.back()
}

defineProps<{
  title: string
  subtitle?: string
  status?: string
  isEditMode?: boolean
  statusBadgeClass?: string
  collaborators?: any[]
  entityType?: 'rfq' | 'quotation'
  entityId?: string
}>()
</script>

