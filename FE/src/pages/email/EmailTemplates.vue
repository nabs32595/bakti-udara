<template>
  <div class="space-y-6">
    <Card>
      <!-- Templates Header -->
      <CardHeader>
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Email Templates</h3>
            <p class="text-sm text-gray-500">Create and manage your email templates</p>
          </div>
        </div>
      </CardHeader>
      <card-content>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
              v-for="template in templates"
              :key="template.id"
              class="border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
              @click="selectTemplate(template)"
          >
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="text-base font-medium text-gray-900">{{ template.name }}</CardTitle>
                <div class="flex space-x-2">
                  <button
                      @click.stop="previewTemplate(template)"
                      class="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Preview template"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <CardDescription class="text-sm text-gray-500">{{ template.description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <!-- Template content area -->
              </div>
            </CardContent>
          </Card>
        </div>
      </card-content>
    </Card>

    <!-- Create Template Modal -->
    <div v-if="showCreateTemplate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
          <CardDescription>Fill in the details for your new email template</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
              <Input v-model="newTemplate.name" placeholder="Enter template name"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input v-model="newTemplate.description" placeholder="Enter template description"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <Input v-model="newTemplate.subject" placeholder="Enter email subject"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
              <textarea
                  v-model="newTemplate.content"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter your email content here..."
              ></textarea>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-2">
          <Button variant="outline" @click="showCreateTemplate = false">Cancel</Button>
          <Button @click="createTemplate" class="bg-gray-800 hover:bg-gray-900">Create Template</Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card class="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>Preview of: {{ selectedTemplate?.name }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="border border-gray-200 rounded-lg p-6 bg-white">
            <div class="mb-4">
              <h4 class="font-semibold text-gray-900">Subject: {{ selectedTemplate?.subject }}</h4>
            </div>
            <div class="prose max-w-none" v-html="selectedTemplate?.content"></div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end">
          <Button @click="showPreview = false">Close</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { INITIAL_EMAIL_TEMPLATES } from '@/data/mockData/emailTemplates'

interface EmailTemplate {
  id: number
  name: string
  description: string
  category: string
  subject: string
  content: string
  status: 'Active' | 'Draft' | 'Archived'
  lastModified: string
}

const showCreateTemplate = ref(false)
const showPreview = ref(false)
const selectedTemplate = ref<EmailTemplate | null>(null)

const newTemplate = ref({
  name: '',
  description: '',
  category: 'Marketing',
  subject: '',
  content: ''
})

const templates = useLocalStorage('emailTemplates', INITIAL_EMAIL_TEMPLATES)

const selectTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = template
}

const previewTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = template
  showPreview.value = true
}

const createTemplate = () => {
  const newId = Math.max(...templates.value.map(t => t.id)) + 1
  templates.value.push({
    id: newId,
    name: newTemplate.value.name,
    description: newTemplate.value.description,
    category: newTemplate.value.category,
    subject: newTemplate.value.subject,
    content: newTemplate.value.content,
    status: 'Draft',
    lastModified: 'Just now'
  })

  // Reset form
  newTemplate.value = {
    name: '',
    description: '',
    category: 'Marketing',
    subject: '',
    content: ''
  }

  showCreateTemplate.value = false
}
</script>
