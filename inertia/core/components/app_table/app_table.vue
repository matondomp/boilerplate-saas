<script lang="ts" setup>
import { computed, watch } from 'vue'
import { AppStatus, AppSelect, AppIcon } from '../index.js'
import { AppTableActions } from './index.js'
import { cn } from '~/core/utilities/cn.js'
import { useTable } from '@core/composables/use_table.js'

import { ColumnProps, TableProps } from './types.js'
const props = defineProps<TableProps>()
const emit = defineEmits(['update:selected'])

const normalizedColumns = computed(() => {
  return props.columns.map((col) => {
    return {
      ...col,
      field: col.field || col.key,
      headerName: col.headerName || col.label,
      slot: col.slot !== undefined ? col.slot : (col.key !== 'actions'),
      actions: col.actions !== undefined ? col.actions : (col.key === 'actions'),
    }
  })
})

const componentProps = (column: ColumnProps, row: any) => {
  const keys = Object.keys(column.componentProps)
  const props = {}

  keys.forEach((k) => {
    // @ts-ignore
    props[k] = row[column.componentProps[k]]
  })

  return props
}

const { handleSort, handleTableFilters, perPageOptions, selectedState } = useTable()

const rowIds = computed(() => props.data.map((d) => d[props.id]))
const allSelected = computed(() => selectedState.rows.length === rowIds.value.length)
const toogleCheck = () => {
  if (allSelected.value) {
    selectedState.rows = []
    return
  }
  selectedState.rows = [...rowIds.value]
}

watch(
  () => selectedState.rows,
  (_new, _) => {
    emit('update:selected', _new)
  }
)
</script>

<template>
  <div class="relative">
    <!-- <div v-if="selectedState.allSelected" class="mx-4"> -->
    <!--   <AppWorkInProgress /> -->
    <!-- </div> -->
    <div class="overflow-x-auto md:overflow-visible w-full">
      <table class="table table-xs">
        <thead>
          <tr>
            <th v-if="multiSelect" scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  @change="toogleCheck"
                  :checked="allSelected"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <template v-for="(column, i) in normalizedColumns" :key="(column as any).key">
              <th
                v-if="!column.actions"
                scope="col"
                :class="[
                  'px-6 py-3 md:table-cell',
                  { 'cursor-pointer': column.sortable, 'hidden': column.hideOnMobile },
                ]"
                @click="handleSort(column, pagination as any)"
              >
                <div
                  :class="
                    cn([
                      'flex flex-column items-center justify-center',
                      { 'justify-start': i === 0 },
                    ])
                  "
                >
                  {{ column.headerName }} &nbsp;
                  <template
                    v-if="
                      column.sortable &&
                      (pagination as any).sort === (column.sortableField || column.field)
                    "
                  >
                    <AppIcon
                      :icon="
                        (pagination as any).direction === 'desc' ? 'chevron-up' : 'chevron-down'
                      "
                      class="w-4 h-4"
                    />
                  </template>
                </div>
              </th>
              <th v-else>
                <span class="sr-only">actions</span>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row[id]">
            <!-- FwbCheckbox -->
            <td v-if="multiSelect" class="w-4 p-4">
              <div class="flex items-center">
                <input
                  :id="`checkbox-${row[id]}`"
                  v-model="selectedState.rows"
                  type="checkbox"
                  :value="row[id]"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-40"
                />
                <label :for="`checkbox-${row[id]}`" class="sr-only">checkbox</label>
              </div>
            </td>
            <!-- End FwbCheckbox -->
            <template v-for="(column, i) in normalizedColumns" :key="column.key">
              <td
                :class="
                  cn([
                    'px-6 py-4 text-center md:table-cell',
                    { 'w-5': column.actions, 'hidden': column.hideOnMobile },
                    { 'text-left': i === 0 },
                    column.cellClasses,
                  ])
                "
              >
                <template v-if="column.slot">
                  <slot :name="column.field" :row="row" />
                </template>
                <template v-else-if="column.isStatus">
                  <AppStatus
                    :status="row[column.field]"
                    :text="row[column.statusTextField || '']"
                  />
                </template>
                <template v-else-if="column.actions">
                  <AppTableActions
                    class="text-right"
                    :disabled="disableActionsIf"
                    :summary="summary"
                  >
                    <slot name="actions" :row="row" />
                  </AppTableActions>
                </template>
                <template v-else-if="column.component">
                  <component :is="column.component" v-bind="componentProps(column, row)" />
                </template>
                <template v-else>
                  {{ column.i18n ? $t(row[column.field]) : row[column.field] }}
                </template>
              </td>
            </template>
          </tr>
          <tr v-show="!data.length">
            <td :colspan="normalizedColumns.length + 5" class="text-center w-4 p-4">
              {{ $t('shared.empty') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-between items-center p-4" v-if="pagination">
      <div class="w-20">
        <AppSelect
          size="sm"
          :options="perPageOptions"
          :model-value="pagination.perPage.toString()"
          @update:model-value="(e) => handleTableFilters({ perPage: e, page: pagination?.page || pagination?.currentPage })"
        />
      </div>
      <div class="join">
        <VueAwesomePaginate
          :total-items="pagination.total"
          :model-value="pagination.page || pagination.currentPage"
          :on-click="(page: number) => handleTableFilters({ page, perPage: pagination?.perPage })"
          :items-per-page="pagination.perPage"
          :max-pages-shown="4"
          paginate-buttons-class="join-item btn"
          active-page-class="btn-active"
          back-button-class="join-item btn"
          next-button-class="join-item btn"
        />
      </div>
    </div>
  </div>
</template>
