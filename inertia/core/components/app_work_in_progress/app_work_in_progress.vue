<script setup lang="ts">
import { AppAlertStandalone as AppAlert } from '../app_alert'
defineProps<{ extra?: boolean }>()
</script>
<template>
  <AppAlert type="error" class="mb-4" :icon="!extra" outline full>
    <template v-if="extra" #icon>
      <svg
        class="flex-shrink-0 w-4 h-4 mr-2 mb-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <span class="sr-only">Info</span>
    </template>
    <template v-if="extra" #default>
      <div class="flex flex-col w-full">
        <span class="mb-3 text-sm">
          {{ $t('shared.not_avaliable_right_now') }}
        </span>
        <slot />
      </div>
    </template>
    <span v-if="!extra">
      {{ $t('shared.not_avaliable_right_now') }}
    </span>
  </AppAlert>
</template>
