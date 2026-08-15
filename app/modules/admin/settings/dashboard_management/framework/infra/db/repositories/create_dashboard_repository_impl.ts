import { CreateDashboardRepository } from '#modules/admin/settings/dashboard_management/usecases/index'
import {
  CreateDashboardUseCaseInput,
  CreateDashboardUseCaseOutput,
} from '#modules/admin/settings/dashboard_management/domain/index'
import { DashboardModel } from '../models/dashboard_model.js'

export class CreateDashboardRespositoryImpl implements CreateDashboardRepository {
  async create(input: CreateDashboardUseCaseInput): Promise<CreateDashboardUseCaseOutput> {
    const dashboard = await DashboardModel.create(input)
    return dashboard
  }
}
