<script lang="ts" setup>
import { AuthLayout } from '../layouts/index.js'
import { AppInput, RouterLink, AppButton } from '@core/components/index.js'
import { useForm } from '@core/utilities/form/index.js'
import { SendResetPasswordLinkForm } from './types.js'
import { email, required } from '@vuelidate/validators'

const { form, v$ } = useForm<SendResetPasswordLinkForm>(
  {
    username: '',
  },
  {
    username: {
      required,
      email,
    },
  }
)
</script>

<template>
  <AuthLayout>
    <form
      class="mt-2 space-y-6"
      autocomplete="on"
      @submit.prevent="form.post('/security/auth/reset/send-mail')"
    >
      <p class="mb-6 text-sm font-normal text-gray-500 dark:text-gray-400">
        {{ $t('auth.send_reset_password.description') }}
      </p>
      <div>
        <AppInput
          name="username"
          v-model="form.model.username"
          type="email"
          :label="$t('auth.frontend.field_email')"
          placeholder="name@company.com"
          :v="v$.username"
        />
      </div>
      <div class="flex items-start">
        <RouterLink
          href="/security/auth/login"
          class="mr-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
        >
          {{ $t('auth.shared.back_login') }}
        </RouterLink>
      </div>

      <AppButton :loading="form.loading">
        {{ $t('auth.send_reset_password.send_link') }}
      </AppButton>
    </form>
  </AuthLayout>
</template>
