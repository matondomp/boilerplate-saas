import { CoreBaseConsumer } from '#shared/framework/infra/consumers/index'

class CoreAdminCommonConsumer extends CoreBaseConsumer {
  constructor() {
    super('core.admin.common', 'CORE_ADMIN_COMMON')
  }
}

export default new CoreAdminCommonConsumer()
