<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md space-y-8 p-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-800 mb-6">
          <span class="text-2xl font-bold text-white">BU</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Bakti Udara</h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <LoginForm
        @google-login="handleGoogleLogin"
        @magic-link="handlePasswordlessLogin"
        :username="username"
        :is-loading="isLoading"
        class="grayscale-theme"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import LoginForm from '@/pages/login/LoginForm.vue'

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
