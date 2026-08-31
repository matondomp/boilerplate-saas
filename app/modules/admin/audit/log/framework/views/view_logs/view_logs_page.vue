<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { AppTable } from '@core/components/index.js'
import ExtractLogs from './components/extract_logs.vue'
import { ColumnProps } from '@core/components/app_table/types.js'
import {
  AppWorkInProgress,
  AppIcon,
  AppDateTooltip,
  AppButton,
  AppFilter,
} from '@core/components/index.js'
import { LogProps, LogsWithPaginationProps } from './types.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch } from 'vue'
import apiService from './services/api.js'
import { FilterType } from '@core/components/app_filter/types'

const pageLogs = computed<LogsWithPaginationProps>(
  () => usePage().props.logs as LogsWithPaginationProps
)
const queryString = ref('')
const sectionTitle = 'text-gray-800 dark:text-white'
const sectionDesc = 'text-gray-500 dark:text-gray-400 text-sm mt-1'
const isFullLogVisible = ref(false)
const isDetailLogCardVisible = ref(false)
const logsData = ref(pageLogs.value)
const queryParams = ref({})

const toggleLog = () => {
  isFullLogVisible.value = !isFullLogVisible.value
}

const showDetailLogCard = () => {
  isDetailLogCardVisible.value = true
}

const closeDetailLogCard = () => {
  isDetailLogCardVisible.value = false
}

const isExtractLogVisible = ref(false)

const toggleExtractLog = () => {
  isExtractLogVisible.value = !isExtractLogVisible.value
}

const { t } = useI18n()

const columns: ColumnProps[] = [
  {
    field: 'title',
    headerName: t('admin.audit.log.title'),
    slot: true,
  },
  {
    field: 'username',
    headerName: t('admin.audit.log.username'),
    slot: true,
  },
  {
    field: 'source',
    headerName: t('admin.audit.log.source'),
    slot: true,
    hideOnMobile: true,
  },
  {
    field: 'createdAt',
    headerName: t('admin.audit.log.date'),
    component: AppDateTooltip,
    componentProps: {
      value: 'createdAt',
      tooltip: 'createdAtText',
    },
    hideOnMobile: true,
  },
  {
    actions: false,
  } as any,
]

const filters = [
  // {
  //   name: t('admin.audit.log.filter.fields.title'),
  //   field: 'title',
  // },
  {
    name: t('admin.audit.log.filter.fields.source'),
    field: 'source',
  },
  {
    name: t('admin.audit.log.filter.fields.user'),
    field: 'user',
  },
  {
    type: FilterType.date,
    name: t('admin.audit.log.filter.fields.date'),
    field: 'date',
  },
  {
    type: FilterType.select,
    selectOptions: [
      {
        name: 'Sim',
        value: 'true',
      },
      {
        name: 'Não',
        value: 'false',
      },
    ],
    name: t('admin.audit.log.filter.fields.success'),
    field: 'success',
  },
]

const selectedLog = ref<LogProps | undefined>({} as LogProps)

const selectLog = (logHash: string) => {
  selectedLog.value = pageLogs.value.data.find((log) => log.hash === logHash)
}

const setQueryString = (value: string) => {
  queryString.value = value
}

const requestLogs = async () => {
  const response = await apiService.getLogs(queryString.value)
  logsData.value = response.data
}

watch(
  () => queryString.value,
  () => {
    requestLogs()
  }
)
</script>

<template>
  <AccountLayout
    :title="$t('menu.admin.audit.log')"
    :b-t="$t('menu.admin.audit.log')"
    :b-d="$t('admin.audit.log.layout.description')"
    :no-padding="true"
  >
    <template #body>
      <main>
        <div class="px-4">
          <AppWorkInProgress extra>
            <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
              <AppFilter
                :filters="filters"
                @filter-updated="(queryString) => setQueryString(queryString)"
              />
              <AppButton
                id="extract-logs"
                class="text-sm mt-1 px-4 py-2 h-[42px]"
                classes="w-full md:w-auto"
                @click="toggleExtractLog"
              >
                {{ $t('admin.audit.log.extract.button.extract') }}
              </AppButton>
            </div>
          </AppWorkInProgress>
        </div>
        <div
          :class="[
            'flex items-start gap-3 relative overflow-hidden',
            { 'show-log-detail': isDetailLogCardVisible },
          ]"
        >
          <div class="w-full table">
            <app-table
              id="view-logs"
              :columns="columns"
              :data="logsData.data"
              :pagination="logsData.pagination"
              :query-string="queryParams"
            >
              <template #title="{ row }">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-[10px] h-[10px] rounded-full',
                      { 'bg-green-400': row.success, 'bg-red-500': !row.success },
                    ]"
                  />
                  <p
                    class="cursor-pointer font-bold hover:dark:text-white hover:text-gray-600 ml-2"
                    @click="
                      () => {
                        selectLog(row.hash)
                        showDetailLogCard()
                      }
                    "
                  >
                    {{ $t(row.title) }}
                  </p>
                </div>
              </template>

              <template #username="{ row }">
                <p>{{ row.username }}</p>
              </template>

              <template #source="{ row }">
                <p>{{ $t(row.source) }}</p>
              </template>
            </app-table>
          </div>

          <div
            class="card-detail w-[400px] min-h-[400px] max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-800 px-4 py-2 customized-scroll flex justify-center items-center relative"
          >
            <p v-if="!selectedLog" class="font-bold text-lg text-gray-500 text-center">
              {{ $t('admin.audit.log.aside.details.description') }}
            </p>
            <div v-else class="w-full">
              <section class="flex items-center justify-between">
                <p class="text-gray-600 dark:text-white font-bold text-lg">
                  {{ selectedLog.title ? $t(selectedLog.title) : selectedLog.title }}
                </p>
                <div
                  class="w-[32px] h-[32px] flex justify-center items-center border border-slate-400 rounded-full cursor-pointer"
                  @click="closeDetailLogCard()"
                >
                  <AppIcon icon="arrow-right" :size="20" class="font-thin dark:text-white" />
                </div>
              </section>

              <section class="mt-5">
                <h3 :class="`${sectionTitle}`">
                  {{ $t('admin.audit.log.username') }}
                </h3>
                <p :class="`${sectionDesc}`">
                  {{ selectedLog.username }}
                </p>
              </section>

              <section class="mt-5">
                <h3 :class="`${sectionTitle}`">
                  {{ $t('admin.audit.log.date') }}
                </h3>
                <p :class="`${sectionDesc}`">
                  {{ selectedLog.createdAt }}
                </p>
              </section>

              <section class="mt-5">
                <h3 :class="`${sectionTitle}`">
                  {{ $t('admin.audit.log.source') }}
                </h3>
                <p :class="`${sectionDesc}`">
                  {{ selectedLog.source }}
                </p>
              </section>

              <section class="mt-5">
                <h3 :class="`${sectionTitle}`">
                  {{ $t('admin.audit.log.action_result') }}
                </h3>
                <p v-if="selectedLog.success" class="text-green-500 text-sm mt-1">
                  {{ $t('admin.audit.log.success') }}
                </p>
                <p v-else class="text-red-500 text-sm mt-1">
                  {{ $t('admin.audit.log.error') }}
                </p>
              </section>

              <section class="mt-5">
                <h3 :class="`${sectionTitle}`">
                  {{ $t('admin.audit.log.action') }}
                </h3>
                <p :class="`${sectionDesc}`">
                  {{ $t(selectedLog.summary ?? '') }}
                </p>
              </section>

              <section
                :class="['mt-5 overflow-hidden flex-col', { 'hide-log': !isFullLogVisible }]"
              >
                <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
                  <div class="flex items-center relative z-50 cursor-pointer" @click="toggleLog()">
                    <h3 :class="`${sectionTitle}`">
                      {{ $t('admin.audit.log.fullLog') }}
                    </h3>
                    <AppIcon
                      icon="chevron-up"
                      :size="20"
                      :class="['ml-3 transition-all dark:text-white chevron']"
                    />
                  </div>
                </div>
                <pre :class="['text-base/7 full-log', `${sectionDesc}`]">{{
                  selectedLog.fullLog
                }}</pre>
              </section>
            </div>
          </div>
        </div>
      </main>
    </template>
  </AccountLayout>
  <ExtractLogs
    v-if="isExtractLogVisible"
    :close-modal="toggleExtractLog"
    :query-string="queryString"
  />
</template>

<style scoped>
.card-detail {
  margin-right: -416px;
}

.table,
.card-detail {
  transition: all 0.5s;
}

.show-log-detail .table {
  width: calc(100% - 416px);
}

.show-log-detail .card-detail {
  margin-right: 0;
}

.hide-log .chevron {
  transform: rotate(180deg);
}

.hide-log .full-log {
  height: 0;
}

@media (max-width: 1023px) {
  .card-detail {
    position: fixed !important;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    width: 100% !important;
    max-width: 100vw !important;
    margin-right: -100% !important;
    max-height: 100vh !important;
  }
  .show-log-detail .table {
    width: 100% !important;
  }
  .show-log-detail .card-detail {
    margin-right: 0 !important;
  }
}
</style>
