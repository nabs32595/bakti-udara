<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './components/layouts/DashboardLayout.vue'
import AuthLayout from './components/layouts/AuthLayout.vue'

const route = useRoute()

const isAuthPage = computed(() => route.name === 'Login')
</script>

<template>
  <AuthLayout v-if="isAuthPage" />
  <DashboardLayout v-else />
</template>
