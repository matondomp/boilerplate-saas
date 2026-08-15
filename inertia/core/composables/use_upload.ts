import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useUpload = () => {
  const { t } = useI18n()
  const fileRef = ref()
  const _files = ref<string[]>([])
  const canSubmitFile = ref(false)
  const selectFile = () => {
    fileRef.value.click()
  }

  const validateFiles = (input: any, MAXIMUM_MB_ALLOWED = 1): void => {
    const files = (input.target as HTMLInputElement).files

    if (!files) return

    for (const file of files) {
      const fileSizeInMb = file.size / 1024 / 1024 // in MB

      if (fileSizeInMb > MAXIMUM_MB_ALLOWED) {
        alert(t('shared.file_too_large'))
        clearFile()
        canSubmitFile.value = false

        return
      }

      const reader = new FileReader()
      reader.onload = (e: any) => {
        _files.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
      canSubmitFile.value = true
    }
  }

  const clearFile = () => {
    fileRef.value.value = null
    canSubmitFile.value = false

    _files.value = []
  }

  return {
    fileRef,
    canSubmitFile,
    selectFile,
    validateFiles,
    clearFile,
    files: _files,
  }
}
