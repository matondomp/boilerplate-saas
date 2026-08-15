<script lang="ts" setup>
import { AppDropdown } from '@core/components/index.js'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
defineProps({
  disabled: {
    type: Boolean,
  },
  summary: {
    type: Boolean,
  },
})
</script>
<template>
  <AppDropdown
    class="focus:outline-none font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center disabled:cursor-not-allowed disabled:opacity-50"
    :summary="summary"
  >
    <template #header>
      <EllipsisVerticalIcon class="h-6 w-6 text-gray-500 hover:text-black dark:hover:text-white" />
    </template>
    <template #default>
      <slot />
    </template>
  </AppDropdown>
</template>
