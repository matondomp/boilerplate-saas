import { useI18n } from 'vue-i18n'
import { usePage } from '@inertiajs/vue3'
import { computed, reactive, ref } from 'vue'
import { useForm } from '@core/utilities/form/index'
import { PermissionGroup } from '../type'
import { required } from '@vuelidate/validators'

export const useRoleForm = () => {
  const { t } = useI18n()

  const { form, v$ } = useForm<{
    name: string
    description: string
    permissions: string[]
  }>(
    {
      name: '',
      description: '',
      permissions: [],
    },
    {
      name: {
        required,
      },
      description: {
        required,
      },
      permissions: {
        required,
      },
    }
  )

  const clearForm = () => {
    form.value.reset()
  }

  const state = reactive<{
    loading: string | null
  }>({
    loading: null,
  })

  const permissions = computed(() => usePage().props.permissions as PermissionGroup[])

  const permissionsGroup = ref(
    permissions.value.map((p) => ({
      id: p.id,
      title: p.title,
      children: p.children.map((c) => ({
        id: c.id,
        title: c.display,
        description: c.description,
      })),
    }))
  )

  return {
    clearForm,
    roleForm: form,
    v$,
    state,
    permissionsGroup,
    t,
  }
}
