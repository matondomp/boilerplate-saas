import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class DbMonitor extends BaseCommand {
  static commandName = 'db:monitor'
  static description = 'Return the count of total connections!'

  @flags.string({ description: 'Define a custom database connection', alias: 'c' })
  declare connection: string

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const db = await this.app.container.make('lucid.db')
    this.connection = this.connection || db.primaryConnectionName
    const connection = db.connection(this.connection || db.primaryConnectionName)

    const dbConfig = db.manager.get(this.connection)

    if (!dbConfig || !dbConfig?.config) {
      throw new Error(`Connection ${this.connection} not found`)
    }

    const conn = dbConfig.config.connection as any

    const totalConnectionsRaw = await connection.rawQuery(
      'SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST where DB = ? and COMMAND <> "Daemon"',
      [conn.database]
    )

    const totalConnections = totalConnectionsRaw[0]

    const report = await db.report()

    const table = this.ui.table()

    table
      .head(['Connection Name', 'Count of Connections', 'Slepping', 'Executing', 'healthly'])
      .row([
        db.primaryConnectionName,
        totalConnections.length,
        totalConnections.filter((x: any) => x.COMMAND === 'Sleep').length,
        totalConnections.filter((x: any) => x.STATE === 'executing').length,
        report.health
          ? {
              content: report.health.healthy
                ? this.colors.green(report.health.message)
                : this.colors.red(report.health.message),
            }
          : 'N/A',
      ])
      .render()

    await db.manager.close(db.primaryConnectionName)
  }
}
