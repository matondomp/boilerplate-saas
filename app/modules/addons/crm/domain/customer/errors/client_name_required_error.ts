import { DomainError, Result } from "#core/domain/index";


export class ClientNameRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'client.name.require',
            error: ClientNameRequireError.name
        })
    }
}