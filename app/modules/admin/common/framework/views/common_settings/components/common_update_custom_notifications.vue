<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { AppButton, AppToggle } from '@core/components/index.js'
import { apiService } from '../services/api.js'
import { CustomNotificationProp } from './types.js'

const props = defineProps<CustomNotificationProp>()

const isLoading = ref(false)

const selectedNotifications = (type: string) => {
  return props.activeNotifications.filter((n) => n.type === type).map((n) => n.id)
}

const form = reactive({
  platform: selectedNotifications('platform'),
  email: selectedNotifications('email'),
})

const onSubmit = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  await apiService.updateNotifications(form).finally(() => {
    isLoading.value = false
  })
}
</script>
<template>
  <div
    class="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-base-200 xl:mb-0"
  >
    <div class="flow-root">
      <div class="flex items-center justify-between pb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t('shared.custom_alert_and_notifications') }}
          </h3>
          <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
            {{ $t('shared.custom_alert_and_notifications.description') }}
          </p>
        </div>
        <div class="flex flex-col flex-grow" />
        <label class="pr-4 text-base font-normal text-gray-500 dark:text-gray-400">
          {{ $t('shared.notifications.platform') }}
        </label>
        <label class="text-base font-normal text-gray-500 dark:text-gray-400">
          {{ $t('shared.notifications.email') }}
        </label>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <template v-for="notification of props.notifications" :key="notification.id">
          <div class="flex items-center justify-between py-2">
            <div class="flex flex-col flex-grow">
              <div class="text-md text-gray-900 dark:text-gray-400">
                {{ $t(notification.title) }}
              </div>
            </div>
            <AppToggle v-model="form.platform" :value="notification.id" display="" />
            <AppToggle v-model="form.email" :value="notification.id" display="" />
          </div>
        </template>
      </div>
      <div class="mt-6">
        <AppButton
          type="button"
          :color="isLoading ? 'success' : 'alternative'"
          :loading="isLoading"
          @click="onSubmit"
        >
          {{ $t('shared.update') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
