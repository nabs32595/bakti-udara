<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Status & Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- Current Status (Editable in Edit Mode) -->
        <div v-if="isEditMode" class="space-y-2">
          <Label class="text-sm font-medium text-gray-700">Current Status</Label>
          <select
            :value="editFormData.status"
            @change="handleStatusChange(($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            :class="{ 'border-gray-600': editErrors.status }"
          >
            <option value="Under Review">Under Review</option>
            <option value="Sent to OEM">Sent to OEM</option>
            <option value="Quoted">Quoted</option>
          </select>
          <p v-if="editErrors.status" class="text-xs text-gray-600">{{ editErrors.status }}</p>
        </div>
        
        <!-- Timeline -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-gray-900">Created</p>
              <p class="text-xs text-gray-500">{{ rfqData?.date }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-gray-900">Under Review</p>
              <p class="text-xs text-gray-500">08/01/2025 2:30PM</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div>
              <p class="text-sm text-gray-500">Sent to OEM</p>
              <p class="text-xs text-gray-400">Pending</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div>
              <p class="text-sm text-gray-500">Quoted</p>
              <p class="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional spacing -->
      <div class="h-6"></div>
      
      <!-- Last Edited By Section -->
      <div class="pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
              {{ rfqData?.lastEditedBy?.initials || 'AD' }}
            </AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium text-gray-900">Last Edited By</p>
            <p class="text-xs text-gray-500">{{ rfqData?.lastEditedBy?.name || 'Admin User' }}</p>
            <p class="text-xs text-gray-400">{{ rfqData?.lastEditedBy?.timestamp || rfqData?.date }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const props = defineProps<{
  rfqData: any
  isEditMode: boolean
  editFormData: any
  editErrors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:status': [value: string]
  'clear-error': [field: string]
}>()

const handleStatusChange = (value: string) => {
  emit('update:status', value)
  emit('clear-error', 'status')
}
</script>

