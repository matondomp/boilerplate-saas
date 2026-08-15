import axios from 'axios'

export default {
  retrieveDashboardSettings: async () => {
    return [
      {
        display: 'NoDashboard',
        id: 'default',
        default: true,
        options: [],
      },
    ]
  },
  retrieveDashboardItems: async (dashboardSlug: string) => {
    return axios.get(`/api/account/dashboard/${dashboardSlug}`)
  },
}
