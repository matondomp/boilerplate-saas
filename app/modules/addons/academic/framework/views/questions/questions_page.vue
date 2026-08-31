<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import {
  AppTable,
  AppButton,
  AppFilter,
  AppSelect,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useQuestions } from './composables/use_questions.js'
import AppQuestionStatusBadge from './components/app_question_status_badge.vue'
import { router } from '@inertiajs/vue3'

interface Props {
  content: {
    data: any[]
    pagination: any
  }
  subjects: Array<{ id: string; name: string }>
}

const props = defineProps<Props>()

const {
  state,
  tableColumns,
  redirectToNew,
  redirectToEdit,
  redirectToReview,
  checkPermission,
} = useQuestions()

const questions = computed(() => props.content?.data || [])
const isReviewList = computed(() => {
  if (typeof window === 'undefined') return false
  return window.location.pathname.includes('/questions/review')
})
const pagination = computed(() => props.content?.pagination || {})

const subjectFilterOptions = computed(() => [
  { label: 'Todas as Disciplinas', value: '' },
  ...props.subjects.map((s) => ({ label: s.name, value: s.id })),
])

const difficultyFilterOptions = computed(() => [
  { label: 'Todas as Dificuldades', value: '' },
  { label: 'Fácil', value: 'EASY' },
  { label: 'Média', value: 'MEDIUM' },
  { label: 'Difícil', value: 'HARD' },
  { label: 'Muito Difícil', value: 'EXPERT' },
])

const statusFilterOptions = computed(() => [
  { label: 'Todos os Estados', value: '' },
  { label: 'Pendentes de Moderação', value: 'PENDING_MODERATION' },
  { label: 'Rascunho (Draft)', value: 'DRAFT' },
  { label: 'Em Processamento', value: 'PROCESSING' },
  { label: 'Processado por IA', value: 'AI_PROCESSED' },
  { label: 'Em Revisão', value: 'UNDER_REVIEW' },
  { label: 'Aprovado', value: 'APPROVED' },
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Rejeitado', value: 'REJECTED' },
  { label: 'Arquivado', value: 'ARCHIVED' },
])

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  state.selectedSubjectId = params.get('subjectId') || ''
  state.selectedDifficulty = params.get('difficulty') || ''
  
  const isReviewList = window.location.pathname.includes('/questions/review')
  state.selectedStatus = params.get('status') || (isReviewList ? 'PENDING_MODERATION' : '')
})

const applyFilters = () => {
  const params = new URLSearchParams(window.location.search)
  
  if (state.selectedSubjectId) {
    params.set('subjectId', state.selectedSubjectId)
  } else {
    params.delete('subjectId')
  }
  
  if (state.selectedDifficulty) {
    params.set('difficulty', state.selectedDifficulty)
  } else {
    params.delete('difficulty')
  }
  
  if (state.selectedStatus) {
    params.set('status', state.selectedStatus)
  } else {
    params.delete('status')
  }
  
  params.delete('page')
  router.visit(window.location.pathname + '?' + params.toString(), { preserveState: true })
}

const handleFilterUpdated = (queryString: string) => {
  const newParams = new URLSearchParams(queryString)
  const currentParams = new URLSearchParams(window.location.search)
  
  if (newParams.has('statement')) {
    currentParams.set('statement', newParams.get('statement')!)
  } else {
    currentParams.delete('statement')
  }
  
  currentParams.delete('page')
  router.visit(window.location.pathname + '?' + currentParams.toString(), { preserveState: true })
}
</script>

<template>
  <AccountLayout
    :title="isReviewList ? $t('menu.academic.reviews') : $t('menu.academic.questions')"
    :b-t="isReviewList ? $t('menu.academic.reviews') : $t('menu.academic.questions')"
    :b-d="isReviewList ? $t('menu.academic.reviews.description') : $t('menu.academic.questions.description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        <div class="flex flex-col lg:flex-row lg:justify-between items-stretch lg:items-center gap-4">
          <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div class="w-full sm:w-72">
              <AppFilter
                :filters="[
                  { field: 'statement', name: $t('academic.question.statement') },
                ]"
                @filter-updated="handleFilterUpdated"
              />
            </div>
            <div class="w-full sm:w-48">
              <AppSelect
                v-model="state.selectedSubjectId"
                placeholder="Filtrar por Disciplina"
                :options="subjectFilterOptions"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="w-full sm:w-40">
              <AppSelect
                v-model="state.selectedDifficulty"
                placeholder="Dificuldade"
                :options="difficultyFilterOptions"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="w-full sm:w-40">
              <AppSelect
                v-model="state.selectedStatus"
                placeholder="Estado"
                :options="statusFilterOptions"
                @update:model-value="applyFilters"
              />
            </div>
          </div>
          <div class="w-full lg:w-auto shrink-0">
            <AppButton
              :classes="'w-full'"
              color="primary"
              :disabled="!checkPermission('academic-questions-manage')"
              @click="redirectToNew"
            >
              {{ $t('academic.question.new') }}
            </AppButton>
          </div>
        </div>
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="questions"
        :pagination="pagination"
      >
        <template #statement="{ row }">
          <div class="font-medium text-gray-900 dark:text-white line-clamp-2 max-w-lg">
            {{ row.statement }}
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span v-if="row.sourceMetadata?.isAiGenerated" class="text-2xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
              IA ({{ Math.round((row.sourceMetadata?.aiConfidenceScore || 0) * 100) }}%)
            </span>
            <span class="text-xs text-gray-400">v{{ row.version || 1 }}</span>
          </div>
        </template>

        <template #subject="{ row }">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ row.subjectName || '—' }}
          </span>
          <br />
          <span class="text-xs text-gray-400">
            {{ row.topicName || '' }}
          </span>
        </template>

        <template #difficulty="{ row }">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
              row.difficulty === 'EASY' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' :
              row.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
              'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            ]"
          >
            {{ row.difficulty }}
          </span>
        </template>

        <template #status="{ row }">
          <AppQuestionStatusBadge :status="row.status" />
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-questions-manage')"
              @click="redirectToEdit(row.id)"
            >
              {{ $t('shared.edit') }}
            </button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <button
              class="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-questions-review')"
              @click="redirectToReview(row.id)"
            >
              {{ $t('academic.question.review') }}
            </button>
          </div>
        </template>
      </AppTable>
    </template>
  </AccountLayout>
</template>
