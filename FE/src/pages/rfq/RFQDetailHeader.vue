<template>
  <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          @click="$emit('go-back')"
          class="flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Button>
        <div>
          <h1 class="text-xl font-semibold text-gray-900">{{ rfqData?.rfqNo }}</h1>
          <p class="text-sm text-gray-500">RFQ Details</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <Badge :class="getStatusBadgeClass(rfqData?.status || '')">
          {{ rfqData?.status }}
        </Badge>
        <Badge v-if="isEditMode" class="bg-gray-200 text-gray-800 border-gray-300">
          Edit Mode
        </Badge>
      </div>
    </div>
    
    <!-- Collaborators Section -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-sm font-medium text-gray-700">Collaborators</span>
            <Badge v-if="collaborators.length > 0" class="bg-gray-200 text-gray-800 border-gray-300 text-xs">
              {{ collaborators.length }}
            </Badge>
          </div>
          
          <!-- Collaborator Avatars -->
          <div class="flex items-center space-x-2 ml-2">
            <div
              v-for="collaborator in collaborators"
              :key="collaborator.id"
              class="relative group"
            >
              <Avatar class="cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all">
                <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium">
                  {{ collaborator.initials }}
                </AvatarFallback>
              </Avatar>
              <!-- Tooltip on hover -->
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-auto">
                <span>{{ collaborator.name }}</span>
                <button
                  @click.stop="$emit('remove-collaborator', collaborator.id)"
                  class="ml-2 text-gray-300 hover:text-white inline-block"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
            
            <!-- Add Collaborator Button -->
            <Button
              variant="outline"
              size="sm"
              @click="$emit('add-collaborator')"
              class="h-8 px-2 text-xs"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

defineProps<{
  rfqData: any
  isEditMode: boolean
  collaborators: any[]
  availableUsers: any[]
}>()

defineEmits<{
  'go-back': []
  'add-collaborator': []
  'remove-collaborator': [collaboratorId: string]
}>()

// Helper function for status badge class
const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-gray-300 text-gray-800',
    'Quoted': 'bg-gray-400 text-gray-900'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>

