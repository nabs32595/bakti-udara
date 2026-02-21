<template>
  <DetailPageLayout
    :is-edit-mode="isEditMode"
    background-color="bg-gray-50"
    :entity-type="isQuotation ? 'quotation' : 'rfq'"
  >
    <template #header>
      <DetailHeader
        :title="headerTitle"
        :subtitle="headerSubtitle"
        :status="headerStatus"
        :status-badge-class="headerStatusBadgeClass"
        :is-edit-mode="isEditMode"
        :collaborators="isPO ? [] : (isQuotation ? (quotationData?.collaborators || []) : (sourceRFQ?.collaborators || []))"
        :entity-type="isPO ? undefined : (isQuotation ? 'quotation' : 'rfq')"
        :entity-id="isPO ? '' : (isQuotation ? quotationData?.quotationNo : sourceRFQ?.rfqNo) || ''"
      />
    </template>

    <!-- RFQ details: /rfq/:rfqNo -->
    <template v-if="isRFQ">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <RFQBasicInfo
            v-if="sourceRFQ"
            :rfq-data="sourceRFQ"
            :is-edit-mode="isEditMode"
            :edit-form-data="rfqEditFormData"
            :edit-errors="rfqEditErrors"
            @update:edit-form-data="handleUpdateRFQEditFormData"
            @clear-error="clearRFQEditError"
          />
          <Card v-else>
            <CardContent class="py-8 text-center">
              <p class="text-sm text-gray-500">No RFQ found</p>
            </CardContent>
          </Card>
          <DocumentSection
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
        </div>
        <div class="space-y-6">
          <RFQActions
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
                  <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium size-6">
                    {{ sourceRFQ?.lastEditedBy?.initials || 'AD' }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-xs font-medium text-gray-900">Last Edited By</p>
                  <p class="text-[11px] text-gray-500">{{ sourceRFQ?.lastEditedBy?.name || 'Admin User' }}</p>
                  <p class="text-[11px] text-gray-400">{{ sourceRFQ?.lastEditedBy?.timestamp || sourceRFQ?.date }}</p>
                </div>
              </div>
            </template>
          </StatusTimeline>
        </div>
      </div>
    </template>

    <!-- Quotation details: /quotations/:quotationNo -->
    <template v-else-if="isQuotation">
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <QuotationBasicInfo
              :quotation-data="quotationData"
              :is-edit-mode="isEditMode"
            />
            <DocumentSection
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
          </div>
          <div class="space-y-6">
            <QuotationActions
              :is-edit-mode="isEditMode"
              :is-submitting="isSubmitting"
              @edit="editQuotation"
              @save="saveQuotationChanges"
              @cancel="cancelQuotationEdit"
              @send-to-customer="sendToCustomer"
              @export-pdf="exportPDF"
              @delete="deleteQuotation"
            />
            <StatusTimeline
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
                    <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium size-6">
                      {{ quotationData?.lastEditedBy?.initials || 'AD' }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-xs font-medium text-gray-900">Last Edited By</p>
                    <p class="text-[11px] text-gray-500">{{ quotationData?.lastEditedBy?.name || 'Admin User' }}</p>
                    <p class="text-[11px] text-gray-400">{{ quotationData?.lastEditedBy?.timestamp || quotationData?.offerDate }}</p>
                  </div>
                </div>
              </template>
            </StatusTimeline>
          </div>
        </div>
        <QuotationLineItems
          :line-items="quotationData?.lineItems || []"
          :currency="quotationData?.currency"
          :is-edit-mode="isEditMode"
        />
      </div>
    </template>

    <!-- PO details: /purchase-orders/:poReference -->
    <template v-else-if="isPO">
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <POBasicInfo
                v-if="poLineItems.length > 0"
                :po-reference="poReference"
                :first-line="poLineItems[0]"
                :all-lines="poLineItems"
                :is-edit-mode="isEditMode"
                @navigate-quotation="viewQuotationDetails"
                @navigate-rfq="viewRFQDetails"
            />
            <Card v-else>
              <CardContent class="py-8 text-center">
                <p class="text-sm text-gray-500">Purchase order not found</p>
                <Button variant="outline" class="mt-4" @click="goBack">Back to Purchase Orders</Button>
              </CardContent>
            </Card>
            <DocumentSection
                v-if="poLineItems.length > 0"
                title="PO Documents"
                description="Attached documents for this purchase order"
                :documents="poDocuments"
                :is-edit-mode="isEditMode"
                :edited-documents="poEditedDocuments"
                @file-upload="handlePOFileUpload"
                @remove-document="removePODocument"
                @remove-new-document="removeNewPODocument"
                @download-document="downloadPODocument"
            />
          </div>
          <div class="space-y-6">
            <POActions
              v-if="poLineItems.length > 0"
              :is-edit-mode="isEditMode"
              :is-submitting="isSubmitting"
              @edit="editPO"
              @save="savePOChanges"
              @cancel="cancelPOEdit"
            />
            <StatusTimeline
                v-if="poLineItems.length > 0 && firstLine"
                title="Status & Timeline"
                :status-timeline="poStatusTimeline"
                :timeline-statuses="['Created', 'On Time', 'Revise EDD']"
                :current-status="firstLine.deliveryStatus"
                :is-edit-mode="isEditMode"
            >
              <template #footer>
                <div class="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium size-6">
                      {{ firstLine?.lastEditedBy?.initials || 'AD' }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-xs font-medium text-gray-900">Last Edited By</p>
                    <p class="text-[11px] text-gray-500">{{ firstLine?.lastEditedBy?.name || 'Admin User' }}</p>
                    <p class="text-[11px] text-gray-400">{{ firstLine?.lastEditedBy?.timestamp || firstLine?.poDate }}</p>
                  </div>
                </div>
              </template>
            </StatusTimeline>
          </div>
        </div>
        <POLineItemsTable
            v-if="poLineItems.length > 0"
            :line-items="poLineItems"
        />
      </div>
    </template>

    <template #dialogs>
      <ConflictResolutionDialog
        v-if="isRFQ"
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
import { INITIAL_PO_LIST } from '@/data/mockData/purchaseOrders'

// Generic Components
import DetailPageLayout from '@/components/details/DetailPageLayout.vue'
import DetailHeader from '@/components/details/DetailHeader.vue'
import DocumentSection from '@/components/details/DocumentSection.vue'
import StatusTimeline from '@/components/details/StatusTimeline.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// RFQ Components
import RFQBasicInfo from '@/components/modules/rfq/RFQBasicInfo.vue'
import RFQActions from '@/components/modules/rfq/RFQActions.vue'

// Quotation Components
import QuotationBasicInfo from '@/components/modules/quotation/QuotationBasicInfo.vue'
import QuotationLineItems from '@/components/modules/quotation/QuotationLineItems.vue'
import QuotationActions from '@/components/modules/quotation/QuotationActions.vue'

// PO Components
import POBasicInfo from '@/components/modules/po/POBasicInfo.vue'
import POLineItemsTable from '@/components/modules/po/POLineItemsTable.vue'
import POActions from '@/components/modules/po/POActions.vue'

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
const poList = useLocalStorage('poList', INITIAL_PO_LIST)

// PO state (for /purchase-orders/:poReference)
const poLineItems = ref<any[]>([])
const poDocuments = ref<any[]>([])
const poEditedDocuments = ref<any[]>([])
const poReference = computed(() => {
  const ref = route.params.poReference as string
  return ref ? decodeURIComponent(ref) : ''
})
const isPO = computed(() => !!route.params.poReference)
const isQuotation = computed(() => !!route.params.quotationNo)
const isRFQ = computed(() => !!route.params.rfqNo)
const firstLine = computed(() => poLineItems.value[0] ?? null)
const poStatusTimeline = computed(() => {
  const line = firstLine.value
  if (!line) return []
  return [
    { status: 'Created', timestamp: line.poDate },
    { status: line.deliveryStatus === 'ON TIME' ? 'On Time' : 'Revise EDD', timestamp: line.expectedDeliveryDate }
  ]
})

// Computed properties
const headerTitle = computed(() => {
  if (isPO.value) return poReference.value || 'Purchase Order'
  if (isQuotation.value) return quotationData.value?.quotationNo || 'Loading...'
  if (isRFQ.value) return sourceRFQ.value?.rfqNo || 'Loading...'
  return 'Loading...'
})

const headerSubtitle = computed(() => {
  if (isPO.value) return 'Purchase Order Details'
  if (isQuotation.value) return 'Quotation Details'
  if (isRFQ.value) return 'RFQ Details'
  return ''
})

const headerStatus = computed(() => {
  if (isPO.value) return firstLine.value?.deliveryStatus ?? ''
  if (isQuotation.value) return quotationData.value?.validityStatus ?? ''
  if (isRFQ.value) return sourceRFQ.value?.status ?? ''
  return ''
})

const headerStatusBadgeClass = computed(() => {
  if (isPO.value) return getDeliveryStatusBadgeClass(firstLine.value?.deliveryStatus ?? '')
  if (isQuotation.value) return getValidityStatusBadgeClass(quotationData.value?.validityStatus ?? '')
  if (isRFQ.value) return getStatusBadgeClass(sourceRFQ.value?.status || '')
  return 'bg-gray-100 text-gray-800'
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

const getDeliveryStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'ON TIME': 'bg-emerald-100 text-emerald-800',
    'REVISE EDD': 'bg-amber-100 text-amber-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

// Navigation
const goBack = () => {
  if (isPO.value) router.push('/purchase-orders')
  else if (isQuotation.value) router.push('/quotations')
  else if (isRFQ.value) router.push('/request-for-quotation')
}

const viewQuotationDetails = (quotationNo: string) => {
  router.push(`/quotations/${quotationNo}`)
}
const viewRFQDetails = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}`)
}

// PO edit & document handlers
const editPO = () => {
  isEditMode.value = true
}

const cancelPOEdit = () => {
  if (poEditedDocuments.value.length > 0 && !confirm('You have unsaved document changes. Cancel anyway?')) return
  isEditMode.value = false
  poEditedDocuments.value = []
  const ref = poReference.value
  const first = poList.value.find((item: any) => item.poReference === ref)
  poDocuments.value = first?.documents ? [...first.documents] : []
}

const hasPOEditChanges = () => poEditedDocuments.value.length > 0

const savePOChanges = () => {
  const updatedDate = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
  if (poEditedDocuments.value.length > 0) {
    const newDocs = poEditedDocuments.value.map((file: File, index: number) => ({
      id: poDocuments.value.length + index + 1,
      name: file.name,
      type: getFileTypeFromMime(file.type),
      size: formatFileSize(file.size),
      uploadDate: updatedDate,
      url: '#'
    }))
    poDocuments.value.push(...newDocs)
  }
  const ref = poReference.value
  const list = poList.value
  for (let i = 0; i < list.length; i++) {
    if (list[i].poReference === ref) {
      list[i] = { ...list[i], documents: [...poDocuments.value], lastEditedBy: { ...(list[i].lastEditedBy || { name: 'Admin User', initials: 'AD' }), timestamp: updatedDate } }
      break
    }
  }
  poList.value = list
  toast({ title: 'Saved', description: `PO ${ref} updated successfully` })
  isEditMode.value = false
  poEditedDocuments.value = []
}

const handlePOFileUpload = (files: File[]) => {
  poEditedDocuments.value.push(...files)
}
const removePODocument = (index: number) => {
  poDocuments.value.splice(index, 1)
}
const removeNewPODocument = (index: number) => {
  poEditedDocuments.value.splice(index, 1)
}
const downloadPODocument = (doc: any) => {
  toast({ title: 'Downloading', description: `Starting download for ${doc.name}...` })
}

// Watch for route changes
watch(() => route.params, () => {
  loadData()
}, { immediate: false })

// Load data
const loadData = () => {
  const poRef = route.params.poReference as string | undefined
  const quotationNo = route.params.quotationNo as string | undefined
  const rfqNo = route.params.rfqNo as string | undefined

  // Route: /purchase-orders/:poReference — load PO line items
  if (poRef && poRef.trim() !== '') {
    const ref = decodeURIComponent(poRef)
    const items = poList.value.filter((item: any) => item.poReference === ref)
    if (items.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Not found',
        description: 'Purchase order not found'
      })
      router.push('/purchase-orders')
      return
    }
    poLineItems.value = items
    const first = items[0]
    poDocuments.value = first?.documents ? [...first.documents] : []
    poEditedDocuments.value = []
    quotationData.value = null
    sourceRFQ.value = null
    isEditMode.value = false
    return
  }

  poLineItems.value = []
  poDocuments.value = []
  poEditedDocuments.value = []

  // Route: /quotations/:quotationNo — load quotation only (no RFQ tab)
  if (quotationNo && quotationNo.trim() !== '') {
    const foundQuotation = quotationList.value.find((q: any) => q.quotationNo === quotationNo)
    if (!foundQuotation) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Quotation not found'
      })
      router.push('/quotations')
      return
    }
    quotationData.value = foundQuotation
    sourceRFQ.value = null
    if (foundQuotation.documents) {
      quotationDocuments.value = foundQuotation.documents
    } else {
      quotationDocuments.value = []
    }
    isEditMode.value = false
    rfqEditErrors.value = {}
    rfqEditedDocuments.value = []
    quotationEditedDocuments.value = []
    return
  }

  // Route: /rfq/:rfqNo — load RFQ only (no quotation tab)
  if (!rfqNo) {
    goBack()
    return
  }
  quotationData.value = null

  const foundRFQ = rfqList.value.find((rfq: any) => rfq.rfqNo === rfqNo)
  if (!foundRFQ) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'RFQ not found'
    })
    goBack()
    return
  }
  sourceRFQ.value = foundRFQ
  if (foundRFQ.documents) {
    rfqDocuments.value = foundRFQ.documents
    originalRFQDocuments.value = [...foundRFQ.documents]
  } else {
    rfqDocuments.value = []
    originalRFQDocuments.value = []
  }

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
    router.push('/quotations')
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

