<script setup lang="ts">
import { DialogTrigger as DialogTriggerPrimitive } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false
})
</script>

<template>
  <DialogTriggerPrimitive :class="cn(props.class)" :as-child="asChild">
    <slot />
  </DialogTriggerPrimitive>
</template>

