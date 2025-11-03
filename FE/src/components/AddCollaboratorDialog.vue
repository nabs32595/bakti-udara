<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Collaborator</DialogTitle>
        <DialogDescription>
          Search and select a user to add as a collaborator
        </DialogDescription>
      </DialogHeader>

      <!-- Search Input -->
      <div class="relative mt-4">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          v-model="searchQuery"
          placeholder="Search by name or email..."
          class="pl-9"
        />
      </div>

      <!-- User List -->
      <div class="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md">
        <div v-if="filteredUsers.length === 0" class="p-6 text-center">
          <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-sm text-gray-500">No users found</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <button
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            :disabled="isAlreadyCollaborator(user.id)"
            :class="[
              'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
              isAlreadyCollaborator(user.id) && 'opacity-50 cursor-not-allowed bg-gray-100'
            ]"
          >
            <div class="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback class="bg-gray-200 text-gray-800 text-sm font-medium">
                  {{ getInitials(user.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
              </div>
              <div v-if="isAlreadyCollaborator(user.id)" class="flex-shrink-0">
                <Badge class="bg-gray-300 text-gray-700 border-gray-400 text-xs">
                  Added
                </Badge>
              </div>
              <div v-else class="flex-shrink-0">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface User {
  id: string
  name: string
  email: string
}

interface Collaborator {
  id: string
  name: string
  email: string
  initials: string
  addedAt: string
}

interface Props {
  open: boolean
  existingCollaborators: Collaborator[]
  availableUsers: User[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [open: boolean]
  'add-collaborator': [user: User]
}>()

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.availableUsers.filter(user => !isAlreadyCollaborator(user.id))
  }

  const query = searchQuery.value.toLowerCase()
  return props.availableUsers.filter(user => {
    const matches = user.name.toLowerCase().includes(query) || 
                   user.email.toLowerCase().includes(query)
    return matches && !isAlreadyCollaborator(user.id)
  })
})

const isAlreadyCollaborator = (userId: string): boolean => {
  return props.existingCollaborators.some(c => c.id === userId)
}

const selectUser = (user: User) => {
  if (!isAlreadyCollaborator(user.id)) {
    emit('add-collaborator', user)
  }
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

