import { FindTimezonesRepository } from '#shared/usecases/ports/find_timezones_repository'

import timezones from './timezones.js'

export class FindTimezonesRepositoryImpl implements FindTimezonesRepository {
  async findAll(): Promise<string[]> {
    return [...new Set(timezones.map((t) => t.utc).flat()).values()].sort()
  }
}
