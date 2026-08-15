<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { DashboardOption } from '../types.js'

import { AppSelect } from '@core/components/index.js'
import { usePage } from '@inertiajs/vue3'

const dashboardRefreshTime = computed(() => usePage().props.dashboardRefreshTime as any)
const refreshOptions = ref([])
const refreshTime = ref()
const refreshTimeIntervalID = ref()

watch(refreshTime, () => {
  clearInterval(refreshTimeIntervalID.value)

  refreshTimeIntervalID.value = setInterval(() => {
    props.loadDashboardItems()
  }, 1000 * refreshTime.value)
})

const loadRefreshOptions = () => {
  const { options, default: defaultRefreshTime } = dashboardRefreshTime.value

  refreshOptions.value = options
  refreshTime.value = defaultRefreshTime.value
}

onMounted(() => {
  loadRefreshOptions()
})

onBeforeUnmount(() => {
  if (refreshTimeIntervalID.value) {
    clearInterval(refreshTimeIntervalID.value)
  }
})

type DashboardHeadProps = {
  dashboards: DashboardOption[]
  loading: boolean
  loadDashboardItems: () => void
}

const props = defineProps<DashboardHeadProps>()

defineEmits(['load-dashboard-items'])
const model = defineModel<string | number | null>({ required: true })
</script>
<template>
  <div class="flex flex-col md:flex-row justify-between md:items-end mb-8">
    <div class="md:w-[350px]">
      <AppSelect
        v-model="model"
        :options="dashboards"
        :label="$t('dashboard.selected_dashboard')"
        :placeholder="$t('dashboard_management.items.select.placeholder')"
      />
    </div>
    <div class="md:w-[350px] md:mr-5">
      <AppSelect
        v-model="refreshTime"
        :label="$t('dashboard.refresh_time')"
        :options="refreshOptions"
        :placeholder="$t('dashboard_management.items.select.placeholder')"
      />
    </div>
  </div>
</template>
