<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Deliveries</h2>
      <p class="text-muted-foreground">
        Monitor delivery status and tracking from OEM to customers
      </p>
    </div>
    
    <!-- Delivery Statistics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Total Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ totalDeliveries }}</div>
          <p class="text-xs text-gray-500">
            All time
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">In Transit</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ inTransit }}</div>
          <p class="text-xs text-gray-500">
            Currently shipping
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Ready for Pickup</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ readyForPickup }}</div>
          <p class="text-xs text-gray-500">
            Awaiting customer
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ delivered }}</div>
          <p class="text-xs text-gray-500">
            This month
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- Delivery Tracking -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-gray-700">Delivery Tracking</CardTitle>
            <CardDescription class="text-gray-500">Monitor all deliveries and their current status</CardDescription>
          </div>
          <Button class="bg-gray-200 text-gray-700 border-gray-300">
            Add Tracking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="delivery in deliveryList" :key="delivery.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-4">
              <div :class="getStatusColor(delivery.status)" class="w-3 h-3 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-gray-700">PO #{{ delivery.poNumber }} - {{ delivery.customer }}</p>
                <p class="text-xs text-gray-500">{{ delivery.carrier }} • Tracking: {{ delivery.trackingNumber }}</p>
                <p class="text-xs text-gray-500">ETA: {{ delivery.eta }} • {{ delivery.date }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getStatusBadgeClass(delivery.status)" class="px-2 py-1 text-xs rounded-full">
                {{ delivery.status }}
              </span>
              <Button variant="outline" size="sm" class="border-gray-300 text-gray-700">
                Track
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Delivery Status Overview -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">In Transit Deliveries</CardTitle>
          <CardDescription class="text-gray-500">Orders currently being shipped</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="transit in inTransitDeliveries" :key="transit.id" class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div>
                <p class="text-sm font-medium text-gray-700">PO #{{ transit.poNumber }}</p>
                <p class="text-xs text-gray-500">{{ transit.customer }} • {{ transit.carrier }}</p>
                <p class="text-xs text-gray-500">ETA: {{ transit.eta }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-yellow-600 font-medium">{{ transit.status }}</span>
                <p class="text-xs text-gray-500">{{ transit.progress }}% complete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Ready for Pickup</CardTitle>
          <CardDescription class="text-gray-500">Orders ready for customer collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="pickup in readyPickupDeliveries" :key="pickup.id" class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
              <div>
                <p class="text-sm font-medium text-gray-700">PO #{{ pickup.poNumber }}</p>
                <p class="text-xs text-gray-500">{{ pickup.customer }} • Ready since {{ pickup.readyDate }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-green-600 font-medium">{{ pickup.status }}</span>
                <Button variant="outline" size="sm" class="mt-1 text-xs">Notify Customer</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- Delivery Performance -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <CardTitle class="text-gray-700">Delivery Performance</CardTitle>
        <CardDescription class="text-gray-500">Key metrics for delivery operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ onTimeDelivery }}%</div>
            <p class="text-sm text-gray-600">On-Time Delivery</p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ avgDeliveryTime }} days</div>
            <p class="text-sm text-gray-600">Average Delivery Time</p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ customerSatisfaction }}%</div>
            <p class="text-sm text-gray-600">Customer Satisfaction</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for delivery statistics
const totalDeliveries = ref(156)
const inTransit = ref(12)
const readyForPickup = ref(5)
const delivered = ref(23)

// Mock data for delivery list
const deliveryList = ref([
  {
    id: 1,
    poNumber: 'PO-2024-001',
    customer: 'Garuda Indonesia',
    carrier: 'DHL Express',
    trackingNumber: 'DHL123456789',
    status: 'In Transit',
    eta: '3 days',
    date: '2 days ago'
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    customer: 'Lion Air',
    carrier: 'FedEx',
    trackingNumber: 'FX987654321',
    status: 'Ready for Pickup',
    eta: 'N/A',
    date: '1 day ago'
  },
  {
    id: 3,
    poNumber: 'PO-2024-003',
    customer: 'Batik Air',
    carrier: 'UPS',
    trackingNumber: 'UPS456789123',
    status: 'Delivered',
    eta: 'N/A',
    date: '3 days ago'
  },
  {
    id: 4,
    poNumber: 'PO-2024-004',
    customer: 'Citilink',
    carrier: 'TNT',
    trackingNumber: 'TNT789123456',
    status: 'In Transit',
    eta: '2 days',
    date: '1 day ago'
  }
])

// Mock data for in-transit deliveries
const inTransitDeliveries = ref([
  {
    id: 1,
    poNumber: 'PO-2024-001',
    customer: 'Garuda Indonesia',
    carrier: 'DHL Express',
    eta: '3 days',
    status: 'In Transit',
    progress: 65
  },
  {
    id: 2,
    poNumber: 'PO-2024-004',
    customer: 'Citilink',
    carrier: 'TNT',
    eta: '2 days',
    status: 'In Transit',
    progress: 40
  }
])

// Mock data for ready pickup deliveries
const readyPickupDeliveries = ref([
  {
    id: 1,
    poNumber: 'PO-2024-002',
    customer: 'Lion Air',
    readyDate: '2 days ago',
    status: 'Ready for Pickup'
  }
])

// Performance metrics
const onTimeDelivery = ref(94)
const avgDeliveryTime = ref(5.2)
const customerSatisfaction = ref(96)

// Helper methods for status styling
const getStatusColor = (status: string) => {
  const colors = {
    'In Transit': 'bg-yellow-400',
    'Ready for Pickup': 'bg-green-400',
    'Delivered': 'bg-blue-400',
    'Delayed': 'bg-red-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'In Transit': 'bg-yellow-100 text-yellow-800',
    'Ready for Pickup': 'bg-green-100 text-green-800',
    'Delivered': 'bg-blue-100 text-blue-800',
    'Delayed': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
