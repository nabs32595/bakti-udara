<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Purchase Order Information</CardTitle>
      <CardDescription>PO reference and related quotation / RFQ</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label class="text-xs font-medium text-gray-500">PO Reference</Label>
          <p class="text-base font-semibold text-gray-900">{{ poReference }}</p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">PO Number</Label>
          <p class="text-base text-gray-900">{{ firstLine?.poNumber || '–' }}</p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">PO Date</Label>
          <p class="text-base text-gray-900">{{ firstLine?.poDate }}</p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">Expected Delivery Date</Label>
          <p class="text-base text-gray-900">{{ firstLine?.expectedDeliveryDate }}</p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">Delivery Status</Label>
          <Badge :class="getDeliveryStatusBadgeClass(firstLine?.deliveryStatus)">
            {{ firstLine?.deliveryStatus }}
          </Badge>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">Days Δ</Label>
          <p class="text-base font-medium" :class="getDaysDeltaClass(firstLine?.daysDelta)">
            {{ firstLine?.daysDelta != null ? firstLine.daysDelta : '–' }}
          </p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">Quotation No</Label>
          <button
            v-if="firstLine?.quotationNo"
            type="button"
            @click="$emit('navigate-quotation', firstLine.quotationNo)"
            class="text-blue-600 hover:text-blue-800 hover:underline text-base font-medium"
          >
            {{ firstLine.quotationNo }}
          </button>
          <p v-else class="text-base text-gray-900">–</p>
        </div>
        <div>
          <Label class="text-xs font-medium text-gray-500">RFQ No</Label>
          <button
            v-if="firstLine?.rfqNo"
            type="button"
            @click="$emit('navigate-rfq', firstLine.rfqNo)"
            class="text-gray-700 hover:text-gray-900 hover:underline text-base"
          >
            {{ firstLine.rfqNo }}
          </button>
          <p v-else class="text-base text-gray-900">–</p>
        </div>
      </div>
      <div class="pt-4 border-t border-gray-200">
        <Label class="text-xs font-medium text-gray-500">Total (CHF)</Label>
        <p class="text-xl font-bold text-gray-900">{{ formatCurrency(totalPrice) }}</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  poReference: string
  firstLine: any
  allLines: any[]
  isEditMode?: boolean
}>()

defineEmits<{
  'navigate-quotation': [quotationNo: string]
  'navigate-rfq': [rfqNo: string]
}>()

const totalPrice = computed(() => {
  return props.allLines.reduce((sum: number, line: any) => sum + (line.totalPrice ?? 0), 0)
})

function getDeliveryStatusBadgeClass (status: string) {
  const classes: Record<string, string> = {
    'ON TIME': 'bg-emerald-100 text-emerald-800',
    'REVISE EDD': 'bg-amber-100 text-amber-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

function getDaysDeltaClass (days: number | null) {
  if (days == null) return ''
  if (days < 0) return 'text-red-600'
  if (days > 0) return 'text-emerald-600'
  return 'text-gray-600'
}

function formatCurrency (amount: number) {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>
