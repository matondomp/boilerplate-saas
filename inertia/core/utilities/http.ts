import { router, usePage } from '@inertiajs/vue3'
import axios, { AxiosResponse, Method } from 'axios'
type Submit<S = any, E = any> = Promise<S | E | null>
type HandleSubmit = (url: string, extra?: any) => Submit

export type Http = {
  _baseUrl: string
  loading: boolean
  setBaseUrl: (url: string) => void
  post: HandleSubmit
  put: HandleSubmit
  patch: HandleSubmit
  delete: HandleSubmit
  submit: <S, E>(requestType: Method, url: string, extra?: any) => Submit<S, E>
  asyncSubmit: (requestType: Method, url: string, extra?: any) => Promise<AxiosResponse<any> | null>
  asyncPost: HandleSubmit
  asyncPut: HandleSubmit
  asyncPatch: HandleSubmit
  asyncDelete: HandleSubmit
}

export const useHttp = (http?: Partial<Http>): Http => ({
  loading: false,
  _baseUrl: '',
  setBaseUrl(url) {
    this._baseUrl = url + '/'
  },
  post(url: string, extra?: any) {
    return this.submit('post', url, extra)
  },

  put(url: string, extra?: any) {
    return this.submit('put', url, extra)
  },
  patch(url: string, extra?: any) {
    return this.submit('patch', url, extra)
  },
  delete(url: string, extra?: any) {
    return this.submit('delete', url, extra)
  },

  submit<S, E>(requestType: Method, url: string, extra?: any) {
    if (this.loading) {
      return new Promise((resolve) => {
        resolve(null)
      })
    }

    this.loading = true
    return new Promise(async (resolve, reject) => {
      router.visit<S, E>(`${this._baseUrl}${url}`, {
        method: requestType,
        data: {
          _csrf: usePage().props.csrfToken,
          ...extra,
        },
        onSuccess: (data: S) => {
          resolve(data as any)
        },
        onError: (error: E) => {
          reject(error)
        },
        onFinish: () => {
          this.loading = false
        },
      })
    })
  },

  async asyncSubmit(requestType: Method, url: string, extra?: any) {
    if (this.loading) {
      return new Promise((resolve) => {
        resolve(null)
      })
    }

    this.loading = true
    return axios
      .request({
        method: requestType,
        baseURL: this._baseUrl,
        url,
        data: {
          _csrf: usePage().props.csrfToken,
          ...extra,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch(({ response: { data } }) => {
        return data
      })
  },
  asyncPost(url: string, extra?: any) {
    return this.asyncSubmit('post', url, extra)
  },

  asyncPut(url: string, extra?: any) {
    return this.asyncSubmit('put', url, extra)
  },
  asyncPatch(url: string, extra?: any) {
    return this.asyncSubmit('patch', url, extra)
  },
  asyncDelete(url: string, extra?: any) {
    return this.asyncSubmit('delete', url, extra)
  },

  ...http,
})
