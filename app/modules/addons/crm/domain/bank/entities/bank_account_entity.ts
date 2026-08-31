import { Entity } from "#core/domain/entity";

interface BankAccountProps {
    iban: string
    municipality_id: string
    bank_id: string
    is_active: boolean
}

export class BankAccountEntity extends Entity<BankAccountProps> {

    get iban(): string {
        return this.props.iban
    }
    get municipality_id(): string {
        return this.props.municipality_id
    }
    get bank_id(): string {
        return this.props.bank_id
    }
    get is_active(): boolean {
        return this.props.is_active
    }
}