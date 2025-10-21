<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Sales Operations Dashboard</h2>
      <p class="text-muted-foreground">
        Manage RFQs and order processing for spare parts sales
      </p>
    </div>
    
    <!-- Key Metrics -->
    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle class="text-sm font-medium text-gray-700">Total RFQs</CardTitle>
        </CardHeader>
        <CardContent class="pt-1">
          <div class="text-xl font-bold text-gray-900">{{ totalRFQs }}</div>
          <p class="text-xs text-gray-500">
            All quotation requests
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle class="text-sm font-medium text-gray-700">Under Review</CardTitle>
        </CardHeader>
        <CardContent class="pt-1">
          <div class="text-xl font-bold text-gray-900">{{ underReview }}</div>
          <p class="text-xs text-gray-500">
            Awaiting initial review
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle class="text-sm font-medium text-gray-700">Sent to OEM</CardTitle>
        </CardHeader>
        <CardContent class="pt-1">
          <div class="text-xl font-bold text-gray-900">{{ sentToOEM }}</div>
          <p class="text-xs text-gray-500">
            Forwarded to suppliers
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle class="text-sm font-medium text-gray-700">Quoted</CardTitle>
        </CardHeader>
        <CardContent class="pt-1">
          <div class="text-xl font-bold text-gray-900">{{ quoted }}</div>
          <p class="text-xs text-gray-500">
            Pricing received
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- AES Distribution -->
    <div class="grid gap-3 md:grid-cols-2">
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">AES Distribution</CardTitle>
          <CardDescription class="text-gray-500">Breakdown by AES classification</CardDescription>
        </CardHeader>
        <CardContent class="pt-2">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">A</span>
                <span class="text-sm font-medium text-gray-700">AES A</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ aesA }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs rounded-full bg-gray-300 text-gray-800">E</span>
                <span class="text-sm font-medium text-gray-700">AES E</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ aesE }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Status Overview</CardTitle>
          <CardDescription class="text-gray-500">Current RFQ status distribution</CardDescription>
        </CardHeader>
        <CardContent class="pt-2">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Under Review</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ underReview }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Sent to OEM</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ sentToOEM }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-700">Quoted</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ quoted }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- RFQ Focus Section -->
    <div class="grid gap-3 md:grid-cols-1">
      <!-- Recent RFQs - Expanded -->
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-gray-700">Recent RFQs</CardTitle>
              <CardDescription class="text-gray-500">Latest quotation requests from customers</CardDescription>
            </div>
            <Button class="bg-gray-200 text-gray-700 border-gray-300" @click="$router.push('/request-for-quotation')">
              View All RFQs
            </Button>
          </div>
        </CardHeader>
        <CardContent class="pt-2">
          <div class="space-y-2">
            <div v-for="rfq in recentRFQs" :key="rfq.id" class="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div :class="getStatusColor(rfq.status)" class="w-2 h-2 rounded-full"></div>
              <div class="flex-1 space-y-0.5">
                <p class="text-sm font-medium text-gray-800">{{ rfq.desc }}</p>
                <p class="text-xs text-gray-600">{{ rfq.rfqNo }} • P/N: {{ rfq.pno }} • Qty: {{ rfq.quantity }}</p>
                <p class="text-xs text-gray-500">{{ rfq.status }} • {{ rfq.date }}</p>
              </div>
              <div class="flex flex-col space-y-1">
                <span :class="getStatusBadgeClass(rfq.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ rfq.status }}
                </span>
                <span :class="getAesBadgeClass(rfq.aes)" class="px-2 py-1 text-xs rounded-full">
                  {{ rfq.aes }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for metrics based on RFQ page data
const totalRFQs = ref(13)
const underReview = ref(5)
const sentToOEM = ref(4)
const quoted = ref(4)
const aesA = ref(5)
const aesE = ref(8)

// Mock data for recent RFQs based on RFQ page data
const recentRFQs = ref([
  {
    id: 1,
    rfqNo: 'RFQM50-08012025-0001-RO1',
    desc: 'PANEL ASSY, FLOOR, LH',
    pno: '5251409289',
    aes: 'A',
    quantity: 1,
    status: 'Under Review',
    date: '08/01/2025 2:30PM'
  },
  {
    id: 2,
    rfqNo: 'RFQM50-08012025-0002-RO1',
    desc: 'RELAY, SOCKET',
    pno: '9742200100',
    aes: 'E',
    quantity: 3,
    status: 'Sent to OEM',
    date: '08/01/2025 10:15AM'
  },
  {
    id: 3,
    rfqNo: 'RFQM50-08012025-0003-RO1',
    desc: 'ROD ASSY, PUSH/PULL, FRONT',
    pno: '576.10.09.021',
    aes: 'E',
    quantity: 1,
    status: 'Quoted',
    date: '07/01/2025 3:45PM'
  },
  {
    id: 4,
    rfqNo: 'RFQM50-08012025-0004-RO1',
    desc: 'MUDGUARD ASSY',
    pno: '5322009158',
    aes: 'E',
    quantity: 1,
    status: 'Under Review',
    date: '06/01/2025 11:20AM'
  },
  {
    id: 5,
    rfqNo: 'RFQM50-08012025-0005-RO1',
    desc: 'NUT',
    pno: '114.40.07.097',
    aes: 'E',
    quantity: 1,
    status: 'Sent to OEM',
    date: '05/01/2025 4:10PM'
  }
])


// Helper methods for status styling - Greyscale only
const getStatusColor = (status: string) => {
  const colors = {
    'Under Review': 'bg-gray-300',
    'Sent to OEM': 'bg-gray-400',
    'Quoted': 'bg-gray-500',
    'Order Confirmed': 'bg-gray-400',
    'In Delivery': 'bg-gray-300',
    'Ready for Pickup': 'bg-gray-500',
    'Invoiced': 'bg-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-gray-300 text-gray-800',
    'Quoted': 'bg-gray-400 text-gray-900',
    'Order Confirmed': 'bg-gray-300 text-gray-800',
    'In Delivery': 'bg-gray-200 text-gray-800',
    'Ready for Pickup': 'bg-gray-400 text-gray-900',
    'Invoiced': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getAesBadgeClass = (aes: string) => {
  const classes = {
    'A': 'bg-gray-200 text-gray-800',
    'E': 'bg-gray-300 text-gray-800'
  }
  return classes[aes as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
