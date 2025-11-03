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
          <Badge v-if="isEditMode" class="bg-gray-200 text-gray-800 border-gray-300">
            Edit Mode
          </Badge>
        </div>
      </div>
      
      <!-- Collaborators Section -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Collaborators</span>
              <Badge v-if="collaborators.length > 0" class="bg-gray-200 text-gray-800 border-gray-300 text-xs">
                {{ collaborators.length }}
              </Badge>
            </div>
            
            <!-- Collaborator Avatars -->
            <div class="flex items-center space-x-2 ml-2">
              <div
                v-for="collaborator in collaborators"
                :key="collaborator.id"
                class="relative group"
              >
                <Avatar class="cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all">
                  <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium">
                    {{ collaborator.initials }}
                  </AvatarFallback>
                </Avatar>
                <!-- Tooltip on hover -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-auto">
                  <span>{{ collaborator.name }}</span>
                  <button
                    @click.stop="handleCollaboratorRemoved(collaborator.id)"
                    class="ml-2 text-gray-300 hover:text-white inline-block"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <!-- Add Collaborator Button -->
              <Button
                variant="outline"
                size="sm"
                @click="showAddDialog = true"
                class="h-8 px-2 text-xs"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8" :class="{ 'bg-gray-50': isEditMode }">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <Card :class="{ 'border-gray-400': isEditMode }">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details of the RFQ item</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label class="text-sm font-medium text-gray-500">Item Number</Label>
                  <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.no }}</p>
                  <Input
                    v-else
                    v-model="editFormData.no"
                    type="text"
                    :class="{ 'border-gray-600': editErrors.no }"
                    @input="clearEditError('no')"
                  />
                  <p v-if="editErrors.no" class="text-xs text-gray-600 mt-1">{{ editErrors.no }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Reference No</Label>
                  <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.referenceNo }}</p>
                  <Input
                    v-else
                    v-model="editFormData.referenceNo"
                    type="text"
                    :class="{ 'border-gray-600': editErrors.referenceNo }"
                    @input="clearEditError('referenceNo')"
                  />
                  <p v-if="editErrors.referenceNo" class="text-xs text-gray-600 mt-1">{{ editErrors.referenceNo }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Part Number</Label>
                  <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.pno }}</p>
                  <Input
                    v-else
                    v-model="editFormData.pno"
                    type="text"
                    :class="{ 'border-gray-600': editErrors.pno }"
                    @input="clearEditError('pno')"
                  />
                  <p v-if="editErrors.pno" class="text-xs text-gray-600 mt-1">{{ editErrors.pno }}</p>
                </div>
                <div>
                  <Label class="text-sm font-medium text-gray-500">Quantity</Label>
                  <p v-if="!isEditMode" class="text-lg font-semibold text-gray-900">{{ rfqData?.quantity }} EA</p>
                  <Input
                    v-else
                    v-model.number="editFormData.quantity"
                    type="number"
                    min="1"
                    :class="{ 'border-gray-600': editErrors.quantity }"
                    @input="clearEditError('quantity')"
                  />
                  <p v-if="editErrors.quantity" class="text-xs text-gray-600 mt-1">{{ editErrors.quantity }}</p>
                </div>
              </div>
              <div>
                <Label class="text-sm font-medium text-gray-500">Description</Label>
                <p v-if="!isEditMode" class="text-lg text-gray-900 mt-1">{{ rfqData?.desc }}</p>
                <textarea
                  v-else
                  v-model="editFormData.desc"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  :class="{ 'border-gray-600': editErrors.desc }"
                  @input="clearEditError('desc')"
                ></textarea>
                <p v-if="editErrors.desc" class="text-xs text-gray-600 mt-1">{{ editErrors.desc }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <div>
                  <Label class="text-sm font-medium text-gray-500">AES Classification</Label>
                  <div class="mt-1">
                    <Badge v-if="!isEditMode" :class="getAesBadgeClass(rfqData?.aes || '')">
                      {{ rfqData?.aes }}
                    </Badge>
                    <select
                      v-else
                      v-model="editFormData.aes"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      :class="{ 'border-gray-600': editErrors.aes }"
                      @change="clearEditError('aes')"
                    >
                      <option value="">Select AES Classification</option>
                      <option value="A">A</option>
                      <option value="E">E</option>
                    </select>
                    <p v-if="editErrors.aes" class="text-xs text-gray-600 mt-1">{{ editErrors.aes }}</p>
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
          <Card :class="{ 'border-gray-400': isEditMode }">
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Attached documents and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <!-- Edit Mode: File Upload Area -->
              <div v-if="isEditMode" class="space-y-4">
                <!-- File Upload Area -->
                <div
                  @drop.prevent="handleFileDrop"
                  @dragover.prevent
                  @dragenter.prevent
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  :class="{ 'border-gray-500 bg-gray-100': isDragOver }"
                  @dragenter="isDragOver = true"
                  @dragleave="isDragOver = false"
                >
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    class="hidden"
                    accept=".pdf,.dwg,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    @click="() => fileInput?.click()"
                    class="mt-2"
                  >
                    Choose Files
                  </Button>
                  <p class="text-xs text-gray-500 mt-2">Supported formats: PDF, DWG, Excel, Word, Images</p>
                </div>

                <!-- Existing Documents with Remove Option -->
                <div v-if="documents.length > 0" class="space-y-2">
                  <h4 class="text-sm font-medium text-gray-700">Existing Documents:</h4>
                  <div v-for="(doc, index) in documents" :key="doc.id" class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      @click="removeExistingDocument(index)"
                      class="text-gray-600 border-gray-400 hover:bg-gray-100"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <!-- Newly Added Documents -->
                <div v-if="editedDocuments.length > 0" class="space-y-2">
                  <h4 class="text-sm font-medium text-gray-700">New Documents:</h4>
                  <div v-for="(file, index) in editedDocuments" :key="index" class="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm font-medium">
                          {{ getFileIcon(file.type) }}
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      @click="removeNewDocument(index)"
                      class="text-gray-600 border-gray-400 hover:bg-gray-100"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <!-- View Mode: Document List -->
              <div v-else class="space-y-3">
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
          <Card :class="{ 'border-gray-400': isEditMode }">
            <CardHeader>
              <CardTitle>Status & Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <!-- Current Status (Editable in Edit Mode) -->
                <div v-if="isEditMode" class="space-y-2">
                  <Label class="text-sm font-medium text-gray-700">Current Status</Label>
                  <select
                    v-model="editFormData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    :class="{ 'border-gray-600': editErrors.status }"
                    @change="clearEditError('status')"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Sent to OEM">Sent to OEM</option>
                    <option value="Quoted">Quoted</option>
                  </select>
                  <p v-if="editErrors.status" class="text-xs text-gray-600">{{ editErrors.status }}</p>
                </div>
                
                <!-- Timeline -->
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
              </div>
              
              <!-- Additional spacing -->
              <div class="h-6"></div>
              
              <!-- Last Edited By Section -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
                      {{ rfqData?.lastEditedBy?.initials || 'AD' }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Last Edited By</p>
                    <p class="text-xs text-gray-500">{{ rfqData?.lastEditedBy?.name || 'Admin User' }}</p>
                    <p class="text-xs text-gray-400">{{ rfqData?.lastEditedBy?.timestamp || rfqData?.date }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Actions -->
          <Card :class="{ 'border-gray-400': isEditMode }">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <!-- Edit Mode Actions -->
              <template v-if="isEditMode">
                <Button 
                  class="w-full bg-gray-800 hover:bg-gray-900 text-white" 
                  @click="saveChanges"
                  :disabled="isSubmitting"
                >
                  <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </Button>
                <Button variant="outline" class="w-full" @click="cancelEdit" :disabled="isSubmitting">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </Button>
              </template>
              
              <!-- View Mode Actions -->
              <template v-else>
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
              </template>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Conflict Resolution Dialog -->
    <ConflictResolutionDialog
      :open="showConflictDialog"
      :conflict-data="conflictData"
      @update:open="showConflictDialog = $event"
      @discard-changes="handleDiscardChanges"
      @resolve-conflicts="handleResolveConflicts"
    />

    <!-- Add Collaborator Dialog -->
    <AddCollaboratorDialog
      :open="showAddDialog"
      :existing-collaborators="collaborators"
      :available-users="availableUsers"
      @update:open="showAddDialog = $event"
      @add-collaborator="handleAddCollaborator"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ConflictResolutionDialog from '@/components/ConflictResolutionDialog.vue'
import AddCollaboratorDialog from '@/components/AddCollaboratorDialog.vue'
import { useToast } from '@/components/ui/toast/use-toast'

// Router
const route = useRoute()
const router = useRouter()

// Toast
const { toast } = useToast()

// Data
const rfqData = ref<any>(null)

// Collaborators state
const collaborators = ref([
  {
    id: '2',
    name: 'erma',
    email: 'erma@baktiudara.com',
    initials: 'ER',
    addedAt: '08/01/2025 1:00PM'
  },
  {
    id: '3',
    name: 'adda',
    email: 'adda@baktiudara.com',
    initials: 'AD',
    addedAt: '08/01/2025 12:30PM'
  }
])

// Available users (reused from RolesPage)
const availableUsers = ref([
  { id: '1', name: 'aliff', email: 'aliff@baktiudara.com' },
  { id: '2', name: 'erma', email: 'erma@baktiudara.com' },
  { id: '3', name: 'adda', email: 'adda@baktiudara.com' },
  { id: '7', name: 'shahmail', email: 'shahmail@baktiudara.com' },
  { id: '8', name: 'zico', email: 'zico@baktiudara.com' }
])

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

// Edit mode state management
const isEditMode = ref(false)
const isSubmitting = ref(false)
const isDragOver = ref(false)
const editFormData = ref({
  no: '',
  rfqNo: '',
  referenceNo: '',
  pno: '',
  desc: '',
  quantity: 1,
  aes: '',
  status: ''
})
const editErrors = ref<Record<string, string>>({})
const editedDocuments = ref<any[]>([])
const originalDocuments = ref<any[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// Conflict resolution state
const showConflictDialog = ref(false)
const conflictData = ref<any[]>([])
const currentDbVersion = ref<any>({})

// Add collaborator dialog state
const showAddDialog = ref(false)

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
    timestamp: new Date('2025-01-08T14:30:00').getTime(),
    lastEditedBy: {
      name: 'Admin User',
      initials: 'AD',
      timestamp: '08/01/2025 2:30PM'
    },
    collaborators: [
      {
        id: '2',
        name: 'erma',
        email: 'erma@baktiudara.com',
        initials: 'ER',
        addedAt: '08/01/2025 1:00PM'
      },
      {
        id: '3',
        name: 'adda',
        email: 'adda@baktiudara.com',
        initials: 'AD',
        addedAt: '08/01/2025 12:30PM'
      }
    ]
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
  }
]

// Methods
const goBack = () => {
  router.push('/request-for-quotation')
}

const editRFQ = () => {
  // Copy current data to edit form
  editFormData.value = {
    no: rfqData.value?.no || '',
    rfqNo: rfqData.value?.rfqNo || '',
    referenceNo: rfqData.value?.referenceNo || '',
    pno: rfqData.value?.pno || '',
    desc: rfqData.value?.desc || '',
    quantity: rfqData.value?.quantity || 1,
    aes: rfqData.value?.aes || '',
    status: rfqData.value?.status || ''
  }
  
  // Store original documents
  originalDocuments.value = [...documents.value]
  editedDocuments.value = []
  
  // Clear any previous errors
  editErrors.value = {}
  
  // Enter edit mode
  isEditMode.value = true
}

const cancelEdit = () => {
  if (hasEditChanges()) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      exitEditMode()
    }
  } else {
    exitEditMode()
  }
}

const exitEditMode = () => {
  isEditMode.value = false
  editErrors.value = {}
  editedDocuments.value = []
  isDragOver.value = false
}

const hasEditChanges = () => {
  return editFormData.value.pno !== rfqData.value?.pno ||
         editFormData.value.desc !== rfqData.value?.desc ||
         editFormData.value.quantity !== rfqData.value?.quantity ||
         editFormData.value.aes !== rfqData.value?.aes ||
         editFormData.value.status !== rfqData.value?.status ||
         editFormData.value.referenceNo !== rfqData.value?.referenceNo ||
         editFormData.value.rfqNo !== rfqData.value?.rfqNo ||
         editedDocuments.value.length > 0
}

const validateEditForm = () => {
  editErrors.value = {}
  
  if (!editFormData.value.pno.trim()) {
    editErrors.value.pno = 'Part number is required'
  }
  
  if (!editFormData.value.desc.trim()) {
    editErrors.value.desc = 'Description is required'
  }
  
  if (!editFormData.value.quantity || editFormData.value.quantity < 1) {
    editErrors.value.quantity = 'Quantity must be at least 1'
  }
  
  if (!editFormData.value.aes) {
    editErrors.value.aes = 'AES classification is required'
  }
  
  if (!editFormData.value.referenceNo.trim()) {
    editErrors.value.referenceNo = 'Reference number is required'
  }
  
  if (!editFormData.value.rfqNo.trim()) {
    editErrors.value.rfqNo = 'RFQ number is required'
  }
  
  if (!editFormData.value.status) {
    editErrors.value.status = 'Status is required'
  }
  
  return Object.keys(editErrors.value).length === 0
}

const clearEditError = (field: string) => {
  if (editErrors.value[field]) {
    delete editErrors.value[field]
  }
}

const saveChanges = async () => {
  if (!validateEditForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock conflict detection (30% chance of conflicts)
    const hasConflicts = Math.random() < 0.3
    
    if (hasConflicts) {
      // Simulate current database version with some changes
      currentDbVersion.value = {
        // no: editFormData.value.no,
        // rfqNo: editFormData.value.rfqNo,
        // referenceNo: editFormData.value.referenceNo + ' (modified)',
        // pno: editFormData.value.pno + '-UPDATED',
        desc: editFormData.value.desc + ' - Updated by another user',
        // quantity: editFormData.value.quantity + 1,
        // aes: editFormData.value.aes === 'A' ? 'E' : 'A',
        // status: editFormData.value.status === 'Under Review' ? 'Sent to OEM' : 'Under Review'
      }
      
      // Generate conflict data for fields that have changed
      const conflicts: Array<{
        key: string
        label: string
        yourValue: string | number
        currentValue: string | number
      }> = []
      const fieldMappings = [
        // { key: 'referenceNo', label: 'Reference No' },
        // { key: 'pno', label: 'Part Number' },
        { key: 'desc', label: 'Description' },
        // { key: 'quantity', label: 'Quantity' },
        // { key: 'aes', label: 'AES Classification' },
        // { key: 'status', label: 'Status' }
      ]
      
      fieldMappings.forEach(field => {
        if (editFormData.value[field.key as keyof typeof editFormData.value] !== currentDbVersion.value[field.key]) {
          conflicts.push({
            key: field.key,
            label: field.label,
            yourValue: editFormData.value[field.key as keyof typeof editFormData.value],
            currentValue: currentDbVersion.value[field.key]
          })
        }
      })
      
      // If we have conflicts, show the dialog
      if (conflicts.length > 0) {
        conflictData.value = conflicts
        showConflictDialog.value = true
        isSubmitting.value = false
        return
      }
    }
    
    // No conflicts - proceed with normal save
    await performSave()
    
  } catch (error) {
    console.error('Error updating RFQ:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Error updating RFQ. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const performSave = async () => {
  // Update RFQ data with new values
  rfqData.value = {
    ...rfqData.value,
    no: editFormData.value.no,
    rfqNo: editFormData.value.rfqNo,
    referenceNo: editFormData.value.referenceNo,
    pno: editFormData.value.pno,
    desc: editFormData.value.desc,
    quantity: editFormData.value.quantity,
    aes: editFormData.value.aes,
    status: editFormData.value.status,
    date: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  // Update documents (in real app, this would be handled by API)
  if (editedDocuments.value.length > 0) {
    // Add new documents to the list
    const newDocs = editedDocuments.value.map((file, index) => ({
      id: documents.value.length + index + 1,
      name: file.name,
      type: getFileTypeFromMime(file.type),
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      url: '#'
    }))
    documents.value.push(...newDocs)
  }
  
  // Show success message
  toast({
    title: 'Success',
    description: `RFQ ${editFormData.value.rfqNo} updated successfully!`
  })
  
  // Exit edit mode
  exitEditMode()
}

const sendToOEM = () => {
  toast({
    title: 'Sending to OEM',
    description: `RFQ ${rfqData.value?.rfqNo} sent to OEM`
  })
}

const markAsQuoted = () => {
  toast({
    title: 'Marked as Quoted',
    description: `RFQ ${rfqData.value?.rfqNo} marked as quoted`
  })
}

const deleteRFQ = () => {
  if (confirm(`Are you sure you want to delete ${rfqData.value?.rfqNo}?`)) {
    toast({
      title: 'Deleted',
      description: `RFQ ${rfqData.value?.rfqNo} deleted successfully`
    })
    goBack()
  }
}

// Conflict resolution handlers
const handleDiscardChanges = () => {
  // Reset form to original values
  editFormData.value = {
    no: rfqData.value?.no || '',
    rfqNo: rfqData.value?.rfqNo || '',
    referenceNo: rfqData.value?.referenceNo || '',
    pno: rfqData.value?.pno || '',
    desc: rfqData.value?.desc || '',
    quantity: rfqData.value?.quantity || 1,
    aes: rfqData.value?.aes || '',
    status: rfqData.value?.status || ''
  }
  
  // Clear any errors
  editErrors.value = {}
  
  // Reset documents
  editedDocuments.value = []
}

const handleResolveConflicts = async (resolutions: Array<{ key: string; selectedValue: string | number }>) => {
  isSubmitting.value = true
  
  try {
    // Update editFormData with resolved values
    resolutions.forEach(resolution => {
      const key = resolution.key as keyof typeof editFormData.value
      if (key in editFormData.value) {
        editFormData.value[key] = resolution.selectedValue as never
      }
    })
    
    // Proceed with save using resolved values
    await performSave()
  } catch (error) {
    console.error('Error saving resolved conflicts:', error)
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Error saving RFQ. Please try again.'
    })
  } finally {
    isSubmitting.value = false
  }
}

const downloadDocument = (doc: any) => {
  toast({
    title: 'Downloading',
    description: `Starting download for ${doc.name}...`
  })
  // In real app, this would trigger actual download
}

// Document management methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    return validTypes.includes(file.type) || file.name.endsWith('.dwg')
  })
  
  editedDocuments.value.push(...validFiles)
}

const removeExistingDocument = (index: number) => {
  documents.value.splice(index, 1)
}

const removeNewDocument = (index: number) => {
  editedDocuments.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeFromMime = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'PDF'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word'
  if (mimeType.includes('image')) return 'Image'
  if (mimeType.includes('dwg')) return 'DWG'
  return 'FILE'
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

// Collaborator handlers
const handleCollaboratorAdded = (collaborator: any) => {
  toast({
    title: 'Collaborator Added',
    description: `${collaborator.name} has been added as a collaborator`
  })
}

const handleCollaboratorRemoved = (collaboratorId: string) => {
  const removed = collaborators.value.find(c => c.id === collaboratorId)
  if (removed) {
    const updatedCollaborators = collaborators.value.filter(c => c.id !== collaboratorId)
    collaborators.value = updatedCollaborators
    toast({
      title: 'Collaborator Removed',
      description: `${removed.name} has been removed from collaborators`
    })
  }
}

const handleAddCollaborator = (user: any) => {
  const newCollaborator = {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getCollaboratorInitials(user.name),
    addedAt: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  collaborators.value = [...collaborators.value, newCollaborator]
  handleCollaboratorAdded(newCollaborator)
  showAddDialog.value = false
}

const getCollaboratorInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    if (first && second) {
      return (first + second).toUpperCase()
    }
  }
  return name.substring(0, 2).toUpperCase()
}

// Load RFQ data based on route parameter
onMounted(() => {
  const rfqNo = route.params.rfqNo as string
  const foundRFQ = mockRFQData.find(rfq => rfq.rfqNo === rfqNo)
  
  if (foundRFQ) {
    rfqData.value = foundRFQ
    // Load collaborators from RFQ data if available
    if (foundRFQ.collaborators) {
      collaborators.value = foundRFQ.collaborators
    }
  } else {
    // Handle case where RFQ not found
    console.error('RFQ not found:', rfqNo)
    goBack()
  }
})
</script>
