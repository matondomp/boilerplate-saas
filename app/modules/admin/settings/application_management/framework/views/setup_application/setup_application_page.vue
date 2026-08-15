<script lang="ts" setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

import { useForm } from '@core/utilities/form/index.js'
import { required } from '@vuelidate/validators'
import { AppAlertStandalone, AppTextarea, AppButton, AppInput, AppAvatar } from '@core/components'
import { AccountLayout } from '@core/layouts'
import { useAvatar } from '@core/composables/use_avatar.js'

import { useUpload } from '~/core/composables/use_upload'
import { apiService } from './services/api'

const appSettings = computed(() => usePage().props.appSetting as any)
const { fileRef, files, validateFiles, selectFile, canSubmitFile } = useUpload()
const { initials } = useAvatar()

const { form, v$ } = useForm(
  {
    appName: appSettings.value.appName,
    appDesc: appSettings.value.appDesc,
    imageUrl: appSettings.value.imageUrl,
    appColorPrimary: appSettings.value.appColorPrimary,
    appColorSecondary: appSettings.value.appColorSecondary,
    appBackgroundPrimaryColor: appSettings.value.appBackgroundPrimaryColor,
    appBackgroundSecondaryColor: appSettings.value.appBackgroundSecondaryColor,
  },
  {
    appName: {
      required,
      $autoDirty: true,
    },
    appDesc: {
      required,
      $autoDirty: true,
    },
    appColorPrimary: {
      required,
      $autoDirty: true,
    },
    appColorSecondary: {
      required,
      $autoDirty: true,
    },
    appBackgroundPrimaryColor: {
      required,
      $autoDirty: true,
    },
    appBackgroundSecondaryColor: {
      required,
      $autoDirty: true,
    },
  }
)

const appImageUrl = computed(() => files.value[0] ?? form.value.model.imageUrl)

const onSubmit = async () => {
  v$.value.$validate()

  if (v$.value.$invalid) {
    return
  }

  if (form.value.loading || !canSubmitFile.value) {
    return
  }

  form.value.loading = true

  const formData = new FormData()

  formData.append('appDesc', form.value.model.appDesc)
  formData.append('appName', form.value.model.appName)
  formData.append('appColorPrimary', form.value.model.appColorPrimary)
  formData.append('appColorSecondary', form.value.model.appColorSecondary)
  formData.append('appBackgroundPrimaryColor', form.value.model.appBackgroundPrimaryColor)
  formData.append('appBackgroundSecondaryColor', form.value.model.appBackgroundSecondaryColor)
  formData.set('logo', fileRef.value.files[0])

  await apiService
    .updateSettings(formData)
    .then(() => {
      canSubmitFile.value = false
    })
    .finally(() => {
      form.value.loading = false
    })
}
</script>

<template>
  <AccountLayout
    :title="$t('menu.admin.setting.application-management.setting.edit_setting')"
    :b-t="$t('menu.admin.setting.application-management.setting.edit_setting')"
    :b-d="$t('menu.admin.setting.application-management.setting.edit_setting.description')"
  >
    <template #body>
      <div class="pt-0">
        <AppAlertStandalone type="warning" outline icon>
          {{
            $t('menu.admin.setting.application-management.setting.edit_setting', {
              name: form.model.appName,
            })
          }}
        </AppAlertStandalone>

        <form class="pt-4" method="post" @submit.prevent="onSubmit">
          <div
            class="items-center mb-4 sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4 min-w-20"
          >
            <AppAvatar
              classes="w-28 h-full"
              :source="appImageUrl"
              :initials="initials(form.model.appName)"
              no-fallback
            />
            <div>
              <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white md:mt-3">
                {{ $t('shared.app_logo') }}
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
                <AppButton
                  color="primary"
                  type="button"
                  classes="md:mr-4"
                  size="sm"
                  @click="selectFile"
                >
                  <AppIcon icon="upload" :size="13" />
                  {{ $t('shared.upload') }}
                </AppButton>
              </div>
            </div>
          </div>

          <AppInput
            name="appName"
            v-model="form.model.appName"
            :v="v$.appName"
            required
            :label="$t('application-management.setting.edit_setting.appName')"
          />

          <div class="mt-4 mb-3">
            <AppTextarea
              name="appDesc"
              v-model="form.model.appDesc"
              :rows="4"
              :label="$t('application-management.setting.edit_setting.appDesc')"
            />
          </div>

          <AppButton
            :disabled="!v$.$anyDirty || v$.$invalid || !canSubmitFile"
            :loading="form.loading"
            type="submit"
            size="md"
          >
            {{ $t('admin.settings.app.update') }}
          </AppButton>
        </form>
      </div>
    </template>
  </AccountLayout>
</template>
<style scoped>
.el-button {
  float: right;
}
</style>
