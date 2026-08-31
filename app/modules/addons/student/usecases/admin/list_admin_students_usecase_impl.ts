import { Either, right } from '#core/domain/index'
import {
  ListAdminStudentsRepository,
  ListAdminStudentsFilter,
  PaginatedAdminStudentsResult,
} from './ports/index.js'

export class ListAdminStudentsUseCaseImpl {
  constructor(private readonly listRepository: ListAdminStudentsRepository) {}

  async perform(
    filter: ListAdminStudentsFilter
  ): Promise<Either<null, PaginatedAdminStudentsResult>> {
    const result = await this.listRepository.listAdminStudents(filter)
    return right(result)
  }
}
