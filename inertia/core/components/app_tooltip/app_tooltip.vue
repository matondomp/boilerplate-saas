<script lang="ts" setup>
import { HTMLAttributes } from 'vue'
import { cn } from '@core/utilities/cn.js'

type Props = {
  content: string
  classes: HTMLAttributes['class']
}

withDefaults(defineProps<Props>(), {
  classes: [],
})
</script>

<template>
  <div :class="cn(['tooltip', ...classes])" :data-tip="content">
    <slot name="target" />
  </div>
</template>
