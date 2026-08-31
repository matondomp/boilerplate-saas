<script setup lang="ts">
//@ts-ignore
import Datepicker from 'flowbite-datepicker/Datepicker'
import { onMounted, reactive, ref } from 'vue'
import { AppInput, AppDropdown, AppButton, AppSelect } from '@core/components/index.js'
import { AddedFilterProps, AppFilterProps, FilterType } from './types.js'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useDark } from '@vueuse/core'
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'

const isDark = useDark()

const props = defineProps<{
  filters: AppFilterProps[]
}>()
const emit = defineEmits<{ (event: 'filter-updated', queryString: string): void }>()

const valueToFilter = ref('')
const selectedFilter = ref({} as AppFilterProps)
const addedFilters = reactive<AddedFilterProps>({})
const url = new URL(window.location.href)

const selectFilter = (field: AppFilterProps) => {
  selectedFilter.value = field
}

const mergeExistingQueryParams = () => {
  const filterKeys = props.filters.map((filter) => filter.field)

  for (const param of url.searchParams.entries()) {
    if (filterKeys.includes(param[0])) {
      const filter = props.filters.find((filter) => filter.field === param[0])
      const key = filter!.field
      addedFilters[key] = filter!
      addedFilters[key].valueToFilter = param[1]
    }
  }
}

const updateUrlQueryParams = () => {
  history.pushState({}, '', url.toString())
}

const isSelectedFilterOfTypeDate = () => {
  return selectedFilter.value.type === FilterType.date
}

const isSelectedFilterOfTypeSelect = () => {
  return selectedFilter.value.type === FilterType.select
}

const cleanselectedFilter = () => {
  selectedFilter.value = {} as AppFilterProps
}

const cleanValueToFilter = () => {
  valueToFilter.value = ''
}

const addQueryParam = (param: string, value: string) => {
  url.searchParams.set(param, value)
  updateUrlQueryParams()
}

const addFilter = (value?: string, key = selectedFilter.value.field) => {
  addedFilters[key] = selectedFilter.value
  addedFilters[key].valueToFilter = value ?? valueToFilter.value

  if (addedFilters[key].type === FilterType.date) {
    addedFilters[key].valueToFilter = addedFilters[key].valueToFilter!.split('T')[0]
  }

  addQueryParam(addedFilters[key].field, addedFilters[key].valueToFilter as string)
  cleanselectedFilter()
  cleanValueToFilter()
  emitFilters()
}

const isFilterToAddValid = () => {
  return Object.keys(selectedFilter.value).length > 0 && valueToFilter.value.length > 0
}

const addFilterByEnterKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && isFilterToAddValid()) {
    addFilter()
  }
}

const addFilterBySelect = (filter: any) => {
  if (filter.length > 0) {
    addFilter(filter)
  }
}

const isAddedFiltersNotEmpty = () => {
  return Object.keys(addedFilters).length !== 0
}

const deleteQueryParam = (param: string) => {
  url.searchParams.delete(param)
  updateUrlQueryParams()
}

const removeFilter = (field: string) => {
  delete addedFilters[field]
  deleteQueryParam(field)
  emitFilters()
}

const emitFilters = () => {
  emit('filter-updated', url.searchParams.toString())
}

const getValueName = (field: any) => {
  if (!field) return ''

  if (field.type !== FilterType.select) return field.valueToFilter

  return (
    field.selectOptions?.find((i: any) => i.value === field.valueToFilter)?.name ||
    field.valueToFilter
  )
}

onMounted(() => {
  mergeExistingQueryParams()
})
</script>

<template>
  <div id="app-filter" class="relative w-full">
    <div class="add-filters">
      <AppDropdown class="relative" :full-width="true">
        <template #header>
          <AppButton color="primary" classes="w-full">
            <div class="flex items-center justify-between w-full">
              <p>{{ $t('shared.add_filter') }}</p>
              <PlusIcon class="w-4 ml-2" />
            </div>
          </AppButton>
        </template>
        <template #default>
          <div id="filters" class="w-full md:w-60 p-2 md:p-4">
            <AppSelect
              :model-value="$t('shared.select_one_option')"
              v-if="isSelectedFilterOfTypeSelect()"
              class="rounded-none"
              size="sm"
              :placeholder="$t('shared.filter.select_placeholder')"
              :options="selectedFilter.selectOptions!"
              @update:model-value="(e) => addFilterBySelect(e)"
            />
            <div v-else-if="isSelectedFilterOfTypeDate()">
              <VueDatePicker
                v-model="valueToFilter"
                :placeholder="$t('admin.audit.log.filter.fields.date.placeholder')"
                :enable-time-picker="false"
                format="dd/MM/yyyy"
                @update:model-value="addFilter"
                utc
                :dark="isDark"
              />
            </div>
            <AppInput
              v-else
              name="search"
              class="rounded-none"
              size="sm"
              :placeholder="$t('shared.filter_placeholer')"
              @keypress="(e: KeyboardEvent) => addFilterByEnterKey(e)"
              v-model="valueToFilter"
            />
            <div class="py-2">
              <div
                :class="[
                  'filter flex justify-between items-center text-gray-700 hover:bg-base-200 hover:dark:bg-base-300 p-1 text-sm dark:text-white cursor-pointer',
                  {
                    'dark:bg-gray-800': selectedFilter.field === i.field,
                  },
                  ,
                ]"
                @click="selectFilter(i)"
                v-for="i in filters"
              >
                <p>
                  {{ i.name }}
                </p>
                <div
                  v-if="selectedFilter.field === i.field"
                  class="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full"
                ></div>
              </div>
            </div>
            <AppButton
              color="alternative"
              class="w-full rounded-sm"
              size="xs"
              @click="addFilter()"
              :disabled="!isFilterToAddValid()"
            >
              <p>{{ $t('shared.add') }}</p>
            </AppButton>
          </div>
        </template>
      </AppDropdown>
    </div>
    <div
      v-if="isAddedFiltersNotEmpty()"
      id="added-filters"
      class="flex items-center gap-3 flex-wrap mt-3"
    >
      <div
        v-for="i in Object.entries(addedFilters)"
        class="added-filter text-gray-700 dark:text-white dark:bg-base-300 py-1 px-2 rounded-lg flex items-center justify-between gap-2"
      >
        <div class="content">
          <strong>{{ i[1].name }}:</strong> {{ getValueName(i[1]) }}
        </div>
        <div id="remove-filter">
          <button class="flex items-center justify-center" @click="removeFilter(i[0])">
            <XMarkIcon class="w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dp__theme_dark {
  --dp-background-color: #1f2937;
}
</style>
