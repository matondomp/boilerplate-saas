import { AggregateRoot } from '#core/domain/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { RoleEntity } from '../entities/role_entity.js'

export interface UserRoleProps {
  user: UserEntity
  role: RoleEntity
}

export class UserRoleAggregate extends AggregateRoot<UserRoleProps> {
  get user(): UserEntity {
    return this.props.user
  }

  get role(): RoleEntity {
    return this.props.role
  }

  static hydrate(props: UserRoleProps): UserRoleAggregate {
    return new UserRoleAggregate(props)
  }
}
