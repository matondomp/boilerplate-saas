<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { computed, ref, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { AppButton, AppInput } from '@core/components'

import { apiService } from '../services/api.js'
import { UserProp } from '@core/types/index.js'

const isLoading = ref(false)

const user = computed(() => usePage().props.user as UserProp)

const updateUserForm = reactive({
  firstName: user.value.firstName,
  lastName: user.value.lastName,
})

const rules = {
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
}

const $v = useVuelidate(rules, updateUserForm, { $lazy: false, $autoDirty: true })

const onSubmit = async () => {
  if (isLoading.value || $v.value.$error || !$v.value.$anyDirty) {
    return
  }

  isLoading.value = true

  const formData = new FormData()

  formData.append('firstName', updateUserForm.firstName)
  formData.append('lastName', updateUserForm.lastName)

  apiService.updateUserInfo(formData).finally(() => {
    isLoading.value = false
  })
}
</script>
<template>
  <div
    class="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-base-200"
  >
    <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('common.general_informations') }}
    </h3>
    <div class="mb-4">
      <AppInput
        name="firstName"
        v-model="updateUserForm.firstName"
        :label="$t('shared.user.first_name')"
        required
      />
    </div>
    <div class="mb-6">
      <AppInput
        name="firstName"
        v-model="updateUserForm.lastName"
        :label="$t('shared.user.last_name')"
        required
      />
    </div>
    <div>
      <AppButton
        type="button"
        color="primary"
        :loading="isLoading"
        :disabled="isLoading || $v.$error || !$v.$anyDirty"
        @click="onSubmit"
      >
        {{ $t('shared.update') }}
      </AppButton>
    </div>
  </div>
</template>
