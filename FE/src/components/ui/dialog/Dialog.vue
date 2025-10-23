<script setup lang="ts">
import { DialogRoot, useForwardProps } from 'reka-ui'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'

interface DialogProps extends DialogRootProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<DialogProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogRoot v-bind="forwardedProps" @update:open="emits('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
