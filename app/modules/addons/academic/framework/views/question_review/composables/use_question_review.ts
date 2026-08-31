import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export function useQuestionReview() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
  })

  const updateStatus = (questionId: string, newStatus: string, callback?: () => void) => {
    state.loading = true
    router.patch(
      `/api/v1/academic/questions/${questionId}/status`,
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () => {
          if (callback) callback()
        },
        onFinish: () => {
          state.loading = false
        },
      }
    )
  }

  return {
    state,
    updateStatus,
    checkPermission,
    t,
  }
}
