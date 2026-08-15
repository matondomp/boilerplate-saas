import { router, usePage } from '@inertiajs/vue3'

export const useLogout = () => {
  router.post('/security/auth/logout', {
    _csrf: usePage().props.csrfToken as string,
  })
}
