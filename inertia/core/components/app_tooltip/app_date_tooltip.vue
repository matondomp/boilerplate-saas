<script lang="ts" setup>
import AppTooltip from './app_tooltip.vue'

defineProps<{
  value: string
  tooltip: string
}>()
</script>
<template>
  <AppTooltip :content="tooltip">
    <template #target>
      <span>{{ value }} </span>
    </template>
  </AppTooltip>
</template>
