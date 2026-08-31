import { DomainError, Result } from "#core/domain/index";


export class DistrictNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'district.name.require',
            error: DistrictNameRequireError.name
        })
    }
}