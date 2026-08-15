<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required, sameAs } from '@vuelidate/validators'

import { AppInput, AppButton } from '~/core/components'
import { apiService } from '../services/api.js'

const isLoading = ref()

const updatePasswordForm = reactive({
  newPassword: '',
  confirmPassword: '',
  currentPassword: '',
})

const rules = computed(() => ({
  newPassword: {
    required,
    minLength: minLength(8),
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(updatePasswordForm.newPassword),
  },
  currentPassword: {
    required,
    minLength: minLength(8),
  },
}))

const $v = useVuelidate(rules, updatePasswordForm, { $lazy: false, $autoDirty: true })

const validateForm = (column: string) => {
  return $v.value[column].$dirty ? ($v.value[column].$error ? 'error' : 'success') : undefined
}

const onSubmit = async () => {
  if (isLoading.value || !$v.value.$dirty || $v.value.$error) {
    return
  }

  isLoading.value = true
  apiService
    .updatePassword({
      newPassword: updatePasswordForm.newPassword,
      confirmPassword: updatePasswordForm.confirmPassword,
      currentPassword: updatePasswordForm.currentPassword,
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <div
    class="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-base-200"
  >
    <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('shared.password_information') }}
    </h3>
    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-6 gap-6">
        <div class="col-span-6 sm:col-span-3">
          <AppInput
            name="currentPassword"
            type="password"
            v-model="updatePasswordForm.currentPassword"
            placeholder="••••••••"
            :label="$t('shared.old.password')"
            required
          />
        </div>
        <div class="col-span-6 sm:col-span-3">
          <AppInput
            name="newPassword"
            type="password"
            v-model="updatePasswordForm.newPassword"
            placeholder="••••••••"
            :label="$t('shared.new.password')"
            required
            autocomplete="off"
          />
        </div>
        <div class="col-span-6 sm:col-span-3">
          <AppInput
            name="confirmPassword"
            type="password"
            v-model="updatePasswordForm.confirmPassword"
            placeholder="••••••••"
            :label="$t('shared.confirm.new.password')"
            required
            autocomplete="off"
          />
        </div>
        <div class="col-span-6 sm:col-full">
          <AppButton
            :color="isLoading ? 'success' : 'alternative'"
            :loading="isLoading"
            :disabled="isLoading || !$v.$dirty || $v.$error"
          >
            {{ $t('shared.update') }}
          </AppButton>
        </div>
      </div>
    </form>
  </div>
</template>
