<script lang="ts" setup>
import { computed } from 'vue'
import {
  AppTable,
  AppButton,
  AppFilter,
  AppPopover,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useCourses } from './composables/use_courses.js'
import AppCreateEditCourseModal from './components/app_create_edit_course_modal.vue'

interface Props {
  content: {
    data: any[]
    pagination: any
  }
  universities: Array<{ id: string; name: string }>
  academicUnits: Array<{ id: string; name: string; universityId: string }>
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
} = useCourses()

const courses = computed(() => props.content?.data || [])
const pagination = computed(() => props.content?.pagination || {})
const universitiesList = computed(() => props.universities || [])
const academicUnitsList = computed(() => props.academicUnits || [])

import { router } from '@inertiajs/vue3'

import { FilterType } from '@core/components/app_filter/types.js'

const universityFilterOptions = computed(() =>
  universitiesList.value.map((u) => ({ name: u.name, value: u.id }))
)

const academicUnitFilterOptions = computed(() =>
  academicUnitsList.value.map((u) => ({ name: u.name, value: u.id }))
)

const handleFilterUpdated = (queryString: string) => {
  router.visit(window.location.pathname + '?' + queryString, { preserveState: true })
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.courses')"
    :b-t="$t('menu.academic.courses')"
    :b-d="$t('menu.academic.courses.description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        
            <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
              <div class="w-full md:w-72">
                <AppFilter
                  :filters="[
                    { field: 'name', name: $t('academic.course.name') },
                    { field: 'universityId', name: $t('academic.course.university'), type: FilterType.select, selectOptions: universityFilterOptions },
                    { field: 'academicUnitId', name: $t('academic.course.academic_unit'), type: FilterType.select, selectOptions: academicUnitFilterOptions }
                  ]"
                  @filter-updated="handleFilterUpdated"
                />
              </div>
              <div class="w-full md:w-auto">
                <AppButton
                color="primary"
                classes="w-full md:w-auto"
                :disabled="!checkPermission('academic-courses-manage')"
                @click="openCreateModal"
              >
                {{ $t('academic.course.new') }}
              </AppButton>
              </div>
            </div>
          
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="courses"
        :pagination="pagination"
      >
        <template #name="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">
            {{ row.name }}
          </div>
        </template>

        <template #university="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.universityName || '—' }}
          </span>
        </template>

        <template #academic_unit="{ row }">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ row.academicUnitName || 'Geral' }}
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
              :disabled="!checkPermission('academic-courses-manage')"
              @click="openEditModal(row)"
            >
              {{ $t('shared.edit') }}
            </button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <AppPopover :id="'toggle-course-' + row.id" :title="$t('shared.alert')">
              <template #trigger>
                <button
                  class="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 font-medium cursor-pointer"
                  :disabled="!checkPermission('academic-courses-manage')"
                >
                  {{ row.status === 'ACTIVE' ? $t('admin.acl.inactivate') : $t('admin.acl.activate') }}
                </button>
              </template>
              <template #body>
                <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {{ row.status === 'ACTIVE' ? $t('admin.acl.users.want_to_deactivate') : $t('admin.acl.users.want_to_activate') }}
                </p>
                <div class="w-full md:w-auto">
                <AppButton :classes="'w-full'"
                  size="xs"
                  color="alternative"
                  @click="toggleStatus(row)"
                >
                  {{ $t('shared.ok_proceed') }}
                </AppButton>
              </div>
              </template>
            </AppPopover>
          </div>
        </template>
      </AppTable>

      <AppCreateEditCourseModal
        v-model="state.modalOpen"
        :form="form"
        :universities="universitiesList"
        :academic-units="academicUnitsList"
        :loading="state.loading"
        @submit="submitForm"
        @close="closeModal"
      />
    </template>
  </AccountLayout>
</template>
