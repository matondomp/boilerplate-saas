import { DetachDashboardItemUseCaseInput } from './../../../domain/usecases/detach_dashboard_item/detach_dashboard_item_usecase_input.js'

export interface DetachDashboardItemRepository {
  detach(input: DetachDashboardItemUseCaseInput): Promise<void>
}
