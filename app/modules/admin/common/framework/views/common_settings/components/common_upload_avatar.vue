<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { computed, ref, reactive } from 'vue'
import { apiService } from '../services/api.js'
import { AppIcon, AppButton, AppAvatar } from '@core/components/index.js'
import { useAvatar } from '@core/composables/use_avatar.js'
import { UserProp } from '@core/types/index.js'
import { useUpload } from '@core/composables/use_upload'

const { initials } = useAvatar()
const {
  fileRef,
  canSubmitFile: canSubmitAvatar,
  validateFiles,
  selectFile,
  clearFile: _clearFile,
  files,
} = useUpload()

const isLoading = ref()

const user = computed(() => usePage().props.user as UserProp)

const updateUserForm = reactive<{ avatar?: string }>({
  avatar: user.value.avatar,
})

const clearFile = () => {
  _clearFile()
  updateUserForm.avatar = undefined
}

const avatarUrl = computed(() => files.value[0] ?? updateUserForm.avatar)

const onSubmit = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  const formData = new FormData()

  formData.append('firstName', user.value.firstName)
  formData.append('lastName', user.value.lastName)
  formData.set('avatar', fileRef.value.files[0])

  apiService.updateUserInfo(formData).finally(() => {
    isLoading.value = false
    canSubmitAvatar.value = false
  })
}
</script>
<template>
  <div
    class="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-base-200"
  >
    <div
      class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4 min-w-20"
    >
      <AppAvatar classes="w-28 h-full" :source="avatarUrl" :initials="initials(user.fullName)" />
      <div>
        <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white md:mt-3">
          {{ $t('shared.profile_pic') }}
        </h3>
        <div class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('shared.profile_pic_allowed_format_and_size') }}
        </div>
        <div class="flex items-end">
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .png, .jpeg"
            @change="validateFiles"
          />
          <AppButton color="primary" classes="md:mr-4" size="sm" @click="selectFile">
            <AppIcon icon="upload" :size="13" />
            {{ $t('shared.upload') }}
          </AppButton>
          <AppButton color="alternative" size="sm" @click="clearFile">
            {{ $t('shared.delete') }}
          </AppButton>
        </div>
      </div>
    </div>
    <AppButton
      v-if="canSubmitAvatar"
      color="success"
      size="sm"
      classes="mt-5 w-full"
      :loading="isLoading"
      @click="onSubmit"
    >
      {{ $t('shared.update') }}
    </AppButton>
  </div>
</template>
