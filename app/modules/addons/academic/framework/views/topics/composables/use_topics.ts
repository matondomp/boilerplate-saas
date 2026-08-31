import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useHasPermission } from '@core/composables/has_permission.js'

export interface TopicNode {
  id: string
  name: string
  subjectId: string
  subjectName?: string
  parentId?: string | null
  level: number
  children?: TopicNode[]
}

export function useTopics() {
  const { t } = useI18n()
  const { checkPermission } = useHasPermission()

  const state = reactive({
    loading: false,
    modalOpen: false,
    selectedTopic: null as TopicNode | null,
    selectedSubjectId: '',
  })

  const form = reactive({
    id: '',
    subjectId: '',
    parentId: '' as string | null,
    name: '',
  })

  const openCreateModal = (parentId: string | null = null, subjectId: string = '') => {
    state.selectedTopic = null
    form.id = ''
    form.subjectId = subjectId || state.selectedSubjectId || ''
    form.parentId = parentId
    form.name = ''
    state.modalOpen = true
  }

  const openEditModal = (topic: TopicNode) => {
    state.selectedTopic = topic
    form.id = topic.id
    form.subjectId = topic.subjectId
    form.parentId = topic.parentId || null
    form.name = topic.name
    state.modalOpen = true
  }

  const closeModal = () => {
    state.modalOpen = false
    state.selectedTopic = null
  }

  const submitForm = () => {
    state.loading = true
    if (!form.id) {
      router.post('/api/v1/academic/topics', form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    } else {
      router.put(`/api/v1/academic/topics/${form.id}`, form, {
        onSuccess: () => {
          closeModal()
        },
        onFinish: () => {
          state.loading = false
        },
      })
    }
  }

  return {
    state,
    form,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    checkPermission,
    t,
  }
}
