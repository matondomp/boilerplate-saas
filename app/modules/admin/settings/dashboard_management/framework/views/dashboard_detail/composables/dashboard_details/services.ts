import axios from 'axios'
import { useHttp } from '@core/utilities/http'

const http = useHttp()

type ItemLinkedToDashboardProps = {
  dashboardSlug: string
  itemId: string
  x: number
  y: number
  width: number
  height: number
}

interface AddItemToDashboardProp extends ItemLinkedToDashboardProps {}

type UpdateDashboardProp = {
  items: ItemLinkedToDashboardProps[]
}

const baseUrl = '/api/account/admin/settings/dashboards'

http.setBaseUrl(baseUrl)

export default {
  async loadItems() {
    return await axios.get(`${baseUrl}/items`)
  },
  addItemToDashboard(props: AddItemToDashboardProp) {
    return http.post(`${props.dashboardSlug}/items/${props.itemId}`, props)
  },
  updateItems(props: UpdateDashboardProp) {
    return http.put('items', props)
  },
  removeItemFromDashboard(props: Partial<ItemLinkedToDashboardProps>) {
    return http.delete(`${props.dashboardSlug}/items/${props.itemId}`)
  },
}
