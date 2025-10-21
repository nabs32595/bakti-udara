<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full">
        <RouterView />
      </div>
    </div>

    <!-- Footer -->
    <footer class="absolute bottom-0 w-full py-4">
      <div class="text-center text-sm text-gray-500">
        <p>&copy; 2025 Bakti Udara. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
