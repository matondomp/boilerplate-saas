import http from './services'

export function useItemsApiService({
  itemReadyToDrop,
  dashboardSlug,
  itemsToSelect,
  submitingItems,
  itemsAbleToManage,
  filterItemsAlreadyInDashboard,
  removeItemFromSelectList,
  removePersistedItem,
  removeAllPersitedItems,
}: any) {
  const loadItems = () => {
    http.loadItems().then((items) => {
      itemsToSelect.value = items.data
      filterItemsAlreadyInDashboard()
    })
  }

  const addItemToDashboard = ({ item, coord }: any) => {
    removeItemFromSelectList(item)
    removePersistedItem({ itemId: item.id })

    http.addItemToDashboard({
      dashboardSlug,
      itemId: item.id,
      ...coord,
    })

    itemReadyToDrop.value = false
  }

  const submitUpdatedItems = async () => {
    submitingItems.value = true

    await http
      .updateItems({
        items: itemsAbleToManage.value.map((item: any) => ({
          dashboardSlug,
          itemId: item.id,
          ...item,
        })),
      })
      .then(() => {})
      .finally(() => {
        removeAllPersitedItems()
        submitingItems.value = false
      })
  }

  const removeItemFromDashboard = async (itemId: string) => {
    await http.removeItemFromDashboard({
      dashboardSlug,
      itemId: itemId,
    })
  }

  return {
    loadItems,
    addItemToDashboard,
    submitUpdatedItems,
    removeItemFromDashboard,
  }
}
