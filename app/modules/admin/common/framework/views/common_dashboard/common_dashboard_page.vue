<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import http from './services.js'
import { UserProp } from '@core/types/user.js'
import { AccountLayout } from '@core/layouts/index.js'
import { Dashboard, DashboardOption, DashboardItem } from './types.js'
import { DashboardHead, CommonDashboardItem } from './components/index.js'

type PageProps = {
  user: UserProp
  dashboards: Dashboard[]
}

const props = defineProps<PageProps>()

const dashboards = computed(() => props.dashboards)
const user = computed(() => props.user)

const selectedDashboard = ref<string | null>(null)
const dashboardItems = ref<DashboardItem[]>([])
const dashboardOptions = ref<DashboardOption[]>([])
const isLoading = ref(false)

watch(
  () => selectedDashboard.value,
  () => {
    loadDashboardItems()
  }
)

const loadDashboardItems = () => {
  if (selectedDashboard.value && !isLoading.value) {
    isLoading.value = true

    http
      .retrieveDashboardItems(selectedDashboard.value)
      .then((response) => {
        dashboardItems.value = response.data
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

onMounted(() => {
  dashboardOptions.value = dashboards.value?.map((dashboard: Dashboard) => ({
    value: dashboard.slug,
    name: dashboard.name,
    isDefault: dashboard.isDefault,
  }))

  const defaultDashboard = dashboardOptions.value?.find((dashboard) => dashboard.isDefault)

  if (defaultDashboard) {
    selectedDashboard.value = defaultDashboard.value
  } else if (dashboardOptions.value[0]) {
    selectedDashboard.value = dashboardOptions.value[0].value
  }

  loadDashboardItems()
})
</script>

<template>
  <AccountLayout
    :title="$t('menu.main.dashboard')"
    :b-t="$t('menu.main.dashboard')"
    :b-d="
      $t('admin.page_hero.common.dashboard.subtitle', {
        name: user.fullName,
      })
    "
  >
    <template #body>
      <main class="min-h-[90vh]">
        <DashboardHead
          :dashboards="dashboardOptions"
          v-model="selectedDashboard"
          :loading="isLoading"
          :load-dashboard-items="loadDashboardItems"
        />

        <div class="relative min-h-[100vh] dashboard-customized-scroll">
          <div
            v-for="item in dashboardItems"
            :key="item.name"
            class="dark:bg-base-200 border pt-3 pb-5 border-base-200 rounded-lg shadow absolute"
            :style="{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
            }"
          >
            <p class="px-4 text-gray-600 text-sm dark:text-gray-200">
              {{ item.name }}
            </p>
            <CommonDashboardItem :item="item" />
          </div>
        </div>
      </main>
    </template>
  </AccountLayout>
</template>
