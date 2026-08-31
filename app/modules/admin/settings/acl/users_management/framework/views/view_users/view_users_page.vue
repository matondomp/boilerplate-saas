<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { usePage, router } from '@inertiajs/vue3'
import { computed, ref, watch, reactive, onMounted } from 'vue'

import eventBus from '@core/event_bus.js'
import { useHasPermission } from '@core/composables/has_permission.js'
import AppEditRowAdapter from './components/app_edit_row_adapter.vue'
import AppCreateUserDialog from './components/app_create_user_dialog.vue'
import {
  AppTable,
  AppButton,
  AppDateTooltip,
  AppStatus,
  AppFilter,
  RouterLink,
  AppAvatar,
  AppWorkInProgress,
} from '@core/components/index.js'
import AppViewRestoredPasswordDialog from './components/app_view_restored_password_dialog.vue'

import { UserProp, UserStatus, Alert } from '@core/types/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useAvatar } from '@core/composables/use_avatar.js'
import { ColumnProps } from '@core/components/app_table/types.js'
import { convertUserStatus } from '@core/utilities/convert_user_status.js'
import { EditUserProps } from './types.js'
import { AppFilterProps, FilterType } from '~/core/components/app_filter/types'
import { apiService } from './services/api'

const dialogVisible = ref(false)
const isUpdatingUser = ref(false)
const viewPasswordRestoredDialog = ref(false)
const viewPasswordRestoredPayload = ref('')

const selectUserToUpdate = reactive<Partial<UserProp>>({})

const content = computed(() => usePage().props.content as any)
const alert = computed(() => usePage().props.alert as Alert)

const { t } = useI18n()
const { initials } = useAvatar()
const modalStatus = ref(false)

function closeModal() {
  modalStatus.value = false
  isUpdatingUser.value = false

  selectUserToUpdate.email = undefined
  selectUserToUpdate.firstName = undefined
  selectUserToUpdate.lastName = undefined
  selectUserToUpdate.roleId = undefined
  selectUserToUpdate.username = undefined
}

function closeViewPasswordRestoredDialog() {
  viewPasswordRestoredDialog.value = false
}

function showModal() {
  modalStatus.value = true
}

function setUserToBeEdited(user: UserProp) {
  selectUserToUpdate.email = user.email
  selectUserToUpdate.firstName = user.firstName
  selectUserToUpdate.lastName = user.lastName
  selectUserToUpdate.roleId = user.roleId
  selectUserToUpdate.username = user.slug
  isUpdatingUser.value = true
  showModal()
}

eventBus.on('redefine-user-password', (newPassword: string) => {
  viewPasswordRestoredPayload.value = newPassword
  viewPasswordRestoredDialog.value = true
})

watch(dialogVisible, (value) => {
  if (value === false) {
    selectUserToUpdate.username = undefined
    if (alert.value.successWithModal) {
      usePage().props.alert = undefined
    }
  }
})
const { checkPermission } = useHasPermission()

// -- TABLE GRID

const columns: ColumnProps[] = [
  {
    field: 'fullName',
    headerName: t('acl.users.list-users.full_name'),
    slot: true,
    sortable: true,
    sortableField: 'firstName',
  },
  {
    field: 'status',
    headerName: t('shared.status'),
    slot: true,
    hideOnMobile: true,
  },
  {
    field: 'roleText',
    headerName: t('acl.users.list-users.role'),
    i18n: true,
    hideOnMobile: true,
  },
  {
    field: 'lastLoginAtText',
    headerName: t('acl.users.list-users.last_login'),
    component: AppDateTooltip,
    hideOnMobile: true,

    componentProps: {
      value: 'lastLoginAtText',
      tooltip: 'lastLoginAt',
    },
    sortable: true,
    sortableField: 'lastLoginAt',
  },
  {
    field: 'updatedAtText',
    headerName: t('shared.updated_at'),
    component: AppDateTooltip,
    componentProps: {
      value: 'updatedAtText',
      tooltip: 'updatedAt',
    },
    sortable: true,
    sortableField: 'updatedAt',
    hideOnMobile: true,
  },
  {
    actions: true,
  } as any,
]

const filters = ref<AppFilterProps[]>([
  {
    name: t('acl.users.list-users.full_name'),
    field: 'fullName',
  },
  {
    name: t('acl.users.list-users.email'),
    field: 'email',
  },
  {
    name: t('acl.users.list-users.role'),
    field: 'role',
    type: FilterType.select,
    selectOptions: [],
  },
  {
    name: t('shared.status'),
    field: 'status',
    type: FilterType.select,
    selectOptions: [
      {
        value: 'ACTIVE',
        name: t('admin.acl.users.status.active'),
      },
      {
        value: 'INACTIVE',
        name: t('admin.acl.users.status.inactive'),
      },
    ],
  },
])

const handlePagination = (event: string, value: number) => {
  console.log(event, value)
}

const getStatusText = (status: UserStatus): string => {
  if (status === 'ACTIVE') return 'admin.acl.users.status.active'

  return 'admin.acl.users.status.inactive'
}

onMounted(() => {
  apiService.loadRoles().then(({ data }: any) => {
    const index = filters.value.findIndex((f) => f.field === 'role')
    filters.value[index].selectOptions = data.map((d: any) => ({ value: d.slug, name: t(d.name) }))
  })
})
</script>

<template>
  <AccountLayout
    :title="$t('menu.admin.setting.acl.users')"
    :b-t="$t('menu.admin.setting.acl.users')"
    :b-d="$t('menu.admin.setting.acl.users-description')"
    no-padding
  >
    <template #body>
      <div>
        <div class="px-4">
          <AppWorkInProgress extra>
            <template #default>
              <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
                <AppFilter
                  :filters="filters"
                  @filter-updated="() => router.reload({ only: ['content'] })"
                />
                <AppButton
                  id="btn-create-user"
                  size="md"
                  classes="w-full md:w-auto"
                  :disabled="!checkPermission('admin-acl-create-user')"
                  onclick="create_user_modal.showModal()"
                >
                  {{ $t('admin.acl.users.register') }}
                </AppButton>
              </div>
            </template>
          </AppWorkInProgress>
        </div>

        <AppTable
          id="slug"
          :columns="columns"
          :data="content.data"
          multi-select
          :pagination="content.pagination"
          :disable-actions-if="!checkPermission('admin-acl-modify-user')"
          @page-changed="(e: any) => handlePagination('page-changed', e)"
          @perpage-changed="(e: any) => handlePagination('perpage-changed', e)"
        >
          <template #fullName="{ row }">
            <div class="flex text-left items-center md:mr-12 md:space-x-6 whitespace-nowrap">
              <AppAvatar
                classes="md:w-10"
                class="hidden md:flex"
                :source="row.avatar"
                :initials="initials(row.fullName)"
                no-fallback
              />
              <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                <RouterLink
                  :href="`/account/admin/settings/acl/users/${row.slug}`"
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ row.fullName }}
                </RouterLink>
                <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <a :href="`mailto:${row.email}`">
                    {{ row.email }}
                  </a>
                </div>

                <AppStatus
                  class="md:hidden"
                  :status="convertUserStatus(row.status)"
                  :text="$t(getStatusText(row.status))"
                />
              </div>
            </div>
          </template>

          <template #status="{ row }">
            <AppStatus
              :status="convertUserStatus(row.status)"
              :text="$t(getStatusText(row.status))"
            />
          </template>

          <template #actions="{ row }">
            <AppEditRowAdapter
              :row="row"
              @on-edit-user="(a: EditUserProps) => setUserToBeEdited(a)"
            />
          </template>
        </AppTable>
      </div>
    </template>

    <template #portal>
      <AppViewRestoredPasswordDialog
        :close-modal="closeViewPasswordRestoredDialog"
        :is-show-modal="viewPasswordRestoredDialog"
        :new-password="viewPasswordRestoredPayload"
      />
    </template>
  </AccountLayout>

  <AppCreateUserDialog
    :is-updating="isUpdatingUser"
    :modal-status="modalStatus"
    :close-modal="closeModal"
    :selected-user="selectUserToUpdate"
  />
</template>
