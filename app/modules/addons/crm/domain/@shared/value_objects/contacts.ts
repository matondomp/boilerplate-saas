import { left, right } from "#core/domain/either"
import { ClientContactRequireError } from "../erros/client_contact_required_error.js"

export class Contacts {
    phone: string 

    constructor (phone_number: string) {
        this.phone = phone_number
        this.validate()
    }
    validate() {
        if (!this.phone) {
            return left(new ClientContactRequireError())
        }
        return right(true)
    }

    get phone_number(): string {
        return this.phone
    }
}