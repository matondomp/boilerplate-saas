import { Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { Gender } from '../value_objects/index.js'
import {
    AccountManagerEntity,
    BankAccountEntity,
    BankEntity,
    CaptivatingEntityEntity,
    ClientTypeEntity,
    DirectionEntity,
    EntityTypeEntity,
 } from '../index.js'
 import { 
    ClientNameRequireError, 
    ClientGenderRequireError
 } from '../errors/index.js'
import { Contacts } from '../../@shared/value_objects/index.js'
import { ProvinceEntity } from '../../Residence/index.js'
import { createCustomerValidatorFactory } from '../factories/create_customer_validation_factory.js'

export interface ClientProps {
    name: string
    gender: Gender
    email: string
    balance: string
    residence: ProvinceEntity
    user_id: string
    identity_type: EntityTypeEntity
    identification_number: string
    entity_number_id: string
    client_number: string
    client_type: ClientTypeEntity
    direction: DirectionEntity
    account_manager: AccountManagerEntity
    is_active: string
    captivating_entity: CaptivatingEntityEntity
    contacts: Contacts[]
    bank_account: BankAccountEntity[]
    Bank: BankEntity[]
}
export class ClientEntity extends Entity<ClientProps>{

    async validate () {
        const validating = new createCustomerValidatorFactory()
        if (!(await validating.hendle(this.props))) {
            return left(new ClientNameRequireError())
        }
        return right (true)
    }

    get contacts(): Contacts[] {
        return this.props.contacts
    }
    get name(): string{
        return this.props.name
    }
    get geneder(): Gender{
        return this.props.gender
    }
    get email(): string{
        return this.props.email
    }
    get balance(): string{
        return this.props.balance
    }
    get residence(): ProvinceEntity{
        return this.props.residence
    }
    get user_id(): string{
        return this.props.user_id
    }
    get identity_type(): EntityTypeEntity{
        return this.props.identity_type
    }
    get identification_number(): string{
        return this.props.identification_number
    }
    get entity_number_id(): string{
        return this.props.entity_number_id
    }
    get client_number(): string{
        return this.props.client_number
    }
    get client_type(): ClientTypeEntity{
        return this.props.client_type
    }
    get direction(): DirectionEntity{
        return this.props.direction
    }
    get account_manager(): AccountManagerEntity{
        return this.props.account_manager
    }
    get is_active(): string{
        return this.props.is_active
    }
    get captivating_entity(): CaptivatingEntityEntity{
        return this.props.captivating_entity
    }
    get bank_account(): BankAccountEntity[] {
        return this.props.bank_account
    }
    get Bank(): BankEntity[] {
        return this.props.Bank
    }
    
    static hydrate(id: UniqueEntityID, props: ClientProps, options?: Options): ClientEntity {
        const clientEntity = new ClientEntity(props, id, options)
        return ( clientEntity )
    }
}