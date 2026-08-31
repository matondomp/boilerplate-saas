import { Entity } from "#core/domain/entity";
import { Address } from "../../@shared/value_objects/index.js";

interface BankProps {
    name: string
    abbreviation: string
    is_active: boolean
    user_id: string
    address: Address
    account_number: string
    iban: string
    primavera_credit_account: string
    primavera_debit_account: string
}

export class BankEntity extends Entity<BankProps> {

    get name(): string {
        return this.props.name
    }
    get abbreviation(): string {
        return this.props.abbreviation
    }
    get is_active(): boolean {
        return this.props.is_active
    }
    get user_id(): string {
        return this.props.user_id
    }
    get address(): Address {
        return this.props.address
    }
    get account_number(): string {
        return this.props.account_number
    }
    get iban(): string {
        return this.props.iban
    }
    get primavera_credit_account(): string {
        return this.props.primavera_credit_account
    }
    get primavera_debit_account(): string {
        return this.props.primavera_debit_account
    }
}