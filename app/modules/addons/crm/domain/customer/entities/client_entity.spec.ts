import { test } from '@japa/runner'
import { ClientEntity, ClientProps } from './client_entity.js'
import { DirectionEntity } from './direction_entity.js'
import { EntityTypeEntity } from './entity_type_entity.js'
import { BankAccountEntity } from '../../bank/entities/bank_account_entity.js'
import { ClientTypeEntity } from './client_type_entity.js'


test.group('test customer entity', ()=> {

    const props = {
        name: "matondo",
        client_number: 123,
        email: 'root@itgest.co.ao',
        direction: 'malueka',
        entity_number_id: 2,
        identification_number: 'bi 122345',
        gender: 'M',
        identity_type: null,
        residence: [],
        Bank: [],
        contacts: [ { phone: 925758037 }, { phone: 925758037 } ],
        account_manager: '123',
        balance: '300',
        bank_account: [ 
            {
                iban: 'ao122344',
                municipality_id: '2',
                bank_id: '2',
                is_active: true
            },
            {
                iban: 'ao122344',
                municipality_id: '3',
                bank_id: '1',
                is_active: true
            }
        ],
        captivating_entity: {
            name: 'unitel',
            client_id: 1,
            value: '200',
            state: 1,
            user_id: 3,
            type_identity_cativating: null,
        },
        is_active: '1',
        user_id: '2'
    }

    const clientEntity = new ClientEntity(props)
    console.log(clientEntity)
    test('create customer', async ({ assert }) => {
        assert.equal(clientEntity.email, 'root@itgest.co.ao')
    })
})