import { computed, ref, reactive } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { apiService } from '../services'
import { AppDateTooltip } from '@core/components/index'
import { useHasPermission } from '@core/composables/has_permission.js'
import { ColumnProps } from '@core/components/app_table/types.js'
import { UserProp } from '~/core/types'

export const useViewRoles = () => {
  const { checkPermission } = useHasPermission()
  const { t } = useI18n()

  const state = reactive<{
    perPage: number
    page: number
    loadingKey: string | null
    selectedRows: string[]
  }>({
    perPage: 10,
    page: 1,
    loadingKey: null,
    selectedRows: [],
  })

  const content = computed(() => usePage().props.content as any)
  const isRoot = computed(() => (usePage().props.user as UserProp).role.isRoot)

  const loading = ref<{ key: string | null }>({
    key: '',
  })

  const columns: ColumnProps[] = [
    {
      field: 'name',
      headerName: t('acl.roles.role_name'),
      slot: true,
      sortable: true,
    },
    {
      field: 'updatedAtText',
      headerName: t('shared.updated_at'),
      component: AppDateTooltip,
      sortable: true,
      sortableField: 'updatedAt',
      componentProps: {
        value: 'updatedAtText',
        tooltip: 'updatedAt',
      },
      hideOnMobile: true,
    },
    {
      actions: true,
    } as any,
  ]

  const redirectTo = (url: string, params: any) => {
    router.get(url, params)
  }

  const onDeleteRole = (roleSlug: string, isInternal: boolean) => {
    if (isInternal && !isRoot.value) {
      return
    }

    loading.value.key = 'remove-role'
    apiService.deleteRole(roleSlug).finally(() => {
      loading.value.key = null
    })
  }

  return {
    onDeleteRole,
    redirectTo,
    tableColumns: columns,
    checkPermission,
    state,
    content,
    isRoot,
    loading,
    t,
  }
}
