import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import type { QuestionOptionItem } from '../components/app_question_options_editor.vue'

export function useQuestionEditor(initialData?: any) {
  const { t } = useI18n()

  const form = reactive({
    id: initialData?.id || '',
    version: initialData?.version || 1,
    statement: initialData?.statement || '',
    subjectId: initialData?.subjectId || '',
    topicId: initialData?.topicId || '',
    difficulty: initialData?.difficulty || 'MEDIUM',
    type: initialData?.type || 'SINGLE_CHOICE',
    source: initialData?.source || 'OFFICIAL_EXAM',
    examId: initialData?.examId || '',
    solution: initialData?.solution || '',
    explanation: initialData?.explanation || '',
    reason: '',
    options: (initialData?.options || [
      { label: 'A', content: '', position: 0, isCorrect: true },
      { label: 'B', content: '', position: 1, isCorrect: false },
      { label: 'C', content: '', position: 2, isCorrect: false },
      { label: 'D', content: '', position: 3, isCorrect: false },
    ]) as QuestionOptionItem[],
  })

  const state = reactive({
    loading: false,
  })

  const save = () => {
    state.loading = true
    if (!form.id) {
      router.post('/api/v1/academic/questions', form, {
        onSuccess: () => {
          router.visit('/academic/questions')
        },
        onFinish: () => {
          state.loading = false
        },
      })
    } else {
      router.put(`/api/v1/academic/questions/${form.id}`, form, {
        onSuccess: () => {
          router.visit('/academic/questions')
        },
        onFinish: () => {
          state.loading = false
        },
      })
    }
  }

  return {
    form,
    state,
    save,
    t,
  }
}
