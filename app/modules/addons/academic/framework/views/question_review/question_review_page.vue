<script lang="ts" setup>
import { computed } from 'vue'
import {
  AppButton,
  AppAlertStandalone,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useQuestionReview } from './composables/use_question_review.js'
import AppQuestionPreviewCard, { type QuestionPreviewData } from '../questions/components/app_question_preview_card.vue'

interface Props {
  question: QuestionPreviewData
  revisions?: Array<{
    revisionNumber: number
    authorName?: string
    reason: string
    createdAt: string
  }>
}

const props = defineProps<Props>()

const { state, updateStatus, checkPermission } = useQuestionReview()

const question = computed(() => props.question)
const revisions = computed(() => props.revisions || [])

const handleApprove = () => {
  updateStatus(props.question.id, 'APPROVED')
}

const handleReject = () => {
  updateStatus(props.question.id, 'DRAFT')
}

const handlePublish = () => {
  updateStatus(props.question.id, 'PUBLISHED')
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.reviews')"
    :b-t="$t('menu.academic.reviews')"
    :b-d="$t('menu.academic.reviews.description')"
  >
    <template #body>
      <div class="max-w-4xl mx-auto space-y-6 pb-12">
        <!-- Review Action Header Card -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">
              Painel do Revisor Humano
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Valide o enunciado, gabarito e resolução antes de aprovar ou publicar.
            </p>
          </div>

          <!-- Moderation Buttons based on current status -->
          <div class="flex items-center gap-3">
            <AppButton
              v-if="question.status === 'UNDER_REVIEW' || question.status === 'APPROVED' || question.status === 'PUBLISHED'"
              type="button"
              color="alternative"
              :disabled="!checkPermission('academic-questions-review') || state.loading"
              @click="handleReject"
            >
              {{ $t('academic.question.reject') }}
            </AppButton>

            <AppButton
              v-if="question.status === 'UNDER_REVIEW' || question.status === 'DRAFT'"
              type="button"
              color="primary"
              :loading="state.loading"
              :disabled="!checkPermission('academic-questions-review')"
              @click="handleApprove"
            >
              {{ $t('academic.question.approve') }}
            </AppButton>

            <AppButton
              v-if="question.status === 'APPROVED'"
              type="button"
              color="primary"
              :loading="state.loading"
              :disabled="!checkPermission('academic-questions-manage')"
              @click="handlePublish"
            >
              {{ $t('academic.question.publish') }}
            </AppButton>
          </div>
        </div>

        <!-- Question Preview (Student Experience Simulation) -->
        <AppQuestionPreviewCard
          :question="question"
        />

        <!-- Revisions History Timeline -->
        <div v-if="revisions.length > 0" class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">
            Histórico de Revisões e Auditoria
          </h3>

          <div class="space-y-3">
            <div
              v-for="rev in revisions"
              :key="rev.revisionNumber"
              class="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-850 text-xs"
            >
              <div>
                <span class="font-bold text-gray-900 dark:text-white">Revisão #{{ rev.revisionNumber }}</span>
                <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ rev.reason }}</p>
                <span class="text-2xs text-gray-400">Por {{ rev.authorName || 'Revisor' }}</span>
              </div>
              <span class="text-gray-400 font-mono">{{ rev.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AccountLayout>
</template>
