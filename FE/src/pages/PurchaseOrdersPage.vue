<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Purchase Orders (PO)</h2>
      <p class="text-muted-foreground">
        Manage purchase orders and delivery tracking
      </p>
    </div>
    
    <!-- Order Statistics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ totalOrders }}</div>
          <p class="text-xs text-gray-500">
            All time
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">PO Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ poReceived }}</div>
          <p class="text-xs text-gray-500">
            Awaiting processing
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">In Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ inDelivery }}</div>
          <p class="text-xs text-gray-500">
            From OEM
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
            Customer notification sent
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- Order List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-gray-700">Order List</CardTitle>
            <CardDescription class="text-gray-500">Track all purchase orders and their status</CardDescription>
          </div>
          <Button class="bg-gray-200 text-gray-700 border-gray-300">
            Process New PO
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="order in orderList" :key="order.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-4">
              <div :class="getStatusColor(order.status)" class="w-3 h-3 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-gray-700">PO #{{ order.poNumber }} - {{ order.customer }}</p>
                <p class="text-xs text-gray-500">{{ order.items }} • {{ order.date }}</p>
                <p class="text-xs text-gray-500">Delivery Terms: {{ order.deliveryTerms }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                {{ order.status }}
              </span>
              <Button variant="outline" size="sm" class="border-gray-300 text-gray-700">
                Track Order
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Order Processing Workflow -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <CardTitle class="text-gray-700">Order Processing Workflow</CardTitle>
        <CardDescription class="text-gray-500">Standard procedure for handling purchase orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-6">
          <div class="text-center">
            <div class="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">1</div>
            <h4 class="text-sm font-medium text-gray-700">PO Received</h4>
            <p class="text-xs text-gray-500">Receive notification from customer</p>
          </div>
          <div class="text-center">
            <div class="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">2</div>
            <h4 class="text-sm font-medium text-gray-700">Review PO</h4>
            <p class="text-xs text-gray-500">Check for discrepancies</p>
          </div>
          <div class="text-center">
            <div class="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">3</div>
            <h4 class="text-sm font-medium text-gray-700">Send to OEM</h4>
            <p class="text-xs text-gray-500">Forward PO to OEM</p>
          </div>
          <div class="text-center">
            <div class="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">4</div>
            <h4 class="text-sm font-medium text-gray-700">Order Confirmed</h4>
            <p class="text-xs text-gray-500">Receive confirmation from OEM</p>
          </div>
          <div class="text-center">
            <div class="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">5</div>
            <h4 class="text-sm font-medium text-gray-700">Monitor Delivery</h4>
            <p class="text-xs text-gray-500">Track delivery progress</p>
          </div>
          <div class="text-center">
            <div class="w-8 h-8 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">6</div>
            <h4 class="text-sm font-medium text-gray-700">Invoice</h4>
            <p class="text-xs text-gray-500">Generate invoice</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Delivery Monitoring -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <CardTitle class="text-gray-700">Delivery Monitoring</CardTitle>
        <CardDescription class="text-gray-500">Track orders in transit and ready for pickup</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Orders In Transit</h4>
            <div class="space-y-2">
              <div v-for="delivery in inTransitOrders" :key="delivery.id" class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div>
                  <p class="text-sm font-medium text-gray-700">PO #{{ delivery.poNumber }}</p>
                  <p class="text-xs text-gray-500">{{ delivery.customer }} • ETA: {{ delivery.eta }}</p>
                </div>
                <span class="text-xs text-yellow-600 font-medium">In Transit</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Ready for Pickup</h4>
            <div class="space-y-2">
              <div v-for="pickup in readyPickupOrders" :key="pickup.id" class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <div>
                  <p class="text-sm font-medium text-gray-700">PO #{{ pickup.poNumber }}</p>
                  <p class="text-xs text-gray-500">{{ pickup.customer }} • Ready since {{ pickup.readyDate }}</p>
                </div>
                <span class="text-xs text-green-600 font-medium">Ready</span>
              </div>
            </div>
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

// Mock data for order statistics
const totalOrders = ref(78)
const poReceived = ref(5)
const inDelivery = ref(8)
const readyForPickup = ref(3)

// Mock data for order list
const orderList = ref([
  {
    id: 1,
    poNumber: 'PO-2024-001',
    customer: 'Garuda Indonesia',
    items: 'Engine Parts (3 items)',
    status: 'Order Confirmed',
    date: '3 hours ago',
    deliveryTerms: 'FOB Jakarta, 15 days'
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    customer: 'Lion Air',
    items: 'Landing Gear Components',
    status: 'In Delivery',
    date: '1 day ago',
    deliveryTerms: 'CIF Surabaya, 20 days'
  },
  {
    id: 3,
    poNumber: 'PO-2024-003',
    customer: 'Batik Air',
    items: 'Avionics Equipment',
    status: 'Ready for Pickup',
    date: '2 days ago',
    deliveryTerms: 'FOB Jakarta, 10 days'
  },
  {
    id: 4,
    poNumber: 'PO-2024-004',
    customer: 'Citilink',
    items: 'Hydraulic Systems',
    status: 'Invoiced',
    date: '3 days ago',
    deliveryTerms: 'FOB Jakarta, 12 days'
  },
  {
    id: 5,
    poNumber: 'PO-2024-005',
    customer: 'Wings Air',
    items: 'Electrical Components',
    status: 'In Delivery',
    date: '4 days ago',
    deliveryTerms: 'CIF Medan, 18 days'
  }
])

// Mock data for delivery monitoring
const inTransitOrders = ref([
  {
    id: 1,
    poNumber: 'PO-2024-002',
    customer: 'Lion Air',
    eta: '5 days'
  },
  {
    id: 2,
    poNumber: 'PO-2024-005',
    customer: 'Wings Air',
    eta: '3 days'
  }
])

const readyPickupOrders = ref([
  {
    id: 1,
    poNumber: 'PO-2024-003',
    customer: 'Batik Air',
    readyDate: '2 days ago'
  }
])

// Helper methods for status styling
const getStatusColor = (status: string) => {
  const colors = {
    'PO Received': 'bg-blue-400',
    'Order Confirmed': 'bg-green-400',
    'In Delivery': 'bg-yellow-400',
    'Ready for Pickup': 'bg-green-400',
    'Invoiced': 'bg-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'PO Received': 'bg-blue-100 text-blue-800',
    'Order Confirmed': 'bg-green-100 text-green-800',
    'In Delivery': 'bg-yellow-100 text-yellow-800',
    'Ready for Pickup': 'bg-green-100 text-green-800',
    'Invoiced': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
