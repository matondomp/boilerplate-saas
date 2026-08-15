export interface QueryBuilder<T> {
  build(input: T): {
    query: T
    queryHelper?: T
  }
}
