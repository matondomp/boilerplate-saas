<script lang="ts" setup>
import { computed } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { PopoverProps } from './types.js'

const props = withDefaults(defineProps<PopoverProps>(), {
  popoverPlacement: 'left'
})

const panelClasses = computed(() => {
  if (props.popoverPlacement === 'right') {
    return 'left-0'
  }
  // Keep it right-aligned (right-0) on all screen sizes to prevent desktop overflows
  return 'right-0'
})
</script>

<template>
  <Popover class="relative block">
    <PopoverButton class="w-full h-full block">
      <slot name="trigger" />
    </PopoverButton>
    <PopoverPanel
      :class="[
        'absolute z-30 mt-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] px-2 sm:px-0',
        panelClasses
      ]"
    >
      <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
        <div class="relative bg-base-100 p-4 sm:p-5">
          <slot name="body" />
        </div>
      </div>
    </PopoverPanel>
  </Popover>
</template>
