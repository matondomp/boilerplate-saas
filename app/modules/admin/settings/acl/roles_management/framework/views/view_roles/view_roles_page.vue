<script lang="ts" setup>
import { onMounted, defineProps, ref } from 'vue'
import {
  AppTable,
  AppPopover,
  AppButton,
  AppWorkInProgress,
  RouterLink,
  AppFilter,
} from '@core/components/index.js'
import { useViewRoles } from './composables/use_view_roles.js'

import { AccountLayout } from '@core/layouts/index.js'
import { AppFilterProps } from '~/core/components/app_filter/types.js'
import { router } from '@inertiajs/vue3'

const {
  onDeleteRole,
  redirectTo,
  tableColumns: columns,
  checkPermission,
  state,
  content,
  isRoot,
  loading,
  t,
} = useViewRoles()

type PageProps = {
  query: {
    perPage: number
    page: number
  }
}

const filters = ref<AppFilterProps[]>([
  {
    field: 'name',
    name: t('acl.roles.role_name'),
  },
])

const props = defineProps<PageProps>()

onMounted(() => {
  state.perPage = props.query.perPage
  state.page = props.query.page
  state.loadingKey = null
})
</script>

<template>
  <AccountLayout
    :title="$t('menu.admin.setting.acl.roles')"
    :b-t="$t('menu.admin.setting.acl.roles')"
    :b-d="$t('menu.admin.setting.acl.roles_description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        <AppWorkInProgress extra>
          <template #default>
            <div class="flex flex-col md:flex-row md:justify-between">
              <AppFilter
                :filters="filters"
                @filter-updated="() => router.reload({ only: ['content', 'query'] })"
              />
              <AppButton
                color="primary"
                :disabled="!checkPermission('admin-acl-create-role')"
                @click="redirectTo('/account/admin/settings/acl/roles/new', {})"
              >
                {{ $t('admin.acl.roles.register') }}
              </AppButton>
            </div>
          </template>
        </AppWorkInProgress>
      </div>
      <AppTable
        id="slug"
        :columns="columns"
        :data="content.data"
        :pagination="content.pagination"
        multi-select
        :disable-actions-if="!checkPermission('admin-acl-modify-role')"
      >
        <template #name="{ row }">
          <div class="text-left">
            <RouterLink
              :href="`/account/admin/settings/acl/roles/${row.slug}/edit`"
              class="inline-flex items-center text-sm font-medium dark:text-gray-400 text-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <span v-if="row.isInternal">{{ $t(row.name) }}</span>
              <span v-else>{{ row.name }}</span>
            </RouterLink>

            <br />
            <span v-if="row.isInternal" class="small text-muted">
              {{ $t(row.description) }}
            </span>
            <span v-else class="small text-muted">
              {{ row.description }}
            </span>
          </div>
        </template>
        <template #actions="{ row }">
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <button
                class="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:hover:text-white"
                @click="redirectTo(`/account/admin/settings/acl/roles/${row.slug}/edit`, {})"
              >
                {{ $t('shared.edit') }}
              </button>
            </li>
            <li>
              <AppPopover :id="'remove-role-' + row.slug" :title="$t('shared.remove')">
                <template #trigger>
                  <button
                    class="block w-full text-left disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-red-500 hover:text-red-700"
                    data-popover-trigger="click"
                    :disabled="!checkPermission('admin-acl-delete-role') || row.slug === 'root'"
                  >
                    {{ $t('shared.remove') }}
                  </button>
                </template>
                <template #body>
                  <p class="text-left">
                    {{ $t('shared.want_to_delete') }}
                  </p>

                  <AppButton
                    type="button"
                    color="error"
                    size="xs"
                    classes="mt-2"
                    :loading="loading.key === 'remove-role'"
                    :disabled="
                      !checkPermission('admin-acl-delete-role') ||
                      (row.isInternal && !isRoot) ||
                      loading.key === 'remove-role'
                    "
                    @click="onDeleteRole(row.slug, row.isInternal)"
                  >
                    {{ $t('shared.ok_proceed') }}
                  </AppButton>
                </template>
              </AppPopover>
            </li>
          </ul>
        </template>
      </AppTable>
    </template>
  </AccountLayout>
</template>
