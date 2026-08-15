import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePage } from '@inertiajs/vue3'

import { Alert } from '@core/types/index.js'
import type { ValidationError } from './types.js'

export const useValidation = () => {
  const { t } = useI18n()
  const alert = computed(() => usePage().props.alert as Alert<ValidationError[]>)

  const validationResult = (name: string): string | undefined => {
    if (!alert.value) return

    if (!alert.value.success) return

    const error = alert.value.message.find((r) => r.field === name)

    if (!error) return

    return t(error.message)
  }

  return {
    validationResult,
  }
}
