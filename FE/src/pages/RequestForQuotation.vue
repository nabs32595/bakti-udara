<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Request For Quotation (RFQ)</h2>
      <p class="text-muted-foreground">
        Manage incoming quotation requests from customers
      </p>
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
          <span class="text-sm text-gray-800">{{ selectedRFQs.length }} RFQ(s) selected</span>
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
                <th class="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('no')">
                  NO
                  <span v-if="sortColumn === 'no'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('rfqNo')">
                  RFQ NO
                  <span v-if="sortColumn === 'rfqNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('desc')">
                  DESC
                  <span v-if="sortColumn === 'desc'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('quantity')">
                  QUANTITY (EA)
                  <span v-if="sortColumn === 'quantity'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('pno')">
                  P/NO
                  <span v-if="sortColumn === 'pno'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('aes')">
                  AES
                  <span v-if="sortColumn === 'aes'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
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
                  LAST EDITED BY
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rfq in filteredAndSortedRFQs" :key="rfq.rfqNo" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <input 
                    type="checkbox" 
                    :checked="selectedRFQs.includes(rfq.rfqNo)"
                    @change="toggleSelect(rfq.rfqNo)"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  {{ rfq.no }}
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  <button 
                    @click="viewRFQDetails(rfq.rfqNo)"
                    class="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    {{ rfq.rfqNo }}
                  </button>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ rfq.desc }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ rfq.quantity }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ rfq.pno }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  <span :class="getAesBadgeClass(rfq.aes)" class="px-2 py-1 text-xs rounded-full">
                    {{ rfq.aes }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="getStatusBadgeClass(rfq.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ rfq.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ rfq.date }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium">
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
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Router
const router = useRouter()

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

// Mock data for RFQ list based on the image data
const rfqList = ref([
  {
    no: 1,
    desc: 'PANEL ASSY, FLOOR, LH',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0001-RO1',
    pno: '5251409289',
    aes: 'A',
    quantity: 1,
    status: 'Under Review',
    date: '08/01/2025 2:30PM',
    timestamp: new Date('2025-01-08T14:30:00').getTime(),
    lastEditedBy: {
      name: 'Admin User',
      initials: 'AD',
      timestamp: '08/01/2025 2:30PM'
    }
  },
  {
    no: 2,
    desc: 'RELAY, SOCKET',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0002-RO1',
    pno: '9742200100',
    aes: 'E',
    quantity: 3,
    status: 'Sent to OEM',
    date: '08/01/2025 10:15AM',
    timestamp: new Date('2025-01-08T10:15:00').getTime(),
    lastEditedBy: {
      name: 'John Smith',
      initials: 'JS',
      timestamp: '08/01/2025 10:15AM'
    }
  },
  {
    no: 3,
    desc: 'ROD ASSY, PUSH/PULL, FRONT',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0003-RO1',
    pno: '576.10.09.021',
    aes: 'E',
    quantity: 1,
    status: 'Quoted',
    date: '07/01/2025 3:45PM',
    timestamp: new Date('2025-01-07T15:45:00').getTime(),
    lastEditedBy: {
      name: 'Sarah Wilson',
      initials: 'SW',
      timestamp: '07/01/2025 3:45PM'
    }
  },
  {
    no: 4,
    desc: 'MUDGUARD ASSY',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0004-RO1',
    pno: '5322009158',
    aes: 'E',
    quantity: 1,
    status: 'Under Review',
    date: '06/01/2025 11:20AM',
    timestamp: new Date('2025-01-06T11:20:00').getTime(),
    lastEditedBy: {
      name: 'Mike Johnson',
      initials: 'MJ',
      timestamp: '06/01/2025 11:20AM'
    }
  },
  {
    no: 5,
    desc: 'NUT',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0005-RO1',
    pno: '114.40.07.097',
    aes: 'E',
    quantity: 1,
    status: 'Sent to OEM',
    date: '05/01/2025 4:10PM',
    timestamp: new Date('2025-01-05T16:10:00').getTime(),
    lastEditedBy: {
      name: 'Lisa Brown',
      initials: 'LB',
      timestamp: '05/01/2025 4:10PM'
    }
  },
  {
    no: 6,
    desc: 'HOSE ASSY',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0006-RO1',
    pno: '959.90.01.255',
    aes: 'E',
    quantity: 1,
    status: 'Quoted',
    date: '04/01/2025 9:30AM',
    timestamp: new Date('2025-01-04T09:30:00').getTime(),
    lastEditedBy: {
      name: 'David Lee',
      initials: 'DL',
      timestamp: '04/01/2025 9:30AM'
    }
  },
  {
    no: 7,
    desc: 'ROD OPERATING RH',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0007-RO1',
    pno: '5323009336',
    aes: 'A',
    quantity: 1,
    status: 'Under Review',
    date: '03/01/2025 1:15PM',
    timestamp: new Date('2025-01-03T13:15:00').getTime(),
    lastEditedBy: {
      name: 'Emma Davis',
      initials: 'ED',
      timestamp: '03/01/2025 1:15PM'
    }
  },
  {
    no: 8,
    desc: 'HOSE ASSY',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0008-RO1',
    pno: '9599001248',
    aes: 'A',
    quantity: 1,
    status: 'Quoted',
    date: '01/01/2025 8:45AM',
    timestamp: new Date('2025-01-01T08:45:00').getTime(),
    lastEditedBy: {
      name: 'Tom Wilson',
      initials: 'TW',
      timestamp: '01/01/2025 8:45AM'
    }
  },
  {
    no: 9,
    desc: 'ROD OPERATING LH',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0009-RO1',
    pno: '5323009337',
    aes: 'A',
    quantity: 1,
    status: 'Sent to OEM',
    date: '31/12/2024 2:50PM',
    timestamp: new Date('2024-12-31T14:50:00').getTime(),
    lastEditedBy: {
      name: 'Anna Garcia',
      initials: 'AG',
      timestamp: '31/12/2024 2:50PM'
    }
  },
  {
    no: 10,
    desc: 'PLACARD, TYRE PRESSURE',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0010-RO1',
    pno: '511.20.09.121',
    aes: 'E',
    quantity: 2,
    status: 'Under Review',
    date: '25/12/2024 10:30AM',
    timestamp: new Date('2024-12-25T10:30:00').getTime(),
    lastEditedBy: {
      name: 'Chris Taylor',
      initials: 'CT',
      timestamp: '25/12/2024 10:30AM'
    }
  },
  {
    no: 11,
    desc: 'PLACARD, TYRE PRESSURE',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0011-RO1',
    pno: '511.20.09.122',
    aes: 'E',
    quantity: 2,
    status: 'Quoted',
    date: '24/12/2024 3:20PM',
    timestamp: new Date('2024-12-24T15:20:00').getTime(),
    lastEditedBy: {
      name: 'Maria Rodriguez',
      initials: 'MR',
      timestamp: '24/12/2024 3:20PM'
    }
  },
  {
    no: 13,
    desc: 'CIRCLIP, WAVE, ST, 29.1*2.5',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0012-RO1',
    pno: '9406100418',
    aes: 'E',
    quantity: 1,
    status: 'Sent to OEM',
    date: '23/12/2024 11:45AM',
    timestamp: new Date('2024-12-23T11:45:00').getTime(),
    lastEditedBy: {
      name: 'Kevin Chen',
      initials: 'KC',
      timestamp: '23/12/2024 11:45AM'
    }
  },
  {
    no: 14,
    desc: 'INDICATOR, CAUTION',
    referenceNo: '04',
    rfqNo: 'RFQM50-08012025-0013-RO1',
    pno: '9733219201',
    aes: 'E',
    quantity: 1,
    status: 'Under Review',
    date: '18/12/2024 4:15PM',
    timestamp: new Date('2024-12-18T16:15:00').getTime(),
    lastEditedBy: {
      name: 'Rachel Kim',
      initials: 'RK',
      timestamp: '18/12/2024 4:15PM'
    }
  }
])

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
  router.push(`/request-for-quotation/${rfqNo}`)
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
    'Under Review': 'bg-gray-200 text-gray-800',
    'Sent to OEM': 'bg-gray-300 text-gray-800',
    'Quoted': 'bg-gray-400 text-gray-900'
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
