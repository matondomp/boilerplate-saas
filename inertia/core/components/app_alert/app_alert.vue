<script lang="ts" setup>
import AppAlertStandalone from './app_alert_standalone.vue'
import { usePage } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import { Alert } from './types.js'

const alertProps = computed(() => usePage().props.alert as Alert)

const reRenderComponent = ref(false)

watch(alertProps, () => {
  if (alertProps.value) {
    reRenderComponent.value = true

    setTimeout(() => {
      reRenderComponent.value = false
    }, 100)
  }
})
</script>
<template>
  <template v-if="alertProps && !alertProps.successWithModal && !reRenderComponent">
    <AppAlertStandalone :type="alertProps.success ? 'success' : 'error'" icon border>
      <template v-if="Array.isArray(alertProps.message)">
        <ul class="max-w-lg space-y-1 text-gray-500 dark:text-gray-400">
          <li v-for="message of alertProps.message" :key="message">
            {{ $t(message) }}
          </li>
        </ul>
      </template>
      <span v-else> {{ $t(alertProps.message) }}</span>
    </AppAlertStandalone>
  </template>
</template>
