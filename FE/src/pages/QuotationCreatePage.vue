<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            @click="handleCancel"
            class="flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Button>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Create New Quotation</h1>
            <p class="text-sm text-gray-500">Add a new quotation for a customer</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
            <CardDescription>Core details of the quotation offer</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="quotationNo" class="text-sm font-medium text-gray-700">Quotation Number *</Label>
                <Input
                  id="quotationNo"
                  v-model="formData.quotationNo"
                  type="text"
                  placeholder="e.g. 20081072"
                  :class="{ 'border-red-500': errors.quotationNo }"
                  @input="clearError('quotationNo')"
                />
                <p v-if="errors.quotationNo" class="text-xs text-red-500 mt-1">{{ errors.quotationNo }}</p>
              </div>
              <div>
                <Label for="referenceNo" class="text-sm font-medium text-gray-700">Reference No</Label>
                <Input
                  id="referenceNo"
                  v-model="formData.referenceNo"
                  type="text"
                  placeholder="04"
                />
              </div>
              <div>
                <Label for="currency" class="text-sm font-medium text-gray-700">Currency *</Label>
                <select
                  id="currency"
                  v-model="formData.currency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errors.currency }"
                  @change="clearError('currency')"
                >
                  <option value="">Select currency</option>
                  <option value="CHF">CHF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <p v-if="errors.currency" class="text-xs text-red-500 mt-1">{{ errors.currency }}</p>
              </div>
              <div>
                <Label for="offerDate" class="text-sm font-medium text-gray-700">Offer Date *</Label>
                <Input
                  id="offerDate"
                  v-model="formData.offerDate"
                  type="date"
                  :class="{ 'border-red-500': errors.offerDate }"
                  @input="clearError('offerDate')"
                />
                <p v-if="errors.offerDate" class="text-xs text-red-500 mt-1">{{ errors.offerDate }}</p>
              </div>
              <div>
                <Label for="validityDate" class="text-sm font-medium text-gray-700">Validity Date *</Label>
                <Input
                  id="validityDate"
                  v-model="formData.validityDate"
                  type="date"
                  :class="{ 'border-red-500': errors.validityDate }"
                  @input="clearError('validityDate')"
                />
                <p v-if="errors.validityDate" class="text-xs text-red-500 mt-1">{{ errors.validityDate }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Line Items: inline table with "Add row" bar -->
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
            <CardDescription>Fill the row below and click "Add line" or press Enter to add items</CardDescription>
          </CardHeader>
          <CardContent>
            <p v-if="errors.lineItems" class="text-xs text-red-500 mb-2">{{ errors.lineItems }}</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-10">#</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">RFQ No</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">Description</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">P/NO</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">AES</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">QTY</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-14">U/M</th>
                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Unit Price</th>
                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Total</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-14">TAT</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <!-- Committed rows -->
                  <tr
                    v-for="(line, index) in formData.lineItems"
                    :key="index"
                    class="hover:bg-gray-50/80"
                  >
                    <td class="px-2 py-1.5 text-gray-600 font-medium">{{ index + 1 }}</td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="line.rfqNo"
                        type="text"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="line.desc"
                        type="text"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="line.pno"
                        type="text"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <select
                        v-model="line.aes"
                        class="h-8 w-full min-w-0 px-2 text-xs border border-gray-300 rounded-md"
                      >
                        <option value="A">A</option>
                        <option value="E">E</option>
                      </select>
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model.number="line.quantity"
                        type="number"
                        min="1"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="line.unitOfMeasure"
                        type="text"
                        class="h-8 w-14 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5 text-right">
                      <Input
                        v-model.number="line.unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        class="h-8 min-w-0 text-xs text-right"
                      />
                    </td>
                    <td class="px-2 py-1.5 text-right font-medium text-gray-900">
                      {{ formatCurrency(lineTotal(line)) }}
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model.number="line.tat"
                        type="number"
                        min="0"
                        class="h-8 w-14 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        @click="removeLineItem(index)"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                  <!-- New row: fill and Add line (or Enter) -->
                  <tr
                    class="bg-gray-50/80 border-t-2 border-dashed border-gray-300"
                    @keydown.enter.prevent="addLineFromNewRow"
                  >
                    <td class="px-2 py-1.5 text-gray-400 italic">+</td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="newLineRow.rfqNo"
                        type="text"
                        placeholder="RFQ No"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="newLineRow.desc"
                        type="text"
                        placeholder="Description"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="newLineRow.pno"
                        type="text"
                        placeholder="P/NO"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <select
                        v-model="newLineRow.aes"
                        class="h-8 w-full min-w-0 px-2 text-xs border border-gray-300 rounded-md"
                      >
                        <option value="A">A</option>
                        <option value="E">E</option>
                      </select>
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model.number="newLineRow.quantity"
                        type="number"
                        min="1"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="newLineRow.unitOfMeasure"
                        type="text"
                        placeholder="EA"
                        class="h-8 w-14 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5 text-right">
                      <Input
                        v-model.number="newLineRow.unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        class="h-8 min-w-0 text-xs text-right"
                      />
                    </td>
                    <td class="px-2 py-1.5 text-right font-medium text-gray-600">
                      {{ formatCurrency(lineTotal(newLineRow)) }}
                    </td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model.number="newLineRow.tat"
                        type="number"
                        min="0"
                        class="h-8 w-14 min-w-0 text-xs"
                      />
                    </td>
                    <td class="px-2 py-1.5">
                      <Button
                        type="button"
                        size="sm"
                        class="h-8 bg-gray-800 hover:bg-gray-700 text-white text-xs"
                        @click="addLineFromNewRow"
                      >
                        Add line
                      </Button>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colspan="8" class="px-2 py-2 text-right text-xs font-semibold text-gray-700">
                      Quotation total
                    </td>
                    <td class="px-2 py-2 text-right text-base font-bold text-gray-900">
                      {{ formatCurrency(totalAmount) }}
                    </td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <!-- Documents (optional) -->
        <DocumentSection
          title="Documents"
          description="Attach supporting documents (optional)"
          :documents="[]"
          :is-edit-mode="true"
          :edited-documents="quotationNewDocuments"
          @file-upload="handleQuotationFileUpload"
          @remove-new-document="removeQuotationNewDocument"
        />

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3">
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
            <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Quotation' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'
import DocumentSection from '@/components/details/DocumentSection.vue'

const router = useRouter()
const { toast } = useToast()
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)

type LineItemForm = {
  rfqNo: string
  desc: string
  pno: string
  aes: string
  quantity: number
  unitOfMeasure: string
  unitPrice: number
  tat: number
}

const defaultLineItem = (): LineItemForm => ({
  rfqNo: '',
  desc: '',
  pno: '',
  aes: 'A',
  quantity: 1,
  unitOfMeasure: 'EA',
  unitPrice: 0,
  tat: 0
})

const formData = ref({
  quotationNo: '',
  referenceNo: '04',
  currency: 'CHF',
  offerDate: '',
  validityDate: '',
  lineItems: [] as LineItemForm[]
})

/** Single empty row at the bottom; fill and click "Add line" or press Enter to append */
const newLineRow = ref<LineItemForm>(defaultLineItem())

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

/** Uploaded files for the new quotation (optional) */
const quotationNewDocuments = ref<File[]>([])

const lineTotal = (line: LineItemForm) => {
  const qty = Number(line.quantity) || 0
  const price = Number(line.unitPrice) || 0
  return Math.round(qty * price * 100) / 100
}

const totalAmount = computed(() => {
  return formData.value.lineItems.reduce((sum, line) => sum + lineTotal(line), 0)
})

const formatCurrency = (amount: number) => {
  if (amount == null || isNaN(amount)) return '-'
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: formData.value.currency || 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}

function parseDateString(s: string): Date | null {
  if (!s?.trim()) return null
  const parts = s.split(/[/-]/).map(p => p.trim())
  if (parts.length >= 3) {
    const a = parseInt(parts[0], 10)
    const b = parseInt(parts[1], 10)
    const c = parseInt(parts[2], 10)
    // YYYY-MM-DD (e.g. from date input) vs d/M/yyyy
    const isIso = parts[0].length === 4
    const [year, month, day] = isIso ? [a, b, c] : [c < 100 ? 2000 + c : c, b, a]
    return new Date(year, month - 1, day)
  }
  return null
}

/** Format YYYY-MM-DD to d/M/yyyy for display/mock consistency */
function formatDateToDisplay(isoOrAny: string): string {
  const d = parseDateString(isoOrAny)
  if (!d) return isoOrAny
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function getFileTypeLabel(file: File): string {
  if (file.type.includes('pdf')) return 'PDF'
  if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'Excel'
  if (file.type.includes('word') || file.type.includes('document')) return 'Word'
  if (file.type.includes('image')) return 'Image'
  if (file.name.toLowerCase().endsWith('.dwg')) return 'DWG'
  return 'FILE'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function filesToDocumentShape(files: File[], now: Date): { id: number; name: string; type: string; size: string; uploadDate: string; url: string }[] {
  const uploadDateStr = now.toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  return files.map((file, i) => ({
    id: i + 1,
    name: file.name,
    type: getFileTypeLabel(file),
    size: formatFileSize(file.size),
    uploadDate: uploadDateStr,
    url: '#'
  }))
}

function computeDaysRemaining(validityDateStr: string): number {
  const d = parseDateString(validityDateStr)
  if (!d) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = d.getTime() - today.getTime()
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

const addLineFromNewRow = () => {
  const row = newLineRow.value
  if (
    !row.rfqNo?.trim() ||
    !row.desc?.trim() ||
    !row.pno?.trim() ||
    !row.quantity ||
    row.quantity < 1 ||
    row.unitPrice == null ||
    row.unitPrice < 0
  ) {
    errors.value.lineItems = 'Fill RFQ No, Description, P/NO, Quantity and Unit Price before adding'
    return
  }
  delete errors.value.lineItems
  formData.value.lineItems.push({
    rfqNo: row.rfqNo.trim(),
    desc: row.desc.trim(),
    pno: row.pno.trim(),
    aes: row.aes || 'A',
    quantity: Number(row.quantity) || 0,
    unitOfMeasure: row.unitOfMeasure || 'EA',
    unitPrice: Number(row.unitPrice) || 0,
    tat: Number(row.tat) || 0
  })
  newLineRow.value = defaultLineItem()
}

const removeLineItem = (index: number) => {
  formData.value.lineItems.splice(index, 1)
}

const handleQuotationFileUpload = (files: File[]) => {
  quotationNewDocuments.value.push(...files)
}

const removeQuotationNewDocument = (index: number) => {
  quotationNewDocuments.value.splice(index, 1)
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.quotationNo.trim()) {
    errors.value.quotationNo = 'Quotation number is required'
  }
  if (!formData.value.currency) {
    errors.value.currency = 'Currency is required'
  }
  if (!formData.value.offerDate.trim()) {
    errors.value.offerDate = 'Offer date is required'
  }
  if (!formData.value.validityDate.trim()) {
    errors.value.validityDate = 'Validity date is required'
  }

  const lines = formData.value.lineItems
  if (!lines.length) {
    errors.value.lineItems = 'At least one line item is required'
  } else {
    const hasInvalid = lines.some(
      (l, i) =>
        !l.rfqNo?.trim() ||
        !l.desc?.trim() ||
        !l.pno?.trim() ||
        !l.quantity ||
        l.quantity < 1 ||
        l.unitPrice == null ||
        l.unitPrice < 0
    )
    if (hasInvalid) {
      errors.value.lineItems = 'Each line must have RFQ No, Description, P/NO, Quantity and Unit Price'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const existing = quotationList.value.find(
    (q: { quotationNo: string }) => q.quotationNo === formData.value.quotationNo
  )
  if (existing) {
    errors.value.quotationNo = 'A quotation with this number already exists'
    return
  }

  isSubmitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 800))

    const daysRemaining = computeDaysRemaining(formData.value.validityDate)
    const validityStatus = daysRemaining >= 0 ? 'Active' : 'Expired'
    const now = new Date()
    const timestamp = now.getTime()

    const lineItems = formData.value.lineItems.map((line, i) => {
      const totalPrice = lineTotal(line)
      return {
        no: i + 1,
        rfqNo: line.rfqNo.trim(),
        desc: line.desc.trim(),
        pno: line.pno.trim(),
        aes: line.aes || 'A',
        quantity: Number(line.quantity) || 0,
        unitOfMeasure: line.unitOfMeasure || 'EA',
        unitPrice: Number(line.unitPrice) || 0,
        totalPrice,
        tat: Number(line.tat) || 0
      }
    })

    const newQuotation = {
      no: quotationList.value.length + 1,
      quotationNo: formData.value.quotationNo.trim(),
      referenceNo: formData.value.referenceNo.trim() || '04',
      offerDate: formatDateToDisplay(formData.value.offerDate.trim()),
      validityDate: formatDateToDisplay(formData.value.validityDate.trim()),
      validityStatus,
      daysRemaining,
      currency: formData.value.currency,
      totalAmount: totalAmount.value,
      rfqNo: lineItems[0]?.rfqNo ?? '',
      lineItems,
      timestamp,
      lastEditedBy: {
        name: 'Admin User',
        initials: 'AD',
        timestamp: now.toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      },
      statusTimeline: [
        { status: 'Draft', timestamp: now.toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
      ],
      documents: filesToDocumentShape(quotationNewDocuments.value, now)
    }

    quotationList.value = [...quotationList.value, newQuotation]

    toast({
      title: 'Success',
      description: `Quotation ${formData.value.quotationNo} created successfully!`
    })
    router.push(`/quotations/${formData.value.quotationNo}`)
  } catch (e) {
    console.error(e)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to create quotation. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const hasNewRowContent = () => {
  const r = newLineRow.value
  return !!(r.rfqNo || r.desc || r.pno || r.quantity > 0 || r.unitPrice > 0)
}

const handleCancel = () => {
  if (
    formData.value.quotationNo ||
    formData.value.offerDate ||
    formData.value.validityDate ||
    formData.value.lineItems.length > 0 ||
    quotationNewDocuments.value.length > 0 ||
    hasNewRowContent()
  ) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/quotations')
    }
  } else {
    router.push('/quotations')
  }
}
</script>
