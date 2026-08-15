<script setup lang="ts">
import { Status } from '@core/types/status.js'

type StatusProps = {
  status: Status
  text: string
}

defineProps<StatusProps>()
</script>

<template>
  <div
    :class="[
      'badge text-xs',
      {
        'text-white badge-error': status === 'DANGER',
        'text-base-100 badge-success': status === 'SUCCESS',
        'badge-warning text-black': status === 'WARNING',
      },
      'badge-lg',
    ]"
  >
    {{ text }}
  </div>
</template>
