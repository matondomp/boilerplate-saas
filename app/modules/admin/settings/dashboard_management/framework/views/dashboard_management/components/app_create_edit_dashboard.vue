<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { FwbButtonGroup } from 'flowbite-vue'

import { DashboardForm } from '../types.js'
import { AppInput, AppTextarea, AppButton } from '@core/components/index.js'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useForm } from '@core/utilities/form/index.js'
import { required } from '@vuelidate/validators'

const props = defineProps<{
  closeModal: () => void
  dashboardToEdit: DashboardForm
  modalStatus: boolean
}>()

const modalTitle = ref('dashboard_management.create')
const buttonText = ref('dashboard_management.create.keep')

const isEditing = ref(false)
const createAndRedirect = ref(false)

const { form, v$ } = useForm(
  {
    name: '',
    description: '',
    slug: '',
  },
  {
    name: {
      required,
    },
    description: {
      required,
    },
  }
)

const onSubmit = async () => {
  const baseUrl = '/api/account/admin/settings/dashboards'

  if (isEditing.value) {
    await form.value.put(`${baseUrl}/${form.value.model.slug}`)
  } else {
    await form.value.post(`${baseUrl}/create`, {
      redirect: createAndRedirect.value,
    })
  }
}

const dashboardEditionSettings = () => {
  if (props.dashboardToEdit.slug) {
    isEditing.value = true
    modalTitle.value = 'dashboard_management.edit.title'
    buttonText.value = 'dashboard_management.edit.save'

    form.value.setValue({
      name: props.dashboardToEdit.name,
      description: props.dashboardToEdit.description,
      slug: props.dashboardToEdit.slug,
    })
  }
}

watch(
  () => props.dashboardToEdit.slug,
  () => dashboardEditionSettings()
)

onMounted(() => {
  dashboardEditionSettings()
})
</script>

<template>
  <dialog id="create_edit_dashboard_modal" :class="['modal', { 'modal-open': props.modalStatus }]">
    <div class="modal-box">
      <form method="dialog">
        <button @click="closeModal()" class="btn btn-ghost absolute right-3 top-3">
          <XMarkIcon class="w-6" />
        </button>
      </form>
      <h3 class="font-bold text-lg">{{ $t(modalTitle) }}</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-6">
          <AppInput
            v-model="form.model.name"
            name="name"
            required
            :label="$t('dashboard_management.create.name.label')"
            :placeholder="$t('dashboard_management.create.name.placeholder')"
            :v="v$.name"
          />
        </div>
        <div class="mb-6">
          <AppTextarea
            name="dashboard-description"
            :label="$t('dashboard_management.create.description.label')"
            v-model="form.model.description"
            :placeholder="$t('dashboard_management.create.description.placeholder')"
            :v="v$.description"
          />
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3 w-full">
          <AppButton
            id="create-dashboard-then-redirect"
            size="sm"
            v-if="!isEditing"
            color="alternative"
            classes="w-full sm:w-auto"
            :loading="form.loading && createAndRedirect"
            @click="
              () => {
                createAndRedirect = true
                onSubmit()
              }
            "
          >
            {{ $t('dashboard_management.create.redirect') }}
          </AppButton>

          <AppButton
            id="create-update-dashboard-button"
            size="sm"
            type="button"
            classes="w-full sm:w-auto"
            :loading="form.loading && !createAndRedirect"
            @click="
              () => {
                createAndRedirect = false
                onSubmit()
              }
            "
          >
            {{ $t(buttonText) }}
          </AppButton>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal()">close</button>
    </form>
  </dialog>
</template>
