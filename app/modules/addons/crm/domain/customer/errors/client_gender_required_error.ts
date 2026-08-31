import { DomainError, Result } from "#core/domain/index";


export class ClientGenderRequireError extends Result<DomainError> {
    constructor () {
        super(false,{
            message: 'client.gender.require',
            error: ClientGenderRequireError.name
        })
    }
}