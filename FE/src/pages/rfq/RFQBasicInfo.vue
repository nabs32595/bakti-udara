<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Basic Information</CardTitle>
      <CardDescription>Core details of the RFQ item</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label class="text-sm font-medium text-gray-500">Item Number</Label>
          <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.no }}</p>
          <Input
            v-else
            :model-value="editFormData.no"
            @update:model-value="handleUpdate('no', $event)"
            type="text"
            :class="{ 'border-gray-600': editErrors.no }"
            @input="$emit('clear-error', 'no')"
          />
          <p v-if="editErrors.no" class="text-xs text-gray-600 mt-1">{{ editErrors.no }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Reference No</Label>
          <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.referenceNo }}</p>
          <Input
            v-else
            :model-value="editFormData.referenceNo"
            @update:model-value="handleUpdate('referenceNo', $event)"
            type="text"
            :class="{ 'border-gray-600': editErrors.referenceNo }"
            @input="$emit('clear-error', 'referenceNo')"
          />
          <p v-if="editErrors.referenceNo" class="text-xs text-gray-600 mt-1">{{ editErrors.referenceNo }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Part Number</Label>
          <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.pno }}</p>
          <Input
            v-else
            :model-value="editFormData.pno"
            @update:model-value="handleUpdate('pno', $event)"
            type="text"
            :class="{ 'border-gray-600': editErrors.pno }"
            @input="$emit('clear-error', 'pno')"
          />
          <p v-if="editErrors.pno" class="text-xs text-gray-600 mt-1">{{ editErrors.pno }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Quantity</Label>
          <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.quantity }} EA</p>
          <Input
            v-else
            :model-value="editFormData.quantity"
            @update:model-value="handleUpdate('quantity', Number($event))"
            type="number"
            min="1"
            :class="{ 'border-gray-600': editErrors.quantity }"
            @input="$emit('clear-error', 'quantity')"
          />
          <p v-if="editErrors.quantity" class="text-xs text-gray-600 mt-1">{{ editErrors.quantity }}</p>
        </div>
      </div>
      <div>
        <Label class="text-sm font-medium text-gray-500">Description</Label>
        <p v-if="!isEditMode" class="text-lg text-gray-900 mt-1">{{ rfqData?.desc }}</p>
        <textarea
          v-else
          :value="editFormData.desc"
          @input="handleUpdate('desc', ($event.target as HTMLTextAreaElement).value)"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          :class="{ 'border-gray-600': editErrors.desc }"
        ></textarea>
        <p v-if="editErrors.desc" class="text-xs text-gray-600 mt-1">{{ editErrors.desc }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <div>
          <Label class="text-sm font-medium text-gray-500">AES Classification</Label>
          <div class="mt-1">
            <Badge v-if="!isEditMode" :class="getAesBadgeClass(rfqData?.aes || '')">
              {{ rfqData?.aes }}
            </Badge>
            <select
              v-else
              :value="editFormData.aes"
              @change="handleUpdate('aes', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              :class="{ 'border-gray-600': editErrors.aes }"
            >
              <option value="">Select AES Classification</option>
              <option value="A">A</option>
              <option value="E">E</option>
            </select>
            <p v-if="editErrors.aes" class="text-xs text-gray-600 mt-1">{{ editErrors.aes }}</p>
          </div>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Date</Label>
          <p class="text-sm text-gray-900 mt-1">{{ rfqData?.date }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  rfqData: any
  isEditMode: boolean
  editFormData: any
  editErrors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:editFormData': [field: string, value: any]
  'clear-error': [field: string]
}>()

const handleUpdate = (field: string, value: any) => {
  emit('update:editFormData', field, value)
}

// Helper function for AES badge class
const getAesBadgeClass = (aes: string) => {
  const classes = {
    'A': 'bg-gray-200 text-gray-800',
    'E': 'bg-gray-300 text-gray-800'
  }
  return classes[aes as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>

