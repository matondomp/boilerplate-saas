# PROMPT MASTER — IMPLEMENTAÇÃO UI/UX — MÓDULO 01

## PAPEL DA IA

Atue como uma equipa sénior especializada em:

* Senior Product Designer
* Senior UI Designer
* Senior UX Designer
* Senior UX Researcher
* Senior Design Systems Engineer
* Senior Frontend Architect
* Senior Accessibility Engineer
* Senior Interaction Designer
* Senior QA Engineer
* Senior Security-aware Frontend Engineer

O objetivo é implementar a interface do **Módulo 01 — Estrutura Académica, Exames e Conteúdo de Avaliação** dentro do boilerplate existente.

---

# 1. REGRA PRINCIPAL: REUTILIZAR PRIMEIRO, CRIAR DEPOIS
Não reconstruir o frontend existente. Reutilizar `AccountLayout`, `AppTable`, `AppButton`, `AppInput`, `AppSelect`, `AppAccordion`, `AppUpload`, `AppModal`, `AppPopover`, `AppFilter`, `AppAlert` do design system core.

---

# 2. AUDITORIA FRONTEND & ESTRUTURA DO PROJETO

```text
Frontend
│
├── Framework: Vue 3 (Composition API `<script setup lang="ts">`) + Inertia.js (`@inertiajs/vue3`)
├── Styling: Tailwind CSS + Flowbite + DaisyUI
├── Layout: AccountLayout (inertia/core/layouts/account_layout)
├── Design System: inertia/core/components (AppTable, AppButton, AppInput, AppModal, etc.)
├── State & Forms: Vue Composition API + @vuelidate/core + Vuelidate/validators
├── Internationalization: vue-i18n (com arquivos pt.json / en.json)
└── Page Resolver: import.meta.glob('../../app/modules/**/*_page.vue')
```

---

# 3. ESCOPO DAS TELAS DE UI/UX DO MÓDULO 01

```text
Gestão Académica
│
├── 1. Universidades (Listagem com status, filtros, modal de cadastro/edição)
├── 2. Cursos & Unidades (Listagem por universidade, modal de criação/edição)
├── 3. Disciplinas (Listagem com cursos associados, modal de criação)
└── 4. Tópicos (Hierarquia em árvore por disciplina usando AppAccordion / Nested Tree)

Avaliações & Conteúdo
│
├── 5. Exames (Listagem por curso/ano/período, modal de cadastro e upload de PDF)
├── 6. Questões (Banco de questões com filtros por disciplina/tópico/dificuldade/status)
├── 7. Editor de Questões (Formulário estruturado: enunciado, alternativas A-E, resposta, resolução, IA metadata)
├── 8. Preview & Revisão (Fluxo de moderação humana de IA: DRAFT -> UNDER_REVIEW -> APPROVED -> PUBLISHED)
└── 9. Relações de Questões (Visualização de SAME_AS e SIMILAR_TO)
```
