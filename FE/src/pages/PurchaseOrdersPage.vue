<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold tracking-tight">Purchase Orders (PO)</h2>
      <p class="text-muted-foreground text-sm">
        Manage purchase orders and delivery tracking
      </p>
    </div>
    <Card class="border-2 border-gray-300">
      <CardHeader>
        <div class="flex items-center justify-between mb-4">
          <div>
            <CardTitle class="text-gray-700 text-base">Purchase Order List</CardTitle>
            <CardDescription class="text-gray-500 text-sm">All PO line items with delivery status</CardDescription>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by PO reference, quotation number, RFQ number, description, or part number..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select v-model="deliveryStatusFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Delivery Status</option>
            <option value="ON TIME">On Time</option>
            <option value="REVISE EDD">Revise EDD</option>
          </select>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedItemIds.length > 0" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
          <span class="text-xs text-gray-800">{{ selectedItemIds.length }} item(s) selected</span>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" class="border-gray-300 text-gray-700" @click="bulkReviseEdd">
              Revise EDD
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
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('poReference')">
                  PO REFERENCE
                  <span v-if="sortColumn === 'poReference'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO NO
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
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('quantity')">
                  QTY
                  <span v-if="sortColumn === 'quantity'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AES
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('poDate')">
                  PO DATE
                  <span v-if="sortColumn === 'poDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('expectedDeliveryDate')">
                  EDD
                  <span v-if="sortColumn === 'expectedDeliveryDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('totalPrice')">
                  TOTAL (CHF)
                  <span v-if="sortColumn === 'totalPrice'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('daysDelta')">
                  DAYS Δ
                  <span v-if="sortColumn === 'daysDelta'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('deliveryStatus')">
                  DELIVERY STATUS
                  <span v-if="sortColumn === 'deliveryStatus'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST EDITED BY
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredAndSortedItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-3 py-2 text-xs">
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
                    @click="viewPODetails(item.poReference)"
                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {{ item.poReference }}
                  </button>
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.poNumber || '–' }}
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
                  {{ item.desc || '–' }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.pno || '–' }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.quantity }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.aes }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.poDate }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600">
                  {{ item.expectedDeliveryDate }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-900 font-medium">
                  {{ formatCurrency(item.totalPrice) }}
                </td>
                <td class="px-3 py-2 text-xs font-medium" :class="getDaysDeltaClass(item.daysDelta)">
                  {{ item.daysDelta != null ? item.daysDelta : '–' }}
                </td>
                <td class="px-3 py-2 text-xs">
                  <span :class="getDeliveryStatusBadgeClass(item.deliveryStatus)" class="px-2 py-0.5 text-[11px] rounded-full font-medium">
                    {{ item.deliveryStatus }}
                  </span>
                </td>
                <td class="px-3 py-2 text-xs">
                  <div class="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback class="bg-gray-200 text-gray-800 text-[11px] font-medium size-6">
                        {{ item.lastEditedBy?.initials || 'AD' }}
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
            Showing {{ filteredItemsCount === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredItemsCount) }} of {{ filteredItemsCount }} items
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
import { INITIAL_PO_LIST } from '@/data/mockData/purchaseOrders'

const router = useRouter()
const { toast } = useToast()

const searchQuery = ref('')
const deliveryStatusFilter = ref('')

const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const selectedItemIds = ref<string[]>([])

const currentPage = ref(1)
const itemsPerPage = ref(10)
const filteredItemsCount = ref(0)

const poList = useLocalStorage('poList', INITIAL_PO_LIST)

const tableItems = computed(() => poList.value)

const filteredAndSortedItems = computed(() => {
  let result = [...tableItems.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (item: any) =>
        (item.poReference || '').toLowerCase().includes(query) ||
        (item.poNumber || '').toString().includes(query) ||
        (item.quotationNo || '').toLowerCase().includes(query) ||
        (item.rfqNo || '').toLowerCase().includes(query) ||
        (item.desc || '').toLowerCase().includes(query) ||
        (item.pno || '').toLowerCase().includes(query)
    )
  }

  if (deliveryStatusFilter.value) {
    result = result.filter((item: any) => item.deliveryStatus === deliveryStatusFilter.value)
  }

  if (sortColumn.value) {
    result.sort((a: any, b: any) => {
      let aVal = a[sortColumn.value]
      let bVal = b[sortColumn.value]

      if (sortColumn.value === 'poDate' || sortColumn.value === 'expectedDeliveryDate') {
        aVal = parseDateForSort(aVal)
        bVal = parseDateForSort(bVal)
      }
      if (aVal == null) aVal = ''
      if (bVal == null) bVal = ''
      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  filteredItemsCount.value = result.length

  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  result = result.slice(startIndex, endIndex)

  return result
})

const allSelected = computed(() => {
  return filteredAndSortedItems.value.length > 0 &&
    filteredAndSortedItems.value.every((item: any) => selectedItemIds.value.includes(item.id))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItemsCount.value / itemsPerPage.value)))

function parseDateForSort (dateStr: string | null): number {
  if (!dateStr) return 0
  const parts = dateStr.split(/[/-]/)
  if (parts.length >= 3) {
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const y = parseInt(parts[2], 10)
    return new Date(y, m, d).getTime()
  }
  return 0
}

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

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
    selectedItemIds.value = filteredAndSortedItems.value.map((item: any) => item.id)
  }
}

const clearSelection = () => {
  selectedItemIds.value = []
}

const bulkReviseEdd = () => {
  toast({
    title: 'Revise EDD',
    description: `Revising EDD for ${selectedItemIds.value.length} item(s)`
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

const viewQuotationDetails = (quotationNo: string) => {
  router.push(`/quotations/${quotationNo}`)
}

const viewRFQDetails = (rfqNo: string) => {
  router.push(`/rfq/${rfqNo}`)
}

const viewPODetails = (poReference: string) => {
  router.push(`/purchase-orders/${encodeURIComponent(poReference)}`)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const getDeliveryStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'ON TIME': 'bg-emerald-100 text-emerald-800',
    'REVISE EDD': 'bg-amber-100 text-amber-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

const getDaysDeltaClass = (days: number | null) => {
  if (days == null) return ''
  if (days < 0) return 'text-red-600'
  if (days > 0) return 'text-emerald-600'
  return 'text-gray-600'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(amount)
}
</script>
