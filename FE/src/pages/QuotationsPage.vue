<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold tracking-tight">Quotations</h2>
      <p class="text-muted-foreground text-sm">
        Manage quotations sent to customers
      </p>
    </div>
    <!-- Quotation List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between mb-4">
          <div>
            <CardTitle class="text-gray-700 text-base">Quotation List</CardTitle>
            <CardDescription class="text-gray-500 text-sm">Manage all customer quotations</CardDescription>
          </div>
          <div class="flex items-center space-x-2">
            <Button 
              class="bg-gray-200 text-gray-700 border-gray-300"
              @click="router.push('/quotations/create')"
            >
              Create New Quotation
            </Button>
          </div>
        </div>
        
        <!-- Search and Filters -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by quotation number, RFQ number, description, or part number..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        
        <!-- Bulk Actions -->
        <div v-if="selectedItemIds.length > 0" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
          <span class="text-xs text-gray-800">{{ selectedItemIds.length }} item(s) selected</span>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="bulkSendQuotation">
              Send Quotation
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
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('no')">
                  NO
                  <span v-if="sortColumn === 'no'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('quotationNo')">
                  QUOTATION NO
                  <span v-if="sortColumn === 'quotationNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('rfqNo')">
                  RFQ NO
                  <span v-if="sortColumn === 'rfqNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/NO
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('offerDate')">
                  OFFER DATE
                  <span v-if="sortColumn === 'offerDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('validityDate')">
                  VALIDITY DATE
                  <span v-if="sortColumn === 'validityDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('totalAmount')">
                  TOTAL PRICE (CHF)
                  <span v-if="sortColumn === 'totalAmount'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('daysRemaining')">
                  DAYS REMAINING
                  <span v-if="sortColumn === 'daysRemaining'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('validityStatus')">
                  VALIDITY STATUS
                  <span v-if="sortColumn === 'validityStatus'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST EDITED BY
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredAndSortedItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-3 py-2">
                  <input 
                    type="checkbox" 
                    :checked="selectedItemIds.includes(item.id)"
                    @change="toggleSelect(item.id)"
                    class="w-3 h-3 rounded border-gray-300"
                  />
                </td>
                <td class="px-3 py-2 text-xs font-medium text-gray-900">
                  {{ item.no }}
                </td>
                <td class="px-3 py-2 text-xs font-medium text-gray-900">
                  <button 
                    @click="viewQuotationDetails(item.quotationNo)"
                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {{ item.quotationNo }}
                  </button>
                </td>
                <td class="px-3 py-2 text-xs text-gray-700">
                  <button 
                    @click="viewRFQDetails(item.rfqNo)"
                    class="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    {{ item.rfqNo }}
                  </button>
                </td>
                <td class="px-3 py-2 text-xs text-gray-700">
                  {{ item.desc || '-' }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.pno || '-' }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.offerDate }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.validityDate }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-900 font-medium">
                  {{ formatCurrency(item.totalAmount) }}
                </td>
                <td class="px-3 py-2 text-xs font-medium" :class="getDaysRemainingClass(item.daysRemaining)">
                  {{ item.daysRemaining }}
                </td>
                <td class="px-3 py-2">
                  <span :class="getValidityStatusBadgeClass(item.validityStatus)" class="px-2 py-0.5 text-[11px] rounded-full font-medium">
                    {{ item.validityStatus }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <div class="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback class="bg-gray-200 text-gray-800 text-[11px] font-medium size-6">
                        {{ item.lastEditedBy.initials }}
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
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItemsCount) }} of {{ filteredItemsCount }} items
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
import { INITIAL_QUOTATION_LIST, buildQuotationTableItems } from '@/data/mockData/quotations'

// Router
const router = useRouter()

// Toast
const { toast } = useToast()

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')

// Sorting state
const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Multi-select state (by item id: quotationNo-lineNo)
const selectedItemIds = ref<string[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filteredItemsCount = ref(0)

// Use localStorage for quotation list
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)

// Table data: one row per line item (flattened, not grouped by quotation)
const tableItems = computed(() => buildQuotationTableItems(quotationList.value))

// Computed: Filtered and sorted items (individual line items)
const filteredAndSortedItems = computed(() => {
  let result = [...tableItems.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.quotationNo.toLowerCase().includes(query) ||
      item.rfqNo.toLowerCase().includes(query) ||
      (item.desc || '').toLowerCase().includes(query) ||
      (item.pno || '').toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(item => item.validityStatus === statusFilter.value)
  }

  // Apply sorting
  if (sortColumn.value) {
    result.sort((a, b) => {
      let aVal: any = a[sortColumn.value as keyof typeof a]
      let bVal: any = b[sortColumn.value as keyof typeof b]

      // Use timestamp for date sorting
      if (sortColumn.value === 'offerDate' || sortColumn.value === 'validityDate') {
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

  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  result = result.slice(startIndex, endIndex)

  return result
})

// Computed: All selected
const allSelected = computed(() => {
  return filteredAndSortedItems.value.length > 0 &&
    filteredAndSortedItems.value.every(item => selectedItemIds.value.includes(item.id))
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
  const index = selectedItemIds.value.indexOf(id)
  if (index > -1) {
    selectedItemIds.value.splice(index, 1)
  } else {
    selectedItemIds.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItemIds.value = []
  } else {
    selectedItemIds.value = filteredAndSortedItems.value.map(item => item.id)
  }
}

const clearSelection = () => {
  selectedItemIds.value = []
}

// Methods: Bulk actions
const bulkSendQuotation = () => {
  toast({
    title: 'Sending Quotations',
    description: `Sending ${selectedItemIds.value.length} item(s) to customers`
  })
  clearSelection()
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedItemIds.value.length} item(s)?`)) {
    toast({
      title: 'Deleted',
      description: `${selectedItemIds.value.length} item(s) deleted successfully`
    })
    clearSelection()
  }
}

// Methods: Individual actions
const viewQuotationDetails = (quotationNo: string) => {
  const quotation = quotationList.value.find((q: { quotationNo: string }) => q.quotationNo === quotationNo)
  if (quotation?.rfqNo) {
    router.push(`/quotations/${quotationNo}`)
  }
}

const viewRFQDetails = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}`)
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

// Helper methods for styling and formatting
const getValidityStatusBadgeClass = (status: string) => {
  const classes = {
    'Active': 'bg-emerald-100 text-emerald-800',
    'Expired': 'bg-red-200 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-slate-100 text-slate-700'
}

const getDaysRemainingClass = (days: number) => {
  if (days < 0) return 'text-red-600'
  if (days < 30) return 'text-orange-600'
  return 'text-green-600'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>
