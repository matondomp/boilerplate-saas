<script lang="ts" setup>
import { AppDropdown, RouterLink } from '@core/components/index.js'
import { DashboardForm } from '../types.js'
import { initFlowbite } from 'flowbite'
import { onMounted } from 'vue'

const props = defineProps<DashboardForm>()

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <div
    class="dashboard dark:bg-gray-700 pl-4 rounded-lg min-w-[220px] h-14 shadow-lg text-gray-800 dark:text-white flex items-center justify-between transition-all duration-[0.2s] hover:text-gray-900 cursor-pointer gap-1"
  >
    <RouterLink :href="`/account/admin/settings/dashboards/${props.slug}`">
      <div class="flex py-4 items-center h-full">
        <span class="flex w-3 h-3 bg-green-500 rounded-full mr-3" />
        <p>{{ props.name }}</p>
      </div>
    </RouterLink>
    <div>
      <AppDropdown
        class="open-dashboard-actions inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-900 rounded-lg dark:text-white focus:ring-gray-50 dark:bg-gray-700"
      >
        <template #header>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path
              d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
            />
          </svg>
        </template>
        <template #default>
          <slot />
        </template>
      </AppDropdown>
    </div>
  </div>
</template>
