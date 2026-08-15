import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

export const useHasPermission = () => {
  const permissions = computed(
    () => (usePage().props.user as { permissions: string[] })?.permissions
  )
  const checkPermission = (permission: string) => {
    return permissions.value.includes(permission)
  }

  return {
    checkPermission,
  }
}
