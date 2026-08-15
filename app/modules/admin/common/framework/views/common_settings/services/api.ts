import { router, usePage } from '@inertiajs/vue3'
import axios from 'axios'

export const apiService = {
  updateNotifications: async (form: object) => {
    return new Promise((resolve) => {
      return router.put(
        '/account/notifications',
        { ...form, _csrf: usePage().props.csrfToken as string },
        {
          onFinish: () => {
            resolve(true)
          },
        }
      )
    })
  },
  updatePassword: async (form: object) => {
    return new Promise((resolve) => {
      return router.put(
        '/account/settings/password',
        { ...form, _csrf: usePage().props.csrfToken as string },
        {
          onFinish: () => {
            resolve(true)
          },
        }
      )
    })
  },
  updateUserInfo: async (form: FormData) => {
    form.append('_csrf', usePage().props.csrfToken as string)
    return new Promise((resolve) => {
      return router.put('/account/settings/users/info', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onFinish: () => {
          resolve(true)
        },
      })
    })
  },
  retrieveActivities: async (userId: string) => {
    return axios.get(`/api/account/${userId}/activities`)
  },
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
