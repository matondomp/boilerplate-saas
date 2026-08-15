<script setup lang="ts">
import { cn } from '~/core/utilities/cn'
import type { ButtonProps } from './types.js'
import { uuidv4 } from '@core/utilities/uuid4.js'

withDefaults(defineProps<ButtonProps>(), {
  type: 'submit',
  size: 'md',
  color: 'primary',
})
</script>
<template>
  <button
    :id="id ?? uuidv4()"
    :class="
      cn(
        'text-white',
        'btn',
        [
          {
            'btn-primary': color === 'primary',
            'btn-success': color === 'success',
            'btn-info': color === 'info',
            'btn-warning': color === 'warning',
            'btn-error': color === 'error',
            'btn-neutral': color === 'alternative',
          },
          {
            'btn-sm': size === 'sm',
            'btn-md': size === 'md',
            'btn-lg': size === 'lg',
            'btn-xl': size === 'xl',
            'btn-xs': size === 'xs',
          },
        ],
        classes
      )
    "
    :disabled="loading || disabled"
    :type="type"
  >
    <span v-if="loading" class="loading loading-spinner" />
    <slot />
  </button>
</template>
