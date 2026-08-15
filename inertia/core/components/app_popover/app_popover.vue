<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { PopoverProps } from './types.js'

defineProps<PopoverProps>()
</script>

<template>
  <Popover class="relative block">
    <PopoverButton class="w-full h-full block">
      <slot name="trigger" />
    </PopoverButton>
    <PopoverPanel class="absolute left-[-100%] z-10 mt-3 w-screen max-w-sm px-4 sm:px-0">
      <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
        <div class="relative bg-base-100 p-7">
          <slot name="body" />
        </div>
      </div>
    </PopoverPanel>
  </Popover>
</template>
