<script lang="ts" setup>
import { computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import {
  AppModal,
  AppInput,
  AppSelect,
  AppButton,
} from '@core/components/index.js'

interface Props {
  modelValue: boolean
  form: {
    id: string
    subjectId: string
    parentId: string | null
    name: string
  }
  subjects: Array<{ id: string; name: string }>
  parentTopics: Array<{ id: string; name: string; subjectId: string }>
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const rules = {
  name: { required, minLength: minLength(2) },
  subjectId: { required },
}

const v$ = useVuelidate(rules, props.form)

const isEditing = computed(() => !!props.form.id)

const subjectOptions = computed(() =>
  props.subjects.map((s) => ({ label: s.name, value: s.id }))
)

const parentOptions = computed(() => {
  const filtered = props.parentTopics.filter(
    (t) => t.subjectId === props.form.subjectId && t.id !== props.form.id
  )
  return [
    { label: 'Nenhum (Tópico Raiz / Nível 1)', value: '' },
    ...filtered.map((t) => ({ label: t.name, value: t.id })),
  ]
})

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
    :title="isEditing ? $t('academic.topic.edit') : $t('academic.topic.new')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <AppSelect
          v-model="form.subjectId"
          :label="$t('academic.topic.subject')"
          name="subjectId"
          required
          :options="subjectOptions"
          :v="v$.subjectId"
        />
      </div>

      <div>
        <AppSelect
          v-model="form.parentId"
          :label="$t('academic.topic.parent')"
          name="parentId"
          :options="parentOptions"
        />
      </div>

      <div>
        <AppInput
          v-model="form.name"
          :label="$t('academic.topic.name')"
          name="name"
          required
          :v="v$.name"
          placeholder="Ex: Equações do 2º Grau"
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
