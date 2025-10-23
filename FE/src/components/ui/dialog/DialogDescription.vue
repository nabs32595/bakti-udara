<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <p
    :class="cn('text-sm text-gray-500', props.class)"
  >
    <slot />
  </p>
</template>
