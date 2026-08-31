<script lang="ts" setup>
import { computed } from 'vue'
import {
  AppTable,
  AppButton,
  AppFilter,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useSubjects } from './composables/use_subjects.js'
import AppCreateEditSubjectModal from './components/app_create_edit_subject_modal.vue'

interface Props {
  content: {
    data: any[]
    pagination: any
  }
  courses: Array<{ id: string; name: string }>
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
  checkPermission,
} = useSubjects()

const subjects = computed(() => props.content?.data || [])
const pagination = computed(() => props.content?.pagination || {})
const coursesList = computed(() => props.courses || [])

import { router } from '@inertiajs/vue3'

const handleFilterUpdated = (queryString: string) => {
  router.visit(window.location.pathname + '?' + queryString, { preserveState: true })
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.subjects')"
    :b-t="$t('menu.academic.subjects')"
    :b-d="$t('menu.academic.subjects.description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        
            <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
              <div class="w-full md:w-72">
                <AppFilter
                  :filters="[{ field: 'name', name: $t('academic.subject.name') }]"
                  @filter-updated="handleFilterUpdated"
                />
              </div>
              <div class="w-full md:w-auto">
                <AppButton :classes="'w-full'"
                color="primary"
                :disabled="!checkPermission('academic-subjects-manage')"
                @click="openCreateModal"
              >
                {{ $t('academic.subject.new') }}
              </AppButton>
              </div>
            </div>
          
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="subjects"
        :pagination="pagination"
      >
        <template #name="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">
            {{ row.name }}
          </div>
        </template>

        <template #description="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ row.description || '—' }}
          </span>
        </template>

        <template #courses="{ row }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="course in (row.courses || [])"
              :key="course.id"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              {{ course.name }}
            </span>
            <span v-if="!row.courses || row.courses.length === 0" class="text-xs text-gray-400">
              Geral / Transversal
            </span>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-subjects-manage')"
              @click="openEditModal(row)"
            >
              {{ $t('shared.edit') }}
            </button>
          </div>
        </template>
      </AppTable>

      <AppCreateEditSubjectModal
        v-model="state.modalOpen"
        :form="form"
        :courses="coursesList"
        :loading="state.loading"
        @submit="submitForm"
        @close="closeModal"
      />
    </template>
  </AccountLayout>
</template>
