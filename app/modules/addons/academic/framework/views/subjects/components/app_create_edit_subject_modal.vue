<script lang="ts" setup>
import { computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import {
  AppModal,
  AppInput,
  AppTextarea,
  AppSelect,
  AppButton,
} from '@core/components/index.js'

interface Props {
  modelValue: boolean
  form: {
    id: string
    name: string
    description?: string
    courseIds: string[]
  }
  courses: Array<{ id: string; name: string }>
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const rules = {
  name: { required, minLength: minLength(3) },
}

const v$ = useVuelidate(rules, props.form)

const isEditing = computed(() => !!props.form.id)

const courseOptions = computed(() =>
  props.courses.map((c) => ({ label: c.name, value: c.id }))
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
    :title="isEditing ? $t('academic.subject.edit') : $t('academic.subject.new')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <AppInput
          v-model="form.name"
          :label="$t('academic.subject.name')"
          name="name"
          required
          :v="v$.name"
          placeholder="Ex: Matemática"
        />
      </div>

      <div>
        <AppTextarea
          v-model="form.description"
          :label="$t('academic.subject.description')"
          name="description"
          :rows="3"
          placeholder="Descrição curricular da disciplina"
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
