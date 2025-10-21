<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            @click="goBack"
            class="flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Button>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">{{ rfqData?.rfqNo }}</h1>
            <p class="text-sm text-gray-500">RFQ Details</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Badge :class="getStatusBadgeClass(rfqData?.status || '')">
            {{ rfqData?.status }}
          </Badge>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details of the RFQ item</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label class="text-sm font-medium text-gray-500">Item Number</Label>
                  <p class="text-lg font-semibold text-gray-900">{{ rfqData?.no }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Reference No</Label>
                  <p class="text-lg font-semibold text-gray-900">{{ rfqData?.referenceNo }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Part Number</Label>
                  <p class="text-lg font-semibold text-gray-900">{{ rfqData?.pno }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Quantity</Label>
                  <p class="text-lg font-semibold text-gray-900">{{ rfqData?.quantity }} EA</p>
                </div>
              </div>
              <div>
                <Label class="text-sm font-medium text-gray-500">Description</Label>
                <p class="text-lg text-gray-900 mt-1">{{ rfqData?.desc }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <div>
                  <Label class="text-sm font-medium text-gray-500">AES Classification</Label>
                  <div class="mt-1">
                    <Badge :class="getAesBadgeClass(rfqData?.aes || '')">
                      {{ rfqData?.aes }}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Date</Label>
                  <p class="text-sm text-gray-900 mt-1">{{ rfqData?.date }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Document Details -->
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Attached documents and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="doc in documents" :key="doc.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div :class="getFileIconClass(doc.type)" class="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium">
                        {{ getFileIcon(doc.type) }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</p>
                      <p class="text-xs text-gray-500">{{ doc.type }} • {{ doc.size }} • {{ doc.uploadDate }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button variant="outline" size="sm" @click="downloadDocument(doc)">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View
                    </Button>
                    <Button variant="outline" size="sm" @click="downloadDocument(doc)">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </Button>
                  </div>
                </div>
                <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No documents attached</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status and Timeline -->
          <Card>
            <CardHeader>
              <CardTitle>Status & Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Created</p>
                    <p class="text-xs text-gray-500">{{ rfqData?.date }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Under Review</p>
                    <p class="text-xs text-gray-500">08/01/2025 2:30PM</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-500">Sent to OEM</p>
                    <p class="text-xs text-gray-400">Pending</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-500">Quoted</p>
                    <p class="text-xs text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Actions -->
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="w-full" @click="editRFQ">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit RFQ
              </Button>
              <Button variant="outline" class="w-full" @click="sendToOEM">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send to OEM
              </Button>
              <Button variant="outline" class="w-full" @click="markAsQuoted">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Quoted
              </Button>
              <Button variant="outline" class="w-full text-gray-600 border-gray-300 hover:bg-gray-50" @click="deleteRFQ">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete RFQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

// Router
const route = useRoute()
const router = useRouter()

// Data
const rfqData = ref<any>(null)
const documents = ref([
  {
    id: 1,
    name: 'Technical Specifications.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '08/01/2025 1:45PM',
    url: '#'
  },
  {
    id: 2,
    name: 'Engineering Drawings.dwg',
    type: 'DWG',
    size: '5.1 MB',
    uploadDate: '07/01/2025 4:20PM',
    url: '#'
  },
  {
    id: 3,
    name: 'Material Certificate.xlsx',
    type: 'Excel',
    size: '1.2 MB',
    uploadDate: '05/01/2025 9:30AM',
    url: '#'
  },
  {
    id: 4,
    name: 'Quality Inspection Report.pdf',
    type: 'PDF',
    size: '3.8 MB',
    uploadDate: '01/01/2025 11:15AM',
    url: '#'
  }
])

// Mock RFQ data (in real app, this would come from API)
const mockRFQData = [
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
    timestamp: new Date('2025-01-08T14:30:00').getTime()
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
    timestamp: new Date('2025-01-08T10:15:00').getTime()
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
    timestamp: new Date('2025-01-07T15:45:00').getTime()
  }
]

// Methods
const goBack = () => {
  router.push('/request-for-quotation')
}

const editRFQ = () => {
  console.log('Edit RFQ:', rfqData.value?.rfqNo)
  alert(`Editing ${rfqData.value?.rfqNo}`)
}

const sendToOEM = () => {
  console.log('Send to OEM:', rfqData.value?.rfqNo)
  alert(`Sending ${rfqData.value?.rfqNo} to OEM`)
}

const markAsQuoted = () => {
  console.log('Mark as quoted:', rfqData.value?.rfqNo)
  alert(`Marking ${rfqData.value?.rfqNo} as quoted`)
}

const deleteRFQ = () => {
  if (confirm(`Are you sure you want to delete ${rfqData.value?.rfqNo}?`)) {
    console.log('Delete RFQ:', rfqData.value?.rfqNo)
    alert(`Deleting ${rfqData.value?.rfqNo}`)
    goBack()
  }
}

const downloadDocument = (doc: any) => {
  console.log('Downloading:', doc.name)
  alert(`Downloading ${doc.name}`)
  // In real app, this would trigger actual download
}

// Helper functions
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

const getFileIconClass = (type: string) => {
  const classes = {
    'PDF': 'bg-gray-500',
    'DWG': 'bg-gray-600',
    'Excel': 'bg-gray-700',
    'Word': 'bg-gray-600',
    'Image': 'bg-gray-500'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-500'
}

const getFileIcon = (type: string) => {
  const icons = {
    'PDF': 'PDF',
    'DWG': 'DWG',
    'Excel': 'XLS',
    'Word': 'DOC',
    'Image': 'IMG'
  }
  return icons[type as keyof typeof icons] || 'FILE'
}

// Load RFQ data based on route parameter
onMounted(() => {
  const rfqNo = route.params.rfqNo as string
  const foundRFQ = mockRFQData.find(rfq => rfq.rfqNo === rfqNo)
  
  if (foundRFQ) {
    rfqData.value = foundRFQ
  } else {
    // Handle case where RFQ not found
    console.error('RFQ not found:', rfqNo)
    goBack()
  }
})
</script>
