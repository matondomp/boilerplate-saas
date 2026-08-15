<script lang="ts" setup>
import { AppWorkInProgress, AppInput } from '../index.js'
</script>
<template>
  <AppWorkInProgress class="flex md:grid" extra>
    <div class="flex flex-col gap-4 md:gap-0 md:flex-row justify-between md:items-center w-full">
      <AppInput
        name="search"
        size="md"
        class="md:max-w-sm"
        required
        :placeholder="$t('shared.to_be_extracted')"
        model-value
      />
      <slot />
    </div>
  </AppWorkInProgress>
</template>
