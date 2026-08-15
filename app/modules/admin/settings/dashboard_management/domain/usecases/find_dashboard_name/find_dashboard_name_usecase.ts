import { UseCase } from '#core/domain/index'
import { DashboardEntity } from '#modules/admin/settings/dashboard_management/domain/entities/index'

export type FindDashboardByNameUseCase = UseCase<string, DashboardEntity | undefined>
