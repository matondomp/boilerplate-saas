<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  AppButton,
  AppSelect,
} from '@core/components/index.js'
import { AccountLayout } from '@core/layouts/index.js'
import { useTopics, type TopicNode } from './composables/use_topics.js'
import AppTopicTreeItem from './components/app_topic_tree_item.vue'
import AppCreateEditTopicModal from './components/app_create_edit_topic_modal.vue'

interface Props {
  subjects: Array<{ id: string; name: string }>
  topics: TopicNode[]
}

const props = defineProps<Props>()

const {
  state,
  form,
  openCreateModal,
  openEditModal,
  closeModal,
  submitForm,
  checkPermission,
} = useTopics()

const selectedSubjectFilter = ref('')

const flatTopics = computed(() => {
  const result: any[] = []
  const traverse = (nodes: any[], depth = 0) => {
    for (const node of nodes) {
      const prefix = depth > 0 ? '\u00a0\u00a0'.repeat(depth) + '└ ' : ''
      result.push({
        id: node.id,
        name: prefix + node.name,
        subjectId: node.subjectId
      })
      if (node.children && node.children.length > 0) {
        traverse(node.children, depth + 1)
      }
    }
  }
  traverse(props.topics || [])
  return result
})

const subjectOptions = computed(() => [
  { label: 'Todas as Disciplinas', value: '' },
  ...props.subjects.map((s) => ({ label: s.name, value: s.id })),
])

const filteredTopics = computed(() => {
  if (!selectedSubjectFilter.value) return props.topics || []
  return (props.topics || []).filter((t) => t.subjectId === selectedSubjectFilter.value)
})

const handleAddChild = (parent: TopicNode) => {
  openCreateModal(parent.id, parent.subjectId)
}

const handleEdit = (topic: TopicNode) => {
  openEditModal(topic)
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.academic.topics')"
    :b-t="$t('menu.academic.topics')"
    :b-d="$t('menu.academic.topics.description')"
    no-padding
  >
    <template #body>
      <div class="px-4">
        
            <div class="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4">
              <div class="w-full md:w-72">
                <AppSelect
                  v-model="selectedSubjectFilter"
                  name="subject_filter"
                  :options="subjectOptions"
                />
              </div>
              <div class="w-full md:w-auto">
                <AppButton :classes="'w-full'"
                color="primary"
                :disabled="!checkPermission('academic-topics-manage')"
                @click="openCreateModal(null, selectedSubjectFilter)"
              >
                {{ $t('academic.topic.new') }}
              </AppButton>
              </div>
            </div>
          
      </div>

      <div class="p-4 sm:p-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 overflow-x-auto w-full">
          <div v-if="filteredTopics.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p class="text-base font-medium">{{ $t('academic.topic.empty') }}</p>
            <p class="text-xs text-gray-400 mt-1">Cadastre tópicos e subtópicos para estruturar as disciplinas.</p>
          </div>

          <div v-else class="space-y-2 min-w-[500px] sm:min-w-0">
            <AppTopicTreeItem
              v-for="topic in filteredTopics"
              :key="topic.id"
              :node="topic"
              :can-manage="checkPermission('academic-topics-manage')"
              @add-child="handleAddChild"
              @edit="handleEdit"
            />
          </div>
        </div>
      </div>

      <AppCreateEditTopicModal
        v-model="state.modalOpen"
        :form="form"
        :subjects="props.subjects"
        :parent-topics="flatTopics"
        :loading="state.loading"
        @submit="submitForm"
        @close="closeModal"
      />
    </template>
  </AccountLayout>
</template>
