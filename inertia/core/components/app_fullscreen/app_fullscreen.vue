<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
import { AppIcon } from '../index.js'
const { toggle: toggleFullscreen, isFullscreen } = useFullscreen()
</script>
<template>
  <button
    type="button"
    class="text-gray-50 justify-center flex group focus:outline-none focus:ring-4 focus:ring-gray-200 text-sm p-1"
    @click="toggleFullscreen"
  >
    <AppIcon
      classes="text-gray-50 rounded-lg sm:flex hover:text-gray-300 "
      :icon="isFullscreen ? 'minimize' : 'maximize'"
      :size="18"
    />
  </button>
</template>
