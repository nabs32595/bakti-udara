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
            <h1 class="text-xl font-semibold text-gray-900">Create New Purchase Order</h1>
            <p class="text-sm text-gray-500">Add a new purchase order with line items</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- PO Header -->
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Information</CardTitle>
            <CardDescription>PO reference and date</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="poReference" class="text-sm font-medium text-gray-700">PO Reference *</Label>
                <Input
                  id="poReference"
                  v-model="formData.poReference"
                  type="text"
                  placeholder="e.g. MA070324-00186L1534-M2"
                  :class="{ 'border-red-500': errors.poReference }"
                  @input="clearError('poReference')"
                />
                <p v-if="errors.poReference" class="text-xs text-red-500 mt-1">{{ errors.poReference }}</p>
              </div>
              <div>
                <Label for="poDate" class="text-sm font-medium text-gray-700">PO Date *</Label>
                <Input
                  id="poDate"
                  v-model="formData.poDate"
                  type="date"
                  :class="{ 'border-red-500': errors.poDate }"
                  @input="clearError('poDate')"
                />
                <p v-if="errors.poDate" class="text-xs text-red-500 mt-1">{{ errors.poDate }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Line Items -->
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
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">Quotation No</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">RFQ No</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">Description</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">P/NO</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">AES</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">QTY</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-14">Line No</th>
                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Unit Price</th>
                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">Total</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-14">TAT</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">EDD</th>
                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(line, index) in formData.lineItems"
                    :key="index"
                    class="hover:bg-gray-50/80"
                  >
                    <td class="px-2 py-1.5 text-gray-600 font-medium">{{ index + 1 }}</td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="line.quotationNo"
                        type="text"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
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
                        v-model.number="line.lineNo"
                        type="number"
                        min="1"
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
                      <Input
                        v-model="line.expectedDeliveryDate"
                        type="date"
                        class="h-8 min-w-0 text-xs"
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
                  <!-- New row -->
                  <tr
                    class="bg-gray-50/80 border-t-2 border-dashed border-gray-300"
                    @keydown.enter.prevent="addLineFromNewRow"
                  >
                    <td class="px-2 py-1.5 text-gray-400 italic">+</td>
                    <td class="px-2 py-1.5">
                      <Input
                        v-model="newLineRow.quotationNo"
                        type="text"
                        placeholder="Quotation No"
                        class="h-8 min-w-0 text-xs"
                      />
                    </td>
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
                        v-model.number="newLineRow.lineNo"
                        type="number"
                        min="1"
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
                      <Input
                        v-model="newLineRow.expectedDeliveryDate"
                        type="date"
                        class="h-8 min-w-0 text-xs"
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
                    <td colspan="9" class="px-2 py-2 text-right text-xs font-semibold text-gray-700">
                      PO total
                    </td>
                    <td class="px-2 py-2 text-right text-base font-bold text-gray-900">
                      {{ formatCurrency(totalAmount) }}
                    </td>
                    <td colspan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

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
            {{ isSubmitting ? 'Creating...' : 'Create Purchase Order' }}
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
import { INITIAL_PO_LIST } from '@/data/mockData/purchaseOrders'

const router = useRouter()
const { toast } = useToast()
const poList = useLocalStorage('poList', INITIAL_PO_LIST)

type POLineItemForm = {
  quotationNo: string
  rfqNo: string
  desc: string
  pno: string
  aes: string
  quantity: number
  lineNo: number
  unitPrice: number
  tat: number
  expectedDeliveryDate: string
  offerDate?: string
  validityDate?: string
}

const defaultLineItem = (): POLineItemForm => ({
  quotationNo: '',
  rfqNo: '',
  desc: '',
  pno: '',
  aes: 'A',
  quantity: 1,
  lineNo: 1,
  unitPrice: 0,
  tat: 0,
  expectedDeliveryDate: ''
})

const formData = ref({
  poReference: '',
  poDate: '',
  lineItems: [] as POLineItemForm[]
})

const newLineRow = ref<POLineItemForm>(defaultLineItem())
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const lineTotal = (line: POLineItemForm) => {
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
    currency: 'CHF',
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
    const isIso = parts[0].length === 4
    const [year, month, day] = isIso ? [a, b, c] : [c < 100 ? 2000 + c : c, b, a]
    return new Date(year, month - 1, day)
  }
  return null
}

function formatDateToDisplay(isoOrAny: string): string {
  const d = parseDateString(isoOrAny)
  if (!d) return isoOrAny
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function computeDaysDelta(eddStr: string | null): number | null {
  if (!eddStr?.trim()) return null
  const edd = parseDateString(eddStr)
  if (!edd) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  edd.setHours(0, 0, 0, 0)
  const diff = edd.getTime() - today.getTime()
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

const addLineFromNewRow = () => {
  const row = newLineRow.value
  if (
    !row.quotationNo?.trim() ||
    !row.rfqNo?.trim() ||
    !row.desc?.trim() ||
    !row.pno?.trim() ||
    !row.quantity ||
    row.quantity < 1 ||
    row.unitPrice == null ||
    row.unitPrice < 0
  ) {
    errors.value.lineItems = 'Fill Quotation No, RFQ No, Description, P/NO, Quantity and Unit Price before adding'
    return
  }
  delete errors.value.lineItems
  formData.value.lineItems.push({
    quotationNo: row.quotationNo.trim(),
    rfqNo: row.rfqNo.trim(),
    desc: row.desc.trim(),
    pno: row.pno.trim(),
    aes: row.aes || 'A',
    quantity: Number(row.quantity) || 0,
    lineNo: Number(row.lineNo) || formData.value.lineItems.length + 1,
    unitPrice: Number(row.unitPrice) || 0,
    tat: Number(row.tat) || 0,
    expectedDeliveryDate: row.expectedDeliveryDate || '',
    offerDate: row.offerDate,
    validityDate: row.validityDate
  })
  newLineRow.value = defaultLineItem()
  newLineRow.value.lineNo = formData.value.lineItems.length + 1
}

const removeLineItem = (index: number) => {
  formData.value.lineItems.splice(index, 1)
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.poReference.trim()) {
    errors.value.poReference = 'PO Reference is required'
  }
  if (!formData.value.poDate.trim()) {
    errors.value.poDate = 'PO Date is required'
  }

  const lines = formData.value.lineItems
  if (!lines.length) {
    errors.value.lineItems = 'At least one line item is required'
  } else {
    const hasInvalid = lines.some(
      (l) =>
        !l.quotationNo?.trim() ||
        !l.rfqNo?.trim() ||
        !l.desc?.trim() ||
        !l.pno?.trim() ||
        !l.quantity ||
        l.quantity < 1 ||
        l.unitPrice == null ||
        l.unitPrice < 0
    )
    if (hasInvalid) {
      errors.value.lineItems = 'Each line must have Quotation No, RFQ No, Description, P/NO, Quantity and Unit Price'
    }
  }

  return Object.keys(errors.value).length === 0
}

function generatePoLineId(quotationNo: string, rfqNo: string, lineIndex: number): string {
  const normalizedRfq = rfqNo.replace(/\//g, '-').replace(/\s/g, '')
  return `po-${quotationNo}-${normalizedRfq}-${lineIndex}`
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 600))

    const now = new Date()
    const poReference = formData.value.poReference.trim()
    const poDateDisplay = formatDateToDisplay(formData.value.poDate)
    const timestampStr = now.toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const lastEditedBy = { name: 'Admin User', initials: 'AD', timestamp: timestampStr }

    const existingCount = poList.value.length
    const newLines = formData.value.lineItems.map((line, i) => {
      const totalPrice = lineTotal(line)
      const no = existingCount + i + 1
      const quotationNo = line.quotationNo.trim()
      const rfqNo = line.rfqNo.trim()
      const id = generatePoLineId(quotationNo, rfqNo, i + 1)

      const eddDisplay = line.expectedDeliveryDate ? formatDateToDisplay(line.expectedDeliveryDate) : null
      const daysDelta = computeDaysDelta(line.expectedDeliveryDate)
      const deliveryStatus = daysDelta != null ? (daysDelta >= 0 ? 'ON TIME' : 'REVISE EDD') : 'ON TIME'

      return {
        no,
        id,
        desc: line.desc.trim(),
        rfqNo,
        pno: line.pno.trim(),
        aes: line.aes || 'A',
        quantity: Number(line.quantity) || 0,
        quotationNo,
        offerDate: line.offerDate ? formatDateToDisplay(line.offerDate) : poDateDisplay,
        validityDate: line.validityDate ? formatDateToDisplay(line.validityDate) : poDateDisplay,
        tat: Number(line.tat) || 0,
        daysRemaining: 0,
        validityStatus: 'Active',
        poReference,
        poDate: poDateDisplay,
        lineNo: Number(line.lineNo) || i + 1,
        totalPrice,
        expectedDeliveryDate: eddDisplay,
        revisedDate: null,
        daysDelta,
        deliveryStatus,
        poNumber: null,
        actualDeliveryDate: null,
        lastEditedBy
      }
    })

    poList.value = [...poList.value, ...newLines]

    toast({
      title: 'Success',
      description: `Purchase Order ${poReference} created with ${newLines.length} line(s).`
    })
    router.push(`/purchase-orders/${encodeURIComponent(poReference)}`)
  } catch (e) {
    console.error(e)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to create purchase order. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const hasNewRowContent = () => {
  const r = newLineRow.value
  return !!(r.quotationNo || r.rfqNo || r.desc || r.pno || r.quantity > 0 || r.unitPrice > 0)
}

const handleCancel = () => {
  if (
    formData.value.poReference ||
    formData.value.poDate ||
    formData.value.lineItems.length > 0 ||
    hasNewRowContent()
  ) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/purchase-orders')
    }
  } else {
    router.push('/purchase-orders')
  }
}
</script>
