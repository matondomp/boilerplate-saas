<script lang="ts" setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { Copyright } from './types.js'

const copyright = computed(() => usePage().props.copyright as Copyright)

defineProps({
  centerText: Boolean,
  rightText: Boolean,
})
</script>

<template>
  <footer id="footer">
    <div :class="['p-3', { 'text-center': centerText }, { 'text-right': rightText }]">
      <span class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400"
        >&copy; 2019-{{ copyright.year }} UNIG© | Todos os Direitos Reservados </span
      >
      <div class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ $t('shared.version') }} {{ copyright.version }}
      </div>
    </div>
  </footer>
</template>
