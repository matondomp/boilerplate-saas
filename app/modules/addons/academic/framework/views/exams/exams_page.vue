<script lang="ts" setup>
import { computed } from 'vue'
import {
  AppTable,
  AppButton,
  AppFilter,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useExams, type ExamItem } from './composables/use_exams.js'
import AppCreateExamModal from './components/app_create_exam_modal.vue'
import AppUploadExamPdfModal from './components/app_upload_exam_pdf_modal.vue'

interface Props {
  content: {
    data: any[]
    pagination: any
  }
  courses: Array<{ id: string; name: string; universityName?: string }>
}

const props = defineProps<Props>()

const {
  state,
  form,
  tableColumns,
  openCreateModal,
  openEditModal, openUploadModal,
  closeModals,
  submitCreateForm,
  checkPermission,
} = useExams()

const exams = computed(() => props.content?.data || [])
const pagination = computed(() => props.content?.pagination || {})
const coursesList = computed(() => props.courses || [])

import { router } from '@inertiajs/vue3'
import { FilterType } from '@core/components/app_filter/types.js'

const courseFilterOptions = computed(() =>
  coursesList.value.map((c) => ({
    name: c.universityName ? `${c.name} (${c.universityName})` : c.name,
    value: c.id
  }))
)

const handleFilterUpdated = (queryString: string) => {
  router.visit(window.location.pathname + '?' + queryString, { preserveState: true })
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.exams')"
    :b-t="$t('menu.academic.exams')"
    :b-d="$t('menu.academic.exams.description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        
            <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
              <div class="w-full md:w-72">
                <AppFilter
                  :filters="[
                    { field: 'course', name: $t('academic.course.name'), type: FilterType.select, selectOptions: courseFilterOptions },
                    { field: 'year', name: $t('academic.exam.year') },
                  ]"
                  @filter-updated="handleFilterUpdated"
                />
              </div>
              <div class="w-full md:w-auto">
                <AppButton :classes="'w-full'"
                color="primary"
                :disabled="!checkPermission('academic-exams-manage')"
                @click="openCreateModal"
              >
                {{ $t('academic.exam.new') }}
              </AppButton>
              </div>
            </div>
          
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="exams"
        :pagination="pagination"
      >
        <template #title="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">
            Exame de Admissão — {{ row.year }}
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ row.universityName || 'Universidade' }}
          </span>
        </template>

        <template #course="{ row }">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ row.courseName || '—' }}
          </span>
        </template>

        <template #year_period="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.year }} ({{ row.period }})
          </span>
        </template>

        <template #questions_count="{ row }">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {{ row.questionsCount || 0 }} questões
          </span>
        </template>

        <template #status="{ row }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              row.status === 'READY' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              row.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-exams-manage')"
              @click="openUploadModal(row)"
            >
              {{ $t('academic.exam.upload_pdf') }}
            </button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <button
              class="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium cursor-pointer"
              :disabled="!checkPermission('academic-exams-manage')"
              @click="openEditModal(row)"
            >
              {{ $t('shared.edit') }}
            </button>
          </div>
        </template>
      </AppTable>

      <AppCreateExamModal
        v-model="state.createModalOpen"
        :form="form"
        :courses="coursesList"
        :loading="state.loading"
        @submit="submitCreateForm"
        @close="closeModals"
      />

      <AppUploadExamPdfModal
        v-model="state.uploadModalOpen"
        :exam="state.selectedExam"
        @close="closeModals"
        @uploaded="closeModals"
      />
    </template>
  </AccountLayout>
</template>
