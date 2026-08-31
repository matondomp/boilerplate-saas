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
    acronym: string
    status: string
  }
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const rules = {
  name: { required, minLength: minLength(3) },
  acronym: { required, minLength: minLength(2) },
}

const v$ = useVuelidate(rules, props.form)

const isEditing = computed(() => !!props.form.id)

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
    :title="isEditing ? $t('academic.university.edit') : $t('academic.university.new')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <AppInput
          v-model="form.name"
          :label="$t('academic.university.name')"
          name="name"
          required
          :v="v$.name"
          placeholder="Ex: Universidade Agostinho Neto"
        />
      </div>

      <div>
        <AppInput
          v-model="form.acronym"
          :label="$t('academic.university.acronym')"
          name="acronym"
          required
          :v="v$.acronym"
          placeholder="Ex: UAN"
        />
      </div>

      <div>
        <AppSelect
          v-model="form.status"
          :label="$t('academic.university.status')"
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
          {{ isEditing ? $t('shared.update') : $t('shared.add') }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
