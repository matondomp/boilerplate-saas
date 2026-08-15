import { router } from '@inertiajs/vue3'

export default {
  stopImpersonate() {
    return new Promise((resolve) => {
      return router.post(
        '/account/admin/settings/acl/users/stop/impersonate',
        {},
        {
          onSuccess: (data: any) => {
            resolve(data)
          },
        }
      )
    })
  },
}
