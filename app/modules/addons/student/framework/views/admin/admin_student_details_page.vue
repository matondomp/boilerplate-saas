<script setup lang="ts">
import { ref } from 'vue'
import { AccountLayout } from '@core/layouts/index.js'
import { AppButton, AppModal, AppStatus, AppAvatar, RouterLink } from '@core/components/index.js'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  student: {
    id: string
    userId: string
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    profile?: {
      fullName: string
      phone?: string | null
      preferredLanguage?: string
      birthYear?: number | null
      avatarUrl?: string | null
    }
    goals?: Array<{
      id: string
      targetYear: number
      status: string
      isPrimary: boolean
    }>
    createdAt: string
  }
}>()

const activeTab = ref<'overview' | 'profile' | 'goals'>('overview')
const isModalOpen = ref(false)
const isUpdating = ref(false)

const getInitials = (name?: string) => {
  if (!name) return 'ST'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const updateStatus = (newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
  isUpdating.value = true
  router.patch(`/admin/students/${props.student.id}/status`, {
    status: newStatus,
  }, {
    preserveScroll: true,
    onSuccess: () => {
      props.student.status = newStatus
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
    :title="`Aluno: ${props.student.profile?.fullName || 'Detalhes'}`"
    b-t="Alunos"
    b-d="Ficha detalhada do aluno e objetivos de preparação"
    no-padding
  >
    <template #body>
      <div class="p-6 space-y-6">
        <!-- Back Button Bar -->
        <div class="flex items-center justify-between">
          <RouterLink
            href="/admin/students"
            class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Lista de Alunos
          </RouterLink>
        </div>

        <!-- Header Panel with AppAvatar -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <AppAvatar
              :source="props.student.profile?.avatarUrl || undefined"
              :initials="getInitials(props.student.profile?.fullName)"
              classes="w-16 h-16 text-xl bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 border-2 border-primary-500 shadow-sm"
            />
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ props.student.profile?.fullName || 'Estudante' }}
                </h2>
                <AppStatus
                  :status="getStatusBadgeType(props.student.status)"
                  :text="getStatusText(props.student.status)"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ID: {{ props.student.id }} | Registrado em {{ new Date(props.student.createdAt).toLocaleDateString('pt-AO') }}
              </p>
            </div>
          </div>

          <AppButton type="button" color="primary" @click="isModalOpen = true">
            Alterar Estado
          </AppButton>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700 flex space-x-6">
          <button
            @click="activeTab = 'overview'"
            class="py-3 text-sm font-medium border-b-2"
            :class="activeTab === 'overview' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Visão Geral
          </button>
          <button
            @click="activeTab = 'profile'"
            class="py-3 text-sm font-medium border-b-2"
            :class="activeTab === 'profile' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Perfil do Aluno
          </button>
          <button
            @click="activeTab = 'goals'"
            class="py-3 text-sm font-medium border-b-2"
            :class="activeTab === 'goals' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Preparações ({{ props.student.goals?.length || 0 }})
          </button>
        </div>

        <!-- Tab Content -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <div class="text-xs font-semibold text-gray-400 uppercase">Estado da Conta</div>
            <div class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              <AppStatus
                :status="getStatusBadgeType(props.student.status)"
                :text="getStatusText(props.student.status)"
              />
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <div class="text-xs font-semibold text-gray-400 uppercase">Qtd. Preparações</div>
            <div class="mt-2 text-xl font-bold text-primary-600">{{ props.student.goals?.length || 0 }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <div class="text-xs font-semibold text-gray-400 uppercase">Idioma</div>
            <div class="mt-2 text-xl font-bold text-gray-900 dark:text-white">{{ props.student.profile?.preferredLanguage || 'pt' }}</div>
          </div>
        </div>

        <div v-if="activeTab === 'profile'" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 space-y-6">
          <!-- Profile Picture Section -->
          <div class="flex items-center gap-6 pb-6 border-b dark:border-gray-700">
            <AppAvatar
              :source="props.student.profile?.avatarUrl || undefined"
              :initials="getInitials(props.student.profile?.fullName)"
              classes="w-24 h-24 text-2xl bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 border-4 border-white dark:border-gray-700 shadow-md"
            />
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Foto de Perfil</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ props.student.profile?.avatarUrl ? 'Imagem oficial carregada no perfil' : 'Nenhuma imagem cadastrada (exibindo iniciais do nome)' }}
              </p>
            </div>
          </div>

          <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b pb-2">Informações Pessoais</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400 text-xs block">Nome Completo</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ props.student.profile?.fullName || '—' }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Telefone</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ props.student.profile?.phone || '—' }}</span>
            </div>
            <div>
              <span class="text-gray-400 text-xs block">Ano de Nascimento</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ props.student.profile?.birthYear || '—' }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'goals'" class="space-y-4">
          <div v-if="!props.student.goals || props.student.goals.length === 0" class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <p class="text-sm text-gray-500">Nenhum objetivo cadastrado pelo estudante.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="g in props.student.goals" :key="g.id" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs text-primary-600 font-semibold">Ano Alvo: {{ g.targetYear }}</div>
                  <div class="text-base font-bold text-gray-900 dark:text-white mt-1">Status: {{ g.status }}</div>
                </div>
                <span v-if="g.isPrimary" class="px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full font-semibold">Principal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Modal -->
        <AppModal
          :is-show-modal="isModalOpen"
          :close-modal="() => isModalOpen = false"
          title="Alterar Estado do Aluno"
        >
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Selecione o novo status para o aluno:
            </p>
            <div class="flex flex-col gap-2">
              <AppButton type="button" color="primary" :disabled="isUpdating" @click="updateStatus('ACTIVE')">Ativar (ACTIVE)</AppButton>
              <AppButton type="button" color="danger" :disabled="isUpdating" @click="updateStatus('SUSPENDED')">Suspender (SUSPENDED)</AppButton>
              <AppButton type="button" color="alternative" :disabled="isUpdating" @click="updateStatus('INACTIVE')">Inativar (INACTIVE)</AppButton>
            </div>
          </div>
        </AppModal>
      </div>
    </template>
  </AccountLayout>
</template>
