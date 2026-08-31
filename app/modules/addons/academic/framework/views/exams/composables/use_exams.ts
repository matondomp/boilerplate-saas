import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export interface ExamItem {
  id: string
  courseId: string
  courseName?: string
  universityName?: string
  year: number
  period: string
  sourceType: string
  status: 'DRAFT' | 'PROCESSING' | 'READY' | 'ARCHIVED'
  questionsCount?: number
  documentUrl?: string
}

export function useExams() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    createModalOpen: false,
    uploadModalOpen: false,
    selectedExam: null as ExamItem | null,
  })

  const form = reactive({
    id: '',
    courseId: '',
    year: new Date().getFullYear(),
    period: 'Fase Regular',
    sourceType: 'OFFICIAL_EXAM',
    documentUrl: '',
  })

  const openCreateModal = () => {
    state.selectedExam = null
    form.id = ''
    form.courseId = ''
    form.year = new Date().getFullYear()
    form.period = 'Fase Regular'
    form.sourceType = 'OFFICIAL_EXAM'
    form.documentUrl = ''
    state.createModalOpen = true
  }

  const openEditModal = (exam: ExamItem) => {
    state.selectedExam = exam
    form.id = exam.id
    form.courseId = exam.courseId
    form.year = exam.year
    form.period = exam.period
    form.sourceType = exam.sourceType
    form.documentUrl = exam.documentUrl || ''
    state.createModalOpen = true
  }

  const openUploadModal = (exam: ExamItem) => {
    state.selectedExam = exam
    state.uploadModalOpen = true
  }

  const closeModals = () => {
    state.createModalOpen = false
    state.uploadModalOpen = false
    state.selectedExam = null
  }

  const submitCreateForm = () => {
    state.loading = true
    const url = form.id ? `/api/v1/academic/exams/${form.id}` : '/api/v1/academic/exams'
    const method = form.id ? 'put' : 'post'
    router[method](url, form, {
      onSuccess: () => {
        closeModals()
      },
      onFinish: () => {
        state.loading = false
      },
    })
  }

  const tableColumns = [
    { key: 'title', label: t('academic.exam.title'), sortable: true },
    { key: 'course', label: t('academic.course.name'), sortable: true },
    { key: 'year_period', label: `${t('academic.exam.year')} / ${t('academic.exam.period')}`, sortable: true },
    { key: 'questions_count', label: t('academic.exam.questions_count'), sortable: true },
    { key: 'status', label: t('shared.status'), sortable: true },
    { key: 'actions', label: t('shared.actions.options'), sortable: false },
  ]

  return {
    state,
    form,
    tableColumns,
    openCreateModal,
    openEditModal,
    openUploadModal,
    closeModals,
    submitCreateForm,
    checkPermission,
    t,
  }
}
