# Módulo Addon de CRM (`addons/crm`)

> **Localização:** `app/modules/addons/crm`  
> **Status:** `IN_PROGRESS` / `NEEDS_REVIEW`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `addons/crm` é uma extensão plugável de gestão de relacionamento com clientes, desenhada para controle cadastral de clientes, entidades cativantes, contas bancárias e endereços/residências.

---

## 2. Diagnóstico do Estado Atual da Implementação

### Componentes Implementados `[IMPLEMENTADO]`
- **Migração MySQL:** `1732630932957_create_clients_table.ts` criando a tabela `crm_clients` (campos `name`, `tax_number`, `type`, `user_id`, timestamps).
- **Model Lucid:** `ClientModel` apontando para a tabela `crm_clients`.
- **View Inertia:** `framework/views/client_manage/client.vue`.

### Inconsistências e Pendências Identificadas `[NEEDS_REVIEW]`
1. **Nomenclatura de Pastas:**
   - A pasta `domain/Residence` utiliza letra inicial maiúscula (violando a convenção snake_case / lowercase).
   - A pasta `domain/customer/use-cases` utiliza hífen, enquanto o padrão do projeto é `usecases`.
2. **Metadados de Rota:**
   - Em `framework/main/routes.ts`, o `routeAdapter` utiliza `operation: 'view-my-user-profile-page'` e `description: '[Admin->Common] View my user profile page'`, que foram copiados do módulo `AdminCommon`.
3. **Casos de Uso e Portas:**
   - Os usecases para criação, listagem e atualização de clientes precisam ser finalizados e vinculados aos controladores correspondentes.
4. **Testes:**
   - Ausência de testes unitários (`*.spec.ts`) e testes de integração.

---

## 3. Próximos Passos para Conclusão do Módulo

1. Renomear pastas fora de padrão: `domain/Residence` ➔ `domain/residence`, `domain/customer/use-cases` ➔ `domain/customer/usecases`.
2. Implementar use cases no padrão do [Golden Module](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md):
   - `CreateClientUseCase`
   - `ListClientsUseCase`
   - `UpdateClientUseCase`
   - `DeleteClientUseCase`
3. Criar controladores e factories em `framework/main/`.
4. Corrigir metadados e prefixo das rotas em `framework/main/routes.ts` (`/crm/clients` ou `/account/crm/clients`).
5. Criar testes unitários com Sinon cobrindo todos os fluxos.
6. Atualizar status no [Module Registry](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md) para `IMPLEMENTED`.
