<script lang="ts" setup>
import { computed } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'

import { AppFooter, RouterLink, AppAlertStandalone as AppAlert } from '@core/components/index.js'
import { Alert, AppHeaderProp } from '@core/types/index.js'

const headers = computed(() => usePage().props.headers as AppHeaderProp)
const alert = computed(() => usePage().props.alertGlobal as Alert)

const env = computed(() => usePage().props.env)
</script>

<template>
  <Head :title="headers.appName" />

  <AppAlert
    v-if="env !== 'LOCAL'"
    class="rounded-none relative md:absolute"
    :type="env === 'PRODUCTION' ? 'error' : 'warning'"
    icon
  >
    {{ env === 'PRODUCTION' ? $t('shared.inProduction') : $t('shared.inStaging') }}
  </AppAlert>
  <div class="md:h-screen md:grid grid-cols-2">
    <div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0">
      <RouterLink
        href="/security/auth/login"
        class="app-logo flex items-center justify-center mb-4 text-3xl md:text-4xl font-semibold dark:text-white"
      >
        <img src="/assets/imgs/logo.png" class="h-12 object-contain" alt="NEXA" />
      </RouterLink>
      <p class="mb-6 text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400">
      </p>
      <div class="w-full p-6 rounded-lg md:w-[400px]">
        <AppAlert v-if="alert" :type="alert.success ? 'success' : 'error'" icon>
          {{ alert.message }}
        </AppAlert>
        <slot />
      </div>
      <AppFooter center-text />
    </div>
    <div class="bg-[url('/assets/imgs/login_bg.jpg')] bg-cover bg-center hidden md:block"></div>
  </div>
</template>
