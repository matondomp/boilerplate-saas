import { Entity, left, right } from "#core/domain/index";
import { ZoneNameRequireError } from "../erros/index.js";

interface ZoneProps{
    name: string
    abbreviation: string
    is_active: string
    user_id: string
}

export class ZoneEntity extends Entity<ZoneProps> {
    validate() {
        if (!this.props.name) {
            return left(new ZoneNameRequireError())
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