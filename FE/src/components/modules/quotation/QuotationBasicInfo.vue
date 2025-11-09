<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <CardTitle>Quotation Information</CardTitle>
      <CardDescription>Core details of the quotation offer</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label class="text-sm font-medium text-gray-500">Quotation Number</Label>
          <p class="text-lg font-semibold text-gray-900">{{ quotationData?.quotationNo }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Reference No</Label>
          <p class="text-lg font-semibold text-gray-900">{{ quotationData?.referenceNo }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Linked RFQ</Label>
          <button 
            @click="navigateToRFQ"
            class="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {{ quotationData?.rfqNo }}
          </button>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Currency</Label>
          <p class="text-lg font-semibold text-gray-900">{{ quotationData?.currency }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Offer Date</Label>
          <p class="text-lg text-gray-900">{{ quotationData?.offerDate }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Validity Date</Label>
          <p class="text-lg text-gray-900">{{ quotationData?.validityDate }}</p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Days Remaining</Label>
          <p class="text-lg font-semibold" :class="getDaysRemainingClass(quotationData?.daysRemaining)">
            {{ quotationData?.daysRemaining }} days
          </p>
        </div>
        <div>
          <Label class="text-sm font-medium text-gray-500">Validity Status</Label>
          <Badge :class="getValidityStatusBadgeClass(quotationData?.validityStatus)">
            {{ quotationData?.validityStatus }}
          </Badge>
        </div>
      </div>
      
      <div class="pt-4 border-t border-gray-200">
        <Label class="text-sm font-medium text-gray-500">Total Amount</Label>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(quotationData?.totalAmount) }}</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  quotationData: any
  isEditMode?: boolean
}>()

const router = useRouter()

const navigateToRFQ = () => {
  if (props.quotationData?.rfqNo) {
    router.push(`/request-for-quotation/${props.quotationData.rfqNo}`)
  }
}

const getDaysRemainingClass = (days: number) => {
  if (days < 0) return 'text-red-600'
  if (days < 30) return 'text-orange-600'
  return 'text-green-600'
}

const getValidityStatusBadgeClass = (status: string) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Expired': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (amount: number) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>

