import { HTMLAttributes } from 'vue'

export type ButtonProps = {
  loading?: boolean
  disabled?: boolean
  id?: string
  type?: 'submit' | 'button'
  size?: 'lg' | 'xs' | 'xl' | 'md' | 'sm'
  color?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'alternative'
  classes?: HTMLAttributes['class']
}
