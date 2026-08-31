import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'

export class Client extends BaseModel{

    @column({ isPrimary: true })
    declare id: string

    @column()
    declare telefone: string

    @column()
    declare nome: string

    @column()
    declare genero_id: string

    @column()
    declare email: string

    @column()
    declare saldo: string

    @column()
    declare municipio_id: string

    @column()
    declare bairro_id: string

    @column()
    declare morada: string

    @column()
    declare user_id: string

    @column()
    declare created_id: string

    @column()
    declare gestor_cliente_id: string

    @column()
    declare created_at: string

    @column()
    declare updated_at: string

    @column()
    declare tipo_identidade_id: string

    @column()
    declare numero_identificacao: string

    @column()
    declare numero_entidade: string

    @column()
    declare numero_cliente: string

    @column()
    declare tipo_cliente_id: string

    @column()
    declare direccao_id: string

    @column()
    declare gestor_conta_id: string

    @column()
    declare is_active: string

    @column()
    declare entidade_cativadora_id: string

    @column()
    declare banco: string

    @column()
    declare telefone2: string

    @column()
    declare conta_bancaria: string

    @beforeSave()
    static async setId(client: Client) {
        client.id = client.id || randomUUID()
    }

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}