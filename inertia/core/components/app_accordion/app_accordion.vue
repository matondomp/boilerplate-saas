<script setup lang="ts">
import { computed } from 'vue'
import { Accordion } from './types.js'

const props = defineProps<Accordion>()

const emit = defineEmits(['update:selected'])

const model = computed({
  get() {
    return props.selected
  },
  set(value) {
    emit('update:selected', value)
  },
})
</script>

<template>
  <div class="join join-vertical w-full">
    <div
      class="collapse collapse-arrow join-item border border-base-300"
      v-for="group in groups"
      :key="group.id"
    >
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">
        {{ $t(group.title) }}
      </div>
      <div class="collapse-content">
        <template v-for="child in group.children" :key="child.id">
          <template v-if="type === 'checkbox'">
            <div class="flex items-center py-1">
              <input
                :id="`permission-${child.id}`"
                v-model="model"
                type="checkbox"
                :value="child.id"
                :disabled="disabled"
                class="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />

              <section class="ml-4">
                <label
                  :for="`permission-${child.id}`"
                  class="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {{ $t(child.title) }}
                </label>
                <span
                  v-if="child.description"
                  class="block text-xs text-gray-400 dark:text-gray-400"
                  >{{ $t(child.description) }}</span
                >
              </section>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
