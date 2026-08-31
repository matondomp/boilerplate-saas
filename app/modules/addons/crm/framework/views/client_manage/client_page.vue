<script setup lang="ts">
import { UserProp } from '@core/types/user.js'
import { AccountLayout } from '@core/layouts/account_layout/index.js'
import { AppTable, AppTableActions } from '@core/components/app_table'
import { ColumnProps, TableProps } from '@core/components/app_table/types'



type ProfileProps = {
  user: UserProp
  data: UserProp
}

const props = defineProps<ProfileProps>()

console.log('props => ', props.user)
let col: ColumnProps[] = [
  {
    field: "Nome",
    headerName: "Nome",
    statusTextField: 'ola',
    actions: false
  },
  {
    field: "Morada",
    headerName: "Morada",
    actions: false
  },
  {
    field: "Conta",
    headerName: "Conta",
    actions: false
  },
  {
    field: "Nome",
    headerName: "Contrato",
    actions: false
  },
  {
    field: "Ação",
    headerName: "Ação",
    actions: true
  }
]

let rows =  [
  {
    key: 1,
    nome: "Matondo"
  },
  {
    key: 2,
    nome: "Pedro"
  },
  {
    key: 3,
    nome: "André"
  },
  {
    key: 4,
    nome: "João"
  }
]

let data: TableProps[] = [
  {
    columns: col,
    data: rows,
    id: '1'
  }
]

</script>

<template>
    <AccountLayout
      :title="props.user?.fullName"
      :b-t="$t('menu.main.client_management.crm', { fullName: props.user.fullName })"
      :b-d="$t('menu.main.client_management.client')"
    >
    <template #body>
      <p>Helllo {{ props.user.fullName }}</p> 
      <AppTable :columns="col" :data="data" :id="'slug'"/>
        
    </template> 
  </AccountLayout>
  
</template>

