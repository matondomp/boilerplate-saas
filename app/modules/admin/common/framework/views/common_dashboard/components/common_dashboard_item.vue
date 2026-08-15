<script lang="ts" setup>
import type ApexCharts from 'apexcharts'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { chartManagement, updateChartOptions } from '@core/chart_management.js'

const chartContainer = ref<HTMLElement>()
const componentChart = ref<ApexCharts>()

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

watch(
  () => props.item,
  () => {
    const { xColumn, yColumn } = props.item.queryResult
    updateChartOptions.updateCoord({ chart: componentChart.value, xColumn, yColumn })
  }
)

onMounted(() => {
  componentChart.value = chartManagement({
    component: chartContainer.value!,
    chartType: props.item.chartType,
    data: props.item.queryResult,
  })
  componentChart.value.render()
})

onUnmounted(() => {
  componentChart.value?.destroy()
})
</script>

<template>
  <div ref="chartContainer" />
</template>
