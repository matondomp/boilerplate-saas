<script setup lang="ts">
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import {
  AppTable,
  AppButton,
  AppFilter,
  AppStatus,
  AppAvatar,
  AppModal,
  RouterLink,
} from '@core/components/index.js'
import { FilterType } from '@core/components/app_filter/types.js'
import { AccountLayout } from '@core/layouts/index.js'

interface Props {
  content: {
    data: Array<{
      id: string
      userId: string
      fullName: string
      phone: string | null
      status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
      goalsCount: number
      createdAt: string
      avatarUrl?: string | null
    }>
    pagination: any
  }
}

const props = defineProps<Props>()

const students = computed(() => props.content?.data || [])
const pagination = computed(() => props.content?.pagination || {})

const getInitials = (name?: string) => {
  if (!name) return 'ST'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const tableColumns = [
  { key: 'fullName', label: 'Nome do Aluno' },
  { key: 'phone', label: 'Telefone / Contato' },
  { key: 'status', label: 'Estado' },
  { key: 'createdAt', label: 'Data de Registo' },
  { key: 'actions', label: 'Ações' },
]

const handleFilterUpdated = (queryString: string) => {
  router.visit(window.location.pathname + '?' + queryString, { preserveState: true })
}

const isModalOpen = ref(false)
const selectedStudent = ref<any>(null)
const isUpdating = ref(false)

const openStatusModal = (student: any) => {
  selectedStudent.value = student
  isModalOpen.value = true
}

const updateStatus = (newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
  if (!selectedStudent.value) return
  isUpdating.value = true

  router.patch(`/admin/students/${selectedStudent.value.id}/status`, {
    status: newStatus,
  }, {
    preserveScroll: true,
    onSuccess: () => {
      selectedStudent.value.status = newStatus
      isModalOpen.value = false
      isUpdating.value = false
    },
    onError: () => {
      isUpdating.value = false
    },
    onFinish: () => {
      isUpdating.value = false
    }
  })
}

const getStatusBadgeType = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'SUCCESS'
    case 'SUSPENDED': return 'DANGER'
    default: return 'WARNING'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'Ativo'
    case 'SUSPENDED': return 'Suspenso'
    case 'INACTIVE': return 'Inativo'
    default: return status
  }
}
</script>

<template>
  <AccountLayout
    title="Alunos"
    b-t="Alunos"
    b-d="Gerencie os alunos, perfis e objetivos de preparação para os exames de acesso"
    no-padding
  >
    <template #body>
      <div class="px-8 pt-6 pb-2">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="w-full md:w-56 relative z-[2] pl-2">
            <AppFilter
              :filters="[
                { field: 'fullName', name: 'Nome do Aluno' },
                { field: 'phone', name: 'Telefone' },
                {
                  field: 'status',
                  name: 'Estado',
                  type: FilterType.select,
                  selectOptions: [
                    { name: 'Ativo (ACTIVE)', value: 'ACTIVE' },
                    { name: 'Suspenso (SUSPENDED)', value: 'SUSPENDED' },
                    { name: 'Inativo (INACTIVE)', value: 'INACTIVE' }
                  ]
                }
              ]"
              @filter-updated="handleFilterUpdated"
            />
          </div>
        </div>
      </div>

      <AppTable
        id="id"
        :columns="tableColumns"
        :data="students"
        :pagination="pagination"
      >
        <template #fullName="{ row }">
          <div class="flex items-center gap-3">
            <AppAvatar
              :source="row.avatarUrl || undefined"
              :initials="getInitials(row.fullName)"
              classes="w-8 h-8 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
            />
            <RouterLink
              :href="`/admin/students/${row.id}`"
              class="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {{ row.fullName }}
            </RouterLink>
          </div>
        </template>

        <template #phone="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ row.phone || '—' }}
          </span>
        </template>

        <template #status="{ row }">
          <AppStatus
            :status="getStatusBadgeType(row.status)"
            :text="getStatusText(row.status)"
          />
        </template>

        <template #createdAt="{ row }">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ new Date(row.createdAt).toLocaleDateString('pt-AO') }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <RouterLink
              :href="`/admin/students/${row.id}`"
              class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
            >
              Detalhes
            </RouterLink>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <button
              class="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 font-medium cursor-pointer"
              @click="openStatusModal(row)"
            >
              Alterar Estado
            </button>
          </div>
        </template>
      </AppTable>

      <AppModal
        :is-show-modal="isModalOpen"
        :close-modal="() => isModalOpen = false"
        title="Alterar Estado do Aluno"
      >
        <div v-if="selectedStudent" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Selecione o novo status para o aluno <strong>{{ selectedStudent.fullName }}</strong>:
          </p>

          <div class="flex flex-col gap-2">
            <AppButton
              type="button"
              color="primary"
              :disabled="isUpdating"
              @click="updateStatus('ACTIVE')"
            >
              Ativar Aluno (ACTIVE)
            </AppButton>
            <AppButton
              type="button"
              color="danger"
              :disabled="isUpdating"
              @click="updateStatus('SUSPENDED')"
            >
              Suspender Aluno (SUSPENDED)
            </AppButton>
            <AppButton
              type="button"
              color="alternative"
              :disabled="isUpdating"
              @click="updateStatus('INACTIVE')"
            >
              Inativar Aluno (INACTIVE)
            </AppButton>
          </div>
        </div>
      </AppModal>
    </template>
  </AccountLayout>
</template>
