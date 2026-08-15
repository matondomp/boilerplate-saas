<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import http from './services.js'
import { AppNotificationItem } from './index.js'
import { AppIcon } from '@core/components/index.js'
import { NotificationWithCount } from './types.js'

const n = ref<NotificationWithCount>()
const isLoading = ref(true)
const showNotifications = ref(false)

onMounted(() => {
  http
    .notifications()
    .then(({ data }) => {
      n.value = data
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <div>
    <!-- Notifications -->
    <button
      type="button"
      data-dropdown-toggle="notification-dropdown"
      class="relative p-2 text-gray-500 rounded-lg justify-center flex hover:text-gray-900 hover:bg-base-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-base-300"
      @click="() => (showNotifications = !showNotifications)"
    >
      <AppIcon
        classes="text-gray-500 rounded-lg sm:flex hover:text-gray-900 hover:bg-base-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-base-300"
        icon="bell"
        :size="18"
      />
      <div
        v-if="n?.unRead"
        class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
      >
        {{ n.unRead }}
      </div>
    </button>
    <!-- Dropdown menu -->
    <div
      id="notification-dropdown"
      :class="[
        'z-50 w-full md:w-[270px] my-4 md:translate-x-[-10rem] bottom-0 md:bottom-auto overflow-hidden text-base fixed md:absolute list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-base-300 transform',
        { hidden: !showNotifications },
      ]"
    >
      <div
        class="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-base-300 dark:text-gray-400"
      >
        {{ $t('shared.notifications') }}
      </div>
      <div v-if="n">
        <AppNotificationItem
          v-for="notification of n.notifications"
          :key="notification.hash"
          :item="notification"
        />
      </div>
      <a
        href="#"
        class="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-base-200 dark:bg-base-300 dark:text-white dark:hover:underline"
      >
        <div class="inline-flex items-center">
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t('shared.more') }}
        </div>
      </a>
    </div>
  </div>
</template>
