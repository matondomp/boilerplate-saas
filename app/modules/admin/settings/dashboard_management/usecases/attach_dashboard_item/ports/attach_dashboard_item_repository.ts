import { AttachDashboardItemUseCaseInput } from './../../../domain/usecases/attach_dashboard_item/index.js'

export interface AttachDashboardItemRepository {
  attach(input: AttachDashboardItemUseCaseInput): Promise<void>
}
