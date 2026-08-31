import { createCustomerValidator } from '../validation/customer_validate.js'

export class createCustomerValidatorFactory {

    async hendle (data: any) {
       return await createCustomerValidator.validate(data)
    }
}