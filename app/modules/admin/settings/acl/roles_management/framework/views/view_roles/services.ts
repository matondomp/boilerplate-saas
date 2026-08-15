import { useHttp } from '@core/utilities/http'

const http = useHttp()

http.setBaseUrl('/account/admin/settings/acl/roles')

export const apiService = {
  deleteRole: async (roleId: string) => {
    return http.delete('delete', {
      roleId,
    })
  },

  deleteRoleBulk: async (roles: string[]) => {
    return http.delete('delete/bulk', {
      roles,
    })
  },
}
