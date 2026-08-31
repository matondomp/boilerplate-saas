<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue'
import { usePage } from '@inertiajs/vue3'
import { computed, ref, onMounted, watch } from 'vue'

import { AppDashboardItem, AppDashboardIsolatedItem } from './components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { AppWorkInProgress } from '@core/components/index.js'

import { Alert } from '@core/types/alert.js'
import { DashboardItem, Dashboard } from './types.js'
import { itemManagement } from '../services/item_management.js'
import { useItemsApiService } from './composables/dashboard_details/items_api_service.js'
import { useManageItemsLocally } from './composables/dashboard_details/manage_items_locally.js'

const pageData = computed(
  () =>
    usePage().props.data as {
      id: string
      items: DashboardItem[]
      dashboard: Dashboard
    }
)

const alert = computed(() => usePage().props.alert as Alert)

const itemsAbleToManage = ref<DashboardItem[]>([])
const createEditModalStatus = ref(false)
const updatingItemsCoordLocaly = ref(false)
const submitingItems = ref(false)
const itemsToSelect = ref<DashboardItem[]>([])
const itemsToSelectFiltered = ref<DashboardItem[]>([])
const itemToUpdate = ref<DashboardItem>()
const placedItemsContainer = ref(null)
const areAvailableItemsVisible = ref(true)
const itemReadyToDrop = ref(false)
const ITEM_COORD_STORAGE_KEY = `${pageData.value.dashboard.slug}-items`

const filterItemsAlreadyInDashboard = () => {
  itemsToSelectFiltered.value = itemsToSelect.value.filter((item) => {
    return !pageData.value.items.find((dashboardItem) => dashboardItem.id === item.id)
  })
}

const removeItemFromSelectList = (itemToRemove: DashboardItem) => {
  itemsToSelectFiltered.value = itemsToSelectFiltered.value.filter(
    (item) => item.id !== itemToRemove.id
  )
}

const {
  removePersistedItem,
  updateItemCoordLocaly,
  mergePersistedItemsCoordToLoadedItems,
  removeAllPersitedItems,
} = useManageItemsLocally({
  ITEM_COORD_STORAGE_KEY,
  itemsAbleToManage,
  updatingItemsCoordLocaly,
})

const { loadItems, addItemToDashboard, submitUpdatedItems, removeItemFromDashboard } =
  useItemsApiService({
    itemsAbleToManage,
    itemReadyToDrop,
    submitingItems,
    dashboardSlug: pageData.value.dashboard.slug,
    itemsToSelect,
    filterItemsAlreadyInDashboard,
    removeItemFromSelectList,
    removePersistedItem,
    removeAllPersitedItems,
  })

const execRemoveItemFromDashboard = async (itemId: string) => {
  removeItemFromDashboard(itemId).then(() => {
    if (alert.value && alert.value.success) {
      filterItemsAlreadyInDashboard()
      itemsAbleToManage.value = pageData.value.items
    }
  })
}

watch(
  () => pageData.value,
  () => {
    itemsAbleToManage.value = pageData.value.items
    mergePersistedItemsCoordToLoadedItems()
  }
)

watch(
  () => createEditModalStatus.value,
  () => {
    if (createEditModalStatus.value === false) {
      itemToUpdate.value!.id = undefined as any
    }
  }
)

watch(
  () => placedItemsContainer.value,
  () => {
    if (placedItemsContainer.value) {
      itemManagement.addItemToDashboard({
        component: placedItemsContainer.value,
        onItemDragEnterCallback: () => {
          itemReadyToDrop.value = true
        },
        onItemDragLeaveCallback: () => {
          itemReadyToDrop.value = false
        },
        onItemDropCallback: () => {},
      })
    }
  }
)

onMounted(() => {
  itemsAbleToManage.value = pageData.value.items

  mergePersistedItemsCoordToLoadedItems()
  loadItems()
})
</script>

<template>
  <AccountLayout
    :title="pageData.dashboard.name"
    :b-t="pageData.dashboard.name"
    :b-d="pageData.dashboard.description"
  >
    <template #body>
      <main class="box">
        <AppWorkInProgress extra>
          <div class="mt-4">
            <FwbButton
              v-if="updatingItemsCoordLocaly"
              class="h-[42px]"
              :loading="submitingItems"
              @click="submitUpdatedItems"
            >
              {{ $t('dashboard_management.items.edit.save') }}
            </FwbButton>
          </div>
        </AppWorkInProgress>
        <div class="flex flex-col lg:flex-row justify-between mt-5">
          <div
            id="dropzone"
            ref="placedItemsContainer"
            class="w-full min-h-[100vh] relative transition-all duration-500 dashboard-customized-scroll"
            :class="{ giveSpaceToItemsList: areAvailableItemsVisible }"
          >
            <AppDashboardItem
              v-for="item in pageData.items"
              :id="item.id"
              :key="item.id"
              :name="item.name"
              :x="Number(item.x)"
              :y="Number(item.y)"
              :width="Number(item.width)"
              :height="Number(item.height)"
              :chart-type="item.chartType"
              :query-result="item.queryResult"
              :items="itemsAbleToManage"
              @update:item="(itemWithNewCoord) => updateItemCoordLocaly({ itemWithNewCoord })"
              @on-remove="() => execRemoveItemFromDashboard(item.id)"
            />
          </div>
          <aside
            class="w-[350px] flex flex-col transition-all duration-500 gap-2 relative min-h-0 border-l dark:border-slate-700 pl-4"
            :class="{ hideItemsList: !areAvailableItemsVisible }"
          >
            <main v-if="itemsToSelectFiltered.length">
              <ul>
                <li v-for="item in itemsToSelectFiltered" :key="item.id">
                  <AppDashboardIsolatedItem
                    :chart-type="item.chartType"
                    :ready-to-drop="itemReadyToDrop"
                    :query-result="item.queryResult"
                    :items="itemsAbleToManage"
                    @item-grabbed="() => (itemReadyToDrop = false)"
                    @item-dropped="(coord) => addItemToDashboard({ item, coord })"
                  />
                </li>
              </ul>
            </main>

            <span
              v-else
              class="w-full h-full flex items-center justify-center relative overflow-hidden"
            >
              <p class="text-gray-400 dark:text-gray-500">
                {{ $t('dashboard_management.items.empty') }}
              </p>
            </span>
          </aside>
        </div>
      </main>
    </template>
  </AccountLayout>
</template>

<style scoped>
.giveSpaceToItemsList {
  width: calc(100% - 350px);
}

.hideItemsList {
  transform: translateX(100%);
  width: 0;
  padding: 0;
}

@media (max-width: 1023px) {
  .giveSpaceToItemsList {
    width: 100% !important;
  }
  aside {
    width: 100% !important;
    border-left: none !important;
    border-top: 1px solid rgb(75 85 99) !important;
    padding-left: 0 !important;
    padding-top: 1rem !important;
  }
  .hideItemsList {
    transform: translateY(100%) !important;
    height: 0 !important;
    width: 100% !important;
  }
}
</style>
