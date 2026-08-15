<script lang="ts" setup>
import { AppDropdown } from '@core/components/index.js'
import { FwbButton, FwbListGroup } from 'flowbite-vue'
import { onMounted, onUnmounted, reactive, watch, ref } from 'vue'

import { AppPopover } from '@core/components/index.js'
import { chartManagement, updateChartOptions } from '@core/chart_management.js'
import { itemManagement } from '../../services/item_management.js'
import { componentManagement } from '../../services/component_management.js'
import { uuidv4 } from '@core/utilities/uuid4.js'
import { initFlowbite } from 'flowbite'
import { DashboardItemProps, ItemCoord } from '../types.js'

const component = ref(null)
const componentGraphicContainer = ref()
const itemCoordEmiterTimer = ref<any>()
const removingItem = ref(false)
const itemChart = ref<any>(null)

const props = defineProps<DashboardItemProps>()

const itemData = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})

const emitItem = defineEmits(['update:item', 'onRemove'])

const setItemProperties = () => {
  Object.assign(itemData, {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
  })

  componentManagement.setComponentCoord({
    component: component.value,
    x: itemData.x,
    y: itemData.y,
    width: itemData.width,
    height: itemData.height,
  })
}

const emitItemCoord = () => {
  clearTimeout(itemCoordEmiterTimer.value)

  itemCoordEmiterTimer.value = setTimeout(() => {
    emitItem('update:item', {
      id: props.id,
      ...itemData,
    })
  }, 100)
}

const updateItemCoord = ({ x, y, width, height }: any) => {
  Object.assign(itemData, { x, y, width, height })
  emitItemCoord()
}

const otherItems = ref<any[]>([])

const setupItem = () => {
  setItemProperties()
  otherItems.value = [...props.items].filter((item: any) => item.id !== props.id)

  itemManagement.resizeItem({
    component: component.value,
    items: otherItems.value,
    callback: ({ width, height, x, y }: any) => {
      updateItemCoord({ x, y, height, width })

      componentManagement.setComponentCoord({
        component: component.value,
        x,
        y,
        width,
        height,
      })
    },
  })

  itemManagement.moveItem({
    component: component.value,
    items: otherItems.value,
    callback: ({ width, height, x, y }: ItemCoord) => {
      updateItemCoord({ x, y, height, width })

      componentManagement.setComponentCoord({
        component: component.value,
        x,
        y,
        width,
        height,
      })
    },
  })
}

watch(props, () => {
  setupItem()
})

watch(
  () => itemChart.value,
  () => {
    updateChartOptions.updateCoord({
      chart: itemChart.value,
      xColumn: props.queryResult.xColumn,
      yColumn: props.queryResult.yColumn,
    })
  }
)

onMounted(() => {
  setupItem()

  itemChart.value = chartManagement({
    component: componentGraphicContainer.value,
    chartType: props.chartType,
    data: props.queryResult,
  })
  itemChart.value.render()
  initFlowbite()
})

onUnmounted(() => {
  itemChart.value.destroy()
})

const removeItemFromDashboard = async () => {
  await itemChart.value.destroy()
  removingItem.value = true
  emitItem('onRemove')
}
</script>

<template>
  <div
    ref="component"
    class="flex-column bg-white border pt-3 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 absolute"
    :style="{
      left: `${itemData.x}%`,
      top: `${itemData.y}%`,
      width: `${itemData.width}%`,
      height: `${itemData.height}%`,
    }"
  >
    <div class="flex flex-row justify-between">
      <p class="px-4 text-gray-600 text-sm dark:text-gray-200">
        {{ name }}
      </p>
      <AppDropdown placement="left">
        <template #header>
          <button
            class="open-dashboard-item-actions inline-flex items-center pb-2 px-4 text-sm font-medium text-center text-gray-900 rounded-lg dark:text-white focus:ring-gray-50"
            type="button"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path
                d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
              />
            </svg>
          </button>
        </template>
        <template #default>
          <FwbListGroup>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <AppPopover :id="uuidv4()">
                <template #trigger="{ target, placement }">
                  <li
                    :data-popover-target="target"
                    :data-popover-placement="placement"
                    data-popover-trigger="click"
                    class="remove-dashboard-item-button block px-4 text-red-500 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium relative z-50"
                  >
                    <p>{{ $t('dashboard_management.delete') }}</p>
                  </li>
                </template>
                <template #body>
                  <p class="text-left">
                    {{ $t('dashboard_management.items.delete.warn', { item: props.name }) }}
                  </p>
                  <FwbButton
                    color="red"
                    size="xs"
                    class="remove-dashboard-item-confirm-button mt-2"
                    :loading="removingItem"
                    @click="removeItemFromDashboard()"
                  >
                    {{ $t('dashboard_management.delete.confirm') }}
                  </FwbButton>
                </template>
              </AppPopover>
            </ul>
          </FwbListGroup>
        </template>
      </AppDropdown>
    </div>
    <div class="componentChart">
      <div ref="componentGraphicContainer" class="h-full w-full overflow-hidden" />
    </div>
  </div>
</template>

<style scoped>
.componentChart {
  position: relative;
  height: calc(100% - 30px);
}

.apexcharts-tooltip span {
  color: #ffffff !important;
}
</style>
