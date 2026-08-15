import { BaseValidation, RuleResult } from '@vuelidate/core'

export type InputProps = {
  modelValue: string | undefined
  type?: 'text' | 'email' | 'password'
  label?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  name: string
  minLength?: number
  v?: RuleResult & BaseValidation
}

export type TextareaProps = Omit<InputProps, 'type'> & {
  rows?: number
}

export type ValidationError = {
  message: string
  field: string
}
