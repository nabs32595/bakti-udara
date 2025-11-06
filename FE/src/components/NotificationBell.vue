<template>
  <div class="relative">
    <!-- Bell Button -->
    <button 
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md"
    >
      <Bell class="h-5 w-5" />
      <Badge 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-gray-700 text-white border-0"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </Badge>
    </button>
    
    <!-- Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50"
    >
      <div class="border-b border-gray-200 px-4 py-3">
        <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-6 text-center">
          <Bell class="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p class="text-sm text-gray-500">No notifications</p>
        </div>
        
        <div v-else>
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-0.5">
                <div :class="getNotificationIconClass(notification.type)" class="w-6 h-6 rounded-full flex items-center justify-center">
                  <component :is="getNotificationIcon(notification.type)" class="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-700 leading-5">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notification.timestamp }}</p>
              </div>
              
              <div v-if="!notification.read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length > 0" class="border-t border-gray-200 px-4 py-2">
        <p class="text-xs text-gray-500 text-center">{{ notifications.length }} notification{{ notifications.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Bell, FileText, Settings, User } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_NOTIFICATIONS } from '@/data/mockData/notifications'

interface Notification {
  id: string
  type: 'rfq' | 'system' | 'mention' | 'collaboration'
  message: string
  timestamp: string
  read: boolean
}

// Notifications with localStorage persistence
const notifications = useLocalStorage('notifications', INITIAL_NOTIFICATIONS)

const isOpen = ref(false)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getNotificationIcon = (type: string) => {
  const icons = {
    rfq: FileText,
    system: Settings,
    mention: User,
    collaboration: User
  }
  return icons[type as keyof typeof icons] || FileText
}

const getNotificationIconClass = (type: string) => {
  const classes = {
    rfq: 'bg-gray-600',
    system: 'bg-gray-500',
    mention: 'bg-gray-700',
    collaboration: 'bg-gray-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-600'
}
</script>
