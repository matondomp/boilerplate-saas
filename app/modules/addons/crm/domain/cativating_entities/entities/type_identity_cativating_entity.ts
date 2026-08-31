import { Entity } from "#core/domain/entity"

interface TypeCativatingEntityProps {
    name: string
    user_id: string
    entity_value: number
}

export class TypeCativatingEntity extends Entity<TypeCativatingEntityProps> {

    get name(): string {
        return this.props.name
    }
    get userID(): string {
        return this.props.user_id
    }
    get entityValue(): number {
        return this.props.entity_value
    }
}