import { Entity, left, right } from "#core/domain/index";
import { ProvinceNameRequireError } from "../erros/index.js";
import { municipalityEntity } from "./municipality_entity.js";

interface ProvinceProps{
    name: string
    abbreviation: string
    is_active: string
    user_id: string
    municipalities: municipalityEntity[]
}

export class ProvinceEntity extends Entity<ProvinceProps> {
    
    validate() {
        if (!this.props.name) {
            return left(new ProvinceNameRequireError())
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
    get municipalities(): municipalityEntity[] {
        return this.props.municipalities
    }
}