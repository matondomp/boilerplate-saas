<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@inertiajs/vue3'

const props = defineProps<{
  isOpen: boolean
  universities: Array<{ id: string; name: string; acronym: string }>
  courses: Array<{ id: string; name: string; universityId: string }>
}>()

const emit = defineEmits(['close'])

const form = useForm({
  universityId: '',
  courseId: '',
  targetYear: new Date().getFullYear() + 1,
  isPrimary: false,
})

const filteredCourses = computed(() => {
  if (!form.universityId) return []
  return props.courses.filter(c => c.universityId === form.universityId)
})

const submit = () => {
  form.post('/api/v1/student/goals', {
    onSuccess: () => {
      form.reset()
      emit('close')
    },
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Adicionar Objetivo de Preparação</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Universidade</label>
          <select
            v-model="form.universityId"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            required
          >
            <option value="" disabled>Selecione a universidade</option>
            <option v-for="u in universities" :key="u.id" :value="u.id">
              {{ u.name }} ({{ u.acronym }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Curso</label>
          <select
            v-model="form.courseId"
            :disabled="!form.universityId"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm disabled:opacity-50"
            required
          >
            <option value="" disabled>Selecione o curso</option>
            <option v-for="c in filteredCourses" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ano Alvo</label>
          <input
            v-model.number="form.targetYear"
            type="number"
            min="2024"
            max="2035"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            required
          />
        </div>

        <div class="flex items-center space-x-2">
          <input
            v-model="form.isPrimary"
            type="checkbox"
            id="isPrimary"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="isPrimary" class="text-xs text-gray-700 dark:text-gray-300">
            Definir como objetivo principal
          </label>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="form.processing"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow disabled:opacity-50"
          >
            Salvar Objetivo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
