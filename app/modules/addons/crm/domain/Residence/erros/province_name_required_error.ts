import { DomainError, Result } from "#core/domain/index";


export class ProvinceNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'province.name.require',
            error: ProvinceNameRequireError.name
        })
    }
}