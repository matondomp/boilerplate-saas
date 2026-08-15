<script lang="ts" setup>
import { AppInput, AppButton } from '@core/components/index.js'

import { AuthLayout } from '../layouts/index.js'
import { useForm } from '@core/utilities/form/index.js'
import { ResetPasswordForm, TokenProps } from './types.js'
import { minLength, required } from '@vuelidate/validators'

const props = defineProps<TokenProps>()

const { form, v$ } = useForm<ResetPasswordForm>(
  {
    password: '',
    confirmPassword: '',
    token: props.token,
  },
  {
    password: {
      required,
      minLength: minLength(8),
    },
    confirmPassword: {
      required,
      sameAsPassword: 'password',
    },
    token: {
      required,
    },
  }
)
</script>

<template>
  <AuthLayout>
    <form
      class="mt-2 space-y-6"
      autocomplete="off"
      @submit.prevent="form.post('/security/auth/reset/password')"
    >
      <p class="mb-6 text-sm font-normal text-gray-500 dark:text-gray-400">
        {{ $t('auth.reset_password.description') }}
      </p>
      <input type="hidden" name="username" autocomplete="username" />
      <div>
        <AppInput
          name="password"
          v-model="form.model.password"
          type="password"
          autocomplete="new-password"
          :label="$t('auth.reset_password.new_password')"
          required
          :min-length="8"
          :v="v$.password"
        />
      </div>
      <div>
        <AppInput
          name="confirm_password"
          v-model="form.model.confirmPassword"
          type="password"
          autocomplete="confirm-password"
          :label="$t('auth.reset_password.confirm_password')"
          required
          :v="v$.confirmPassword"
        />
      </div>
      <AppButton :loading="form.loading" class="w-full">
        {{ $t('auth.reset_password.button_label') }}
      </AppButton>
    </form>
  </AuthLayout>
</template>
