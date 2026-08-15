<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { usePage } from '@inertiajs/vue3'
import { DashboardForm } from './types.js'
import { computed, ref, watch, reactive } from 'vue'

import { AccountLayout } from '@core/layouts/index.js'
import { ColumnProps } from '@core/components/app_table/types.js'
import { useHasPermission } from '@core/composables/has_permission.js'
import { AppCreateEditDashboard, AppDashboard, AppDashboardActions } from './components/index.js'
import {
  RouterLink,
  AppButton,
  AppTable,
  AppWorkInProgress,
  AppDateTooltip,
} from '@core/components/index.js'
import { TableCellsIcon, RectangleGroupIcon, InboxIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const data = computed(() => usePage().props.data as any)
const noDashboardToList = computed(() => data.value.length < 1)
const createEditModalStatus = ref(false)
const selectedDashboard = reactive<DashboardForm>({
  slug: '',
  name: '',
  description: '',
})

const closeEditCreateModal = () => {
  createEditModalStatus.value = false
}

const openEditCreateModal = () => {
  createEditModalStatus.value = true
}

const setupDashboardEdition = (dashboard: DashboardForm) => {
  Object.assign(selectedDashboard, dashboard)
  openEditCreateModal()
}

const columns: ColumnProps[] = [
  {
    field: 'name',
    headerName: t('dashboard_management.table.name'),
    slot: true,
  },
  {
    field: 'createdAt',
    headerName: t('dashboard_management.table.createdAt'),
    component: AppDateTooltip,
    componentProps: {
      value: 'createdAt',
      tooltip: 'createdAt',
    },
    slot: true,
  },
  {
    field: 'updatedAt',
    headerName: t('dashboard_management.table.updatedAt'),
    component: AppDateTooltip,
    componentProps: {
      value: 'updatedAt',
      tooltip: 'updatedAt',
    },
    slot: true,
  },
  {
    actions: true,
  } as any,
]

const layout = {
  card: 'CARD',
  table: 'TABLE',
}

const definedLayout = ref(layout.card)

const setLayout = (type: string) => {
  definedLayout.value = type
}

const { checkPermission } = useHasPermission()

watch(
  () => createEditModalStatus.value,
  () => {
    if (createEditModalStatus.value === false) {
      selectedDashboard.slug = undefined
    }
  }
)
</script>

<template>
  <AccountLayout
    :title="$t('menu.main.dashboard.dashboard_management')"
    :b-t="$t('menu.main.dashboard.dashboard_management')"
    :b-d="$t('admin.dashboard-management.dashboard_management.description')"
  >
    <template #body>
      <main>
        <div>
          <AppWorkInProgress extra>
            <div class="flex justify-between items-end mt-4">
              <AppButton
                color="primary"
                :disabled="!checkPermission('admin-create-dashboards')"
                id="open-create-edit-dashboard-modal"
                onclick="create_edit_dashboard_modal.showModal()"
              >
                {{ $t('dashboard_management.create') }}
              </AppButton>

              <div class="flex items-end gap-2">
                <TableCellsIcon
                  :class="[
                    'w-8 cursor-pointer ',
                    { 'text-primary': definedLayout === layout.table },
                  ]"
                  @click="setLayout(layout.table)"
                />
                <RectangleGroupIcon
                  :class="[
                    'w-8 cursor-pointer ',
                    { 'text-primary': definedLayout === layout.card },
                  ]"
                  @click="setLayout(layout.card)"
                />
              </div>
            </div>
          </AppWorkInProgress>
        </div>
        <div
          v-if="noDashboardToList"
          class="min-h-[50vh] flex items-center justify-center flex-col"
        >
          <InboxIcon class="w-28 mb-5" />
          <p class="font-bold leading-none tracking-tight">
            {{ $t('dashboard_management.empty_dashboard') }}
          </p>
        </div>

        <AppTable
          id="slug"
          v-if="definedLayout === layout.table && !noDashboardToList"
          :data="data"
          :columns="columns"
        >
          <template #name="{ row }">
            <RouterLink
              :href="`/account/admin/settings/dashboards/${row.slug}`"
              class="inline-flex items-center text-sm font-medium dark:text-gray-400 text-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <span>{{ row.name }}</span>
            </RouterLink>
            <br />
            <span class="small text-muted">
              {{ row.description }}
            </span>
          </template>

          <template #createdAt="{ row }">
            <p>{{ row.createdAt }}</p>
          </template>

          <template #updatedAt="{ row }">
            <p>{{ row.updatedAt }}</p>
          </template>

          <template #actions="{ row }">
            <AppDashboardActions
              class="text-left"
              index="table"
              :slug="row.slug"
              :name="row.name"
              @on-edit="setupDashboardEdition(row)"
            />
          </template>
        </AppTable>

        <div v-if="definedLayout === layout.card" class="flex flex-wrap mt-5 gap-7 w-full p-4">
          <div v-for="dashboard in data" :key="dashboard.slug">
            <AppDashboard
              :name="dashboard.name"
              :slug="dashboard.slug"
              :description="dashboard.description"
            >
              <AppDashboardActions
                index="card"
                :slug="dashboard.slug"
                :name="dashboard.name"
                @on-edit="setupDashboardEdition(dashboard)"
              />
            </AppDashboard>
          </div>
        </div>
      </main>
    </template>
  </AccountLayout>
  <AppCreateEditDashboard
    :close-modal="closeEditCreateModal"
    :dashboard-to-edit="selectedDashboard"
    :modal-status="createEditModalStatus"
  />
</template>
