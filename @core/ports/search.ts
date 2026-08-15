import { Paginate } from './pagination.js'

export interface Search {
  orderBy?: string
  orderByDirection?: 'asc' | 'desc'
  searchBy?: string[]
  filters?: {
    [key: string]: {
      operation: Operator
      value: string
    }
  }
  searchValue?: string
}

export enum Operator {
  LIKE = 'like',
  EQ = 'eq',
  NEQ = 'neq',
  GTE = 'gte',
  LTE = 'lte',
}

export const getOperator = (alia: Operator): string => {
  const op = {
    [Operator.LIKE]: 'LIKE',
    [Operator.EQ]: '=',
    [Operator.NEQ]: '!=',
    [Operator.GTE]: '>=',
    [Operator.LTE]: '<=',
  }[alia]

  if (!op) {
    throw new Error(`Invalid operator ${alia}`)
  }

  return op
}

export type SearchWithPagination = Search & Paginate
