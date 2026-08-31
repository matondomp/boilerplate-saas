<script lang="ts" setup>
import { computed } from 'vue'
import {
  AppTextarea,
  AppSelect,
  AppInput,
  AppButton,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useQuestionEditor } from './composables/use_question_editor.js'
import AppQuestionOptionsEditor from './components/app_question_options_editor.vue'

interface Props {
  question?: any
  subjects: Array<{ id: string; name: string }>
  topics: Array<{ id: string; name: string; subjectId: string }>
  exams: Array<{ id: string; year: number; period: string; courseName?: string }>
}

const props = defineProps<Props>()

const { form, state, save } = useQuestionEditor(props.question)

const isEditing = computed(() => !!form.id)

const subjectOptions = computed(() =>
  props.subjects.map((s) => ({ label: s.name, value: s.id }))
)

const filteredTopics = computed(() => {
  if (!form.subjectId) return []
  return props.topics
    .filter((t) => t.subjectId === form.subjectId)
    .map((t) => ({ label: t.name, value: t.id }))
})

const examOptions = computed(() => [
  { label: 'Nenhum (Questão Avulsa / Original)', value: '' },
  ...props.exams.map((e) => ({
    label: `${e.courseName || 'Exame'} — ${e.year} (${e.period})`,
    value: e.id,
  })),
])
</script>

<template>
  <AccountLayout
    :title="isEditing ? $t('academic.question.edit') : $t('academic.question.new')"
    :b-t="isEditing ? $t('academic.question.edit') : $t('academic.question.new')"
    b-d="Editor estruturado de itens de avaliação com gabarito e resolução"
  >
    <template #body>
      <form class="space-y-6 max-w-4xl mx-auto pb-12" @submit.prevent="save">
        <!-- Bloco 1: Metadados Curriculares -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">
            1. Metadados e Classificação
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AppSelect
                v-model="form.subjectId"
                :label="$t('academic.subject.name')"
                name="subjectId"
                required
                :options="subjectOptions"
              />
            </div>

            <div>
              <AppSelect
                v-model="form.topicId"
                :label="$t('academic.topic.name')"
                name="topicId"
                required
                :options="filteredTopics"
              />
            </div>

            <div>
              <AppSelect
                v-model="form.difficulty"
                :label="$t('academic.question.difficulty')"
                name="difficulty"
                :options="[
                  { label: $t('academic.question.difficulty.easy'), value: 'EASY' },
                  { label: $t('academic.question.difficulty.medium'), value: 'MEDIUM' },
                  { label: $t('academic.question.difficulty.hard'), value: 'HARD' },
                  { label: $t('academic.question.difficulty.expert'), value: 'EXPERT' },
                ]"
              />
            </div>

            <div>
              <AppSelect
                v-model="form.examId"
                :label="$t('academic.exam.title')"
                name="examId"
                :options="examOptions"
              />
            </div>
          </div>
        </div>

        <!-- Bloco 2: Enunciado da Questão -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">
            2. Enunciado
          </h2>

          <div>
            <AppTextarea
              v-model="form.statement"
              :label="$t('academic.question.statement')"
              name="statement"
              required
              :rows="5"
              placeholder="Digite o enunciado completo da questão..."
            />
          </div>
        </div>

        <!-- Bloco 3: Alternativas e Gabarito -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">
            3. Alternativas & Gabarito
          </h2>

          <AppQuestionOptionsEditor
            v-model:options="form.options"
          />
        </div>

        <!-- Bloco 4: Resolução e Explicação Pedagógica -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">
            4. Resolução & Explicação Didática
          </h2>

          <div>
            <AppTextarea
              v-model="form.solution"
              :label="$t('academic.question.solution')"
              name="solution"
              :rows="3"
              placeholder="Passo a passo detalhado do cálculo ou raciocínio..."
            />
          </div>

          <div>
            <AppTextarea
              v-model="form.explanation"
              :label="$t('academic.question.explanation')"
              name="explanation"
              :rows="3"
              placeholder="Fundamentação teórica adicional e conceitos abordados..."
            />
          </div>

          <div v-if="isEditing">
            <AppInput
              v-model="form.reason"
              label="Justificativa da Alteração (Histórico de Revisão)"
              name="reason"
              required
              placeholder="Ex: Correção ortográfica no enunciado da alternativa B"
            />
          </div>
        </div>

        <!-- Barra de Ações -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <AppButton
            type="button"
            color="alternative"
            @click="$inertia.visit('/academic/questions')"
          >
            {{ $t('shared.no_thanks') }}
          </AppButton>

          <AppButton
            type="submit"
            color="primary"
            :loading="state.loading"
          >
            {{ isEditing ? $t('academic.question.updated') : $t('academic.question.created') }}
          </AppButton>
        </div>
      </form>
    </template>
  </AccountLayout>
</template>
