<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'

const props = defineProps<{
  profile: {
    fullName: string
    phone?: string | null
    avatarUrl?: string | null
    preferredLanguage: string
    birthYear?: number | null
  }
}>()

const form = useForm({
  fullName: props.profile?.fullName || '',
  phone: props.profile?.phone || '',
  avatarUrl: props.profile?.avatarUrl || '',
  preferredLanguage: props.profile?.preferredLanguage || 'pt',
  birthYear: props.profile?.birthYear || null,
})

const submit = () => {
  form.put('/api/v1/student/profile', {
    preserveScroll: true,
  })
}
</script>

<template>
  <Head title="Meu Perfil de Estudante" />

  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil de Estudante</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Gerencie seus dados de perfil na plataforma de preparação para exames de acesso.
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ano de Nascimento</label>
            <input
              v-model.number="form.birthYear"
              type="number"
              min="1950"
              max="2015"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Idioma Preferido</label>
          <select
            v-model="form.preferredLanguage"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            :disabled="form.processing"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow disabled:opacity-50"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
