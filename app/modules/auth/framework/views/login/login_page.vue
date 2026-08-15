<script lang="ts" setup>
import { LoginProp } from './types.js'
import { AuthLayout } from '../layouts/index.js'
import { useForm } from '@core/utilities/form/index.js'
import { AppInput, AppCheckbox, RouterLink, AppButton } from '@core/components/index.js'
import { required, minLength, email } from '@vuelidate/validators'

const { form, v$ } = useForm<LoginProp>(
  {
    username: '',
    password: '',
    rememberMe: false,
  },
  {
    username: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
    rememberMe: {
      required,
    },
  }
)
</script>

<template>
  <AuthLayout>
    <form
      class="mt-3 md:mt-2 space-y-4"
      @submit.prevent="form.post('/security/auth/login')"
      autocomplete="off"
    >
      <div>
        <AppInput
          v-model="form.model.username"
          name="username"
          required
          type="email"
         
          placeholder="name@company.com"
          :v="v$.username"
        />
        <!--  :label="$t('auth.frontend.field_email')" -->
      </div>
      <div>
        <AppInput
          v-model="form.model.password"
          name="password"
          type="password"
          required
          autocomplete="current-password"
          :minlength="8"
          
          :v="v$.password"
        />
        <!-- :label="$t('auth.frontend.field_password')" -->
      </div> 
   <!--    <div
        class="flex mb-2 md:mb-0 md:items-center flex-col-reverse md:flex-row md:justify-between"
      >
        <AppCheckbox
          class="hidden sm:flex justify-start"
          value="remember_me"
          v-model="form.model.rememberMe"
          :display="$t('auth.frontend.remember_me')"
        />
        <RouterLink href="/security/auth/reset/password" class="link link-hover text-sm">
          {{ $t('auth.frontend.forget_password_link') }}
        </RouterLink>
      </div> -->
      <AppButton color="primary" class="w-full " :loading="form.loading">
        {{ $t('auth.frontend.login') }}
      </AppButton>
    </form>
  </AuthLayout>
</template>
