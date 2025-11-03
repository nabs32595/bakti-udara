<script setup lang="ts">
import { useToast } from './use-toast'
import Toast from './Toast.vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="pointer-events-auto flex flex-col gap-2"
    >
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :title="toast.title"
        :description="toast.description"
        :variant="toast.variant"
        @close="dismiss(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
