import { CoreBaseConsumer } from './core_base_consumer.js'

class CoreAdminAuditConsumer extends CoreBaseConsumer {
  constructor() {
    super('core.shared.audit.log', 'CORE_SHARED')
  }
}
export default new CoreAdminAuditConsumer()
