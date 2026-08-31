<script lang="ts" setup>
import { computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, maxValue } from '@vuelidate/validators'
import {
  AppModal,
  AppInput,
  AppSelect,
  AppButton,
} from '@core/components/index.js'

interface Props {
  modelValue: boolean
  form: {
    courseId: string
    year: number
    period: string
    sourceType: string
  }
  courses: Array<{ id: string; name: string; universityName?: string }>
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const currentYear = new Date().getFullYear()

const rules = {
  courseId: { required },
  year: { required, minValue: minValue(1990), maxValue: maxValue(currentYear + 1) },
  period: { required },
}

const v$ = useVuelidate(rules, props.form)

const courseOptions = computed(() =>
  props.courses.map((c) => ({
    label: c.universityName ? `${c.name} (${c.universityName})` : c.name,
    value: c.id,
  }))
)

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  emit('submit')
}
</script>

<template>
  <AppModal
    :isShowModal="modelValue"
    :closeModal="() => emit('close')"
    :title="$t('academic.exam.new')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <AppSelect
          v-model="form.courseId"
          :label="$t('academic.course.name')"
          name="courseId"
          required
          :options="courseOptions"
          :v="v$.courseId"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <AppInput
            v-model="form.year"
            type="number"
            :label="$t('academic.exam.year')"
            name="year"
            required
            :v="v$.year"
          />
        </div>

        <div>
          <AppInput
            v-model="form.period"
            :label="$t('academic.exam.period')"
            name="period"
            required
            :v="v$.period"
            placeholder="Ex: Fase Regular / 1º Semestre"
          />
        </div>
      </div>

      <div>
        <AppSelect
          v-model="form.sourceType"
          :label="$t('academic.exam.source_type')"
          name="sourceType"
          :options="[
            { label: 'Exame Oficial de Admissão', value: 'OFFICIAL_EXAM' },
            { label: 'Simulado / Treinamento', value: 'SIMULATED' },
            { label: 'Conteúdo Original', value: 'ORIGINAL' },
          ]"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <AppButton
          type="button"
          color="alternative"
          @click="emit('close')"
        >
          {{ $t('shared.no_thanks') }}
        </AppButton>
        <AppButton
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="v$.$invalid || loading"
        >
          {{ $t('shared.update') }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
