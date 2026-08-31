<script lang="ts" setup>
import { ref } from 'vue'
import {
  AppModal,
  AppUpload,
  AppButton,
  AppAlertStandalone,
} from '@core/components/index.js'
import type { ExamItem } from '../composables/use_exams.js'

interface Props {
  modelValue: boolean
  exam: ExamItem | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'close', 'uploaded'])

const fileState = ref({
  status: 'idle' as 'idle' | 'uploading' | 'processing' | 'success' | 'error',
  progress: 0,
  errorMessage: '',
})

const handleFileSelected = (event: any) => {
  const file = event.fileRef?.value?.files?.[0]
  if (!file) return

  fileState.value.status = 'uploading'
  fileState.value.progress = 30

  const formData = new FormData()
  formData.append('document', file)
  if (props.exam) {
    formData.append('examId', props.exam.id)
  }

  // Simula progresso e envio para endpoint de ingestão
  const xhr = new XMLHttpRequest()
  xhr.open('POST', `/api/v1/academic/exams/${props.exam?.id}/upload-pdf`)

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      fileState.value.progress = Math.round((e.loaded / e.total) * 100)
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      fileState.value.status = 'processing'
      setTimeout(() => {
        fileState.value.status = 'success'
        emit('uploaded')
      }, 1000)
    } else {
      fileState.value.status = 'error'
      fileState.value.errorMessage = 'Falha ao processar o arquivo PDF no servidor.'
    }
  }

  xhr.onerror = () => {
    fileState.value.status = 'error'
    fileState.value.errorMessage = 'Erro de rede durante o upload.'
  }

  xhr.send(formData)
}
</script>

<template>
  <AppModal
    :isShowModal="modelValue"
    :closeModal="() => emit('close')"
    :title="$t('academic.exam.upload_pdf')"
  >
    <div class="space-y-4">
      <div v-if="exam" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
        <span class="text-gray-500 dark:text-gray-400">Exame Selecionado:</span>
        <span class="font-semibold text-gray-900 dark:text-white ml-1">
          {{ exam.courseName }} — {{ exam.year }} ({{ exam.period }})
        </span>
      </div>

      <div v-if="fileState.status === 'error'">
        <AppAlertStandalone type="error" icon border>
          {{ fileState.errorMessage }}
        </AppAlertStandalone>
      </div>

      <div v-if="fileState.status === 'processing'">
        <AppAlertStandalone type="info" icon border>
          Arquivo recebido com sucesso. Processando extração de questões com IA...
        </AppAlertStandalone>
      </div>

      <div v-if="fileState.status === 'success'">
        <AppAlertStandalone type="success" icon border>
          Upload e processamento concluídos com sucesso!
        </AppAlertStandalone>
      </div>

      <div v-if="fileState.status === 'idle' || fileState.status === 'uploading'">
        <AppUpload
          label="Clique para selecionar ou arraste o PDF do exame aqui"
          supported-types="application/pdf"
          :maximum-file-size="20"
          @change="handleFileSelected"
        />
        <p class="text-xs text-gray-500 text-center mt-2">
          Formatos permitidos: Apenas PDF (Tamanho máximo: 20MB)
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <AppButton
          type="button"
          color="alternative"
          @click="emit('close')"
        >
          {{ $t('shared.close') }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
