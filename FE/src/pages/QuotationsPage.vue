<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Quotations</h2>
      <p class="text-muted-foreground">
        Manage quotations sent to customers
      </p>
    </div>
    
    <!-- Quotation Statistics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Total Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ totalQuotations }}</div>
          <p class="text-xs text-gray-500">
            All time
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Pending Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ pendingResponse }}</div>
          <p class="text-xs text-gray-500">
            Awaiting customer decision
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Accepted</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ accepted }}</div>
          <p class="text-xs text-gray-500">
            Converted to orders
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">${{ totalValue.toLocaleString() }}</div>
          <p class="text-xs text-gray-500">
            Quoted amount
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- Quotation List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-gray-700">Quotation List</CardTitle>
            <CardDescription class="text-gray-500">Track all quotations sent to customers</CardDescription>
          </div>
          <Button class="bg-gray-200 text-gray-700 border-gray-300">
            Create New Quotation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="quotation in quotationList" :key="quotation.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-4">
              <div :class="getStatusColor(quotation.status)" class="w-3 h-3 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-gray-700">Quote #{{ quotation.id }} - {{ quotation.customer }}</p>
                <p class="text-xs text-gray-500">{{ quotation.items }} • {{ quotation.date }}</p>
                <p class="text-xs text-gray-500">Amount: ${{ quotation.amount.toLocaleString() }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getStatusBadgeClass(quotation.status)" class="px-2 py-1 text-xs rounded-full">
                {{ quotation.status }}
              </span>
              <Button variant="outline" size="sm" class="border-gray-300 text-gray-700">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Quotation Performance -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Recent Quotations</CardTitle>
          <CardDescription class="text-gray-500">Latest quotations sent to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="recent in recentQuotations" :key="recent.id" class="flex items-center space-x-4">
              <div :class="getStatusColor(recent.status)" class="w-2 h-2 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium text-gray-700">{{ recent.customer }} - ${{ recent.amount.toLocaleString() }}</p>
                <p class="text-xs text-gray-500">{{ recent.status }} • {{ recent.date }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader>
          <CardTitle class="text-gray-700">Conversion Rate</CardTitle>
          <CardDescription class="text-gray-500">Quotation to order conversion performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Overall Conversion</span>
              <span class="text-lg font-semibold text-gray-900">{{ conversionRate }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">This Month</span>
              <span class="text-lg font-semibold text-gray-900">{{ monthlyConversion }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Average Response Time</span>
              <span class="text-lg font-semibold text-gray-900">{{ avgResponseTime }} days</span>
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

// Mock data for quotation statistics
const totalQuotations = ref(67)
const pendingResponse = ref(15)
const accepted = ref(28)
const totalValue = ref(1250000)

// Mock data for quotation list
const quotationList = ref([
  {
    id: 'QUO-2024-001',
    customer: 'Garuda Indonesia',
    items: 'Engine Parts (3 items)',
    amount: 45000,
    status: 'Pending Response',
    date: '2 hours ago'
  },
  {
    id: 'QUO-2024-002',
    customer: 'Lion Air',
    items: 'Landing Gear Components',
    amount: 32000,
    status: 'Accepted',
    date: '1 day ago'
  },
  {
    id: 'QUO-2024-003',
    customer: 'Batik Air',
    items: 'Avionics Equipment',
    amount: 28000,
    status: 'Expired',
    date: '3 days ago'
  },
  {
    id: 'QUO-2024-004',
    customer: 'Citilink',
    items: 'Hydraulic Systems',
    amount: 55000,
    status: 'Pending Response',
    date: '4 days ago'
  },
  {
    id: 'QUO-2024-005',
    customer: 'Wings Air',
    items: 'Electrical Components',
    amount: 18000,
    status: 'Accepted',
    date: '5 days ago'
  }
])

// Mock data for recent quotations
const recentQuotations = ref([
  {
    id: 1,
    customer: 'Garuda Indonesia',
    amount: 45000,
    status: 'Pending Response',
    date: '2 hours ago'
  },
  {
    id: 2,
    customer: 'Lion Air',
    amount: 32000,
    status: 'Accepted',
    date: '1 day ago'
  },
  {
    id: 3,
    customer: 'Batik Air',
    amount: 28000,
    status: 'Expired',
    date: '3 days ago'
  }
])

// Performance metrics
const conversionRate = ref(42)
const monthlyConversion = ref(38)
const avgResponseTime = ref(3.2)

// Helper methods for status styling
const getStatusColor = (status: string) => {
  const colors = {
    'Pending Response': 'bg-yellow-400',
    'Accepted': 'bg-green-400',
    'Expired': 'bg-red-400',
    'Rejected': 'bg-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Pending Response': 'bg-yellow-100 text-yellow-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Expired': 'bg-red-100 text-red-800',
    'Rejected': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
