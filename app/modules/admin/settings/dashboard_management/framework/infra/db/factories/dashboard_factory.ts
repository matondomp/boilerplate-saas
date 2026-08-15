import Factory from '@adonisjs/lucid/factories'
import { DashboardModel } from '#modules/admin/settings/dashboard_management/framework/infra/db/models/index'

export const dashboardFactory = Factory.define(DashboardModel, ({ faker }) => {
  const slug = faker.lorem.slug()
  return {
    name: slug,
    slug,
    description: faker.lorem.sentence(5),
  }
}).build()
