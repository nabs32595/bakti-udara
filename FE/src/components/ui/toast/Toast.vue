<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ToastProps>(), {
  variant: 'default'
})

const emit = defineEmits<{
  close: []
}>()

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const toastClass = computed(() => cn(toastVariants({ variant: props.variant }), props.class))

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div :class="toastClass" role="alert">
    <div class="grid gap-1">
      <div v-if="title" class="text-sm font-semibold">
        {{ title }}
      </div>
      <div v-if="description" class="text-sm opacity-90">
        {{ description }}
      </div>
    </div>
    <button
      class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      @click="handleClose"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
