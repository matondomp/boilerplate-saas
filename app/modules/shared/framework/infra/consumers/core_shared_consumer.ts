import { CoreBaseConsumer } from './core_base_consumer.js'

class CoreSharedCommonConsumer extends CoreBaseConsumer {
  constructor() {
    super('core.shared', 'CORE_SHARED')
  }
}
export default new CoreSharedCommonConsumer()
