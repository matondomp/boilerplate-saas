import { Entity } from "#core/domain/entity";

interface EntityTypeProps {
    name: string
    digits_number: string
    is_delete: boolean
    is_default: boolean
}

export class EntityTypeEntity extends Entity<EntityTypeProps> {
   
    get name (): string {
        return this.props.name
    }
    get digits_number(): string {
        return this.props.digits_number
    }
    get isDelete (): boolean {
        return this.props.is_delete
    }
    get isDefault(): boolean {
        return this.props.is_default
    }
}