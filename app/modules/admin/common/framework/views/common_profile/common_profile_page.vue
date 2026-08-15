<script lang="ts" setup id="common-profile">
import { ref, computed, onMounted } from 'vue'

import http from './services.js'
import { UserActivity } from './types.js'
import eventBus from '@core/event_bus.js'
import { UserProp } from '@core/types/user.js'
import { AppStatus, AppAvatar, AppDropdown } from '@core/components/index.js'
import { useAvatar } from '@core/composables/use_avatar.js'
import { AccountLayout } from '@core/layouts/account_layout/index.js'
import { convertUserStatus } from '@core/utilities/convert_user_status.js'
import AppEditRowAdapter from '@app/admin/settings/acl/users_management/framework/views/view_users/components/app_edit_row_adapter.vue'
import AppViewRestoredPasswordDialog from '@app/admin/settings/acl/users_management/framework/views/view_users/components/app_view_restored_password_dialog.vue'
import { router } from '@inertiajs/vue3'

type ProfileProps = {
  user: UserProp
  data: UserProp
}

const props = defineProps<ProfileProps>()
const isLoading = ref(true)
const { initials } = useAvatar()
const userActivities = ref<UserActivity[]>([])
const info = computed(() => props.data ?? props.user)
const viewPasswordRestoredDialog = ref(false)
const viewPasswordRestoredPayload = ref('')
function closeViewPasswordRestoredDialog() {
  viewPasswordRestoredDialog.value = false
}
onMounted(() => {
  http
    .retrieveActivities(info.value.slug)
    .then(({ data }) => {
      userActivities.value = data
    })
    .finally(() => {
      isLoading.value = false
    })
})

const getStatusText = (success: boolean) => {
  if (success) return 'shared.status.success'

  return 'shared.status.error'
}

eventBus.on('redefine-user-password', (newPassword: string) => {
  viewPasswordRestoredPayload.value = newPassword
  viewPasswordRestoredDialog.value = true
})
eventBus.on('user-deleted', (username: string) => {
  if (username === info.value.slug) {
    router.visit('/account/admin/settings/acl/users')
  }
})
</script>

<template>
  <AccountLayout
    :title="info.fullName"
    :b-t="
      !data ? $t('menu.user.profile') : $t('menu.user.other_profile', { fullName: data.fullName })
    "
    :b-d="$t('menu.user.profile.subtitle')"
  >
    <template #body>
      <main id="common-profile" class="flex flex-col md:flex-row gap-5">
        <div
          class="w-full max-w-sm border border-gray-200 rounded-lg shadow dark:bg-base-200 dark:border-gray-700"
        >
          <div class="flex flex-col p-10">
            <section class="flex gap-4 items-start">
              <AppAvatar :initials="initials(info.fullName)" classes="w-28" :source="info.avatar" />
              <div class="flex flex-col">
                <AppStatus
                  :status="convertUserStatus(info.status)"
                  :text="$t(`admin.common.user.status.${info.status.toLocaleLowerCase()}`)"
                  class="w-[50%]"
                />

                <h5
                  class="mt-2.5 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                >
                  {{ info.fullName }}
                </h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{
                  info.role.internal ? $t(info.role.name) : info.role.name
                }}</span>
              </div>
            </section>

            <AppDropdown v-if="props.data" summary class="btn btn-sm btn-neutral my-4">
              <template #header> {{ $t('shared.actions.options') }} </template>
              <template #default>
                <AppEditRowAdapter
                  :row="{
                    roleSlug: info.role.slug,
                    slug: info.slug,
                    status: info.status,
                    isInternal: info.role.internal,
                  }"
                  no-edit
                />
              </template>
            </AppDropdown>
            <span class="text-sm mt-2 text-gray-500 dark:text-gray-400">{{
              info.role.internal ? $t(info.role.description) : info.role.description
            }}</span>

            <div class="text-left w-full mt-5">
              <dt class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('shared.email') }}
              </dt>
              <dt class="text-sm mb-3 text-gray-900 dark:text-white">
                <a :href="`mailto:${info.email}`"> {{ info.email }}</a>
              </dt>
            </div>

            <div class="text-left w-full mt-2">
              <dt class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('shared.phone_numbers') }}
              </dt>
              <dt class="text-sm mb-3 text-gray-900 dark:text-white">
                {{ $t('shared.empty') }}
              </dt>
            </div>

            <div class="mt-2">
              <dt class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('shared.bio') }}
              </dt>
              <dt class="text-sm mb-3 text-gray-900 dark:text-white">
                {{ info.bio || $t('shared.empty') }}
              </dt>
            </div>
          </div>
        </div>

        <div
          class="w-full border border-gray-200 rounded-lg shadow dark:bg-base-200 dark:border-gray-700 p-5"
        >
          <h2 class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {{ $t('common.activity_track') }}
          </h2>

          <ol class="relative md:border-l border-gray-200 dark:border-gray-700">
            <template v-for="activity in userActivities" :key="activity.id">
              <li class="mb-5 md:ml-2 relative">
                <div
                  class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600"
                >
                  <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                    {{ activity.recordAtText }}</time
                  >
                  <div class="text-sm font-normal flex text-gray-500 dark:text-gray-300">
                    <AppStatus
                      :status="activity.success ? 'SUCCESS' : 'DANGER'"
                      :text="$t(getStatusText(activity.success))"
                    />
                    <span
                      class="ml-2"
                      v-html="
                        $t(
                          `${activity.operation}${activity.success ? '' : '-with-error'}`,
                          activity.payload
                        )
                      "
                    />
                  </div>
                </div>
              </li>
            </template>
          </ol>
        </div>
      </main>
    </template>

    <template #portal>
      <AppViewRestoredPasswordDialog
        :close-modal="closeViewPasswordRestoredDialog"
        :is-show-modal="viewPasswordRestoredDialog"
        :new-password="viewPasswordRestoredPayload"
      />
    </template>
  </AccountLayout>
</template>
