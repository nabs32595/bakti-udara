<template>
  <TooltipProvider>
    <div class="flex items-center gap-2">
      <!-- Visible Avatars (max 5) -->
      <div v-if="visibleCollaborators.length > 0" class="flex items-center -space-x-2">
        <Tooltip v-for="collaborator in visibleCollaborators" :key="collaborator.id">
          <TooltipTrigger as-child>
            <div class="relative group">
              <Avatar class="w-8 h-8 border-2 border-white cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
                <AvatarFallback class="bg-gray-200 text-gray-800 text-xs font-medium">
                  {{ collaborator.initials }}
                </AvatarFallback>
              </Avatar>
              <!-- Remove button on hover -->
              <button
                v-if="isEditMode"
                @click.stop="handleRemoveCollaborator(collaborator.id)"
                class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove collaborator"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div class="text-xs">
              <p class="font-medium">{{ collaborator.name }}</p>
              <p v-if="collaborator.email" class="text-gray-300">{{ collaborator.email }}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <!-- "+N more" badge if more than 5 -->
      <Badge v-if="remainingCount > 0" class="bg-gray-200 text-gray-800 border-gray-300 text-xs">
        +{{ remainingCount }} more
      </Badge>

      <!-- Add Collaborator Button -->
      <Tooltip>
        <TooltipTrigger as-child>
          <button
            @click="showAddDialog = true"
            class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            title="Add collaborator"
          >
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          Add collaborator
        </TooltipContent>
      </Tooltip>
    </div>

    <!-- Add Collaborator Dialog -->
    <AddCollaboratorDialog
      :open="showAddDialog"
      :existing-collaborators="collaborators"
      :available-users="availableUsers"
      @update:open="showAddDialog = $event"
      @add-collaborator="handleAddCollaborator"
    />
  </TooltipProvider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_AVAILABLE_USERS } from '@/data/mockData/rfqDetails'
import { INITIAL_RFQ_LIST } from '@/data/mockData/requestForQuotation'
import { INITIAL_QUOTATION_LIST } from '@/data/mockData/quotations'
import AddCollaboratorDialog from '@/components/details/AddCollaboratorDialog.vue'

interface Collaborator {
  id: string
  name: string
  email: string
  initials: string
  addedAt: string
}

interface User {
  id: string
  name: string
  email: string
}

interface CollaboratorInput {
  id: string
  name: string
  email: string
  initials: string
  addedAt?: string
}

interface Props {
  entityType: 'rfq' | 'quotation'
  entityId: string
  isEditMode?: boolean
  initialCollaborators?: CollaboratorInput[]
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  initialCollaborators: () => []
})

const { toast } = useToast()

// Normalize collaborator input to ensure all required fields
const normalizeCollaborator = (collab: CollaboratorInput): Collaborator => {
  return {
    ...collab,
    addedAt: collab.addedAt || new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

// Collaborators state
const collaborators = ref<Collaborator[]>(props.initialCollaborators.map(normalizeCollaborator))

// Available users with localStorage persistence
const availableUsers = useLocalStorage('availableUsers', INITIAL_AVAILABLE_USERS)

// Dialog state
const showAddDialog = ref(false)

// localStorage lists
const rfqList = useLocalStorage('rfqList', INITIAL_RFQ_LIST)
const quotationList = useLocalStorage('quotationList', INITIAL_QUOTATION_LIST)

const MAX_VISIBLE = 5

const visibleCollaborators = computed(() => {
  return collaborators.value.slice(0, MAX_VISIBLE)
})

const remainingCount = computed(() => {
  return Math.max(0, collaborators.value.length - MAX_VISIBLE)
})

// Watch for changes in initialCollaborators
watch(() => props.initialCollaborators, (newCollaborators) => {
  if (newCollaborators && newCollaborators.length >= 0) {
    // Ensure all collaborators have required fields
    collaborators.value = newCollaborators.map(normalizeCollaborator)
  }
}, { deep: true, immediate: true })

// Helper function to get collaborator initials
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

// Update the appropriate list in localStorage
// Since useLocalStorage uses deep watching, updating the array will automatically save to localStorage
const updateEntityList = (updatedCollaborators: Collaborator[]) => {
  if (props.entityType === 'rfq') {
    const rfqIndex = rfqList.value.findIndex((rfq: any) => rfq.rfqNo === props.entityId)
    if (rfqIndex !== -1) {
      // Directly update the collaborators array to trigger reactivity
      rfqList.value[rfqIndex] = {
        ...rfqList.value[rfqIndex],
        collaborators: updatedCollaborators
      }
    }
  } else if (props.entityType === 'quotation') {
    const quotationIndex = quotationList.value.findIndex((q: any) => q.quotationNo === props.entityId)
    if (quotationIndex !== -1) {
      // Directly update the collaborators array to trigger reactivity
      quotationList.value[quotationIndex] = {
        ...quotationList.value[quotationIndex],
        collaborators: updatedCollaborators
      }
    }
  }
}

// Handle adding a collaborator
const handleAddCollaborator = (user: User) => {
  const newCollaborator: Collaborator = {
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
  updateEntityList(collaborators.value)
  
  toast({
    title: 'Collaborator Added',
    description: `${newCollaborator.name} has been added as a collaborator`
  })
  
  showAddDialog.value = false
}

// Handle removing a collaborator
const handleRemoveCollaborator = (collaboratorId: string) => {
  const removed = collaborators.value.find(c => c.id === collaboratorId)
  if (removed) {
    const updatedCollaborators = collaborators.value.filter(c => c.id !== collaboratorId)
    collaborators.value = updatedCollaborators
    updateEntityList(updatedCollaborators)
    
    toast({
      title: 'Collaborator Removed',
      description: `${removed.name} has been removed from collaborators`
    })
  }
}
</script>

