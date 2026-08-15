import Errors from './errors.js'
import { Ref, UnwrapRef, reactive, ref, computed } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import axios, { Method } from 'axios'
import { UseForm } from './types.js'
import { useVuelidate } from '@vuelidate/core'
import { sameAs } from '@vuelidate/validators'
import { useHttp } from '../http.js'

export function useForm<T extends object>(
  defaultData: T,
  validations: Partial<{ [key in keyof T]: any }>
) {
  const originalData = reactive(defaultData)

  const errors = ref<Errors>(new Errors())

  const serialize = (form: object): object => {
    const keys = Object.keys(originalData)
    const r = {}

    for (const k of keys) {
      // @ts-ignore
      r[k] = form[k]
    }

    return r
  }

  const http = useHttp({
    submit<D = any, E = any>(requestType: Method, url: string, extra?: any) {
      if (validations) {
        v$.value.$validate()
      }

      if (validations && v$.value.$invalid) {
        return new Promise((resolve) => {
          resolve(null)
        })
      }

      if (this.loading) {
        return new Promise((resolve) => {
          resolve(null)
        })
      }

      this.loading = true

      return new Promise(async (resolve, reject) => {
        router.visit(`${this._baseUrl}${url}`, {
          method: requestType,
          data: {
            ...serialize(internal.value.model),
            _csrf: usePage().props.csrfToken,
            ...extra,
          },
          onSuccess: (data: D) => {
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
    async asyncSubmit<S = any, E = any>(requestType: Method, url: string, extra?: any) {
      if (validations) {
        v$.value.$validate()
      }

      if (validations && v$.value.$invalid) {
        return new Promise((resolve) => {
          resolve(null)
        })
      }

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
            ...serialize(internal.value.model),
            _csrf: usePage().props.csrfToken,
            ...extra,
          },
        })
        .then(({ data }: { data: S }) => {
          return data
        })
        .catch(({ response: { data } }: { response: { data: E } }) => {
          return data
        })
    },
  })

  const internal: Ref<UnwrapRef<UseForm<T>>> = ref<UseForm<T>>({
    model: reactive(defaultData),
    formData(): FormData {
      return Object.keys(originalData).reduce((acc: FormData, key: string) => {
        const idx: keyof T = key as keyof T

        // @ts-ignore
        acc.append(key, originalData.value[idx])
        return acc
      }, new FormData())
    },
    setValue(data: Partial<T>): void {
      Object.keys(originalData).map((key) => {
        const idx: keyof T = key as keyof T

        // @ts-ignore
        if (data[idx] && internal.value.model[idx] !== data[idx]) {
          // @ts-ignore
          internal.value.model[idx] = data[idx]
        }
      })
    },
    reset(): void {
      Object.keys(originalData).map(
        // @ts-ignore
        (key) => (internal.value[key] = originalData.value[key])
      )
      errors.value.clear()
    },
    clear(): void {
      Object.keys(originalData).map((key) => {
        internal.value.model[key] = ''
      })
    },
    ...http,
  })

  // built-in loader for sameAs and other refs

  let v: { [key in keyof T]: any } = {} as any
  const validationKeys = Object.keys(validations)

  for (const k of validationKeys) {
    // @ts-ignore
    if (!v[k]) {
      // @ts-ignore
      v[k] = {}
    }

    //@ts-ignore
    for (const j of Object.keys(validations[k])) {
      if (j.includes('sameAs')) {
        // @ts-ignore
        v[k][j] = sameAs(computed(() => internal.value.model[validations[k][j]]))

        continue
      }

      //@ts-ignore
      v[k][j] = validations[k][j]
    }
  }
  const v$ = useVuelidate(v, internal.value.model as any, {
    $lazy: true,
    $autoDirty: false,
  })

  return {
    form: internal,
    v$,
  }
}
