import { DomainError, Result } from "#core/domain/index";


export class ClientContactRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'client.contact.require',
            error: ClientContactRequireError.name
        })
    }
}