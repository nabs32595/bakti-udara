<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-gray-900">Notification Settings</CardTitle>
        <CardDescription class="text-sm text-gray-500">Configure automatic email notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div class="space-y-5">
            <div v-for="template in templates" :key="template.id"
                 class="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <h4 class="text-base font-medium text-gray-900">{{ template.name }}</h4>
                  <p class="text-sm text-gray-500">{{ template.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">{{ template.enabled ? 'On' : 'Off' }}</span>
                  <div
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 cursor-pointer"
                      :class="template.enabled ? 'bg-gray-800' : 'bg-gray-200'"
                      @click="template.enabled = !template.enabled"
                      role="switch"
                      :aria-checked="template.enabled"
                  >
                    <span
                        class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform"
                        :class="template.enabled ? 'translate-x-5' : 'translate-x-0.5'"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div class="flex justify-end">
          <Button @click="saveTemplateSettings" class="bg-gray-800 hover:bg-gray-900">
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_EMAIL_TEMPLATE_SETTINGS } from '@/data/mockData/emailSettings'

const { toast } = useToast()

interface EmailTemplate {
  id: number
  name: string
  description: string
  category: string
  enabled: boolean
}

// Email template settings with localStorage persistence
const templates = useLocalStorage('emailTemplateSettings', INITIAL_EMAIL_TEMPLATE_SETTINGS)

const saveTemplateSettings = () => {
  // Here you would typically save the settings to your backend
  toast({
    title: 'Success',
    description: 'Template settings saved successfully!'
  })
}
</script>