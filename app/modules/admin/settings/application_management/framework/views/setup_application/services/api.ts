import { usePage } from '@inertiajs/vue3'

import axios from 'axios'
export const apiService = {
  updateSettings: (formData: FormData) => {
    formData.append('_csrf', usePage().props.csrfToken as string)

    return axios.put('/account/admin/settings/app-settings', formData)
  },
}
