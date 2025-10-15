<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="max-w-sm w-full space-y-6 p-6">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 mb-4">
          <span class="text-xl font-bold text-gray-700">BU</span>
        </div>
        <h1 class="text-2xl font-bold">Welcome Back</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <Card>
        <CardContent class="p-6 space-y-4">
          <!-- Google Login -->
          <Button
              @click="handleGoogleLogin"
              class="w-full"
              variant="outline"
              :disabled="isLoading"
          >
            Continue with Google
          </Button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t"/>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <!-- Username Login -->
          <form @submit.prevent="handlePasswordlessLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="username">Username</Label>
              <Input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  :disabled="isLoading"
              />
            </div>

            <Button
                type="submit"
                class="w-full"
                :disabled="!username || isLoading"
            >
              Send Magic Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

const router = useRouter()
const username = ref('aliff@baktiudara.com')
const isLoading = ref(false)

const handleGoogleLogin = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  router.push('/')
}

const handlePasswordlessLogin = async () => {
  if (!username.value) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  router.push('/')
}
</script>
