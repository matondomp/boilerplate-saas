export type Timezone = string

export interface FindTimezonesRepository {
  findAll(): Promise<Timezone[]>
}
