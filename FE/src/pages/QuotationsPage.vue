<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Quotations</h2>
      <p class="text-muted-foreground">
        Manage quotations sent to customers
      </p>
    </div>
    <!-- Quotation List -->
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between mb-4">
          <div>
            <CardTitle class="text-gray-700">Quotation List</CardTitle>
            <CardDescription class="text-gray-500">Manage all customer quotations</CardDescription>
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
        <div v-if="selectedQuotations.length > 0" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
          <span class="text-sm text-gray-800">{{ selectedQuotations.length }} quotation(s) selected</span>
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('quotationNo')">
                  QUOTATION NO
                  <span v-if="sortColumn === 'quotationNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('rfqNo')">
                  RFQ NO
                  <span v-if="sortColumn === 'rfqNo'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/NO
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('offerDate')">
                  OFFER DATE
                  <span v-if="sortColumn === 'offerDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('validityDate')">
                  VALIDITY DATE
                  <span v-if="sortColumn === 'validityDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('totalAmount')">
                  TOTAL PRICE (CHF)
                  <span v-if="sortColumn === 'totalAmount'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('daysRemaining')">
                  DAYS REMAINING
                  <span v-if="sortColumn === 'daysRemaining'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('validityStatus')">
                  VALIDITY STATUS
                  <span v-if="sortColumn === 'validityStatus'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST EDITED BY
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="quotation in filteredAndSortedQuotations" :key="quotation.quotationNo" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <input 
                    type="checkbox" 
                    :checked="selectedQuotations.includes(quotation.quotationNo)"
                    @change="toggleSelect(quotation.quotationNo)"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  {{ quotation.no }}
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  <button 
                    @click="viewQuotationDetails(quotation.quotationNo)"
                    class="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    {{ quotation.quotationNo }}
                  </button>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  <button 
                    @click="viewRFQDetails(quotation.rfqNo)"
                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {{ quotation.rfqNo }}
                  </button>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ quotation.lineItems[0]?.desc || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ quotation.lineItems[0]?.pno || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ quotation.offerDate }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ quotation.validityDate }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 font-medium">
                  {{ formatCurrency(quotation.totalAmount) }}
                </td>
                <td class="px-4 py-3 text-sm font-medium" :class="getDaysRemainingClass(quotation.daysRemaining)">
                  {{ quotation.daysRemaining }}
                </td>
                <td class="px-4 py-3">
                  <span :class="getValidityStatusBadgeClass(quotation.validityStatus)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ quotation.validityStatus }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium">
                        {{ quotation.lastEditedBy.initials }}
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
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItemsCount) }} of {{ filteredItemsCount }} quotations
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
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'

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

// Multi-select state
const selectedQuotations = ref<string[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filteredItemsCount = ref(0)

// Use localStorage for quotation list
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)

// Computed: Filtered and sorted quotations
const filteredAndSortedQuotations = computed(() => {
  let result = [...quotationList.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(quotation => 
      quotation.quotationNo.toLowerCase().includes(query) ||
      quotation.rfqNo.toLowerCase().includes(query) ||
      (quotation.lineItems[0]?.desc || '').toLowerCase().includes(query) ||
      (quotation.lineItems[0]?.pno || '').toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(quotation => quotation.validityStatus === statusFilter.value)
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

  // Apply pagination - limit to itemsPerPage items for the current page
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  result = result.slice(startIndex, endIndex)

  return result
})

// Computed: All selected
const allSelected = computed(() => {
  return filteredAndSortedQuotations.value.length > 0 && 
         filteredAndSortedQuotations.value.every(quotation => selectedQuotations.value.includes(quotation.quotationNo))
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
  const index = selectedQuotations.value.indexOf(id)
  if (index > -1) {
    selectedQuotations.value.splice(index, 1)
  } else {
    selectedQuotations.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedQuotations.value = []
  } else {
    selectedQuotations.value = filteredAndSortedQuotations.value.map(quotation => quotation.quotationNo)
  }
}

const clearSelection = () => {
  selectedQuotations.value = []
}

// Methods: Bulk actions
const bulkSendQuotation = () => {
  toast({
    title: 'Sending Quotations',
    description: `Sending ${selectedQuotations.value.length} quotation(s) to customers`
  })
  // Here you would make API call to update status
  clearSelection()
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedQuotations.value.length} quotation(s)?`)) {
    toast({
      title: 'Deleted',
      description: `${selectedQuotations.value.length} quotation(s) deleted successfully`
    })
    // Here you would make API call to delete
    clearSelection()
  }
}

// Methods: Individual actions
const viewQuotationDetails = (quotationNo: string) => {
  const quotation = quotationList.value.find(q => q.quotationNo === quotationNo)
  if (quotation?.rfqNo) {
    router.push(`/rfq/${quotation.rfqNo}/q/${quotationNo}`)
  }
}

const viewRFQDetails = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}/q`)
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
    'Active': 'bg-green-100 text-green-800',
    'Expired': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
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
