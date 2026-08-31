import { Entity } from "#core/domain/entity";

interface ClientTypeProps {
    description: string
    client_account: string
    slug: string
    code: string
}

export class ClientTypeEntity extends Entity<ClientTypeProps> {

    get description (): string {
        return this.props.description
    }
    get client_account (): string {
        return this.props.client_account
    }
    get slug (): string {
        return this.props.slug
    }
    get code (): string {
        return this.props.code
    }

}