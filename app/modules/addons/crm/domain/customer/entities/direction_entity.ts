import { Entity } from "#core/domain/entity"

interface DerectionProps {
    designation: string
    slug: string
    user_id: string
}

export class DirectionEntity extends Entity<DerectionProps> {
    get designation (): string {
        return this.props.designation
    }
    get slug (): string {
        return this.props.slug
    }
    get user_id (): string {
        return this.props.user_id
    }
}