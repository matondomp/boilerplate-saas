<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { FwbModal, FwbSpinner } from 'flowbite-vue'

import http from '../services.js'
import { Alert } from '@core/types/index.js'
import { DashboardForm } from '../types.js'

const alert = computed(() => usePage().props.alert as Alert)

const props = defineProps<{
  closeModal: () => void
  dashboardToDelete: DashboardForm
}>()

const emitDashboard = defineEmits(['success:onDelete'])
const deletingDashboard = ref(false)

const deleteDashboard = async () => {
  deletingDashboard.value = true
  await http.deleteDashboard(props.dashboardToDelete.slug as string).finally(() => {
    deletingDashboard.value = false
  })
}

watch(
  () => alert.value,
  () => {
    if (alert.value.success) {
      emitDashboard('success:onDelete')
    }
  }
)
</script>
<template>
  <FwbModal size="xl" @close="closeModal">
    <template #body>
      <div class="p-6 text-center">
        <svg
          class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          {{
            $t('dashboard_management.delete.warn', {
              dashboard: dashboardToDelete.name,
            })
          }}
        </h3>
        <div v-if="!deletingDashboard">
          <button
            loa
            data-modal-hide="popup-modal"
            type="button"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="deleteDashboard"
          >
            {{ $t('dashboard_management.delete.confirm') }}
          </button>
          <button
            data-modal-hide="popup-modal"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="closeModal"
          >
            {{ $t('dashboard_management.delete.cancel') }}
          </button>
        </div>
        <div v-else class="flex justify-center">
          <FwbSpinner size="10" />
        </div>
      </div>
    </template>
  </FwbModal>
</template>
