# Boilerplate Monolítico Modular

Este é um boilerplate que utiliza a abordagem de Design Orientado a Domínio (DDD) e Arquitetura Limpa (Clean Architecture). Ele foi desenvolvido com o framework Adonis v6 e Vue.js, e requer um ambiente mínimo com Node.js 20.9.0 e NPM 10.2.4, MongoDB e MySQL.


> 📖 **DOCUMENTAÇÃO CENTRAL & BASE DE CONHECIMENTO:**  
> A documentação completa de arquitetura, inventário vivo de módulos, padrões e o **[Guia Mandatório de Desenvolvimento com IA](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/ai/ai-development-guide.md)** estão disponíveis na pasta [`docs/`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/README.md).  
> **Qualquer desenvolvimento ou interação com IA DEVE seguir estritamente o protocolo em [`docs/ai/ai-development-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/ai/ai-development-guide.md).**

## Tecnologias

- Adonis v6
- Lucid ( ORM )
- MongoDB Client
- Vue.js 3
- Inertia.js

## Requisitos

Para utilizar este boilerplate, certifique-se de ter os seguintes requisitos mínimos instalados:

- \>= Node.js 20.14.0
- MongoDB
- MySQL
- Linux ( O uso do ambiente Linux é obrigatório por conta do FileSystem )

> O Projecto tem configurado o [https://volta.sh](volta), assim, não precisas baixar manualmente a versão do node, desde que tenhas o volta instalado, ele vai lidar com essas questões.

## Requisitos de estudo

- TDD
- DDD
- Clean Arch
- Mensageria assíncrona ( Opcional, o boilerplate abstrai bastante )

## Instalação

Siga as etapas abaixo para instalar e configurar o projeto:

1. Clone o repositório.
2. Navegue até a pasta do projeto.
3. Execute o comando `npm install` para instalar as dependências.
4. Execute o comando `node ace migration:run` para migrar as migrations a BD.
5. Execute o comando `node ace db:sync` para sincronizar os dados dos seeders no banco de dados.
6. Configure os arquivos de ambiente, se necessário.
7. Execute o comando `npm run dev` para iniciar o servidor.

> Para o ambiente linux talvez você precise de instalar os build-essentials para prover ao sistema mais recursos para desenvolvimento, como o `make` por exemplo.

## Estrutura do Projeto

O projeto possui a seguinte estrutura de diretórios:

- `@core`: Funções essenciais para o funcionamento do boilerplate.
- `app`: Contém todos os módulos da aplicação.
  - `framework`: Funções globais da framework.
  - `infra`:
  - `modules`: Módulos do sistema.
    - `addons`: Local onde serão instalados todos os módulos que não são incorporados por padrão. Esses módulos são ignorados pelo Git.
    - `admin`: Módulo administrativo disponível, com configuração completa de ACL (Access Control List).
    - `auth`: Módulo de autenticação com usuário e senha, já incorporado.
    - `shared`: Compartilhamento de código entre todos os módulos da aplicação.
- `commands`: Comandos personalizados para execução no projeto.
- `config`: Arquivos de configuração da aplicação.
- `providers`: Provedores de serviços e dependências.
- `resources`: Recursos estáticos, como arquivos de estilo e imagens.
- `start`: Arquivos de inicialização e configuração do servidor.
- `tests`: Testes automatizados (e2e, unit).

## Estrutura de um Módulo

Cada módulo dentro da pasta `app/modules` segue uma estrutura específica:

- `moduleName`:

  - `domain`:
    - `entities`: Entidades do domínio específicas do módulo.
    - `errors`: Tratamento dos possíves erros do módulo.
    - `events`: Declaração dos eventos de domínio.
    - `usecases`: Declaração dos casos de uso, seus erros, inputs e outputs.
    <!-- - `value-objects`: Objetos de valor específicos do módulo. -->
  - `framework`:
    - `infra`:
      - `adapters`: Implementação de adaptadores para bibliotecas externas.
      - `db`: Migrações, seeders, modelos, mapeadores e repositórios específicos do módulo.
      - `listeners`: Implementação dos eventos de domínio.
      - `resources`: Templates para e-mails.
      - `services`: Implementação de serviços adicionais.
      - `tasks`: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      <!-- - `jobs`: Registro de jobs utilizando o BullMQ. -->
    - `main`:
      - `controllers`: Controladores normais do Adonis.js.
      - `factories`: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      - `i18n`: Arquivos de tradução para cada idioma.
      - `validations`: Validações específicas do módulo.
      - `events.ts`: Arquivo para registrar os eventos de domínio, lido automaticamente pelo IoC do boilerplate.
      - `routes.ts`: Arquivo que registra as rotas, lido automaticamente pelo IoC do boilerplate.
      <!-- - `socket.ts`: Arquivo para adicionar funcionalidades de tempo real usando o Socket.io, lido automaticamente pelo IoC do boilerplate. -->
    - `tests`:
    - `views`: Páginas desenvolvidas com o Vue.js, renderizadas como SPA usando o Inertia.js.
  - `usecases`: Implementação dos casos de uso utilizando o padrão de portas e adaptadores.

- `package.json`: Cada módulo pode ter suas próprias dependências definidas dentro deste arquivo. Isso é especialmente relevante para os módulos que estão em `addons`.

## Desenvolvimento

Ao desenvolver sua aplicação com este boilerplate, é recomendado seguir as práticas de DDD e Arquitetura Limpa. Os módulos existentes podem ser utilizados como referência para criar novos módulos.

Você pode adicionar novos módulos na pasta `app/modules/addons`, utilizando a estrutura descrita acima. Certifique-se de que seus módulos sigam os princípios de DDD e Arquitetura Limpa, separando as responsabilidades corretamente e mantendo a modularidade.

## Comandos Especiais

O boilerplate possui alguns comandos especiais que podem ser executados para facilitar tarefas específicas durante o desenvolvimento do projeto. Esses comandos são úteis para instalar dependências de módulos, instalar e atualizar addons, e sincronizar as seeders do banco de dados.

### Comando `node ace addon:install:deps`

O comando `node ace addon:install:deps` é utilizado para instalar todas as dependências de todos os módulos instalados no projeto. Isso permite garantir que todas as dependências necessárias para o funcionamento dos módulos sejam instaladas de forma automatizada.

Exemplo de uso:

```
node ace addon:install:deps
```

### Comando `node ace addon:install <nome-do-addon>`

O comando `node ace addon:install <nome-do-addon>` é usado para instalar um novo addon no projeto. Esse comando simplifica o processo de instalação de um addon específico, permitindo adicionar facilmente novas funcionalidades ao boilerplate.

Exemplo de uso:

```
node ace addon:install nome-do-addon
```

### Comando `node ace addon:update <nome-do-addon>`

O comando `node ace addon:update <nome-do-addon>` é utilizado para atualizar um addon já instalado no projeto. Com esse comando, é possível manter os addons atualizados com as versões mais recentes, garantindo correções de bugs e melhorias de recursos.

Exemplo de uso:

```
node ace addon:update nome-do-addon
```

### Comando `node ace db:sync`

O comando `node ace db:sync` é usado para executar apenas as seeders que ainda não foram executadas a nível de projeto. Esse comando é útil para sincronizar o estado atual do banco de dados com as alterações nas seeders, permitindo a atualização do banco de dados de forma controlada e consistente.

Exemplo de uso:

```
node ace db:sync
```

### Conclusão

Os comandos especiais fornecidos pelo boilerplate facilitam algumas tarefas comuns durante o desenvolvimento do projeto. Eles permitem instalar dependências de módulos, adicionar novos addons, atualizar addons e sincronizar as seeders do banco de dados. Utilize esses comandos conforme necessário para agilizar seu fluxo de trabalho e melhorar a eficiência no desenvolvimento do projeto.

## Comunicação entre Módulos

A comunicação entre os módulos do boilerplate ocorre de forma assíncrona, utilizando os padrões Outbox e Inbox para garantir a troca de informações de forma confiável e resiliente.

### Padrões Outbox e Inbox

O padrão Outbox é utilizado quando um módulo precisa informar a outro módulo sobre determinada ação ou evento. Quando um módulo deseja enviar uma mensagem para outro módulo, ele registra essa mensagem no Outbox. O Outbox, por sua vez, utiliza o RabbitMQ, um sistema de mensageria assíncrona, para enviar essa mensagem ao módulo de destino.

Ao receber a mensagem, o módulo de destino a coloca no Inbox para processamento posterior. O Inbox é responsável por armazenar as mensagens recebidas e garantir que elas sejam processadas sem perdas.

Dessa forma, os módulos podem se comunicar de forma independente, sem a necessidade de acoplamento direto. Cada módulo pode registrar as mensagens relevantes no Outbox e receber as mensagens correspondentes no Inbox, permitindo uma comunicação eficiente e flexível entre os diferentes componentes do sistema.

#### Requisitos de Estudo

Para aprofundar o estudo sobre os padrões Outbox e Inbox, recomenda-se a pesquisa e leitura sobre os seguintes tópicos:

- Outbox Pattern: Exploração do padrão Outbox e como ele é utilizado para garantir a entrega de mensagens assíncronas entre os módulos.
- Inbox Pattern: Compreensão do padrão Inbox e como ele é responsável por receber e processar as mensagens enviadas pelos outros módulos.
- RabbitMQ: Estudo sobre a ferramenta de mensageria RabbitMQ, utilizada pelo Outbox para enviar e receber as mensagens entre os módulos.

Esses tópicos fornecerão uma base sólida para entender e implementar a comunicação assíncrona entre os módulos do boilerplate, garantindo uma arquitetura escalável e resiliente.

### Observação

É importante ressaltar que apenas o módulo `shared` do boilerplate é diretamente utilizado, uma vez que ele faz parte do próprio boilerplate. Os demais módulos devem se comunicar entre si utilizando os padrões Outbox e Inbox, proporcionando uma separação adequada das responsabilidades e promovendo a modularidade e o desacoplamento.

## Padrões e Design

Neste boilerplate , existem alguns padrões e convenções adotadas para garantir a consistência e a clareza do código. Esses padrões incluem a nomenclatura das tabelas no banco de dados e o estilo de nomenclatura dos arquivos. Além disso, a declaração dos casos de uso no domínio segue uma estrutura organizada com namespaces para incluir o contrato, o input, o output e os erros relacionados.

### Nomenclatura das Tabelas no Banco de Dados

No banco de dados, todas as tabelas devem ser prefixadas com o nome do módulo que as antecede. Por exemplo, todas as tabelas nativas do boilerplate são prefixadas com `core_`, como `core_users` e `core_roles`. Esse padrão de nomenclatura ajuda a organizar e diferenciar as tabelas relacionadas a cada módulo.

### Estilo de Nomenclatura de Arquivos

No boilerplate, é adotado o estilo de nomenclatura de arquivos em lowercase com dash-case (separação por hífens). Independentemente do tipo de arquivo, como modelos, controladores, serviços, validações, traduções, etc., todos devem seguir esse padrão. Por exemplo: `user-model.js`, `auth-controller.js`, `email-service.js`.

Essa convenção de nomenclatura auxilia na legibilidade e na organização dos arquivos do projeto, tornando mais fácil a localização e a identificação de cada componente.

### Declaração dos Casos de Uso no Domínio

Para a declaração dos casos de uso no domínio, é utilizado um padrão que envolve namespaces para incluir diferentes partes relacionadas ao caso de uso. Essa estrutura ajuda a manter as responsabilidades bem definidas e a facilitar a compreensão do fluxo de dados.

Os namespaces incluem o contrato (contract), o input, o output e os erros relacionados ao caso de uso específico. Essa organização torna mais fácil localizar e agrupar as partes relacionadas a um caso de uso específico, melhorando a manutenibilidade e a escalabilidade do sistema.

A adoção desses padrões e convenções contribui para a consistência e a organização do código-fonte no projeto, facilitando o desenvolvimento e a manutenção. Ao seguir essas práticas, você terá um código mais legível, coeso e fácil de entender, proporcionando uma melhor experiência de desenvolvimento e promovendo a colaboração efetiva entre os membros da equipe.

### Commits Conventional com Angular Conventional Commits

No boilerplate , adotamos o estilo de commits convencionais utilizando o Angular Conventional Commits. Essa abordagem padroniza a forma como escrevemos as mensagens de commit, tornando-as mais descritivas, consistentes e fáceis de entender.

#### Convenções de Commit

Seguimos as seguintes convenções para escrever as mensagens de commit:

- `fix`: Utilizado para correções de bugs.
- `feat`: Utilizado para adicionar uma nova funcionalidade.
- `docs`: Utilizado para alterações na documentação.
- `chore`: Utilizado para tarefas de manutenção, como atualização de dependências.
- `refactor`: Utilizado para refatorações de código.
- `style`: Utilizado para alterações relacionadas a estilos de código (espaçamento, formatação, etc.).
- `test`: Utilizado para adicionar ou modificar testes.

Além desses prefixos, também utilizamos um escopo opcional para indicar o módulo ou componente afetado pela mudança. Isso ajuda a identificar mais facilmente as áreas do projeto impactadas pelo commit.

#### Exemplo de Mensagem de Commit

A seguir, está um exemplo de como uma mensagem de commit pode ser estruturada:

```
feat(auth): Adiciona funcionalidade de recuperação de senha
```

Neste exemplo, o commit adiciona uma nova funcionalidade no módulo de autenticação relacionada à recuperação de senha.

## Testes

O boilerplate possui suporte para testes automatizados. Cada módulo deve possuir sua própria pasta de testes, com os testes correspondentes para cada parte do módulo.

- Testes unitários: Utilize o Japa ( do adonis ) para escrever os testes unitários dos seus módulos.
- Testes de integração: Utilize o Japa (do Adonis) para escrever os testes de integração dos seus módulos.
- Testes end-to-end (e2e): Utilize as bibliotecas Playwright e Japa para escrever os testes e2e dos seus módulos.

Certifique-se de manter os testes separados por tipo e localizados nas pastas corretas dentro do diretório `tests`.

## Contribuição

Se você encontrar algum problema ou tiver sugestões de melhorias para o boilerplate, sinta-se à vontade para contribuir. Abra uma nova issue ou envie um pull request com suas alterações.

## Deploy

Nós usamos o `hub.docker.co.ao` para publicar as imagens dos nossos projectos, então adicione essas configurações ao ter docker config file, caso, faças deploy para ele.

```json
"insecure-registries": [
    "172.16.25.40:5000",
    "hub.itgest.co.ao:5000"
]
```

Para fazer o build da imagem e o deploy, execute `sh deploy.sh <versao>`.
Em <versao> coloque a versão atual do projecto que estás a trabalhar.

> Não esqueça de alterar o `CONTAINER_NAME` e o `DOCKER_HUB_PATH` de acordo com o teu projecto, no env

## Licença

Este projeto é licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

Actualizado aos 22 de Julho de 2024
