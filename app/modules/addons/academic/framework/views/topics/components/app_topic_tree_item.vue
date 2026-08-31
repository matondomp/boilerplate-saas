<script lang="ts" setup>
import { ref } from 'vue'
import type { TopicNode } from '../composables/use_topics.js'
import AppTopicTreeItem from './app_topic_tree_item.vue'

interface Props {
  node: TopicNode
  canManage: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['add-child', 'edit'])

const isOpen = ref(true)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="py-1">
    <div
      class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
    >
      <div class="flex items-center gap-2">
        <button
          v-if="node.children && node.children.length > 0"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-1 focus:outline-none"
          @click="toggle"
        >
          <span v-if="isOpen">▼</span>
          <span v-else>▶</span>
        </button>
        <span v-else class="w-5 inline-block text-gray-300 dark:text-gray-600 text-center">•</span>

        <span class="font-medium text-sm text-gray-900 dark:text-white">
          {{ node.name }}
        </span>

        <span
          class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          Nível {{ node.level }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="canManage"
          class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium cursor-pointer"
          @click="emit('add-child', node)"
        >
          + Subtópico
        </button>
        <span v-if="canManage" class="text-gray-300 dark:text-gray-600">|</span>
        <button
          v-if="canManage"
          class="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium cursor-pointer"
          @click="emit('edit', node)"
        >
          Editar
        </button>
      </div>
    </div>

    <!-- Recursive children -->
    <div v-if="isOpen && node.children && node.children.length > 0" class="pl-6 border-l-2 border-gray-100 dark:border-gray-800 ml-3 mt-1 space-y-1">
      <AppTopicTreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :can-manage="canManage"
        @add-child="(n) => emit('add-child', n)"
        @edit="(n) => emit('edit', n)"
      />
    </div>
  </div>
</template>
