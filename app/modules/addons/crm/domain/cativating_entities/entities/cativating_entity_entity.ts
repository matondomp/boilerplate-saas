import { Entity } from "#core/domain/entity";
import { TypeCativatingEntity } from "../../customer/index.js";

interface CaptivatingEntityProps {
    name: string
    client_id: string
    value: string
    state: number
    user_id: string
    type_identity_cativating: TypeCativatingEntity
}

export class CaptivatingEntityEntity extends Entity<CaptivatingEntityProps> {

    get name(): string {
        return this.props.name
    }
    get value(): string {
        return this.props.value
    }
    get clientId(): string {
        return this.props.client_id
    }
    get state(): number {
        return this.props.state
    }
    get userID(): string {
        return this.props.user_id
    }
    get typeIdentityCativating(): TypeCativatingEntity {
        return this.props.type_identity_cativating
    }
}