<script lang="ts" setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import {
  CommonUpdatePassword,
  CommonUploadAvatar,
  CommonUpdateGeneralInfo,
  CommonUpdateLanguageAndTimezone,
  CommonUpdateCustomNotifications,
} from './components/index.js'

import { AccountLayout } from '@core/layouts/index.js'

const props = computed(() => ({
  activeNotifications: usePage().props.activeNotifications as any[],
  notifications: usePage().props.notifications as any[],
  timezones: usePage().props.timezones as any[],
}))
</script>
<template>
  <AccountLayout
    :title="$t('menu.settings')"
    :b-t="$t('menu.settings')"
    :b-d="$t('menu.settings.subtitle')"
  >
    <template #body>
      <main>
        <div class="grid grid-cols-1 xl:grid-cols-3 xl:gap-4">
          <div class="col-span-full xl:col-auto">
            <CommonUploadAvatar />
            <CommonUpdateGeneralInfo />
            <CommonUpdateLanguageAndTimezone :timezones="props.timezones" />
          </div>
          <div class="col-span-2">
            <CommonUpdatePassword />
            <CommonUpdateCustomNotifications
              :notifications="props.notifications"
              :active-notifications="props.activeNotifications"
            />
          </div>
        </div>
      </main>
    </template>
  </AccountLayout>
</template>
