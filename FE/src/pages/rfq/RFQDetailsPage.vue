<template>
  <DetailPageLayout 
    :is-edit-mode="isEditMode" 
    background-color="bg-gray-50"
    default-tab="rfq"
    :rfq-data="rfqData"
    :quotation-data="relatedQuotations.length > 0 ? relatedQuotations[0] : null"
  >
    <!-- Header Slot -->
    <template #header>
      <DetailHeader
        :title="rfqData?.rfqNo || 'Loading...'"
        subtitle="RFQ Details"
        :status="rfqData?.status"
        :status-badge-class="getStatusBadgeClass(rfqData?.status || '')"
        :is-edit-mode="isEditMode"
        :collaborators="rfqData?.collaborators || []"
        entity-type="rfq"
        :entity-id="rfqData?.rfqNo || ''"
        @go-back="goBack"
      />
    </template>

    <!-- RFQ Content Tab - 2 Column Layout -->
    <!-- Left Column (2/3 width) -->
    <template #rfq-left>
      <RFQBasicInfo
        :rfq-data="rfqData"
        :is-edit-mode="isEditMode"
        :edit-form-data="editFormData"
        :edit-errors="editErrors"
        @update:edit-form-data="handleUpdateEditFormData"
        @clear-error="clearEditError"
      />

      <DocumentSection
        title="Document Details"
        description="Attached documents and specifications"
        :documents="documents"
        :is-edit-mode="isEditMode"
        :edited-documents="editedDocuments"
        @file-upload="handleFileUpload"
        @remove-document="removeExistingDocument"
        @remove-new-document="removeNewDocument"
        @download-document="downloadDocument"
      />
    </template>

    <!-- Right Column (1/3 width) -->
    <template #rfq-right>
      <RFQActions
        :is-edit-mode="isEditMode"
        :is-submitting="isSubmitting"
        @edit="editRFQ"
        @save="saveChanges"
        @cancel="cancelEdit"
        @send-to-oem="sendToOEM"
        @mark-as-quoted="markAsQuoted"
        @delete="deleteRFQ"
      />

      <StatusTimeline
        title="Status & Timeline"
        :status-timeline="rfqData?.statusTimeline || []"
        :timeline-statuses="['Created', 'Under Review', 'Sent to OEM', 'Quoted']"
        :current-status="rfqData?.status"
        :is-edit-mode="isEditMode"
        :status-options="['Under Review', 'Sent to OEM', 'Quoted']"
        @update:status="handleStatusUpdate"
      >
        <template #footer>
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
        </template>
      </StatusTimeline>
    </template>

    <!-- Quotation Content Tab -->
    <template #quotation-content>
      <template v-if="relatedQuotations.length > 0">
        <QuotationBasicInfo
          v-for="quotation in relatedQuotations"
          :key="quotation.quotationNo"
          :quotation-data="quotation"
          :is-edit-mode="false"
        />
      </template>
      <Card v-else>
        <CardContent class="py-8 text-center">
          <p class="text-gray-500">No quotations found for this RFQ</p>
        </CardContent>
      </Card>
    </template>


    <!-- Dialogs Slot -->
    <template #dialogs>
      <!-- Conflict Resolution Dialog -->
      <ConflictResolutionDialog
        :open="showConflictDialog"
        :conflict-data="conflictData"
        @update:open="showConflictDialog = $event"
        @discard-changes="handleDiscardChanges"
        @resolve-conflicts="handleResolveConflicts"
      />

    </template>
  </DetailPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'

// Generic Components
import DetailPageLayout from '@/components/details/DetailPageLayout.vue'
import DetailHeader from '@/components/details/DetailHeader.vue'
import DocumentSection from '@/components/details/DocumentSection.vue'
import StatusTimeline from '@/components/details/StatusTimeline.vue'
import { Card, CardContent } from '@/components/ui/card'

// RFQ-Specific Components
import RFQBasicInfo from '@/components/modules/rfq/RFQBasicInfo.vue'
import RFQActions from '@/components/modules/rfq/RFQActions.vue'

// Quotation Components
import QuotationBasicInfo from '@/components/modules/quotation/QuotationBasicInfo.vue'

// Dialogs
import ConflictResolutionDialog from '@/components/ConflictResolutionDialog.vue'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { toast } = useToast()

// Data
const rfqData = ref<any>(null)

// Documents state (from rfqData)
const documents = ref<any[]>([])

// Edit mode state management
const isEditMode = ref(false)
const isSubmitting = ref(false)
const editFormData = ref({
  no: '',
  rfqNo: '',
  referenceNo: '',
  pno: '',
  desc: '',
  quantity: 1,
  aes: '',
  status: ''
})
const editErrors = ref<Record<string, string>>({})
const editedDocuments = ref<any[]>([])
const originalDocuments = ref<any[]>([])

// Conflict resolution state
const showConflictDialog = ref(false)
const conflictData = ref<any[]>([])
const currentDbVersion = ref<any>({})


// Use the same localStorage key as the list page
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)

// Related quotations state
const relatedQuotations = ref<any[]>([])

// Helper function for status badge class
const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-gray-300 text-gray-800',
    'Quoted': 'bg-gray-400 text-gray-900'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Methods
const goBack = () => {
  router.push('/request-for-quotation')
}

const editRFQ = () => {
  // Copy current data to edit form
  editFormData.value = {
    no: rfqData.value?.no || '',
    rfqNo: rfqData.value?.rfqNo || '',
    referenceNo: rfqData.value?.referenceNo || '',
    pno: rfqData.value?.pno || '',
    desc: rfqData.value?.desc || '',
    quantity: rfqData.value?.quantity || 1,
    aes: rfqData.value?.aes || '',
    status: rfqData.value?.status || ''
  }
  
  // Store original documents
  originalDocuments.value = [...documents.value]
  editedDocuments.value = []
  
  // Clear any previous errors
  editErrors.value = {}
  
  // Enter edit mode
  isEditMode.value = true
}

const cancelEdit = () => {
  if (hasEditChanges()) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      exitEditMode()
    }
  } else {
    exitEditMode()
  }
}

const exitEditMode = () => {
  isEditMode.value = false
  editErrors.value = {}
  editedDocuments.value = []
}

const hasEditChanges = () => {
  return editFormData.value.pno !== rfqData.value?.pno ||
         editFormData.value.desc !== rfqData.value?.desc ||
         editFormData.value.quantity !== rfqData.value?.quantity ||
         editFormData.value.aes !== rfqData.value?.aes ||
         editFormData.value.status !== rfqData.value?.status ||
         editFormData.value.referenceNo !== rfqData.value?.referenceNo ||
         editFormData.value.rfqNo !== rfqData.value?.rfqNo ||
         editedDocuments.value.length > 0
}

const validateEditForm = () => {
  editErrors.value = {}
  
  if (!editFormData.value.pno.trim()) {
    editErrors.value.pno = 'Part number is required'
  }
  
  if (!editFormData.value.desc.trim()) {
    editErrors.value.desc = 'Description is required'
  }
  
  if (!editFormData.value.quantity || editFormData.value.quantity < 1) {
    editErrors.value.quantity = 'Quantity must be at least 1'
  }
  
  if (!editFormData.value.aes) {
    editErrors.value.aes = 'AES classification is required'
  }
  
  if (!editFormData.value.referenceNo.trim()) {
    editErrors.value.referenceNo = 'Reference number is required'
  }
  
  if (!editFormData.value.rfqNo.trim()) {
    editErrors.value.rfqNo = 'RFQ number is required'
  }
  
  if (!editFormData.value.status) {
    editErrors.value.status = 'Status is required'
  }
  
  return Object.keys(editErrors.value).length === 0
}

const clearEditError = (field: string) => {
  if (editErrors.value[field]) {
    delete editErrors.value[field]
  }
}

const handleUpdateEditFormData = (field: string, value: any) => {
  (editFormData.value as any)[field] = value
}

const handleStatusUpdate = (value: string) => {
  editFormData.value.status = value
  clearEditError('status')
}

const updateStatusTimeline = (newStatus: string) => {
  // Initialize statusTimeline if it doesn't exist
  if (!rfqData.value.statusTimeline) {
    rfqData.value.statusTimeline = []
  }
  
  // Check if this status is already in the timeline
  const existingStatusIndex = rfqData.value.statusTimeline.findIndex(
    (item: any) => item.status === newStatus
  )
  
  // If status doesn't exist in timeline, add it
  if (existingStatusIndex === -1) {
    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    
    rfqData.value.statusTimeline.push({
      status: newStatus,
      timestamp: timestamp
    })
  }
}

const saveChanges = async () => {
  if (!validateEditForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock conflict detection (30% chance of conflicts)
    const hasConflicts = Math.random() < 0.3
    
    if (hasConflicts) {
      // Simulate current database version with some changes
      currentDbVersion.value = {
        desc: editFormData.value.desc + ' - Updated by another user',
      }
      
      // Generate conflict data for fields that have changed
      const conflicts: Array<{
        key: string
        label: string
        yourValue: string | number
        currentValue: string | number
      }> = []
      const fieldMappings = [
        { key: 'desc', label: 'Description' },
      ]
      
      fieldMappings.forEach(field => {
        if (editFormData.value[field.key as keyof typeof editFormData.value] !== currentDbVersion.value[field.key]) {
          conflicts.push({
            key: field.key,
            label: field.label,
            yourValue: editFormData.value[field.key as keyof typeof editFormData.value],
            currentValue: currentDbVersion.value[field.key]
          })
        }
      })
      
      // If we have conflicts, show the dialog
      if (conflicts.length > 0) {
        conflictData.value = conflicts
        showConflictDialog.value = true
        isSubmitting.value = false
        return
      }
    }
    
    // No conflicts - proceed with normal save
    await performSave()
    
  } catch (error) {
    console.error('Error updating RFQ:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Error updating RFQ. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const performSave = async () => {
  // Update RFQ data with new values
  const updatedDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  
  // Update status timeline if status has changed
  if (editFormData.value.status !== rfqData.value.status) {
    updateStatusTimeline(editFormData.value.status)
  }
  
  // Update documents (in real app, this would be handled by API)
  if (editedDocuments.value.length > 0) {
    // Add new documents to the list
    const newDocs = editedDocuments.value.map((file, index) => ({
      id: documents.value.length + index + 1,
      name: file.name,
      type: getFileTypeFromMime(file.type),
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      url: '#'
    }))
    documents.value.push(...newDocs)
  }
  
  rfqData.value = {
    ...rfqData.value,
    no: editFormData.value.no,
    rfqNo: editFormData.value.rfqNo,
    referenceNo: editFormData.value.referenceNo,
    pno: editFormData.value.pno,
    desc: editFormData.value.desc,
    quantity: editFormData.value.quantity,
    aes: editFormData.value.aes,
    status: editFormData.value.status,
    date: updatedDate,
    collaborators: rfqData.value?.collaborators || [],
    documents: documents.value,
    lastEditedBy: {
      ...(rfqData.value?.lastEditedBy || {
        name: 'Admin User',
        initials: 'AD'
      }),
      timestamp: updatedDate
    },
    timestamp: new Date().getTime()
  }

  // Update the RFQ in rfqList array (same as list page uses)
  const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value.rfqNo)
  if (rfqIndex !== -1) {
    // Merge with existing data to preserve all fields
    rfqList.value[rfqIndex] = { ...rfqList.value[rfqIndex], ...rfqData.value }
  }
  
  // Show success message
  toast({
    title: 'Success',
    description: `RFQ ${editFormData.value.rfqNo} updated successfully!`
  })
  
  // Exit edit mode
  exitEditMode()
}

const sendToOEM = () => {
  if (rfqData.value) {
    // Update status timeline
    updateStatusTimeline('Sent to OEM')
    
    // Update status in the shared rfqList
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Sent to OEM'
      rfqList.value[rfqIndex].statusTimeline = rfqData.value.statusTimeline
      rfqData.value.status = 'Sent to OEM'
    }
  }
  
  toast({
    title: 'Sending to OEM',
    description: `RFQ ${rfqData.value?.rfqNo} sent to OEM`
  })
}

const markAsQuoted = () => {
  if (rfqData.value) {
    // Update status timeline
    updateStatusTimeline('Quoted')
    
    // Update status in the shared rfqList
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Quoted'
      rfqList.value[rfqIndex].statusTimeline = rfqData.value.statusTimeline
      rfqData.value.status = 'Quoted'
    }
  }
  
  toast({
    title: 'Marked as Quoted',
    description: `RFQ ${rfqData.value?.rfqNo} marked as quoted`
  })
}

const deleteRFQ = () => {
  if (confirm(`Are you sure you want to delete ${rfqData.value?.rfqNo}?`)) {
    toast({
      title: 'Deleted',
      description: `RFQ ${rfqData.value?.rfqNo} deleted successfully`
    })
    goBack()
  }
}

// Conflict resolution handlers
const handleDiscardChanges = () => {
  // Reset form to original values
  editFormData.value = {
    no: rfqData.value?.no || '',
    rfqNo: rfqData.value?.rfqNo || '',
    referenceNo: rfqData.value?.referenceNo || '',
    pno: rfqData.value?.pno || '',
    desc: rfqData.value?.desc || '',
    quantity: rfqData.value?.quantity || 1,
    aes: rfqData.value?.aes || '',
    status: rfqData.value?.status || ''
  }
  
  // Clear any errors
  editErrors.value = {}
  
  // Reset documents
  editedDocuments.value = []
}

const handleResolveConflicts = async (resolutions: Array<{ key: string; selectedValue: string | number }>) => {
  isSubmitting.value = true
  
  try {
    // Update editFormData with resolved values
    resolutions.forEach(resolution => {
      const key = resolution.key as keyof typeof editFormData.value
      if (key in editFormData.value) {
        editFormData.value[key] = resolution.selectedValue as never
      }
    })
    
    // Proceed with save using resolved values
    await performSave()
  } catch (error) {
    console.error('Error saving resolved conflicts:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Error saving RFQ. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const downloadDocument = (doc: any) => {
  toast({
    title: 'Downloading',
    description: `Starting download for ${doc.name}...`
  })
  // In real app, this would trigger actual download
}

// Document management methods
const handleFileUpload = (files: File[]) => {
  editedDocuments.value.push(...files)
}

const removeExistingDocument = (index: number) => {
  documents.value.splice(index, 1)
}

const removeNewDocument = (index: number) => {
  editedDocuments.value.splice(index, 1)
}

// Helper functions for file handling (used in performSave)
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


// Load RFQ data based on route parameter
onMounted(() => {
  const rfqNo = route.params.rfqNo as string
  const foundRFQ = rfqList.value.find(rfq => rfq.rfqNo === rfqNo)
  
  if (foundRFQ) {
    rfqData.value = foundRFQ
    // Load documents from RFQ data if available
    if (foundRFQ.documents) {
      documents.value = foundRFQ.documents
    }
    
    // Load related quotations
    relatedQuotations.value = quotationList.value.filter(
      quotation => quotation.rfqNo === rfqNo
    )
  } else {
    // Handle case where RFQ not found
    console.error('RFQ not found:', rfqNo)
    goBack()
  }
})
</script>
