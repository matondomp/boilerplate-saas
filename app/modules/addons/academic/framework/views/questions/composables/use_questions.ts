import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export function useQuestions() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    selectedSubjectId: '',
    selectedStatus: '',
    selectedDifficulty: '',
    search: '',
  })

  const redirectToNew = () => {
    router.visit('/academic/questions/new')
  }

  const redirectToEdit = (id: string) => {
    router.visit(`/academic/questions/${id}/edit`)
  }

  const redirectToReview = (id: string) => {
    router.visit(`/academic/questions/${id}/review`)
  }

  const changeStatus = (id: string, newStatus: string) => {
    router.patch(`/api/v1/academic/questions/${id}/status`, { newStatus }, {
      preserveScroll: true,
    })
  }

  const tableColumns = [
    { key: 'statement', label: t('academic.question.statement'), sortable: false },
    { key: 'subject', label: t('academic.subject.name'), sortable: true },
    { key: 'difficulty', label: t('academic.question.difficulty'), sortable: true },
    { key: 'status', label: t('academic.question.status'), sortable: true },
    { key: 'actions', label: t('shared.actions.options'), sortable: false },
  ]

  return {
    state,
    tableColumns,
    redirectToNew,
    redirectToEdit,
    redirectToReview,
    changeStatus,
    checkPermission,
    t,
  }
}
