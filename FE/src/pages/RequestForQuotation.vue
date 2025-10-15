<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Request For Quotation (RFQ)</h2>
      <p class="text-muted-foreground">
        Manage incoming quotation requests from customers
      </p>
    </div>
    
    <!-- RFQ Statistics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Total RFQs</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ totalRFQs }}</div>
          <p class="text-xs text-gray-500">
            All time
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ pendingReview }}</div>
          <p class="text-xs text-gray-500">
            Awaiting processing
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Sent to OEM</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ sentToOEM }}</div>
          <p class="text-xs text-gray-500">
            Awaiting quotation
          </p>
        </CardContent>
      </Card>
      
      <Card class="border-2 border-gray-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-700">Quoted</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ quoted }}</div>
          <p class="text-xs text-gray-500">
            Ready for customer
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- RFQ List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between mb-4">
          <div>
            <CardTitle class="text-gray-700">RFQ List</CardTitle>
            <CardDescription class="text-gray-500">Manage all quotation requests</CardDescription>
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" class="border-gray-300 text-gray-700" @click="exportSelected">
              Export Selected
            </Button>
            <Button class="bg-gray-200 text-gray-700 border-gray-300">
              Create New RFQ
            </Button>
          </div>
        </div>
        
        <!-- Search and Filters -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search RFQs by customer, ID, or items..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Sent to OEM">Sent to OEM</option>
            <option value="Quoted">Quoted</option>
          </select>
          <select v-model="customerFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Customers</option>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
            <option value="Lion Air">Lion Air</option>
            <option value="Batik Air">Batik Air</option>
            <option value="Citilink">Citilink</option>
            <option value="Wings Air">Wings Air</option>
          </select>
        </div>
        
        <!-- Bulk Actions -->
        <div v-if="selectedRFQs.length > 0" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
          <span class="text-sm text-blue-800">{{ selectedRFQs.length }} RFQ(s) selected</span>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-blue-300 text-blue-700" @click="bulkSendToOEM">
              Send to OEM
            </Button>
            <Button variant="outline" size="sm" class="border-blue-300 text-blue-700" @click="bulkMarkQuoted">
              Mark as Quoted
            </Button>
            <Button variant="outline" size="sm" class="border-red-300 text-red-700" @click="bulkDelete">
              Delete
            </Button>
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="clearSelection">
              Clear Selection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('id')">
                  RFQ ID
                  <span v-if="sortColumn === 'id'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('customer')">
                  Customer
                  <span v-if="sortColumn === 'customer'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                  Status
                  <span v-if="sortColumn === 'status'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('date')">
                  Date
                  <span v-if="sortColumn === 'date'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rfq in filteredAndSortedRFQs" :key="rfq.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <input 
                    type="checkbox" 
                    :checked="selectedRFQs.includes(rfq.id)"
                    @change="toggleSelect(rfq.id)"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  {{ rfq.id }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ rfq.customer }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ rfq.items }}
                </td>
                <td class="px-4 py-3">
                  <span :class="getStatusBadgeClass(rfq.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ rfq.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ rfq.date }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="viewDetails(rfq.id)">
                      View
                    </Button>
                    <Button variant="outline" size="sm" class="border-blue-300 text-blue-700" @click="editRFQ(rfq.id)">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" class="border-red-300 text-red-700" @click="deleteRFQ(rfq.id)">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItemsCount) }} of {{ filteredItemsCount }} RFQs
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" :disabled="currentPage === 1" @click="prevPage">
              Previous
            </Button>
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" :disabled="currentPage === totalPages" @click="nextPage">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for RFQ statistics
const totalRFQs = ref(45)
const pendingReview = ref(8)
const sentToOEM = ref(12)
const quoted = ref(25)

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')
const customerFilter = ref('')

// Sorting state
const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Multi-select state
const selectedRFQs = ref<string[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filteredItemsCount = ref(0)

// Mock data for RFQ list
const rfqList = ref([
  {
    id: 'RFQ-2024-001',
    customer: 'Garuda Indonesia',
    items: 'Engine Parts (3 items)',
    status: 'Under Review',
    date: '2 hours ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-002',
    customer: 'Lion Air',
    items: 'Landing Gear Components',
    status: 'Sent to OEM',
    date: '4 hours ago',
    timestamp: Date.now() - 4 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-003',
    customer: 'Batik Air',
    items: 'Avionics Equipment',
    status: 'Quoted',
    date: '1 day ago',
    timestamp: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-004',
    customer: 'Citilink',
    items: 'Hydraulic Systems',
    status: 'Under Review',
    date: '2 days ago',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-005',
    customer: 'Wings Air',
    items: 'Electrical Components',
    status: 'Sent to OEM',
    date: '3 days ago',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-006',
    customer: 'Garuda Indonesia',
    items: 'Brake Systems',
    status: 'Quoted',
    date: '4 days ago',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-007',
    customer: 'Lion Air',
    items: 'Navigation Equipment',
    status: 'Under Review',
    date: '5 days ago',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-008',
    customer: 'Sriwijaya Air',
    items: 'Cabin Pressurization System',
    status: 'Quoted',
    date: '1 week ago',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-009',
    customer: 'AirAsia Indonesia',
    items: 'Oxygen Supply Equipment',
    status: 'Sent to OEM',
    date: '1 week ago',
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-010',
    customer: 'TransNusa',
    items: 'Fuel System Components',
    status: 'Under Review',
    date: '2 weeks ago',
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-011',
    customer: 'Pelita Air Service',
    items: 'Aircraft Battery Systems',
    status: 'Quoted',
    date: '2 weeks ago',
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-012',
    customer: 'Garuda Indonesia',
    items: 'Weather Radar Equipment',
    status: 'Sent to OEM',
    date: '2 weeks ago',
    timestamp: Date.now() - 16 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-013',
    customer: 'Lion Air',
    items: 'Emergency Evacuation Slides',
    status: 'Under Review',
    date: '3 weeks ago',
    timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-014',
    customer: 'NAM Air',
    items: 'Fire Detection Systems',
    status: 'Quoted',
    date: '3 weeks ago',
    timestamp: Date.now() - 22 * 24 * 60 * 60 * 1000
  },
  {
    id: 'RFQ-2024-015',
    customer: 'Indonesia AirAsia X',
    items: 'APU Components',
    status: 'Sent to OEM',
    date: '1 month ago',
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000
  }
])

// Computed: Filtered and sorted RFQs
const filteredAndSortedRFQs = computed(() => {
  let result = [...rfqList.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(rfq => 
      rfq.id.toLowerCase().includes(query) ||
      rfq.customer.toLowerCase().includes(query) ||
      rfq.items.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(rfq => rfq.status === statusFilter.value)
  }
  
  // Apply customer filter
  if (customerFilter.value) {
    result = result.filter(rfq => rfq.customer === customerFilter.value)
  }
  
  // Apply sorting
  if (sortColumn.value) {
    result.sort((a, b) => {
      let aVal: any = a[sortColumn.value as keyof typeof a]
      let bVal: any = b[sortColumn.value as keyof typeof b]
      
      if (sortColumn.value === 'date') {
        aVal = a.timestamp
        bVal = b.timestamp
      }
      
      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  // Store total filtered items count for pagination info
  filteredItemsCount.value = result.length

  // Apply pagination - limit to itemsPerPage items for the current page
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  result = result.slice(startIndex, endIndex)

  return result
})

// Computed: All selected
const allSelected = computed(() => {
  return filteredAndSortedRFQs.value.length > 0 && 
         filteredAndSortedRFQs.value.every(rfq => selectedRFQs.value.includes(rfq.id))
})

// Computed: Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredItemsCount.value / itemsPerPage.value)
})

// Methods: Sorting
const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Methods: Multi-select
const toggleSelect = (id: string) => {
  const index = selectedRFQs.value.indexOf(id)
  if (index > -1) {
    selectedRFQs.value.splice(index, 1)
  } else {
    selectedRFQs.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRFQs.value = []
  } else {
    selectedRFQs.value = filteredAndSortedRFQs.value.map(rfq => rfq.id)
  }
}

const clearSelection = () => {
  selectedRFQs.value = []
}

// Methods: Bulk actions
const bulkSendToOEM = () => {
  console.log('Sending to OEM:', selectedRFQs.value)
  alert(`Sending ${selectedRFQs.value.length} RFQ(s) to OEM`)
  // Here you would make API call to update status
  clearSelection()
}

const bulkMarkQuoted = () => {
  console.log('Marking as quoted:', selectedRFQs.value)
  alert(`Marking ${selectedRFQs.value.length} RFQ(s) as quoted`)
  // Here you would make API call to update status
  clearSelection()
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedRFQs.value.length} RFQ(s)?`)) {
    console.log('Deleting:', selectedRFQs.value)
    // Here you would make API call to delete
    clearSelection()
  }
}

const exportSelected = () => {
  const toExport = selectedRFQs.value.length > 0 
    ? filteredAndSortedRFQs.value.filter(rfq => selectedRFQs.value.includes(rfq.id))
    : filteredAndSortedRFQs.value
  
  console.log('Exporting:', toExport)
  alert(`Exporting ${toExport.length} RFQ(s)`)
  // Here you would implement CSV/Excel export
}

// Methods: Individual actions
const viewDetails = (id: string) => {
  console.log('View details:', id)
  alert(`Viewing details for ${id}`)
  // Here you would navigate to details page or open modal
}

const editRFQ = (id: string) => {
  console.log('Edit RFQ:', id)
  alert(`Editing ${id}`)
  // Here you would navigate to edit page or open modal
}

const deleteRFQ = (id: string) => {
  if (confirm(`Are you sure you want to delete ${id}?`)) {
    console.log('Delete RFQ:', id)
    // Here you would make API call to delete
  }
}

// Methods: Pagination
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Helper methods for status styling
const getStatusColor = (status: string) => {
  const colors = {
    'Under Review': 'bg-yellow-400',
    'Sent to OEM': 'bg-blue-400',
    'Quoted': 'bg-green-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Sent to OEM': 'bg-blue-100 text-blue-800',
    'Quoted': 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>
