import { Entity } from "#core/domain/entity";
import { Contacts } from "../../@shared/value_objects/index.js";
import { ProvinceEntity } from "../../Residence/index.js";

interface AccountManagerProps {
    name: string
    contacts: Contacts
    email: string
    residence: ProvinceEntity
    slug: string
    is_delete: boolean
}

export class AccountManagerEntity extends Entity<AccountManagerProps> {

    get name(): string {
        return this.props.name
    }
    get contacts (): Contacts {
        return this.props.contacts
    }
    get email(): string {
        return this.props.email
    }
    get residence(): ProvinceEntity {
        return this.props.residence
    }
    get slug(): string {
        return this.props.slug
    }
    get is_delete(): boolean {
        return this.props.is_delete
    }
}