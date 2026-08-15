<script lang="ts" setup>
import VFeather from 'vue-feather'
import { computed } from 'vue'
import type { IconProp } from './types.js'

const props = withDefaults(defineProps<IconProp>(), {
  size: 16,
})

const resolvedIcon = computed(() => {
  if (props.icon === 'building') {
    return 'briefcase'
  }

  return props.icon
})
</script>

<template>
  <v-feather
    :class="classes"
    v-bind="{
      type: resolvedIcon,
      size,
    }"
  />
</template>
