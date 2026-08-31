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
    name: string
    universityId: string
    academicUnitId?: string
    status: string
  }
  universities: Array<{ id: string; name: string }>
  academicUnits: Array<{ id: string; name: string; universityId: string }>
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const rules = {
  name: { required, minLength: minLength(3) },
  universityId: { required },
}

const v$ = useVuelidate(rules, props.form)

const isEditing = computed(() => !!props.form.id)

const universityOptions = computed(() =>
  props.universities.map((u) => ({ label: u.name, value: u.id }))
)

const filteredUnits = computed(() => {
  if (!props.form.universityId) return []
  return props.academicUnits
    .filter((unit) => unit.universityId === props.form.universityId)
    .map((u) => ({ label: u.name, value: u.id }))
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
    :title="isEditing ? $t('academic.course.edit') : $t('academic.course.new')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <AppSelect
          v-model="form.universityId"
          :label="$t('academic.course.university')"
          name="universityId"
          required
          :options="universityOptions"
          :v="v$.universityId"
        />
      </div>

      <div>
        <AppInput
          v-model="form.name"
          :label="$t('academic.course.name')"
          name="name"
          required
          :v="v$.name"
          placeholder="Ex: Engenharia Informática"
        />
      </div>

      <div v-if="filteredUnits.length > 0">
        <AppSelect
          v-model="form.academicUnitId"
          :label="$t('academic.course.academic_unit')"
          name="academicUnitId"
          :options="filteredUnits"
        />
      </div>

      <div>
        <AppSelect
          v-model="form.status"
          :label="$t('shared.status')"
          name="status"
          :options="[
            { label: $t('admin.common.user.status.active'), value: 'ACTIVE' },
            { label: $t('admin.common.user.status.inactive'), value: 'INACTIVE' },
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
