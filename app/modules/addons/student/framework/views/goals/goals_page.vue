<script setup lang="ts">
import { ref } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import AppCreateGoalModal from './components/app_create_goal_modal.vue'

interface Goal {
  id: string
  universityId: string
  courseId: string
  targetYear: number
  status: string
  isPrimary: boolean
  university?: { name: string; acronym: string }
  course?: { name: string }
}

const props = defineProps<{
  goals: Goal[]
  universities?: Array<{ id: string; name: string; acronym: string }>
  courses?: Array<{ id: string; name: string; universityId: string }>
}>()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const setPrimaryGoal = (goalId: string) => {
  router.patch('/api/v1/student/goals/primary', { goalId }, {
    preserveScroll: true,
  })
}
</script>

<template>
  <Head title="Meus Objetivos de Preparação" />

  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meus Objetivos de Preparação</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gerencie suas metas de estudos para os exames de acesso universitários em Angola.
        </p>
      </div>
      <button
        @click="openModal"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
      >
        Novo Objetivo
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!goals || goals.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum objetivo cadastrado</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Escolha uma universidade e um curso para iniciar sua preparação.</p>
      <div class="mt-6">
        <button
          @click="openModal"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700"
        >
          Criar Primeiro Objetivo
        </button>
      </div>
    </div>

    <!-- Goals Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between relative transition hover:shadow-md"
        :class="{ 'ring-2 ring-indigo-500': goal.isPrimary }"
      >
        <span
          v-if="goal.isPrimary"
          class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
        >
          Principal
        </span>

        <div>
          <div class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {{ goal.university?.acronym || 'Universidade' }}
          </div>
          <h2 class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            {{ goal.course?.name || 'Curso Alvo' }}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ goal.university?.name }}
          </p>

          <div class="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3">
            <span>Ano Alvo: <strong>{{ goal.targetYear }}</strong></span>
            <span class="capitalize px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700">
              {{ goal.status.toLowerCase() }}
            </span>
          </div>
        </div>

        <div class="mt-6 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            v-if="!goal.isPrimary"
            @click="setPrimaryGoal(goal.id)"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Definir como Principal
          </button>
        </div>
      </div>
    </div>

    <!-- Create Goal Modal -->
    <AppCreateGoalModal
      :isOpen="isModalOpen"
      :universities="universities || []"
      :courses="courses || []"
      @close="isModalOpen = false"
    />
  </div>
</template>
