<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Edit Mode: File Upload Area -->
      <div v-if="isEditMode" class="space-y-4">
        <!-- File Upload Area -->
        <div
          @drop.prevent="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
          :class="{ 'border-gray-500 bg-gray-100': isDragOver }"
          @dragenter="isDragOver = true"
          @dragleave="isDragOver = false"
        >
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-xs text-gray-600 mb-2">Drop files here or click to upload</p>
          <input
            ref="fileInput"
            type="file"
            multiple
            @change="handleFileSelect"
            class="hidden"
            accept=".pdf,.dwg,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            type="button"
            variant="outline"
            @click="() => fileInput?.click()"
            class="mt-2"
          >
            Choose Files
          </Button>
          <p class="text-xs text-gray-500 mt-2">Supported formats: PDF, DWG, Excel, Word, Images</p>
        </div>

        <!-- Existing Documents with Remove Option -->
        <div v-if="documents.length > 0" class="space-y-2">
          <h4 class="text-xs font-medium text-gray-700">Existing Documents:</h4>
          <div v-for="(doc, index) in documents" :key="doc.id" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div :class="getFileIconClass(doc.type)" class="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-medium">
                  {{ getFileIcon(doc.type) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 truncate">{{ doc.name }}</p>
                <p class="text-[11px] text-gray-500">{{ doc.type }} • {{ doc.size }} • {{ doc.uploadDate }}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="$emit('remove-document', index)"
              class="text-gray-600 border-gray-400 hover:bg-gray-100"
            >
              Remove
            </Button>
          </div>
        </div>

        <!-- Newly Added Documents -->
        <div v-if="editedDocuments.length > 0" class="space-y-2">
          <h4 class="text-xs font-medium text-gray-700">New Documents:</h4>
          <div v-for="(file, index) in editedDocuments" :key="index" class="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-7 h-7 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-medium">
                  {{ getFileIcon(getFileTypeFromMime(file.type)) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 truncate">{{ file.name }}</p>
                <p class="text-[11px] text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="$emit('remove-new-document', index)"
              class="text-gray-600 border-gray-400 hover:bg-gray-100"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <!-- View Mode: Document List -->
      <div v-else class="space-y-3">
        <div v-for="doc in documents" :key="doc.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div :class="getFileIconClass(doc.type)" class="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-medium">
                {{ getFileIcon(doc.type) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-900 truncate">{{ doc.name }}</p>
              <p class="text-[11px] text-gray-500">{{ doc.type }} • {{ doc.size }} • {{ doc.uploadDate }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" @click="$emit('download-document', doc)">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </Button>
          </div>
        </div>
        <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No documents attached</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps<{
  title?: string
  description?: string
  documents: any[]
  isEditMode: boolean
  editedDocuments: any[]
}>()

const emit = defineEmits<{
  'file-upload': [files: File[]]
  'remove-document': [index: number]
  'remove-new-document': [index: number]
  'download-document': [doc: any]
}>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const validFiles = filterValidFiles(Array.from(target.files))
    if (validFiles.length > 0) {
      emit('file-upload', validFiles)
    }
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    const validFiles = filterValidFiles(Array.from(event.dataTransfer.files))
    if (validFiles.length > 0) {
      emit('file-upload', validFiles)
    }
  }
}

const filterValidFiles = (files: File[]) => {
  return files.filter(file => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    return validTypes.includes(file.type) || file.name.endsWith('.dwg')
  })
}

// Helper functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeFromMime = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'PDF'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word'
  if (mimeType.includes('image')) return 'Image'
  if (mimeType.includes('dwg')) return 'DWG'
  return 'FILE'
}

const getFileIconClass = (type: string) => {
  const classes = {
    'PDF': 'bg-gray-500',
    'DWG': 'bg-gray-600',
    'Excel': 'bg-gray-700',
    'Word': 'bg-gray-600',
    'Image': 'bg-gray-500'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-500'
}

const getFileIcon = (type: string) => {
  const icons = {
    'PDF': 'PDF',
    'DWG': 'DWG',
    'Excel': 'XLS',
    'Word': 'DOC',
    'Image': 'IMG'
  }
  return icons[type as keyof typeof icons] || 'FILE'
}
</script>

