import { reactive, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export interface UniversityItem {
  id: string
  name: string
  acronym: string
  status: 'ACTIVE' | 'INACTIVE'
  coursesCount?: number
  createdAt: string
  updatedAt: string
}

export function useUniversities() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    modalOpen: false,
    selectedUniversity: null as UniversityItem | null,
    search: '',
  })

  const form = reactive({
    id: '',
    name: '',
    acronym: '',
    status: 'ACTIVE',
  })

  const openCreateModal = () => {
    state.selectedUniversity = null
    form.id = ''
    form.name = ''
    form.acronym = ''
    form.status = 'ACTIVE'
    state.modalOpen = true
  }

  const openEditModal = (uni: UniversityItem) => {
    state.selectedUniversity = uni
    form.id = uni.id
    form.name = uni.name
    form.acronym = uni.acronym
    form.status = uni.status
    state.modalOpen = true
  }

  const closeModal = () => {
    state.modalOpen = false
    state.selectedUniversity = null
  }

  const submitForm = () => {
    state.loading = true
    if (!form.id) {
      router.post('/api/v1/academic/universities', form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    } else {
      router.put(`/api/v1/academic/universities/${form.id}`, form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    }
  }

  const toggleStatus = (uni: UniversityItem) => {
    const newStatus = uni.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    router.patch(`/api/v1/academic/universities/${uni.id}/status`, { status: newStatus }, {
      preserveScroll: true,
    })
  }

  const tableColumns = [
    { key: 'name', field: 'name', headerName: t('academic.university.name'), sortable: true, slot: true },
    { key: 'acronym', field: 'acronym', headerName: t('academic.university.acronym'), sortable: true, slot: true },
    { key: 'status', field: 'status', headerName: t('academic.university.status'), sortable: true, slot: true },
    { key: 'actions', actions: true } as any,
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
