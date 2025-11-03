<template>
  <Card :class="{ 'border-gray-400': isEditMode }">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Collaborators</CardTitle>
        <Badge v-if="collaborators.length > 0" class="bg-gray-200 text-gray-800 border-gray-300">
          {{ collaborators.length }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <!-- Collaborator List -->
      <div v-if="collaborators.length > 0" class="space-y-2">
        <div
          v-for="collaborator in collaborators"
          :key="collaborator.id"
          class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors group"
        >
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar>
              <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
                {{ collaborator.initials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ collaborator.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ collaborator.email }}</p>
            </div>
          </div>
          <button
            @click="removeCollaborator(collaborator.id)"
            class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Remove collaborator"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-4">
        <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-sm text-gray-500">No collaborators yet</p>
      </div>

      <!-- Add Collaborator Button -->
      <Button
        variant="outline"
        class="w-full mt-2"
        @click="openAddDialog"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Collaborator
      </Button>

      <!-- Add Collaborator Dialog -->
      <AddCollaboratorDialog
        :open="showAddDialog"
        :existing-collaborators="collaborators"
        :available-users="availableUsers"
        @update:open="showAddDialog = $event"
        @add-collaborator="handleAddCollaborator"
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AddCollaboratorDialog from './AddCollaboratorDialog.vue'

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

interface Props {
  collaborators: Collaborator[]
  availableUsers: User[]
  isEditMode?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:collaborators': [collaborators: Collaborator[]]
  'collaborator-added': [collaborator: Collaborator]
  'collaborator-removed': [collaboratorId: string]
}>()

const showAddDialog = ref(false)

const openAddDialog = () => {
  showAddDialog.value = true
}

const handleAddCollaborator = (user: User) => {
  const newCollaborator: Collaborator = {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
    addedAt: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  const updatedCollaborators = [...props.collaborators, newCollaborator]
  emit('update:collaborators', updatedCollaborators)
  emit('collaborator-added', newCollaborator)
  showAddDialog.value = false
}

const removeCollaborator = (collaboratorId: string) => {
  const updatedCollaborators = props.collaborators.filter(c => c.id !== collaboratorId)
  emit('update:collaborators', updatedCollaborators)
  emit('collaborator-removed', collaboratorId)
}

const getInitials = (name: string): string => {
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
</script>

