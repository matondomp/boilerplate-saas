<script lang="ts" setup>
import { AppInput, AppModal } from '@core/components/index.js'

defineProps<{
  isShowModal: boolean
  closeModal: () => void
  newPassword: string
}>()
</script>

<template>
  <AppModal
    :isShowModal="isShowModal"
    :closeModal="closeModal"
    :title="$t('admin.acl.user.password.restored')"
  >
    <p class="mb-4 text-gray-900 dark:text-gray-300 text-sm">
      {{ $t('admin.acl.user.password.restored.description') }}
    </p>
    <AppInput name="new_password" :modelValue="newPassword" disabled type="text" />
  </AppModal>
</template>
