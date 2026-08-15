export enum FilterType {
  date = 'date',
  select = 'select',
}

type SelectOptions = {
  name: string
  value: string
}[]

type FilterProps = {
  type?: FilterType.date | FilterType.select
  selectOptions?: SelectOptions
  valueToFilter?: string
  name: string
  field: string
}

export interface AddedFilterProps {
  [key: string]: FilterProps
}
export interface AppFilterProps extends FilterProps {}

export interface FilterUpdatedEvent {
  (
    event: 'filter-updated',
    data: { queryString: string; queryParams: { [key: string]: string } }
  ): void
}
