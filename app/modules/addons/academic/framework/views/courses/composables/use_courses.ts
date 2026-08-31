import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export interface CourseItem {
  id: string
  name: string
  universityId: string
  universityName?: string
  academicUnitId?: string
  academicUnitName?: string
  status: 'ACTIVE' | 'INACTIVE'
}

export function useCourses() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    modalOpen: false,
    selectedCourse: null as CourseItem | null,
    selectedUniversityId: '',
  })

  const form = reactive({
    id: '',
    name: '',
    universityId: '',
    academicUnitId: '',
    status: 'ACTIVE',
  })

  const openCreateModal = () => {
    state.selectedCourse = null
    form.id = ''
    form.name = ''
    form.universityId = state.selectedUniversityId || ''
    form.academicUnitId = ''
    form.status = 'ACTIVE'
    state.modalOpen = true
  }

  const openEditModal = (course: CourseItem) => {
    state.selectedCourse = course
    form.id = course.id
    form.name = course.name
    form.universityId = course.universityId
    form.academicUnitId = course.academicUnitId || ''
    form.status = course.status
    state.modalOpen = true
  }

  const closeModal = () => {
    state.modalOpen = false
    state.selectedCourse = null
  }

  const submitForm = () => {
    state.loading = true
    if (!form.id) {
      router.post('/api/v1/academic/courses', form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    } else {
      router.put(`/api/v1/academic/courses/${form.id}`, form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    }
  }

  const toggleStatus = (course: CourseItem) => {
    const newStatus = course.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    router.patch(`/api/v1/academic/courses/${course.id}/status`, { status: newStatus }, {
      preserveScroll: true,
    })
  }

  const tableColumns = [
    { key: 'name', label: t('academic.course.name'), sortable: true },
    { key: 'university', label: t('academic.course.university'), sortable: true },
    { key: 'academic_unit', label: t('academic.course.academic_unit'), sortable: false },
    { key: 'status', label: t('shared.status'), sortable: true },
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
    toggleStatus,
    checkPermission,
    t,
  }
}
