<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Line Items</CardTitle>
      <CardDescription>Quotation line items with pricing details</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">RFQ No</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P/NO</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">AES</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">QTY</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">U/M</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Price</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">TAT (Days)</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in lineItems" :key="item.no" class="hover:bg-gray-50">
              <td class="px-3 py-3 text-gray-900 font-medium">{{ item.no }}</td>
              <td class="px-3 py-3 text-gray-600 font-mono text-xs">
                <a v-if="item.rfqNo" :href="`#/rfq/${item.rfqNo}`" class="text-blue-600 hover:underline" @click.prevent="navigateToRFQ(item.rfqNo)">{{ item.rfqNo }}</a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-3 py-3 text-gray-700">{{ item.desc }}</td>
              <td class="px-3 py-3 text-gray-600 font-mono text-xs">{{ item.pno }}</td>
              <td class="px-3 py-3">
                <Badge :class="getAesBadgeClass(item.aes)">{{ item.aes }}</Badge>
              </td>
              <td class="px-3 py-3 text-gray-900 text-center">{{ item.quantity }}</td>
              <td class="px-3 py-3 text-gray-600">{{ item.unitOfMeasure }}</td>
              <td class="px-3 py-3 text-gray-900 font-medium text-right">{{ formatPrice(item.unitPrice) }}</td>
              <td class="px-3 py-3 text-gray-900 font-bold text-right">{{ formatPrice(item.totalPrice) }}</td>
              <td class="px-3 py-3 text-gray-600 text-center">{{ item.tat }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td colspan="8" class="px-3 py-3 text-right text-sm font-semibold text-gray-700">
                Grand Total:
              </td>
              <td class="px-3 py-3 text-right text-lg font-bold text-gray-900">
                {{ formatPrice(grandTotal) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  lineItems: Array<{
    no: number
    rfqNo?: string
    desc: string
    pno: string
    aes: string
    quantity: number
    unitOfMeasure: string
    unitPrice: number
    totalPrice: number
    tat: number
  }>
  isEditMode?: boolean
  currency?: string
}>()

const router = useRouter()
const navigateToRFQ = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}`)
}

const grandTotal = computed(() => {
  return props.lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
})

const getAesBadgeClass = (aes: string) => {
  const classes = {
    'A': 'bg-blue-100 text-blue-800',
    'E': 'bg-purple-100 text-purple-800'
  }
  return classes[aes as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price: number) => {
  const currency = props.currency || 'CHF'
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(price)
}
</script>

