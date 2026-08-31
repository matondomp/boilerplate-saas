<script lang="ts" setup>
import { AppInput, AppButton } from '@core/components/index.js'

export interface QuestionOptionItem {
  id?: string
  label: string
  content: string
  position: number
  isCorrect: boolean
}

interface Props {
  options: QuestionOptionItem[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:options'])

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const addOption = () => {
  if (props.options.length >= 6) return
  const nextLabel = alphabet[props.options.length] || 'X'
  const updated = [
    ...props.options,
    {
      label: nextLabel,
      content: '',
      position: props.options.length,
      isCorrect: props.options.length === 0,
    },
  ]
  emit('update:options', updated)
}

const removeOption = (index: number) => {
  if (props.options.length <= 2) return
  const updated = props.options
    .filter((_, idx) => idx !== index)
    .map((opt, idx) => ({
      ...opt,
      label: alphabet[idx] || 'X',
      position: idx,
    }))

  // If removed option was the correct one, make first option correct
  if (!updated.some((opt) => opt.isCorrect) && updated.length > 0) {
    updated[0].isCorrect = true
  }

  emit('update:options', updated)
}

const setCorrectOption = (index: number) => {
  const updated = props.options.map((opt, idx) => ({
    ...opt,
    isCorrect: idx === index,
  }))
  emit('update:options', updated)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-semibold text-gray-900 dark:text-white">
        {{ $t('academic.question.options') }} (Gabarito e Alternativas)
      </label>
      <AppButton
        v-if="options.length < 6"
        type="button"
        size="xs"
        color="alternative"
        @click="addOption"
      >
        + {{ $t('academic.question.options.add') }}
      </AppButton>
    </div>

    <div class="space-y-3">
      <div
        v-for="(option, idx) in options"
        :key="idx"
        :class="[
          'flex items-center gap-3 p-3 rounded-lg border transition',
          option.isCorrect
            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        ]"
      >
        <!-- Correct Answer Radio -->
        <button
          type="button"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition',
            option.isCorrect
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-800'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          ]"
          :title="'Definir como resposta correta (' + option.label + ')'"
          @click="setCorrectOption(idx)"
        >
          {{ option.label }}
        </button>

        <!-- Option Content Input -->
        <div class="flex-1">
          <input
            v-model="option.content"
            type="text"
            placeholder="Texto da alternativa..."
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Correct Label Indicator -->
        <span v-if="option.isCorrect" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
          Correta ✓
        </span>

        <!-- Remove Option Button -->
        <button
          v-if="options.length > 2"
          type="button"
          class="text-gray-400 hover:text-red-500 p-1 text-sm shrink-0"
          title="Remover alternativa"
          @click="removeOption(idx)"
        >
          ✕
        </button>
      </div>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      * Clique na letra da alternativa para marcá-la como o gabarito oficial.
    </p>
  </div>
</template>
