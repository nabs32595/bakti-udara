<template>
  <Card>
    <CardHeader>
      <CardTitle>Source RFQ</CardTitle>
      <CardDescription>Request for Quotation that generated this offer</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="flex items-start justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <button 
                @click="navigateToRFQ"
                class="text-lg font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                {{ rfqNo }}
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-1">Request for Quotation</p>
            <div v-if="rfqStatus" class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">Status:</span>
              <Badge :class="getRFQStatusBadgeClass(rfqStatus)">
                {{ rfqStatus }}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button variant="outline" class="w-full" @click="navigateToRFQ">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Full RFQ Details
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  rfqNo: string
  rfqStatus?: string
}>()

const router = useRouter()

const navigateToRFQ = () => {
  if (props.rfqNo) {
    router.push(`/rfq/${props.rfqNo}`)
  }
}

const getRFQStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-blue-200 text-blue-800',
    'Quoted': 'bg-green-200 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>

