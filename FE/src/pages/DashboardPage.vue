<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Sales Operations Dashboard</h2>
      <p class="text-muted-foreground">
        Manage RFQs and order processing for spare parts sales
      </p>
    </div>
    
    <!-- Key Metrics -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Active RFQs</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ activeRFQs }}</div>
          <p class="text-xs text-gray-500">
            {{ newRFQsThisWeek }} new this week
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ pendingOrders }}</div>
          <p class="text-xs text-gray-500">
            {{ ordersInProgress }} in progress
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Awaiting Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ awaitingDelivery }}</div>
          <p class="text-xs text-gray-500">
            {{ readyForPickup }} ready for pickup
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">${{ monthlyRevenue.toLocaleString() }}</div>
          <p class="text-xs text-gray-500">
            +{{ revenueGrowth }}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid gap-4 md:grid-cols-2">
      <!-- RFQ Management Section -->
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Recent RFQs</CardTitle>
          <CardDescription class="text-gray-500">Latest quotation requests from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="rfq in recentRFQs" :key="rfq.id" class="flex items-center space-x-4">
              <div :class="getStatusColor(rfq.status)" class="w-2 h-2 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-gray-700">{{ rfq.customer }} - {{ rfq.items }}</p>
                <p class="text-xs text-gray-500">{{ rfq.status }} • {{ rfq.date }}</p>
              </div>
              <span :class="getStatusBadgeClass(rfq.status)" class="px-2 py-1 text-xs rounded-full">
                {{ rfq.status }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <!-- Order Processing Section -->
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Active Orders</CardTitle>
          <CardDescription class="text-gray-500">Purchase orders in processing pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="order in activeOrders" :key="order.id" class="flex items-center space-x-4">
              <div :class="getStatusColor(order.status)" class="w-2 h-2 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-gray-700">PO #{{ order.poNumber }} - {{ order.customer }}</p>
                <p class="text-xs text-gray-500">{{ order.status }} • {{ order.date }}</p>
              </div>
              <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                {{ order.status }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- Activity Timeline and Quick Actions -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Recent Activity</CardTitle>
          <CardDescription class="text-gray-500">Latest sales operations activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-gray-700">{{ activity.description }}</p>
                <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Quick Actions</CardTitle>
          <CardDescription class="text-gray-500">Common sales operations tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2">
            <Button class="justify-start bg-gray-200 text-gray-700 border-gray-300" @click="$router.push('/rfq')">
              Create New RFQ
            </Button>
            <Button variant="outline" class="justify-start border-gray-300 text-gray-700" @click="$router.push('/orders')">
              Process Purchase Order
            </Button>
            <Button variant="outline" class="justify-start border-gray-300 text-gray-700">
              View Pending Deliveries
            </Button>
            <Button variant="outline" class="justify-start border-gray-300 text-gray-700">
              Generate Invoice
            </Button>
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

// Mock data for metrics
const activeRFQs = ref(12)
const newRFQsThisWeek = ref(3)
const pendingOrders = ref(8)
const ordersInProgress = ref(5)
const awaitingDelivery = ref(6)
const readyForPickup = ref(2)
const monthlyRevenue = ref(125430)
const revenueGrowth = ref(12.5)

// Mock data for recent RFQs
const recentRFQs = ref([
  {
    id: 1,
    customer: 'Garuda Indonesia',
    items: 'Engine Parts (3 items)',
    status: 'Under Review',
    date: '2 hours ago'
  },
  {
    id: 2,
    customer: 'Lion Air',
    items: 'Landing Gear Components',
    status: 'Sent to OEM',
    date: '4 hours ago'
  },
  {
    id: 3,
    customer: 'Batik Air',
    items: 'Avionics Equipment',
    status: 'Quoted',
    date: '1 day ago'
  }
])

// Mock data for active orders
const activeOrders = ref([
  {
    id: 1,
    poNumber: 'PO-2024-001',
    customer: 'Garuda Indonesia',
    status: 'Order Confirmed',
    date: '3 hours ago'
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    customer: 'Lion Air',
    status: 'In Delivery',
    date: '1 day ago'
  },
  {
    id: 3,
    poNumber: 'PO-2024-003',
    customer: 'Batik Air',
    status: 'Ready for Pickup',
    date: '2 days ago'
  }
])

// Mock data for recent activities
const recentActivities = ref([
  {
    id: 1,
    description: 'RFQ received from Garuda Indonesia for engine parts',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    description: 'Order confirmation sent to Lion Air for PO-2024-002',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    description: 'Delivery notification received from OEM for Batik Air order',
    timestamp: '6 hours ago'
  },
  {
    id: 4,
    description: 'Invoice generated for Citilink PO-2024-004',
    timestamp: '1 day ago'
  }
])

// Helper methods for status styling
const getStatusColor = (status: string) => {
  const colors = {
    'Under Review': 'bg-yellow-400',
    'Sent to OEM': 'bg-blue-400',
    'Quoted': 'bg-green-400',
    'Order Confirmed': 'bg-blue-400',
    'In Delivery': 'bg-yellow-400',
    'Ready for Pickup': 'bg-green-400',
    'Invoiced': 'bg-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Sent to OEM': 'bg-blue-100 text-blue-800',
    'Quoted': 'bg-green-100 text-green-800',
    'Order Confirmed': 'bg-blue-100 text-blue-800',
    'In Delivery': 'bg-yellow-100 text-yellow-800',
    'Ready for Pickup': 'bg-green-100 text-green-800',
    'Invoiced': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
