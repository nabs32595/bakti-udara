<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <RFQDetailHeader
      :rfq-data="rfqData"
      :is-edit-mode="isEditMode"
      :collaborators="collaborators"
      :available-users="availableUsers"
      @go-back="goBack"
      @add-collaborator="showAddDialog = true"
      @remove-collaborator="handleCollaboratorRemoved"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" :class="{ 'bg-gray-50': isEditMode }">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <RFQBasicInfo
            :rfq-data="rfqData"
            :is-edit-mode="isEditMode"
            :edit-form-data="editFormData"
            :edit-errors="editErrors"
            @update:edit-form-data="handleUpdateEditFormData"
            @clear-error="clearEditError"
          />

          <!-- Document Details -->
          <RFQDocumentDetails
            :documents="documents"
            :is-edit-mode="isEditMode"
            :edited-documents="editedDocuments"
            @file-upload="handleFileUpload"
            @remove-document="removeExistingDocument"
            @remove-new-document="removeNewDocument"
            @download-document="downloadDocument"
          />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status and Timeline -->
          <RFQStatusTimeline
            :rfq-data="rfqData"
            :is-edit-mode="isEditMode"
            :edit-form-data="editFormData"
            :edit-errors="editErrors"
            @update:status="handleStatusUpdate"
            @clear-error="clearEditError"
          />

          <!-- Actions -->
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
        </div>
      </div>
    </div>

    <!-- Conflict Resolution Dialog -->
    <ConflictResolutionDialog
      :open="showConflictDialog"
      :conflict-data="conflictData"
      @update:open="showConflictDialog = $event"
      @discard-changes="handleDiscardChanges"
      @resolve-conflicts="handleResolveConflicts"
    />

    <!-- Add Collaborator Dialog -->
    <AddCollaboratorDialog
      :open="showAddDialog"
      :existing-collaborators="collaborators"
      :available-users="availableUsers"
      @update:open="showAddDialog = $event"
      @add-collaborator="handleAddCollaborator"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RFQDetailHeader from './RFQDetailHeader.vue'
import RFQBasicInfo from './RFQBasicInfo.vue'
import RFQDocumentDetails from './RFQDocumentDetails.vue'
import RFQStatusTimeline from './RFQStatusTimeline.vue'
import RFQActions from './RFQActions.vue'
import ConflictResolutionDialog from '@/components/ConflictResolutionDialog.vue'
import AddCollaboratorDialog from '@/components/AddCollaboratorDialog.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { 
  INITIAL_AVAILABLE_USERS
} from '@/data/mockData/rfqDetails'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { toast } = useToast()

// Data
const rfqData = ref<any>(null)

// Collaborators state (from rfqData)
const collaborators = ref<any[]>([])

// Available users with localStorage persistence
const availableUsers = useLocalStorage('availableUsers', INITIAL_AVAILABLE_USERS)

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

// Add collaborator dialog state
const showAddDialog = ref(false)

// CHANGE THIS: Use the same localStorage key as the list page
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)

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
    collaborators: collaborators.value,
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
    // Update status in the shared rfqList
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Sent to OEM'
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
    // Update status in the shared rfqList
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Quoted'
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

// Collaborator handlers
const handleCollaboratorAdded = (collaborator: any) => {
  toast({
    title: 'Collaborator Added',
    description: `${collaborator.name} has been added as a collaborator`
  })
}

const handleCollaboratorRemoved = (collaboratorId: string) => {
  const removed = collaborators.value.find(c => c.id === collaboratorId)
  if (removed) {
    const updatedCollaborators = collaborators.value.filter(c => c.id !== collaboratorId)
    collaborators.value = updatedCollaborators
    
    // Update rfqList
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value?.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].collaborators = updatedCollaborators
    }
    
    toast({
      title: 'Collaborator Removed',
      description: `${removed.name} has been removed from collaborators`
    })
  }
}

const handleAddCollaborator = (user: any) => {
  const newCollaborator = {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getCollaboratorInitials(user.name),
    addedAt: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  collaborators.value = [...collaborators.value, newCollaborator]
  
  // Update rfqList
  const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === rfqData.value?.rfqNo)
  if (rfqIndex !== -1) {
    rfqList.value[rfqIndex].collaborators = collaborators.value
  }
  
  handleCollaboratorAdded(newCollaborator)
  showAddDialog.value = false
}

const getCollaboratorInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    if (first && second) {
      return (first + second).toUpperCase()
    }
  }
  return name.substring(0, 2).toUpperCase()
}

// Load RFQ data based on route parameter
onMounted(() => {
  const rfqNo = route.params.rfqNo as string
  const foundRFQ = rfqList.value.find(rfq => rfq.rfqNo === rfqNo)
  
  if (foundRFQ) {
    rfqData.value = foundRFQ
    // Load collaborators from RFQ data if available
    if (foundRFQ.collaborators) {
      collaborators.value = foundRFQ.collaborators
    }
    // Load documents from RFQ data if available
    if (foundRFQ.documents) {
      documents.value = foundRFQ.documents
    }
  } else {
    // Handle case where RFQ not found
    console.error('RFQ not found:', rfqNo)
    goBack()
  }
})
</script>

