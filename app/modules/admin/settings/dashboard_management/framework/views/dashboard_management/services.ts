import { useHttp } from '@core/utilities/http'

const http = useHttp()

http.setBaseUrl('/api/account/admin/settings/dashboards')

export default {
  setDashboardAsDefault(dashboardSlug: string) {
    return http.put(`default/${dashboardSlug}`)
  },
  deleteDashboard(dashboardSlug: string) {
    return http.delete(dashboardSlug)
  },
}
