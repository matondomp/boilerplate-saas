<script setup lang="ts">
import { FwbModal, FwbButton, FwbSpinner } from 'flowbite-vue'
import { AppIcon } from '@core/components/index.js'
import http from '../services/api'
import { ref } from 'vue'
import { DocsFormats, generateDocument } from '@core/utilities/generate_document'

const props = defineProps<{
  closeModal: () => void
  queryString: string
}>()

const formats = [{ name: DocsFormats.PDF }, { name: DocsFormats.XLSX }]
const loadingExtractLogs = ref(false)
const formatBeingExtracted = ref('')

const extractLogs = async (format: DocsFormats) => {
  formatBeingExtracted.value = format
  loadingExtractLogs.value = true

  const response = await http.extractLogs(format, props.queryString)

  generateDocument({ blob: response.data, format })
  loadingExtractLogs.value = false
}

const isThisFormatBeingExtracted = (format: string) => {
  return formatBeingExtracted.value === format
}
</script>

<template>
  <FwbModal class="bg-gray-800" size="sm" @close="closeModal">
    <template #header>
      <h3 class="text-lg font-semibold dark:text-white">
        {{ $t('admin.audit.log.extract.button.extract') }}
      </h3>
    </template>
    <template #body>
      <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Extraia os logs em um dos formatos listados abaixo
      </p>
      <ul class="my-4 space-y-3">
        <li v-for="format in formats" :key="format.name">
          <div
            class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
          >
            <p class="flex-1 ms-3 whitespace-nowrap">{{ format.name }}</p>

            <FwbButton
              :id="`extract-${format.name}`"
              size="xs"
              color="alternative"
              @click="extractLogs(format.name)"
            >
              <FwbSpinner v-if="isThisFormatBeingExtracted(format.name) && loadingExtractLogs" />
              <AppIcon v-else icon="arrow-down" />
            </FwbButton>
          </div>
        </li>
      </ul>
    </template>
  </FwbModal>
</template>

<style></style>
