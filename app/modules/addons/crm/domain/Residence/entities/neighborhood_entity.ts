import { Entity, left, right } from "#core/domain/index";
import { NeighborhoodNameRequireError } from "../erros/index.js";

interface NeighborhoodProps{
    name: string
    abbreviation: string
    is_active: string
    user_id: string
}

export class NeighborhoodEntity extends Entity<NeighborhoodProps> {

    validate() {
        if (!this.props.name) {
            return left(new NeighborhoodNameRequireError())
        }
        return right(true)
    }
    get name(): string {
        return this.props.name
    }
    get abbreviation(): string {
        return this.props.abbreviation
    }
    get is_active(): string {
        return this.props.is_active
    }
    get user_id(): string {
        return this.props.user_id
    }
}