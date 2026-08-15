/* eslint-disable @typescript-eslint/quotes */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DashboardItemModel } from '../models/index.js'
import Application from '@adonisjs/core/services/app'

export default class CreateItemsToTestSeed extends BaseSeeder {
  async run() {
    if (!Application.inProduction) {
      await DashboardItemModel.createMany([
        {
          name: 'Número de gráficos disponíveis no sistema em barra',
          sqlRaw: `
        SELECT JSON_OBJECT('xColumn', JSON_ARRAYAGG(xColumn),'yColumn', JSON_ARRAYAGG(yColumn)) AS result FROM
          (SELECT chart_type AS xColumn, COUNT(chart_type) AS yColumn FROM core_dashboard_items GROUP BY chart_type ) subquery
        `,
          chartType: 'BAR',
        },
        {
          name: 'Número de gráficos disponíveis no sistema em linha',
          sqlRaw: `
        SELECT JSON_OBJECT('xColumn', JSON_ARRAYAGG(xColumn),'yColumn', JSON_ARRAYAGG(yColumn)) AS result FROM
          (SELECT chart_type AS xColumn, COUNT(chart_type) AS yColumn FROM core_dashboard_items GROUP BY chart_type ) subquery
        `,
          chartType: 'LINE',
        },
        {
          name: 'Número de utilizador activos e bloqueados em pizza',
          sqlRaw: `
        SELECT JSON_OBJECT('xColumn', JSON_ARRAYAGG(xColumn),'yColumn', JSON_ARRAYAGG(yColumn)) AS result FROM
          (SELECT status_id AS xColumn, COUNT(status_id) AS yColumn FROM core_users GROUP BY status_id ) subquery
        `,
          chartType: 'PIZZA',
        },
        {
          name: 'Número de utilizador activos e bloqueados em barra',
          sqlRaw: `
        SELECT JSON_OBJECT('xColumn', JSON_ARRAYAGG(xColumn),'yColumn', JSON_ARRAYAGG(yColumn)) AS result FROM
          (SELECT status_id AS xColumn, COUNT(status_id) AS yColumn FROM core_users GROUP BY status_id ) subquery
        `,
          chartType: 'BAR',
        },
      ])
    }
  }
}
