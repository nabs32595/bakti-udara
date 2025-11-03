<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref } from "vue"
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  class?: HTMLAttributes["class"]
  username?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'google-login': []
  'magic-link': [username: string]
}>()

const username = ref(props.username || '')

const handleGoogleLogin = () => {
  emit('google-login')
}

const handleMagicLink = (event: Event) => {
  event.preventDefault()
  if (username.value) {
    emit('magic-link', username.value)
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="shadow-sm">
      <CardContent class="p-8 space-y-6">
        <!-- Google Login -->
        <Button
          @click="handleGoogleLogin"
          class="w-full bg-gray-900 hover:bg-gray-800 text-white"
          :disabled="isLoading"
        >
          Continue with Google
        </Button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"/>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-4 text-gray-500">or</span>
          </div>
        </div>

        <!-- Username Login -->
        <form @submit.prevent="handleMagicLink" class="space-y-4">
          <div class="space-y-2">
            <Label for="username" class="text-gray-700">Username</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
              :disabled="isLoading"
              class="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>

          <Button
            type="submit"
            class="w-full bg-gray-900 hover:bg-gray-800 text-white"
            :disabled="!username || isLoading"
          >
            Send Magic Link
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
