<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useForm } from '@core/utilities/form/index.js'
import { Language } from '@core/components/app_languages/types.js'
import { AppBeta, AppSelect, AppButton } from '@core/components/index.js'
import { required } from '@vuelidate/validators'
import { apiService } from '../services/api'
import { UserProp } from '@core/types/index.js'

const languagues = computed(() => usePage().props.i18n as Language[])
const user = computed(() => usePage().props.user as UserProp)

const isLoading = ref(false)

const { v$, form } = useForm(
  {
    language: user.value.defaultLang,
    timezone: user.value.timezone,
  },
  {
    language: {
      required,
      $autoDirty: true,
    },
    timezone: {
      required,
      $autoDirty: true,
    },
  }
)

const listOfLanguages = languagues.value.map((l: Language) => ({
  value: l.key,
  name: l.display,
}))

type Props = {
  timezones: string[]
}

const props = defineProps<Props>()

const listOfTimezones = props.timezones.map((t) => ({
  value: t,
  name: t,
}))

function onSubmit() {
  if (isLoading.value || v$.value.$invalid || !v$.value.$anyDirty) {
    return
  }

  const formData = new FormData()
  formData.append('firstName', user.value.firstName)
  formData.append('lastName', user.value.lastName)
  formData.append('defaultLang', form.value.model.language)
  formData.append('timezone', form.value.model.timezone)

  apiService.updateUserInfo(formData).finally(() => {
    isLoading.value = false
  })
}
</script>
<template>
  <div
    class="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-base-200"
  >
    <AppBeta />
    <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('shared.language_and_timezone') }}
    </h3>
    <div class="mb-4">
      <AppSelect
        v-model="form.model.language"
        :label="$t('common.select_language')"
        :options="listOfLanguages"
      />
    </div>
    <div class="mb-6">
      <AppSelect
        v-model="form.model.timezone"
        :label="$t('common.select_timezone')"
        :options="listOfTimezones"
      />
    </div>
    <div>
      <AppButton
        size="md"
        :disabled="v$.$invalid || !v$.$anyDirty"
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ $t('shared.update') }}
      </AppButton>
    </div>
  </div>
</template>
