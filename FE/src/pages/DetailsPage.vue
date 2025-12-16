<template>
  <DetailPageLayout 
    :is-edit-mode="isEditMode" 
    background-color="bg-gray-50"
    :default-tab="defaultTab"
    :rfq-data="sourceRFQ"
    :quotation-data="quotationData"
  >
    <!-- Header Slot -->
    <template #header>
      <DetailHeader
        :title="headerTitle"
        :subtitle="headerSubtitle"
        :status="headerStatus"
        :status-badge-class="headerStatusBadgeClass"
        :is-edit-mode="isEditMode"
        :collaborators="sourceRFQ?.collaborators || quotationData?.collaborators || []"
        :entity-type="quotationData ? 'quotation' : 'rfq'"
        :entity-id="quotationData?.quotationNo || sourceRFQ?.rfqNo || ''"
        @go-back="goBack"
      />
    </template>

    <!-- RFQ Content Tab - 2 Column Layout -->
    <template #rfq-left>
      <RFQBasicInfo
        v-if="sourceRFQ"
        :rfq-data="sourceRFQ"
        :is-edit-mode="isEditMode && !quotationData"
        :edit-form-data="rfqEditFormData"
        :edit-errors="rfqEditErrors"
        @update:edit-form-data="handleUpdateRFQEditFormData"
        @clear-error="clearRFQEditError"
      />
      <Card v-else>
        <CardContent class="py-8 text-center">
          <p class="text-gray-500">No RFQ found</p>
        </CardContent>
      </Card>

      <DocumentSection
        v-if="!quotationData"
        title="Document Details"
        description="Attached documents and specifications"
        :documents="rfqDocuments"
        :is-edit-mode="isEditMode"
        :edited-documents="rfqEditedDocuments"
        @file-upload="handleRFQFileUpload"
        @remove-document="removeRFQDocument"
        @remove-new-document="removeNewRFQDocument"
        @download-document="downloadRFQDocument"
      />
    </template>

    <template #rfq-right>
      <RFQActions
        v-if="!quotationData"
        :is-edit-mode="isEditMode"
        :is-submitting="isSubmitting"
        @edit="editRFQ"
        @save="saveRFQChanges"
        @cancel="cancelRFQEdit"
        @send-to-oem="sendToOEM"
        @mark-as-quoted="markAsQuoted"
        @delete="deleteRFQ"
      />

      <StatusTimeline
        v-if="!quotationData"
        title="Status & Timeline"
        :status-timeline="sourceRFQ?.statusTimeline || []"
        :timeline-statuses="['Created', 'Under Review', 'Sent to OEM', 'Quoted']"
        :current-status="sourceRFQ?.status"
        :is-edit-mode="isEditMode"
        :status-options="['Under Review', 'Sent to OEM', 'Quoted']"
        @update:status="handleRFQStatusUpdate"
      >
        <template #footer>
          <div class="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
                {{ sourceRFQ?.lastEditedBy?.initials || 'AD' }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium text-gray-900">Last Edited By</p>
              <p class="text-xs text-gray-500">{{ sourceRFQ?.lastEditedBy?.name || 'Admin User' }}</p>
              <p class="text-xs text-gray-400">{{ sourceRFQ?.lastEditedBy?.timestamp || sourceRFQ?.date }}</p>
            </div>
          </div>
        </template>
      </StatusTimeline>

      <!-- Show RFQ info in read-only mode when viewing quotation -->
      <RFQBasicInfo
        v-if="quotationData && sourceRFQ"
        :rfq-data="sourceRFQ"
        :is-edit-mode="false"
        :edit-form-data="{}"
        :edit-errors="{}"
      />
    </template>

    <!-- RFQ Content Tab - Full Width (when viewing quotation) -->
    <template #rfq-content>
      <RFQBasicInfo
        v-if="sourceRFQ"
        :rfq-data="sourceRFQ"
        :is-edit-mode="false"
        :edit-form-data="{}"
        :edit-errors="{}"
      />
      <Card v-else>
        <CardContent class="py-8 text-center">
          <p class="text-gray-500">No source RFQ found for this quotation</p>
        </CardContent>
      </Card>
    </template>

    <!-- Quotation Content Tab - 2 Column Layout -->
    <template #quotation-left>
      <QuotationBasicInfo
        v-if="quotationData"
        :quotation-data="quotationData"
        :is-edit-mode="isEditMode"
      />

      <QuotationLineItems
        v-if="quotationData"
        :line-items="quotationData?.lineItems || []"
        :currency="quotationData?.currency"
        :is-edit-mode="isEditMode"
      />

      <DocumentSection
        v-if="quotationData"
        title="Supporting Documents"
        description="Technical specifications and related documents"
        :documents="quotationDocuments"
        :is-edit-mode="isEditMode"
        :edited-documents="quotationEditedDocuments"
        @file-upload="handleQuotationFileUpload"
        @remove-document="removeQuotationDocument"
        @remove-new-document="removeNewQuotationDocument"
        @download-document="downloadQuotationDocument"
      />

      <!-- Show all quotations for RFQ when no specific quotation selected -->
      <template v-if="!quotationData && relatedQuotations.length > 0">
        <QuotationBasicInfo
          v-for="quotation in relatedQuotations"
          :key="quotation.quotationNo"
          :quotation-data="quotation"
          :is-edit-mode="false"
        />
      </template>
      <Card v-if="!quotationData && relatedQuotations.length === 0">
        <CardContent class="py-8 text-center">
          <p class="text-gray-500">No quotations found for this RFQ</p>
        </CardContent>
      </Card>
    </template>

    <template #quotation-right>
      <QuotationActions
        v-if="quotationData"
        :is-edit-mode="isEditMode"
        :is-submitting="isSubmitting"
        @edit="editQuotation"
        @save="saveQuotationChanges"
        @cancel="cancelQuotationEdit"
        @send-to-customer="sendToCustomer"
        @mark-as-accepted="markAsAccepted"
        @mark-as-rejected="markAsRejected"
        @export-pdf="exportPDF"
        @delete="deleteQuotation"
      />

      <StatusTimeline
        v-if="quotationData"
        title="Status & Timeline"
        :status-timeline="quotationData?.statusTimeline || []"
        :timeline-statuses="['Draft', 'Sent', 'Accepted', 'Rejected']"
        :current-status="quotationData?.validityStatus"
        :is-edit-mode="isEditMode"
        @update:status="handleQuotationStatusUpdate"
      >
        <template #footer>
          <div class="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
                {{ quotationData?.lastEditedBy?.initials || 'AD' }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium text-gray-900">Last Edited By</p>
              <p class="text-xs text-gray-500">{{ quotationData?.lastEditedBy?.name || 'Admin User' }}</p>
              <p class="text-xs text-gray-400">{{ quotationData?.lastEditedBy?.timestamp || quotationData?.offerDate }}</p>
            </div>
          </div>
        </template>
      </StatusTimeline>
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <ConflictResolutionDialog
        v-if="!quotationData"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'

// Generic Components
import DetailPageLayout from '@/components/details/DetailPageLayout.vue'
import DetailHeader from '@/components/details/DetailHeader.vue'
import DocumentSection from '@/components/details/DocumentSection.vue'
import StatusTimeline from '@/components/details/StatusTimeline.vue'
import { Card, CardContent } from '@/components/ui/card'

// RFQ Components
import RFQBasicInfo from '@/components/modules/rfq/RFQBasicInfo.vue'
import RFQActions from '@/components/modules/rfq/RFQActions.vue'

// Quotation Components
import QuotationBasicInfo from '@/components/modules/quotation/QuotationBasicInfo.vue'
import QuotationLineItems from '@/components/modules/quotation/QuotationLineItems.vue'
import QuotationActions from '@/components/modules/quotation/QuotationActions.vue'

// Dialogs
import ConflictResolutionDialog from '@/components/ConflictResolutionDialog.vue'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { toast } = useToast()

// Data
const quotationData = ref<any>(null)
const sourceRFQ = ref<any>(null)
const relatedQuotations = ref<any[]>([])

// RFQ Documents state
const rfqDocuments = ref<any[]>([])
const rfqEditedDocuments = ref<any[]>([])
const originalRFQDocuments = ref<any[]>([])

// Quotation Documents state
const quotationDocuments = ref<any[]>([])
const quotationEditedDocuments = ref<any[]>([])

// Edit mode state
const isEditMode = ref(false)
const isSubmitting = ref(false)

// RFQ Edit state
const rfqEditFormData = ref({
  no: '',
  rfqNo: '',
  referenceNo: '',
  pno: '',
  desc: '',
  quantity: 1,
  aes: '',
  status: ''
})
const rfqEditErrors = ref<Record<string, string>>({})

// Conflict resolution state (for RFQ)
const showConflictDialog = ref(false)
const conflictData = ref<any[]>([])

// Use localStorage
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)

// Computed properties
const defaultTab = computed(() => {
  return quotationData.value ? 'quotation' : 'rfq'
})

const headerTitle = computed(() => {
  if (quotationData.value) {
    return quotationData.value.quotationNo || 'Loading...'
  }
  return sourceRFQ.value?.rfqNo || 'Loading...'
})

const headerSubtitle = computed(() => {
  return quotationData.value ? 'Quotation Details' : 'RFQ Details'
})

const headerStatus = computed(() => {
  if (quotationData.value) {
    return quotationData.value.validityStatus
  }
  return sourceRFQ.value?.status
})

const headerStatusBadgeClass = computed(() => {
  if (quotationData.value) {
    return getValidityStatusBadgeClass(quotationData.value.validityStatus)
  }
  return getStatusBadgeClass(sourceRFQ.value?.status || '')
})

// Helper functions
const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-gray-300 text-gray-800',
    'Quoted': 'bg-gray-400 text-gray-900'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getValidityStatusBadgeClass = (status: string) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Expired': 'bg-red-100 text-red-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Navigation
const goBack = () => {
  if (quotationData.value) {
    router.push('/quotations')
  } else {
    router.push('/request-for-quotation')
  }
}

// Watch for route changes
watch(() => route.params, () => {
  loadData()
}, { immediate: false })

// Load data
const loadData = () => {
  const rfqNo = route.params.rfqNo as string
  const quotationNo = route.params.quotationNo as string | undefined

  // Validate rfqNo
  if (!rfqNo) {
    console.error('RFQ number is required')
    goBack()
    return
  }

  // Load RFQ
  const foundRFQ = rfqList.value.find((rfq: any) => rfq.rfqNo === rfqNo)
  if (!foundRFQ) {
    console.error('RFQ not found:', rfqNo)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'RFQ not found'
    })
    goBack()
    return
  }
  sourceRFQ.value = foundRFQ
  
  // Load RFQ documents
  if (foundRFQ.documents) {
    rfqDocuments.value = foundRFQ.documents
    originalRFQDocuments.value = [...foundRFQ.documents]
  } else {
    rfqDocuments.value = []
    originalRFQDocuments.value = []
  }

  // Load related quotations
  relatedQuotations.value = quotationList.value.filter(
    (quotation: any) => quotation.rfqNo === rfqNo
  )

  // Load quotation if provided and not empty
  if (quotationNo && quotationNo.trim() !== '') {
    const foundQuotation = quotationList.value.find((q: any) => q.quotationNo === quotationNo)
    if (foundQuotation) {
      // Validate that quotation belongs to this RFQ
      if (foundQuotation.rfqNo !== rfqNo) {
        console.error('Quotation does not belong to this RFQ')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Quotation does not belong to this RFQ'
        })
        quotationData.value = null
      } else {
        quotationData.value = foundQuotation
        // Load quotation documents if available
        if (foundQuotation.documents) {
          quotationDocuments.value = foundQuotation.documents
        } else {
          quotationDocuments.value = []
        }
      }
    } else {
      console.error('Quotation not found:', quotationNo)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Quotation not found'
      })
      quotationData.value = null
      // Navigate to RFQ-only view if quotation not found
      router.push(`/rfq/${rfqNo}/q`)
    }
  } else {
    quotationData.value = null
  }
  
  // Reset edit mode when data changes
  isEditMode.value = false
  rfqEditErrors.value = {}
  rfqEditedDocuments.value = []
  quotationEditedDocuments.value = []
}

// RFQ Methods
const editRFQ = () => {
  if (!sourceRFQ.value) return
  
  rfqEditFormData.value = {
    no: sourceRFQ.value.no || '',
    rfqNo: sourceRFQ.value.rfqNo || '',
    referenceNo: sourceRFQ.value.referenceNo || '',
    pno: sourceRFQ.value.pno || '',
    desc: sourceRFQ.value.desc || '',
    quantity: sourceRFQ.value.quantity || 1,
    aes: sourceRFQ.value.aes || '',
    status: sourceRFQ.value.status || ''
  }
  
  originalRFQDocuments.value = [...rfqDocuments.value]
  rfqEditedDocuments.value = []
  rfqEditErrors.value = {}
  isEditMode.value = true
}

const cancelRFQEdit = () => {
  if (hasRFQEditChanges()) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      exitRFQEditMode()
    }
  } else {
    exitRFQEditMode()
  }
}

const exitRFQEditMode = () => {
  isEditMode.value = false
  rfqEditErrors.value = {}
  rfqEditedDocuments.value = []
}

const hasRFQEditChanges = () => {
  if (!sourceRFQ.value) return false
  return rfqEditFormData.value.pno !== sourceRFQ.value.pno ||
         rfqEditFormData.value.desc !== sourceRFQ.value.desc ||
         rfqEditFormData.value.quantity !== sourceRFQ.value.quantity ||
         rfqEditFormData.value.aes !== sourceRFQ.value.aes ||
         rfqEditFormData.value.status !== sourceRFQ.value.status ||
         rfqEditFormData.value.referenceNo !== sourceRFQ.value.referenceNo ||
         rfqEditFormData.value.rfqNo !== sourceRFQ.value.rfqNo ||
         rfqEditedDocuments.value.length > 0
}

const validateRFQEditForm = () => {
  rfqEditErrors.value = {}
  
  if (!rfqEditFormData.value.pno.trim()) {
    rfqEditErrors.value.pno = 'Part number is required'
  }
  
  if (!rfqEditFormData.value.desc.trim()) {
    rfqEditErrors.value.desc = 'Description is required'
  }
  
  if (!rfqEditFormData.value.quantity || rfqEditFormData.value.quantity < 1) {
    rfqEditErrors.value.quantity = 'Quantity must be at least 1'
  }
  
  if (!rfqEditFormData.value.aes) {
    rfqEditErrors.value.aes = 'AES classification is required'
  }
  
  if (!rfqEditFormData.value.referenceNo.trim()) {
    rfqEditErrors.value.referenceNo = 'Reference number is required'
  }
  
  if (!rfqEditFormData.value.rfqNo.trim()) {
    rfqEditErrors.value.rfqNo = 'RFQ number is required'
  }
  
  if (!rfqEditFormData.value.status) {
    rfqEditErrors.value.status = 'Status is required'
  }
  
  return Object.keys(rfqEditErrors.value).length === 0
}

const clearRFQEditError = (field: string) => {
  if (rfqEditErrors.value[field]) {
    delete rfqEditErrors.value[field]
  }
}

const handleUpdateRFQEditFormData = (field: string, value: any) => {
  (rfqEditFormData.value as any)[field] = value
}

const handleRFQStatusUpdate = (value: string) => {
  rfqEditFormData.value.status = value
  clearRFQEditError('status')
}

const updateStatusTimeline = (newStatus: string) => {
  if (!sourceRFQ.value) return
  
  // Initialize statusTimeline if it doesn't exist
  if (!sourceRFQ.value.statusTimeline) {
    sourceRFQ.value.statusTimeline = []
  }
  
  // Check if this status is already in the timeline
  const existingStatusIndex = sourceRFQ.value.statusTimeline.findIndex(
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
    
    sourceRFQ.value.statusTimeline.push({
      status: newStatus,
      timestamp: timestamp
    })
  }
}

const saveRFQChanges = async () => {
  if (!validateRFQEditForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate conflict detection (30% chance)
    const hasConflicts = Math.random() < 0.3
    
    if (hasConflicts) {
      const currentDbVersion = {
        desc: rfqEditFormData.value.desc + ' - Updated by another user',
      }
      
      const conflicts: Array<{
        key: string
        label: string
        yourValue: string | number
        currentValue: string | number
      }> = []
      
      if (rfqEditFormData.value.desc !== currentDbVersion.desc) {
        conflicts.push({
          key: 'desc',
          label: 'Description',
          yourValue: rfqEditFormData.value.desc,
          currentValue: currentDbVersion.desc
        })
      }
      
      if (conflicts.length > 0) {
        conflictData.value = conflicts
        showConflictDialog.value = true
        isSubmitting.value = false
        return
      }
    }
    
    await performRFQSave()
    
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

const performRFQSave = async () => {
  if (!sourceRFQ.value) return
  
  const updatedDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  
  // Update status timeline if status changed
  if (rfqEditFormData.value.status !== sourceRFQ.value.status) {
    updateStatusTimeline(rfqEditFormData.value.status)
  }
  
  // Update documents
  if (rfqEditedDocuments.value.length > 0) {
    const newDocs = rfqEditedDocuments.value.map((file, index) => ({
      id: rfqDocuments.value.length + index + 1,
      name: file.name,
      type: getFileTypeFromMime(file.type),
      size: formatFileSize(file.size),
      uploadDate: updatedDate,
      url: '#'
    }))
    rfqDocuments.value.push(...newDocs)
  }
  
  sourceRFQ.value = {
    ...sourceRFQ.value,
    no: rfqEditFormData.value.no,
    rfqNo: rfqEditFormData.value.rfqNo,
    referenceNo: rfqEditFormData.value.referenceNo,
    pno: rfqEditFormData.value.pno,
    desc: rfqEditFormData.value.desc,
    quantity: rfqEditFormData.value.quantity,
    aes: rfqEditFormData.value.aes,
    status: rfqEditFormData.value.status,
    date: updatedDate,
    documents: rfqDocuments.value,
    lastEditedBy: {
      ...(sourceRFQ.value.lastEditedBy || {
        name: 'Admin User',
        initials: 'AD'
      }),
      timestamp: updatedDate
    },
    timestamp: new Date().getTime()
  }

  // Update in localStorage
  const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === sourceRFQ.value.rfqNo)
  if (rfqIndex !== -1) {
    rfqList.value[rfqIndex] = { ...rfqList.value[rfqIndex], ...sourceRFQ.value }
  }
  
  toast({
    title: 'Success',
    description: `RFQ ${rfqEditFormData.value.rfqNo} updated successfully!`
  })
  
  exitRFQEditMode()
}

const sendToOEM = () => {
  if (sourceRFQ.value) {
    updateStatusTimeline('Sent to OEM')
    
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === sourceRFQ.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Sent to OEM'
      rfqList.value[rfqIndex].statusTimeline = sourceRFQ.value.statusTimeline
      sourceRFQ.value.status = 'Sent to OEM'
    }
  }
  
  toast({
    title: 'Sending to OEM',
    description: `RFQ ${sourceRFQ.value?.rfqNo} sent to OEM`
  })
}

const markAsQuoted = () => {
  if (sourceRFQ.value) {
    updateStatusTimeline('Quoted')
    
    const rfqIndex = rfqList.value.findIndex(rfq => rfq.rfqNo === sourceRFQ.value.rfqNo)
    if (rfqIndex !== -1) {
      rfqList.value[rfqIndex].status = 'Quoted'
      rfqList.value[rfqIndex].statusTimeline = sourceRFQ.value.statusTimeline
      sourceRFQ.value.status = 'Quoted'
    }
  }
  
  toast({
    title: 'Marked as Quoted',
    description: `RFQ ${sourceRFQ.value?.rfqNo} marked as quoted`
  })
}

const deleteRFQ = () => {
  if (confirm(`Are you sure you want to delete ${sourceRFQ.value?.rfqNo}?`)) {
    toast({
      title: 'Deleted',
      description: `RFQ ${sourceRFQ.value?.rfqNo} deleted successfully`
    })
    goBack()
  }
}

// Conflict resolution handlers
const handleDiscardChanges = () => {
  if (!sourceRFQ.value) return
  rfqEditFormData.value = {
    no: sourceRFQ.value.no || '',
    rfqNo: sourceRFQ.value.rfqNo || '',
    referenceNo: sourceRFQ.value.referenceNo || '',
    pno: sourceRFQ.value.pno || '',
    desc: sourceRFQ.value.desc || '',
    quantity: sourceRFQ.value.quantity || 1,
    aes: sourceRFQ.value.aes || '',
    status: sourceRFQ.value.status || ''
  }
  rfqEditErrors.value = {}
  rfqEditedDocuments.value = []
}

const handleResolveConflicts = async (resolutions: Array<{ key: string; selectedValue: string | number }>) => {
  isSubmitting.value = true
  
  try {
    resolutions.forEach(resolution => {
      const key = resolution.key as keyof typeof rfqEditFormData.value
      if (key in rfqEditFormData.value) {
        rfqEditFormData.value[key] = resolution.selectedValue as never
      }
    })
    
    await performRFQSave()
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

// RFQ Document management
const handleRFQFileUpload = (files: File[]) => {
  rfqEditedDocuments.value.push(...files)
}

const removeRFQDocument = (index: number) => {
  rfqDocuments.value.splice(index, 1)
}

const removeNewRFQDocument = (index: number) => {
  rfqEditedDocuments.value.splice(index, 1)
}

const downloadRFQDocument = (doc: any) => {
  toast({
    title: 'Downloading',
    description: `Starting download for ${doc.name}...`
  })
}

// Quotation Methods
const editQuotation = () => {
  isEditMode.value = true
}

const cancelQuotationEdit = () => {
  if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
    isEditMode.value = false
    quotationEditedDocuments.value = []
  }
}

const saveQuotationChanges = async () => {
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Success',
      description: `Quotation ${quotationData.value?.quotationNo} updated successfully!`
    })
    
    isEditMode.value = false
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Error updating quotation. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const sendToCustomer = () => {
  toast({
    title: 'Sending Quotation',
    description: `Quotation ${quotationData.value?.quotationNo} sent to customer`
  })
}

const markAsAccepted = () => {
  if (quotationData.value) {
    quotationData.value.validityStatus = 'Accepted'
    
    toast({
      title: 'Marked as Accepted',
      description: `Quotation ${quotationData.value.quotationNo} marked as accepted`
    })
  }
}

const markAsRejected = () => {
  if (quotationData.value) {
    quotationData.value.validityStatus = 'Rejected'
    
    toast({
      title: 'Marked as Rejected',
      description: `Quotation ${quotationData.value.quotationNo} marked as rejected`
    })
  }
}

const exportPDF = () => {
  toast({
    title: 'Exporting PDF',
    description: `Generating PDF for quotation ${quotationData.value?.quotationNo}...`
  })
}

const deleteQuotation = () => {
  if (confirm(`Are you sure you want to delete ${quotationData.value?.quotationNo}?`)) {
    toast({
      title: 'Deleted',
      description: `Quotation ${quotationData.value?.quotationNo} deleted successfully`
    })
    // Navigate back to RFQ view
    router.push(`/rfq/${sourceRFQ.value?.rfqNo}/q`)
  }
}

const handleQuotationStatusUpdate = (status: string) => {
  console.log('Status updated:', status)
}

// Quotation Document management
const handleQuotationFileUpload = (files: File[]) => {
  quotationEditedDocuments.value.push(...files)
}

const removeQuotationDocument = (index: number) => {
  quotationDocuments.value.splice(index, 1)
}

const removeNewQuotationDocument = (index: number) => {
  quotationEditedDocuments.value.splice(index, 1)
}

const downloadQuotationDocument = (doc: any) => {
  toast({
    title: 'Downloading',
    description: `Starting download for ${doc.name}...`
  })
}

// Helper functions for file handling
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

// Initialize
onMounted(() => {
  loadData()
})
</script>

