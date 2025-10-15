<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

interface BadgeVariants {
  variant: "default" | "secondary" | "destructive" | "outline"
}

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"]
  variant?: BadgeVariants["variant"]
}>(), {
  variant: "default"
})

const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground"
}
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[props.variant],
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
