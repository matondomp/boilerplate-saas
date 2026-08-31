import { DomainError, Result } from "#core/domain/index";


export class MunicipalityNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'municipality.name.require',
            error: MunicipalityNameRequireError.name
        })
    }
}