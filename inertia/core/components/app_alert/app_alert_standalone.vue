<script lang="ts" setup>
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
} from '@heroicons/vue/24/outline'
type Props = {
  readonly type: 'error' | 'info' | 'success' | 'warning'
  readonly icon?: boolean
  readonly outline?: boolean
  readonly full?: boolean
}

defineProps<Props>()
</script>
<template>
  <div
    role="alert"
    :class="[
      'alert gap-0 md:gap-2',
      {
        'text-white alert-info': type === 'info' && !outline,
        'text-white alert-success': type === 'success' && !outline,
        'text-black alert-warning': type === 'warning' && !outline,
        'text-white alert-error': type === 'error' && !outline,
        'border-2 border-base-300': outline,
      },
      {
        'md:grid-cols-1': full,
      },
    ]"
  >
    <template v-if="icon">
      <template v-if="type === 'info'">
        <InformationCircleIcon class="w-6 h-6" />
      </template>
      <template v-else-if="type === 'success'">
        <CheckCircleIcon class="w-6 h-6" />
      </template>
      <template v-else-if="type === 'warning'">
        <ExclamationTriangleIcon class="w-6 h-6" />
      </template>
      <template v-else-if="type === 'error'">
        <NoSymbolIcon class="w-6 h-6" />
      </template>
      <template v-else>
        <slot name="icon" />
      </template>
    </template>
    <slot />
  </div>
</template>
