import { Entity } from "#core/domain/entity";
import { DistrictEntity } from "./district_entity.js";
import { MunicipalityNameRequireError } from '../erros/index.js'
import { left, right } from "#core/domain/index";

interface municipalityProps {
    name: string
    abbreviation: string
    has_district: string
    has_locality: string
    is_active: string
    primavera_account: string
    primavera_invoice_account: string
    user_id: string
    receipt_account: string
    disticts: DistrictEntity[]
}

export class municipalityEntity extends Entity<municipalityProps> {

  validate() {
    if (!this.props.name) {
        return left(new MunicipalityNameRequireError())
    }
    return right(true)
  }
  get name(): string {
    return this.props.name
  }
  get abbraviation(): string {
    return this.props.abbreviation
  }
  get has_district(): string {
    return this.props.has_district
  }
  get has_locality(): string {
    return this.props.has_locality
  }
  get is_active(): string {
    return this.props.is_active
  }
  get primavera_account(): string {
    return this.props.primavera_account
  }
  get primavera_invoice_account(): string {
    return this.props.primavera_invoice_account
  }
  get receipt_account(): string {
    return this.props.receipt_account
  }
  get districts(): DistrictEntity[] {
    return this.props.disticts
  }
}