import { Entity, left, right } from "#core/domain/index";
import { NeighborhoodEntity } from "./neighborhood_entity.js";
import { ZoneEntity } from "./zone_entity.js";
import { DistrictNameRequireError } from '../erros/district_name_required_error.js'

interface DistrictProps{
    name: string
    abbreviation: string
    is_active: string
    user_id: string
    neighborhood: NeighborhoodEntity[]
    zone: ZoneEntity[]
}

export class DistrictEntity extends Entity<DistrictProps> {
   
    validate() {
        if (!this.props.name) {
            return left(new DistrictNameRequireError())
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
    get neighborhoodEntity(): NeighborhoodEntity[] {
        return this.props.neighborhood
    }
    get zone(): ZoneEntity[] {
        return this.props.zone
    }
}