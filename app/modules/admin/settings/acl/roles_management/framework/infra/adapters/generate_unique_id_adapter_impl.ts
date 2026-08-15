import { cuid } from '@adonisjs/core/helpers'
import { GenerateUniqueIdAdapter } from '../../../usecases/find_permissions/ports/generate_unique_id_adapter.js'

export class GenerateUniqueIdAdapterImpl implements GenerateUniqueIdAdapter {
  generate(): string {
    return cuid()
  }
}
