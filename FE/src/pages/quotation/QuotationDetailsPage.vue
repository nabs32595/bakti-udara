<template>
  <DetailPageLayout :is-edit-mode="isEditMode" background-color="bg-gray-50">
    <!-- Header Slot -->
    <template #header>
      <DetailHeader
        :title="quotationData?.quotationNo || 'Loading...'"
        subtitle="Quotation Details"
        :status="quotationData?.validityStatus"
        :status-badge-class="getValidityStatusBadgeClass(quotationData?.validityStatus)"
        :is-edit-mode="isEditMode"
        @go-back="goBack"
      />
    </template>

    <!-- Basic Info Slot -->
    <template #basic-info>
      <QuotationBasicInfo
        :quotation-data="quotationData"
        :is-edit-mode="isEditMode"
      />
    </template>

    <!-- Custom Sections Slot - Line Items -->
    <template #custom-sections>
      <QuotationLineItems
        :line-items="quotationData?.lineItems || []"
        :currency="quotationData?.currency"
        :is-edit-mode="isEditMode"
      />
    </template>

    <!-- Documents Slot -->
    <template #documents>
      <DocumentSection
        title="Supporting Documents"
        description="Technical specifications and related documents"
        :documents="documents"
        :is-edit-mode="isEditMode"
        :edited-documents="editedDocuments"
        @file-upload="handleFileUpload"
        @remove-document="removeExistingDocument"
        @remove-new-document="removeNewDocument"
        @download-document="downloadDocument"
      />
    </template>

    <!-- Status Timeline Slot -->
    <template #status-timeline>
      <StatusTimeline
        title="Status & Timeline"
        :status-timeline="quotationData?.statusTimeline || []"
        :timeline-statuses="['Draft', 'Sent', 'Accepted', 'Rejected']"
        :current-status="quotationData?.validityStatus"
        :is-edit-mode="isEditMode"
        @update:status="handleStatusUpdate"
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

    <!-- Related Items Slot - Show RFQ Link -->
    <template #related-items>
      <LinkedRFQSection
        :rfq-no="quotationData?.rfqNo || ''"
        :rfq-status="linkedRFQStatus"
      />
    </template>

    <!-- Actions Slot -->
    <template #actions>
      <QuotationActions
        :is-edit-mode="isEditMode"
        :is-submitting="isSubmitting"
        @edit="editQuotation"
        @save="saveChanges"
        @cancel="cancelEdit"
        @send-to-customer="sendToCustomer"
        @mark-as-accepted="markAsAccepted"
        @mark-as-rejected="markAsRejected"
        @export-pdf="exportPDF"
        @delete="deleteQuotation"
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
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'

// Generic Components
import DetailPageLayout from '@/components/details/DetailPageLayout.vue'
import DetailHeader from '@/components/details/DetailHeader.vue'
import DocumentSection from '@/components/details/DocumentSection.vue'
import StatusTimeline from '@/components/details/StatusTimeline.vue'

// Quotation-Specific Components
import QuotationBasicInfo from '@/components/modules/quotation/QuotationBasicInfo.vue'
import QuotationLineItems from '@/components/modules/quotation/QuotationLineItems.vue'
import QuotationActions from '@/components/modules/quotation/QuotationActions.vue'
import LinkedRFQSection from '@/components/modules/quotation/LinkedRFQSection.vue'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { toast } = useToast()

// Data
const quotationData = ref<any>(null)
const linkedRFQStatus = ref<string>('')

// Documents state
const documents = ref<any[]>([])
const editedDocuments = ref<any[]>([])

// Edit mode state
const isEditMode = ref(false)
const isSubmitting = ref(false)

// Use localStorage
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)

// Methods
const goBack = () => {
  router.push('/quotations')
}

const editQuotation = () => {
  isEditMode.value = true
}

const cancelEdit = () => {
  if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
    isEditMode.value = false
    editedDocuments.value = []
  }
}

const saveChanges = async () => {
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
    goBack()
  }
}

const handleStatusUpdate = (status: string) => {
  console.log('Status updated:', status)
}

// Document management
const handleFileUpload = (files: File[]) => {
  editedDocuments.value.push(...files)
}

const removeExistingDocument = (index: number) => {
  documents.value.splice(index, 1)
}

const removeNewDocument = (index: number) => {
  editedDocuments.value.splice(index, 1)
}

const downloadDocument = (doc: any) => {
  toast({
    title: 'Downloading',
    description: `Starting download for ${doc.name}...`
  })
}

// Helper functions
const getValidityStatusBadgeClass = (status: string) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Expired': 'bg-red-100 text-red-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Load quotation data
onMounted(() => {
  const quotationNo = route.params.quotationNo as string
  const foundQuotation = quotationList.value.find(q => q.quotationNo === quotationNo)
  
  if (foundQuotation) {
    quotationData.value = foundQuotation
    
    // Load linked RFQ status
    const linkedRFQ = rfqList.value.find(rfq => rfq.rfqNo === foundQuotation.rfqNo)
    if (linkedRFQ) {
      linkedRFQStatus.value = linkedRFQ.status
    }
    
    // Load documents if available
    if (foundQuotation.documents) {
      documents.value = foundQuotation.documents
    }
  } else {
    console.error('Quotation not found:', quotationNo)
    goBack()
  }
})
</script>

