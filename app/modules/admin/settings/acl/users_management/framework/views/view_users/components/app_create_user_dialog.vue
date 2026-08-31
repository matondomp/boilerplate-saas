<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FwbButtonGroup } from 'flowbite-vue'

import { XMarkIcon } from '@heroicons/vue/24/outline'

import { apiService } from '../services/api.js'
import { useHasPermission } from '@core/composables/has_permission.js'
import { RoleProp, UserProp } from '@core/types/user.js'
import { useForm } from '@core/utilities/form/index.js'
import { email, required } from '@vuelidate/validators'
import { AppButton, AppInput, AppSelect } from '@core/components/index.js'

const props = defineProps<{
  selectedUser: Partial<UserProp>
  isUpdating?: Boolean
  closeModal: () => void
  modalStatus: Boolean
}>()

const exactPermission = ref('admin-acl-create-user')

const { t } = useI18n()
const { checkPermission } = useHasPermission()

const state = reactive<{
  loading: string | null
  loadingOptions: boolean
  options: { value: string; name: string }[]
}>({
  loading: null,
  loadingOptions: false,
  options: [],
})

const { form, v$ } = useForm(
  {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  },
  {
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    email: {
      required,
      email,
    },
    role: {
      required,
    },
  }
)

const onSubmit = async (createAndContinue: boolean) => {
  if (state.loading) {
    return
  }

  state.loading = createAndContinue ? 'create_continue' : 'create_close'

  if (props.isUpdating && checkPermission('admin-acl-modify-user')) {
    form.value
      .put(`/account/admin/settings/acl/users/${props.selectedUser.username}`, {
        isModal: true,
      })
      .then((data) => {
        if (data.props.alert.success) {
          if (createAndContinue === false) {
            props.closeModal()
          }
        }
      })
      .finally(() => {
        state.loading = null
      })

    return
  }

  await form.value
    .post('/account/admin/settings/acl/users')
    .then((data) => {
      if (data.props.alert.success) {
        if (createAndContinue === false) {
          props.closeModal()
        }
      }
    })
    .finally(() => {
      state.loading = null
    })
}

watch(
  () => props.selectedUser.username,
  () => {
    if (props.selectedUser && props.selectedUser.username) {
      form.value.setValue({
        email: props.selectedUser.email,
        firstName: props.selectedUser.firstName,
        lastName: props.selectedUser.lastName,
        role: props.selectedUser.roleId,
      })

      exactPermission.value = 'admin-acl-modify-user'
    } else {
      form.value.clear()
    }
  }
)

onMounted(() => {
  apiService
    .loadRoles<RoleProp[]>()
    .then(({ data }) => {
      state.options = data.map((d: RoleProp) => ({
        value: d.id,
        name: t(d.name),
      }))
    })
    .finally(() => {
      state.loadingOptions = false
    })
})

const modalTitle = computed(() =>
  props.isUpdating
    ? t('admin.acl.users.update.title', { userName: props.selectedUser.firstName })
    : t('admin.acl.users.register.title')
)

const submitButtonText = computed(() =>
  props.isUpdating
    ? t('admin.acl.users.update_user', { userName: props.selectedUser.firstName })
    : t('admin.acl.users.create_and_close')
)
</script>
<template>
  <dialog
    :class="['modal', { 'modal-open': props.modalStatus }]"
    id="create_user_modal"
    role="dialog"
  >
    <div class="modal-box">
      <form method="dialog">
        <button @click="closeModal" class="btn btn-ghost absolute right-3 top-3">
          <XMarkIcon class="w-6" />
        </button>
      </form>
      <h3 class="font-bold text-lg">{{ modalTitle }}!</h3>
      <div>
        <main>
          <form @submit.prevent="onSubmit(false)">
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="mb-6">
                <AppInput
                  name="first_name"
                  v-model="form.model.firstName"
                  :label="$t('shared.user.first_name')"
                  placeholder="Jack"
                  required
                  :v="v$.firstName"
                />
              </div>
              <div class="mb-6">
                <AppInput
                  name="last_name"
                  v-model="form.model.lastName"
                  :label="$t('shared.user.last_name')"
                  placeholder="Sparrow"
                  required
                  :v="v$.lastName"
                />
              </div>
            </div>
            <div class="mb-6">
              <AppInput
                v-model="form.model.email"
                type="email"
                name="username"
                autocomplete="username"
                :label="$t('shared.users.email')"
                placeholder="jack.sparrow@caribbean.com"
                :v="v$.email"
              />
            </div>
            <div class="mb-6">
              <AppSelect
                v-model="form.model.role"
                :loading="state.loadingOptions"
                :disabled="state.loadingOptions"
                :label="$t('shared.users.role')"
                :options="state.options"
                :placeholder="$t('shared.roles.choose')"
              />
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 w-full">
              <AppButton
                v-if="!isUpdating"
                type="button"
                size="sm"
                classes="w-full sm:w-auto"
                :loading="state.loading === 'create_continue'"
                :color="'alternative'"
                :disabled="!checkPermission(exactPermission)"
                @click="onSubmit(true)"
              >
                {{ $t('admin.acl.users.create') }}
              </AppButton>
              <AppButton
                type="submit"
                size="sm"
                classes="w-full sm:w-auto"
                :loading="state.loading === 'create_close'"
                :disabled="!checkPermission(exactPermission)"
              >
                {{ submitButtonText }}
              </AppButton>
            </div>
          </form>
        </main>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal"></button>
    </form>
  </dialog>
</template>
