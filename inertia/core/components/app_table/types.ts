import type { Component } from 'vue'

export type BaseProps = {
  field: string
  headerName: string
  slot?: boolean
  i18n?: boolean
  isStatus?: boolean
  statusTextField?: string
  component?: Component
  componentProps?: any
  actions?: boolean
  sortable?: boolean
  sortableField?: string
  cellClasses?: string
  hideOnMobile?: boolean
}

export type ColumnProps = BaseProps

export type PaginationProps = {
  total: number
  perPage: number
  page: number
}

export type TableProps<T = any[]> = {
  columns: ColumnProps[]
  data: T
  pagination?: PaginationProps
  disableActionsIf?: boolean
  multiSelect?: boolean
  id: string
  summary?: boolean
}
