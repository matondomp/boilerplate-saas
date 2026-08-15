import axios from 'axios'
import { useHttp } from '@core/utilities/http'
import eventBus from '@core/event_bus.js'
import { usePage } from '@inertiajs/vue3'

const http = useHttp()

http.setBaseUrl('/account/admin/settings/acl/users')

type UserOperationForm = {
  username: string
}

type UserAuditedOperationForm = UserOperationForm & {
  motivation: string | null
}

export const apiService = {
  loadRoles: <T>() => {
    return axios.get<T>('/api/admin/settings/acl/roles/dropdown')
  },

  deleteUser: (form: UserAuditedOperationForm) => {
    return http.delete('', form)
  },
  redefinePassword: (form: UserOperationForm) => {
    return axios.put<{ newPassword: string }>(
      '/api/account/admin/settings/acl/users/redefine_password',
      {
        ...form,
        _csrf: usePage().props.csrfToken,
      }
    )
  },
  blockUser: (form: UserAuditedOperationForm) => {
    return http.put('block', form)
  },
  unblockUser: (form: UserAuditedOperationForm) => {
    return http.put('unblock', form)
  },
  impersonateUser: (form: UserOperationForm) => {
    return http.post('impersonate', form)
  },
}

type Loading = {
  key: string | null
}

export const useApiService = () => {
  const onSortChange = (e: any) => {
    console.log(e)
  }

  const onBlockUser = async (username: string, loading: Loading) => {
    loading.key = 'block-user'
    await apiService
      .blockUser({
        username,
        motivation: null,
      })
      .finally(() => {
        loading.key = null
      })
  }

  const onImpersonateUser = async (username: string, loading: Loading) => {
    loading.key = 'impersonating-user'
    await apiService
      .impersonateUser({
        username,
      })
      .finally(() => {
        loading.key = null
      })
  }
  const onUnblockUser = async (username: string, loading: Loading) => {
    loading.key = 'unblock-user'
    await apiService
      .unblockUser({
        username,
        motivation: null,
      })
      .finally(() => {
        loading.key = null
      })
  }

  const onDeleteUser = async (username: string, loading: Loading) => {
    loading.key = 'remove-user'
    await apiService
      .deleteUser({
        username,
        motivation: null,
      })
      .then(() => {
        eventBus.emit('user-deleted', username)
      })
      .finally(() => {
        loading.key = null
      })
  }

  const onRedefineUserPassword = async (username: string, loading: Loading) => {
    loading.key = 'redefine-user-password'
    await apiService
      .redefinePassword({
        username,
      })
      .then(({ data }) => {
        eventBus.emit('redefine-user-password', data.newPassword)
      })
      .catch(({ response: { data } }) => {
        eventBus.emit('error-redefine-user-password', data.message)
      })
      .finally(() => {
        loading.key = null
      })
  }

  return {
    onRedefineUserPassword,
    onDeleteUser,
    onBlockUser,
    onSortChange,
    onUnblockUser,
    onImpersonateUser,
  }
}
