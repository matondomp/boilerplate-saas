<script lang="ts" setup>
import { ref } from 'vue'
import { FwbButton } from 'flowbite-vue'

import http from '../services.js'
import { AppPopover } from '@core/components/index.js'

const props = defineProps<{
  index: string
  slug: string
  name: string
}>()

const emit = defineEmits(['onEdit', 'success:onDelete'])
const deletingDashboard = ref(false)

const deleteDashboard = async () => {
  deletingDashboard.value = true
  await http
    .deleteDashboard(props.slug)
    .then((data: any) => {
      if (data.props.alert.success) {
        emit('success:onDelete')
      }
    })
    .finally(() => {
      deletingDashboard.value = false
    })
}

const settingDashboardAsDefault = ref(false)

const setDashboardAsDefault = async () => {
  settingDashboardAsDefault.value = true
  await http.setDashboardAsDefault(props.slug).finally(() => {
    settingDashboardAsDefault.value = false
  })
}
</script>

<template>
  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
    <li
      class="update-dashboard-button block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-medium"
      @click="
        () => {
          emit('onEdit', { ...props })
        }
      "
    >
      <p>{{ $t('dashboard_management.edit') }}</p>
    </li>

    <li>
      <AppPopover
        :id="`set-default-${slug}-${index}`"
        :title="$t('dashboard_management.set_default')"
      >
        <template #trigger="{ target, placement }">
          <button
            :data-popover-target="target"
            :data-popover-placement="placement"
            data-popover-trigger="click"
            class="set-default-dashboard-button w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium"
          >
            {{ $t('dashboard_management.set_default') }}
          </button>
        </template>
        <template #body>
          <p class="text-left">
            {{ $t('dashboard_management.set_default.warn') }}
          </p>
          <FwbButton
            size="xs"
            class="set-default-dashboard-confirm-button mt-2"
            :loading="settingDashboardAsDefault"
            @click="setDashboardAsDefault()"
          >
            {{ $t('dashboard_management.set_default.confirm') }}
          </FwbButton>
        </template>
      </AppPopover>
    </li>
    <li>
      <AppPopover :id="`remove-${slug}-${index}`" :title="$t('dashboard_management.delete')">
        <template #trigger="{ target, placement }">
          <button
            :data-popover-target="target"
            :data-popover-placement="placement"
            data-popover-trigger="click"
            class="delete-dashboard-button w-full text-left px-4 text-red-500 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium"
          >
            {{ $t('dashboard_management.delete') }}
          </button>
        </template>
        <template #body>
          <p class="text-left">
            {{ $t('dashboard_management.delete.warn', { dashboard: props.name }) }}
          </p>
          <FwbButton
            color="red"
            size="xs"
            class="delete-dashboard-confirm-button mt-2"
            :loading="deletingDashboard"
            @click="deleteDashboard()"
          >
            {{ $t('dashboard_management.delete.confirm') }}
          </FwbButton>
        </template>
      </AppPopover>
    </li>
  </ul>
</template>
