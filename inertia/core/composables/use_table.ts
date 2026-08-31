import { router } from '@inertiajs/vue3'
import { reactive } from 'vue'
import { ColumnProps } from '../components/app_table/types'

export const useTable = () => {
  const selectedState = reactive<{ rows: string[] }>({
    rows: [],
  })

  const perPageOptions: { value: string; name: string }[] = [2, 5, 10, 20, 50, 100, 200].map(
    (value) => ({
      value: value.toString(),
      name: value.toString(),
    })
  )

  const handleTableFilters = (params: any) => {
    const currentParams = Object.fromEntries(new URLSearchParams(window.location.search))
    router.get('', { ...currentParams, ...params })
  }

  const handleSort = (column: ColumnProps, pagination: { sort?: string; direction?: string }) => {
    if (!column.sortable) return

    if ((column.sortableField || column.field) === pagination.sort) {
      pagination.direction = pagination.direction === 'asc' ? 'desc' : 'asc'
    }

    handleTableFilters({
      sort: column.sortableField || column.field,
      direction: pagination.direction,
    })
  }

  return {
    handleTableFilters,
    handleSort,
    perPageOptions,
    selectedState,
  }
}
