<script setup lang="ts">
import { NotificationItem } from './types.js'
import { RouterLink } from '@core/components/index.js'

type NotificationItemProp = {
  item: NotificationItem
}

defineProps<NotificationItemProp>()
</script>
<template>
  <RouterLink
    :href="item.routePath"
    class="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
  >
    <div class="w-full pl-3">
      <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
        <span class="font-semibold text-gray-900 dark:text-white">{{ $t(item.title) }}</span> <br />
        {{ $t(item.message) }}
      </div>
      <div class="text-xs font-medium text-primary-700 dark:text-primary-400">
        {{ item.createdAtText }}
      </div>
    </div>
  </RouterLink>
</template>
