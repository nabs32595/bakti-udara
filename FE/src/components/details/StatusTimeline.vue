<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- Current Status (Editable in Edit Mode) -->
        <div v-if="isEditMode && statusOptions" class="space-y-2">
          <Label class="text-xs font-medium text-gray-700">Current Status</Label>
          <select
            :value="currentStatus"
            @change="handleStatusChange(($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option v-for="option in statusOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        
        <!-- Timeline -->
        <div class="space-y-4">
          <div 
            v-for="(status, index) in timelineStatuses" 
            :key="status"
            class="flex items-center space-x-3"
          >
            <div 
              class="w-2 h-2 rounded-full" 
              :class="getStatusDotClass(status, index)"
            ></div>
            <div>
              <p 
                class="text-xs"
                :class="isStatusCompleted(status) ? 'font-medium text-gray-900' : 'text-gray-500'"
              >
                {{ status }}
              </p>
              <p 
                class="text-[11px]"
                :class="isStatusCompleted(status) ? 'text-gray-500' : 'text-gray-400'"
              >
                {{ getStatusTimestamp(status) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Custom Slot (e.g., Last Edited By) -->
      <div v-if="$slots.footer" class="pt-4 mt-4 border-t border-gray-200">
        <slot name="footer"></slot>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  title?: string
  statusTimeline: Array<{status: string, timestamp: string}>
  timelineStatuses: string[]
  currentStatus?: string
  isEditMode?: boolean
  statusOptions?: string[]
}>()

const emit = defineEmits<{
  'update:status': [value: string]
}>()

// Helper function to check if a status is completed
const isStatusCompleted = (status: string) => {
  return props.statusTimeline?.some(item => item.status === status)
}

// Helper function to get the timestamp for a status
const getStatusTimestamp = (status: string) => {
  const timelineItem = props.statusTimeline?.find(item => item.status === status)
  return timelineItem?.timestamp || ''
}

// Helper function to get the dot class based on status completion
const getStatusDotClass = (status: string, index: number) => {
  if (isStatusCompleted(status)) {
    // Use different shades for completed statuses
    return index === 0 ? 'bg-gray-600' : 'bg-gray-500'
  }
  return 'bg-gray-300'
}

const handleStatusChange = (value: string) => {
  emit('update:status', value)
}
</script>

