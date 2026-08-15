<script setup lang="ts">
// @ts-ignore
import Datepicker from 'flowbite-datepicker/Datepicker'
import { FwbInput } from 'flowbite-vue'
import { AppSelect, AppButton } from '@core/components/index.js'

import { router } from '@inertiajs/vue3'
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchBy = ref('')
const searchValue = ref('')
const dateSearchValue = ref('')
const inputFieldIsDate = ref(false)

const performFilter = () => {
  router.get('', {
    searchBy: searchBy.value,
    search: inputFieldIsDate.value
      ? new Date((getDatePickerEl()! as any).value).toISOString()
      : searchValue.value,
  })
}

const logFields = {
  TITLE: 'title',
  SOURCE: 'source',
  USERNAME: 'username',
  CREATEDAT: 'createdAt',
}

const filterOptions = [
  {
    value: logFields.TITLE,
    name: t('admin.audit.log.search.field.title'),
  },
  {
    value: logFields.SOURCE,
    name: t('admin.audit.log.search.field.source'),
  },
  {
    value: logFields.USERNAME,
    name: t('admin.audit.log.search.field.username'),
  },
  {
    value: logFields.CREATEDAT,
    name: t('admin.audit.log.search.field.createdAt'),
  },
]

watch(
  () => searchBy.value,
  () => {
    inputFieldIsDate.value = searchBy.value === logFields.CREATEDAT
  }
)

const getDatePickerEl = () => document.getElementById('datepickerId')

onMounted(() => {
  const datepickerEl = getDatePickerEl()
  new Datepicker(datepickerEl)
})
</script>

<template>
  <div class="flex items-end gap-2">
    <div class="w-[310px]">
      <AppSelect
        v-model="searchBy"
        :placeholder="$t('admin.audit.filter_by')"
        :options="filterOptions"
      />
    </div>
    <div class="flex items-center gap-2">
      <div v-show="inputFieldIsDate" class="relative max-w-sm">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
            />
          </svg>
        </div>
        <input
          id="datepickerId"
          v-model="dateSearchValue"
          datepicker
          datepicker-autohide
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="$t('admin.audit.log.search.field.createdAt.placeholder')"
        />
      </div>

      <FwbInput
        v-show="!inputFieldIsDate"
        v-model="searchValue"
        :placeholder="$t('admin.audit.filter_by_text')"
        class="w-[310px]"
      >
        <template #prefix>
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </template>
      </FwbInput>

      <AppButton size="md" @click="performFilter">
        {{ $t('admin.audit.filter') }}
      </AppButton>
    </div>
  </div>
</template>
