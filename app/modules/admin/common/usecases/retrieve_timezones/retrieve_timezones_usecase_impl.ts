import { FindTimezonesRepository } from '#shared/usecases/ports/find_timezones_repository'
import { RetrieveTimezones } from '../../domain/index.js'

export class RetrieveTimezonesUseCaseImpl implements RetrieveTimezones.Contract {
  constructor(private readonly findTimezonesRepository: FindTimezonesRepository) {}
  async perform(): Promise<RetrieveTimezones.Output> {
    return this.findTimezonesRepository.findAll()
  }
}
