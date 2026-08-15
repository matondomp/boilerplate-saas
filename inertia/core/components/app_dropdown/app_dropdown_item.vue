<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@core/utilities/cn.js'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
  }>(),
  {
    class: [''],
  }
)
</script>
<template>
  <li :class="cn([props.class])">
    <slot />
  </li>
</template>
