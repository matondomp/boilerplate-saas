import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique().primary()
      table.string('telefone')
      table.string('nome')
      table.string('genero_id')
      table.string('email')
      table.string('saldo')
      table.string('municipio_id')
      table.string('bairro_id')
      table.string('morada')
      table.string('user_id')
      table.string('created_id')
      table.string('gestor_cliente_id')
      table.string('created_at')
      table.string('updated_at')
      table.string('tipo_identidade_id')
      table.string('numero_identificacao')
      table.string('numero_entidade')
      table.string('numero_cliente')
      table.string('tipo_cliente_id')
      table.string('direccao_id')
      table.string('gestor_conta_id')
      table.string('is_active')
      table.string('entidade_cativadora_id')
      table.string('banco')
      table.string('telefone2')
      table.string('conta_bancaria')
      /* table.timestamp('created_at')
      table.timestamp('updated_at') */
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}