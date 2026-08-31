import { DomainError, Result } from "#core/domain/index";


export class NeighborhoodNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'neighborhood.name.require',
            error: NeighborhoodNameRequireError.name
        })
    }
}