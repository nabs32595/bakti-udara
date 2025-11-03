import { ref } from 'vue'
import type { ToastProps } from './Toast.vue'

export interface Toast extends ToastProps {
  id: string
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

const TOAST_LIMIT = 1

function dismiss(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const id = `toast-${toastIdCounter++}`
    const newToast: Toast = {
      id,
      ...props
    }

    toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)

    return {
      id,
      dismiss: () => dismiss(id)
    }
  }

  return {
    toast,
    dismiss,
    toasts
  }
}
