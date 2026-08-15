<script setup lang="ts">
import { AppAlertStandalone as AppAlert } from '../index.js'
</script>
<template>
  <AppAlert type="warning" class="mb-4" icon>
    <span class="ml-2">
      {{ $t('shared.feat_beta') }}
    </span>
  </AppAlert>
</template>
