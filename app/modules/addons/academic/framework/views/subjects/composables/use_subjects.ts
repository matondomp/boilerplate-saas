import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export interface SubjectItem {
  id: string
  name: string
  description?: string
  courses?: Array<{ id: string; name: string }>
  topicsCount?: number
}

export function useSubjects() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    modalOpen: false,
    selectedSubject: null as SubjectItem | null,
  })

  const form = reactive({
    id: '',
    name: '',
    description: '',
    courseIds: [] as string[],
  })

  const openCreateModal = () => {
    state.selectedSubject = null
    form.id = ''
    form.name = ''
    form.description = ''
    form.courseIds = []
    state.modalOpen = true
  }

  const openEditModal = (subject: SubjectItem) => {
    state.selectedSubject = subject
    form.id = subject.id
    form.name = subject.name
    form.description = subject.description || ''
    form.courseIds = subject.courses ? subject.courses.map((c) => c.id) : []
    state.modalOpen = true
  }

  const closeModal = () => {
    state.modalOpen = false
    state.selectedSubject = null
  }

  const submitForm = () => {
    state.loading = true
    if (!form.id) {
      router.post('/api/v1/academic/subjects', form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    } else {
      router.put(`/api/v1/academic/subjects/${form.id}`, form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    }
  }

  const tableColumns = [
    { key: 'name', label: t('academic.subject.name'), sortable: true },
    { key: 'description', label: t('academic.subject.description'), sortable: false },
    { key: 'courses', label: t('academic.subject.used_by_courses'), sortable: false },
    { key: 'actions', label: t('shared.actions.options'), sortable: false },
  ]

  return {
    state,
    form,
    tableColumns,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    checkPermission,
    t,
  }
}
