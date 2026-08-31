import { DomainError, Result } from "#core/domain/index";


export class ZoneNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'zone.name.require',
            error: ZoneNameRequireError.name
        })
    }
}