import { UnwrapNestedRefs } from 'vue'
import { Http } from '../http.js'

export type UseForm<T> = {
  model: UnwrapNestedRefs<T>
  formData: () => FormData
  setValue: (data: Partial<T>) => void
  reset: () => void
  clear: () => void
} & Http
