<script setup lang="ts">
import { DialogClose as DialogClosePrimitive } from 'reka-ui'
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
  <DialogClosePrimitive :class="cn(props.class)" :as-child="asChild">
    <slot />
  </DialogClosePrimitive>
</template>

