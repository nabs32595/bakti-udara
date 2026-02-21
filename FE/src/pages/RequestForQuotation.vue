<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold tracking-tight">Request For Quotation (RFQ)</h2>
      <p class="text-muted-foreground text-sm">
        Manage incoming quotation requests from customers
      </p>
    </div>
    <!-- RFQ List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between mb-4">
          <div>
            <CardTitle class="text-gray-700 text-base">RFQ List</CardTitle>
            <CardDescription class="text-gray-500 text-sm">Manage all quotation requests</CardDescription>
          </div>
          <div class="flex items-center space-x-2">
            <Button 
              class="bg-gray-200 text-gray-700 border-gray-300"
              @click="router.push('/request-for-quotation/create')"
            >
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
              placeholder="Search RFQs by description, RFQ number, or part number..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Sent to OEM">Sent to OEM</option>
            <option value="Quoted">Quoted</option>  
          </select>
          <select v-model="aesFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All AES</option>
            <option value="A">A</option>
            <option value="E">E</option>
          </select>
        </div>
        
        <!-- Bulk Actions -->
        <div v-if="selectedRFQs.length > 0" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
          <span class="text-xs text-gray-800">{{ selectedRFQs.length }} RFQ(s) selected</span>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="bulkSendToOEM">
              Send to OEM
            </Button>
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="bulkMarkQuoted">
              Mark as Quoted
            </Button>
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="bulkDelete">
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
                <th class="px-3 py-2 text-left">
                  <input 
                    type="checkbox" 
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    class="w-3 h-3 rounded border-gray-300"
                  />
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('no')">
                  NO
                  <span v-if="sortColumn === 'no'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('rfqNo')">
                  RFQ NO
                  <span v-if="sortColumn === 'rfqNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('desc')">
                  DESC
                  <span v-if="sortColumn === 'desc'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('quantity')">
                  QUANTITY (EA)
                  <span v-if="sortColumn === 'quantity'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('pno')">
                  P/NO
                  <span v-if="sortColumn === 'pno'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('aes')">
                  AES
                  <span v-if="sortColumn === 'aes'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                  Status
                  <span v-if="sortColumn === 'status'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('date')">
                  Date
                  <span v-if="sortColumn === 'date'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST EDITED BY
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rfq in filteredAndSortedRFQs" :key="`${rfq.rfqNo}-${rfq.pno}`" class="hover:bg-gray-50">
                <td class="px-3 py-2">
                  <input 
                    type="checkbox" 
                    :checked="selectedRFQs.includes(rfq.rfqNo)"
                    @change="toggleSelect(rfq.rfqNo)"
                    class="w-3 h-3 rounded border-gray-300"
                  />
                </td>
                <td class="px-3 py-2 text-xs font-medium text-gray-900">
                  {{ rfq.no }}
                </td>
                <td class="px-3 py-2 text-xs font-medium text-gray-900">
                  <button 
                    @click="viewRFQDetails(rfq.rfqNo)"
                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {{ rfq.rfqNo }}
                  </button>
                </td>
                <td class="px-3 py-2 text-xs text-gray-700">
                  {{ rfq.desc }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ rfq.quantity }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ rfq.pno }}
                </td>
                <td class="px-3 py-2 text-gray-600">
                  <span :class="getAesBadgeClass(rfq.aes)" class="px-2 py-0.5 text-[11px] rounded-full font-medium">
                    {{ rfq.aes }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <span :class="getStatusBadgeClass(rfq.status)" class="px-2 py-0.5 text-[11px] rounded-full font-medium">
                    {{ rfq.status }}
                  </span>
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ rfq.date }}
                </td>
                <td class="px-3 py-2">
                  <div class="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback class="bg-gray-200 text-gray-800 text-[11px] font-medium size-6">
                        {{ rfq.lastEditedBy.initials }}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div class="text-xs text-gray-600">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItemsCount) }} of {{ filteredItemsCount }} RFQs
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700 text-xs" :disabled="currentPage === 1" @click="prevPage">
              Previous
            </Button>
            <span class="text-xs text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700 text-xs" :disabled="currentPage === totalPages" @click="nextPage">
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
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'

// Router
const router = useRouter()

// Toast
const { toast } = useToast()

// Mock data for RFQ statistics
// const totalRFQs = ref(13)
// const pendingReview = ref(5)
// const sentToOEM = ref(4)
// const quoted = ref(4)

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')
const aesFilter = ref('')
const referenceFilter = ref('')

// Sorting state
const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Multi-select state
const selectedRFQs = ref<string[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filteredItemsCount = ref(0)

// CHANGE THIS: Use the same localStorage key as the list page
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)

// Computed: Filtered and sorted RFQs
const filteredAndSortedRFQs = computed(() => {
  let result = [...rfqList.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(rfq => 
      rfq.desc.toLowerCase().includes(query) ||
      rfq.rfqNo.toLowerCase().includes(query) ||
      rfq.pno.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(rfq => rfq.status === statusFilter.value)
  }
  
  // Apply AES filter
  if (aesFilter.value) {
    result = result.filter(rfq => rfq.aes === aesFilter.value)
  }
  
  // Apply reference filter
  if (referenceFilter.value) {
    result = result.filter(rfq => rfq.referenceNo === referenceFilter.value)
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
         filteredAndSortedRFQs.value.every(rfq => selectedRFQs.value.includes(rfq.rfqNo))
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
    selectedRFQs.value = filteredAndSortedRFQs.value.map(rfq => rfq.rfqNo)
  }
}

const clearSelection = () => {
  selectedRFQs.value = []
}

// Methods: Bulk actions
const bulkSendToOEM = () => {
  toast({
    title: 'Sending to OEM',
    description: `Sending ${selectedRFQs.value.length} RFQ(s) to OEM`
  })
  // Here you would make API call to update status
  clearSelection()
}

const bulkMarkQuoted = () => {
  toast({
    title: 'Marked as Quoted',
    description: `Marking ${selectedRFQs.value.length} RFQ(s) as quoted`
  })
  // Here you would make API call to update status
  clearSelection()
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedRFQs.value.length} RFQ(s)?`)) {
    // Here you would make API call to delete
    clearSelection()
  }
}

// const exportSelected = () => {
//   const toExport = selectedRFQs.value.length > 0
//     ? filteredAndSortedRFQs.value.filter(rfq => selectedRFQs.value.includes(rfq.rfqNo))
//     : filteredAndSortedRFQs.value
//
//   console.log('Exporting:', toExport)
//   alert(`Exporting ${toExport.length} RFQ(s)`)
//   // Here you would implement CSV/Excel export
// }

// Methods: Individual actions
const viewRFQDetails = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}`)
}

// const viewDetails = (rfqNo: string) => {
//   console.log('View details:', rfqNo)
//   alert(`Viewing details for ${rfqNo}`)
//   // Here you would navigate to details page or open modal
// }
//
// const editRFQ = (rfqNo: string) => {
//   console.log('Edit RFQ:', rfqNo)
//   alert(`Editing ${rfqNo}`)
//   // Here you would navigate to edit page or open modal
// }

// const deleteRFQ = (rfqNo: string) => {
//   if (confirm(`Are you sure you want to delete ${rfqNo}?`)) {
//     console.log('Delete RFQ:', rfqNo)
//     // Here you would make API call to delete
//   }
// }

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

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'Under Review': 'bg-amber-100 text-amber-800',
    'Sent to OEM': 'bg-blue-100 text-blue-800',
    'Quoted': 'bg-emerald-100 text-emerald-800'
  }
  return classes[status as keyof typeof classes] || 'bg-slate-100 text-slate-700'
}

const getAesBadgeClass = (aes: string) => {
  const classes = {
    'A': 'bg-blue-100 text-blue-800',
    'E': 'bg-violet-100 text-violet-800'
  }
  return classes[aes as keyof typeof classes] || 'bg-slate-100 text-slate-700'
}
</script>
