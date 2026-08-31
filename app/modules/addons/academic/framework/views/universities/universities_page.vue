<script lang="ts" setup>
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import {
  AppTable,
  AppButton,
  AppFilter,
  AppPopover,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useUniversities } from './composables/use_universities.js'
import AppCreateEditUniversityModal from './components/app_create_edit_university_modal.vue'

interface Props {
  content: {
    data: any[]
    pagination: any
  }
}

const props = defineProps<Props>()

const {
  state,
  form,
  tableColumns,
  openCreateModal,
  openEditModal,
  closeModal,
  submitForm,
  toggleStatus,
  checkPermission,
} = useUniversities()

const universities = computed(() => props.content?.data || [])
const pagination = computed(() => props.content?.pagination && props.content.pagination.perPage ? props.content.pagination : null)

const handleFilterUpdated = (queryString: string) => {
  router.visit(window.location.pathname + '?' + queryString, { preserveState: true })
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.universities')"
    :b-t="$t('menu.academic.universities')"
    :b-d="$t('menu.academic.universities.description')"
    no-padding
  >
    <template #body>
      <div class="px-4 py-4">
        <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
          <div class="w-full md:w-72">
            <AppFilter
              :filters="[
                { field: 'name', name: $t('academic.university.name') },
                { field: 'acronym', name: $t('academic.university.acronym') }
              ]"
              @filter-updated="handleFilterUpdated"
            />
          </div>
          <AppButton
            color="primary"
            classes="w-full md:w-auto"
            :disabled="!checkPermission('academic-universities-manage')"
            @click="openCreateModal"
          >
            {{ $t('academic.university.new') }}
          </AppButton>
        </div>
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="universities"
        :pagination="pagination"
      >
        <template #name="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">
            {{ row.name }}
          </div>
        </template>

        <template #acronym="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {{ row.acronym }}
          </span>
        </template>

        <template #status="{ row }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              row.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ row.status === 'ACTIVE' ? $t('admin.common.user.status.active') : $t('admin.common.user.status.inactive') }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-universities-manage')"
              @click="openEditModal(row)"
            >
              {{ $t('shared.edit') }}
            </button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <AppPopover :id="'toggle-status-' + row.id" :title="$t('shared.alert')">
              <template #trigger>
                <button
                  class="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 font-medium cursor-pointer"
                  :disabled="!checkPermission('academic-universities-manage')"
                >
                  {{ row.status === 'ACTIVE' ? $t('admin.acl.inactivate') : $t('admin.acl.activate') }}
                </button>
              </template>
              <template #body>
                <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {{ row.status === 'ACTIVE' ? $t('admin.acl.users.want_to_deactivate') : $t('admin.acl.users.want_to_activate') }}
                </p>
                <AppButton
                  size="xs"
                  color="alternative"
                  @click="toggleStatus(row)"
                >
                  {{ $t('shared.ok_proceed') }}
                </AppButton>
              </template>
            </AppPopover>
          </div>
        </template>
      </AppTable>

      <AppCreateEditUniversityModal
        v-model="state.modalOpen"
        :form="form"
        :loading="state.loading"
        @submit="submitForm"
        @close="closeModal"
      />
    </template>
  </AccountLayout>
</template>
