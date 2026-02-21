<template>
  <Card>
    <CardHeader>
      <CardTitle>Line Items</CardTitle>
      <CardDescription>Items under this purchase order</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/NO</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AES</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (CHF)</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EDD</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in lineItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-3 py-2 text-xs text-gray-900">{{ item.desc || '–' }}</td>
              <td class="px-3 py-2 text-xs text-gray-600">{{ item.pno || '–' }}</td>
              <td class="px-3 py-2 text-xs text-gray-600">{{ item.quantity }}</td>
              <td class="px-3 py-2 text-xs text-gray-600">{{ item.aes }}</td>
              <td class="px-3 py-2 text-xs text-gray-600">{{ item.lineNo }}</td>
              <td class="px-3 py-2 text-xs font-medium text-gray-900">{{ formatCurrency(item.totalPrice) }}</td>
              <td class="px-3 py-2 text-xs text-gray-600">{{ item.expectedDeliveryDate }}</td>
              <td class="px-3 py-2 text-xs">
                <span :class="getDeliveryStatusBadgeClass(item.deliveryStatus)" class="px-2 py-0.5 text-[11px] rounded-full font-medium">
                  {{ item.deliveryStatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  lineItems: any[]
}>()

function getDeliveryStatusBadgeClass (status: string) {
  const classes: Record<string, string> = {
    'ON TIME': 'bg-emerald-100 text-emerald-800',
    'REVISE EDD': 'bg-amber-100 text-amber-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

function formatCurrency (amount: number) {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>
