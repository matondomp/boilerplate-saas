<script lang="ts" setup>
import { chartManagement } from '@core/chart_management.js'
import { itemManagement } from '../../services/item_management.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useItemTheme } from '@core/composables/item_theme.js'
import { DashboardIsolatedItems } from '../types.js'

const props = defineProps<DashboardIsolatedItems>()

const emitItem = defineEmits(['itemDropped', 'itemGrabbed'])
const movingItem = ref(false)
const dropzone = ref(null)
const component = ref<any>()
const componentChart = ref<any>()
const isOverlaping = ref(false)
const itemCoord = ref({})

type Pointer = { x: number; y: number }

const setComponentCoord = ({ x, y }: Pointer) => {
  component.value.setAttribute('data-x', x)
  component.value.setAttribute('data-y', y)
}

const translateItem = ({ x, y }: Pointer) => {
  component.value.style.transition = 'none'
  component.value.style.transform = `translate(${x}px,${y}px)`
}

const moveItemToInitialPosition = () => {
  component.value.style.transition = 'all 0.2s'
  component.value.style.transform = `translate(${0}px,${0}px)`
}

watch(
  () => componentChart.value,
  () => {
    useItemTheme({
      chart: componentChart.value,
      optionalData: { ...props.queryResult },
    })
  }
)

onMounted(() => {
  // @ts-ignore
  dropzone.value = document.getElementById('dropzone')

  componentChart.value = chartManagement({
    component: component.value,
    chartType: props.chartType,
    data: props.queryResult,
  })
  componentChart.value.render()

  itemManagement.moveIsolatedItem({
    dropzone: dropzone.value,
    component: component.value,
    items: props.items,

    startCallback() {
      movingItem.value = true
      emitItem('itemGrabbed')
    },

    moveCallback: ({ x, y, coord, overlaping }: any) => {
      isOverlaping.value = overlaping.some
      itemCoord.value = coord

      setComponentCoord({ x, y })
      translateItem({ x, y })
    },

    endCallback: () => {
      movingItem.value = false

      if (!props.readyToDrop || isOverlaping.value) {
        setComponentCoord({ x: 0, y: 0 })
        moveItemToInitialPosition()
      } else {
        componentChart.value.destroy()
        emitItem('itemDropped', itemCoord.value)
      }
    },
  })
})

onUnmounted(() => {
  componentChart.value.destroy()
})
</script>

<template>
  <div
    ref="component"
    class="w-full min-h-230 h-full flex-column bg-white border pt-3 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 active:rotate-3"
    :class="{
      'able-to-drop': readyToDrop && !isOverlaping && movingItem,
      'unable-to-drop': (!readyToDrop || isOverlaping) && movingItem,
    }"
  />
</template>

<style scoped>
.able-to-drop {
  border: 2px solid rgba(49, 196, 141, 0.9);
}

.unable-to-drop {
  border: 2px solid rgba(249, 128, 128, 0.9);
}
</style>
