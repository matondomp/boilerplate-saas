import { Dashboard, DashboardItem } from '../../types'

export function useManageItemsLocally({
  ITEM_COORD_STORAGE_KEY,
  itemsAbleToManage,
  updatingItemsCoordLocaly,
}: any) {
  const persistItemsCoordInBrowser = ({ items }: any) => {
    // @ts-ignore
    localStorage.setItem(
      ITEM_COORD_STORAGE_KEY,
      JSON.stringify(
        items.map((item: DashboardItem & Dashboard) => ({
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          slug: item.slug,
        }))
      )
    )
  }

  const updateItemCoordLocaly = ({ itemWithNewCoord }: any) => {
    itemsAbleToManage.value = itemsAbleToManage.value.map((item: any) => {
      if (item.id === itemWithNewCoord.id) {
        Object.assign(item, itemWithNewCoord)
      }
      return item
    })
    persistItemsCoordInBrowser({ items: itemsAbleToManage.value })
    updatingItemsCoordLocaly.value = true
  }

  const mergePersistedItemsCoordToLoadedItems = () => {
    // @ts-ignore
    const persistedItemsCoord = localStorage.getItem(ITEM_COORD_STORAGE_KEY)

    if (persistedItemsCoord) {
      updatingItemsCoordLocaly.value = true

      itemsAbleToManage.value.map((item: any) => {
        return Object.assign(
          item,
          JSON.parse(persistedItemsCoord).find(
            (persistedItem: any) => item.slug === persistedItem.slug
          )
        )
      })
    }
  }

  const removePersistedItem = ({ itemId }: any) => {
    // @ts-ignore
    localStorage.setItem(
      ITEM_COORD_STORAGE_KEY,
      JSON.stringify(itemsAbleToManage.value.filter((item: any) => item.id !== itemId))
    )
  }

  const removeAllPersitedItems = () => {
    // @ts-ignore
    localStorage.removeItem(ITEM_COORD_STORAGE_KEY)
    updatingItemsCoordLocaly.value = false
  }

  return {
    persistItemsCoordInBrowser,
    removePersistedItem,
    updateItemCoordLocaly,
    mergePersistedItemsCoordToLoadedItems,
    removeAllPersitedItems,
  }
}
