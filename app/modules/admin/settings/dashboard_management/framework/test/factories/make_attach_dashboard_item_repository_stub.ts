import { AttachDashboardItemUseCaseInput } from '#modules/admin/settings/dashboard_management/domain/index'
import { AttachDashboardItemRepository } from '#modules/admin/settings/dashboard_management/usecases/index'

export const makeAttachDashboardItemRepositoryStub = (): AttachDashboardItemRepository => {
  return new (class implements AttachDashboardItemRepository {
    async attach(_input: AttachDashboardItemUseCaseInput): Promise<void> {
      return
    }
  })()
}
