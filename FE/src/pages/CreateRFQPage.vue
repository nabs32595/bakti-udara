<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            @click="router.push('/request-for-quotation')"
            class="flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Button>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Create New RFQ</h1>
            <p class="text-sm text-gray-500">Add a new Request for Quotation</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>RFQ Information</CardTitle>
          <CardDescription>Enter the details for the new RFQ</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Information Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <!-- RFQ Number (Auto-generated with partial manual input) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="rfqNumber" class="text-sm font-medium text-gray-700">RFQ Number</Label>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm text-gray-500 font-mono">{{ rfqPrefix }}</span>
                    <Input
                      id="rfqNumber"
                      v-model="formData.referenceNo"
                      type="text"
                      placeholder="RO1"
                      class="flex-1"
                      :class="{ 'border-red-500': errors.referenceNo }"
                      @input="clearError('referenceNo')"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Format: RFQM50-DDMMYYYY-####-RO#</p>
                  <p v-if="errors.referenceNo" class="text-xs text-red-500 mt-1">{{ errors.referenceNo }}</p>
                </div>
                
                <div>
                  <Label for="referenceNo" class="text-sm font-medium text-gray-700">Reference No</Label>
                  <Input
                    id="referenceNo"
                    v-model="formData.referenceNo"
                    type="text"
                    placeholder="04"
                    :class="{ 'border-red-500': errors.referenceNo }"
                    @input="clearError('referenceNo')"
                  />
                  <p v-if="errors.referenceNo" class="text-xs text-red-500 mt-1">{{ errors.referenceNo }}</p>
                </div>
              </div>
            </div>

            <!-- Item Details Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Item Details</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="partNumber" class="text-sm font-medium text-gray-700">Part Number (P/NO) *</Label>
                  <Input
                    id="partNumber"
                    v-model="formData.pno"
                    type="text"
                    placeholder="5251409289"
                    :class="{ 'border-red-500': errors.pno }"
                    @input="clearError('pno')"
                  />
                  <p v-if="errors.pno" class="text-xs text-red-500 mt-1">{{ errors.pno }}</p>
                </div>
                
                <div>
                  <Label for="quantity" class="text-sm font-medium text-gray-700">Quantity (EA) *</Label>
                  <Input
                    id="quantity"
                    v-model.number="formData.quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    :class="{ 'border-red-500': errors.quantity }"
                    @input="clearError('quantity')"
                  />
                  <p v-if="errors.quantity" class="text-xs text-red-500 mt-1">{{ errors.quantity }}</p>
                </div>
              </div>

              <div>
                <Label for="description" class="text-sm font-medium text-gray-700">Description *</Label>
                <textarea
                  id="description"
                  v-model="formData.desc"
                  rows="3"
                  placeholder="Enter item description..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors.desc }"
                  @input="clearError('desc')"
                ></textarea>
                <p v-if="errors.desc" class="text-xs text-red-500 mt-1">{{ errors.desc }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="aes" class="text-sm font-medium text-gray-700">AES Classification *</Label>
                  <select
                    id="aes"
                    v-model="formData.aes"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors.aes }"
                    @change="clearError('aes')"
                  >
                    <option value="">Select AES Classification</option>
                    <option value="A">A</option>
                    <option value="E">E</option>
                  </select>
                  <p v-if="errors.aes" class="text-xs text-red-500 mt-1">{{ errors.aes }}</p>
                </div>
                
                <div>
                  <Label for="status" class="text-sm font-medium text-gray-700">Status</Label>
                  <select
                    id="status"
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Sent to OEM">Sent to OEM</option>
                    <option value="Quoted">Quoted</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Document Upload Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Documents (Optional)</h3>
              
              <!-- File Upload Area -->
              <div
                @drop.prevent="handleFileDrop"
                @dragover.prevent
                @dragenter.prevent
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
                @dragenter="isDragOver = true"
                @dragleave="isDragOver = false"
              >
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
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

              <!-- File List -->
              <div v-if="uploadedFiles.length > 0" class="space-y-2">
                <h4 class="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-sm font-medium">
                        {{ getFileIcon(file.type) }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="removeFile(index)"
                    class="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                @click="handleCancel"
                :disabled="isSubmitting"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                :disabled="isSubmitting"
                class="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ isSubmitting ? 'Creating...' : 'Create RFQ' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Router
const router = useRouter()

// Form data
const formData = ref({
  referenceNo: '',
  pno: '',
  desc: '',
  quantity: 1,
  aes: '',
  status: 'Under Review'
})

// Form state
const isSubmitting = ref(false)
const isDragOver = ref(false)
const uploadedFiles = ref<File[]>([])
const errors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)

// Computed properties
const rfqPrefix = computed(() => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `RFQM50-${day}${month}${year}-${sequence}-`
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.pno.trim()) {
    errors.value.pno = 'Part number is required'
  }
  
  if (!formData.value.desc.trim()) {
    errors.value.desc = 'Description is required'
  }
  
  if (!formData.value.quantity || formData.value.quantity < 1) {
    errors.value.quantity = 'Quantity must be at least 1'
  }
  
  if (!formData.value.aes) {
    errors.value.aes = 'AES classification is required'
  }
  
  if (!formData.value.referenceNo.trim()) {
    errors.value.referenceNo = 'Reference number is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate final RFQ number
    const rfqNumber = `${rfqPrefix.value}${formData.value.referenceNo}`
    
    // Create RFQ object
    const newRFQ = {
      no: Math.floor(Math.random() * 1000) + 1, // This would come from API
      desc: formData.value.desc,
      referenceNo: formData.value.referenceNo,
      rfqNo: rfqNumber,
      pno: formData.value.pno,
      aes: formData.value.aes,
      quantity: formData.value.quantity,
      status: formData.value.status,
      date: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      timestamp: Date.now()
    }
    
    console.log('Creating RFQ:', newRFQ)
    console.log('Uploaded files:', uploadedFiles.value)
    
    // Show success message
    alert(`RFQ ${rfqNumber} created successfully!`)
    
    // Navigate to RFQ details or list
    router.push('/request-for-quotation')
    
  } catch (error) {
    console.error('Error creating RFQ:', error)
    alert('Error creating RFQ. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (hasFormChanges()) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      router.push('/request-for-quotation')
    }
  } else {
    router.push('/request-for-quotation')
  }
}

const hasFormChanges = () => {
  return formData.value.pno || 
         formData.value.desc || 
         formData.value.quantity !== 1 || 
         formData.value.aes || 
         uploadedFiles.value.length > 0
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
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
  
  uploadedFiles.value.push(...validFiles)
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return 'PDF'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'XLS'
  if (type.includes('word') || type.includes('document')) return 'DOC'
  if (type.includes('image')) return 'IMG'
  if (type.includes('dwg')) return 'DWG'
  return 'FILE'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Initialize form
onMounted(() => {
  // Set default reference number if needed
  if (!formData.value.referenceNo) {
    formData.value.referenceNo = 'RO1'
  }
})
</script>
