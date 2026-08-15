<script lang="ts" setup>
import { usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'

import { useApiService } from '../services/api.js'
import { useHasPermission } from '@core/composables/has_permission.js'
import { AppButton, AppPopover, AppDropdownItem } from '@core/components/index.js'
import { cn } from '@core/utilities/cn.js'
import { EditUserProps } from '../types.js'
import { UserProp } from '~/core/types/index.js'

const { checkPermission } = useHasPermission()
const { onBlockUser, onDeleteUser, onRedefineUserPassword, onUnblockUser, onImpersonateUser } =
  useApiService()

type Props = {
  row: EditUserProps
  noEdit?: boolean
  noRedefine?: boolean
  noInactive?: boolean
}

const props = defineProps<Props>()

const user = computed(() => usePage().props.user as UserProp)

const selfUsername = computed(() => user.value.slug)
const isRoot = computed(() => user.value.role.isRoot)

const disableOnSelf = (username: string) => selfUsername.value === username

const loading = ref({
  key: null,
})

const defaultClasses = ref(`block w-full text-left`)

defineEmits(['onEditUser'])
</script>
<template>
  <AppDropdownItem v-if="!noEdit" :class="defaultClasses">
    <button
      :class="[
        'w-full h-full text-left',
        {
          'cursor-not-allowed opacity-50':
            !checkPermission('admin-acl-modify-user') ||
            (!isRoot && props.row.roleSlug === 'root') ||
            disableOnSelf(props.row.slug),
        },
      ]"
      :disabled="
        !checkPermission('admin-acl-modify-user') ||
        (!isRoot && props.row.roleSlug === 'root') ||
        disableOnSelf(props.row.slug)
      "
      @click="$emit('onEditUser', props.row)"
    >
      {{ $t('shared.edit') }}
    </button>
  </AppDropdownItem>
  <AppDropdownItem v-if="!noRedefine" :class="defaultClasses">
    <AppPopover :id="'reset-password-' + props.row.slug" :title="$t('admin.acl.reset_password')">
      <template #trigger>
        <button
          :class="[
            'w-full h-full text-left',
            {
              'cursor-not-allowed opacity-50':
                !checkPermission('admin-acl-reset-user') ||
                (!isRoot && props.row.roleSlug === 'root'),
            },
          ]"
          :disabled="
            !checkPermission('admin-acl-reset-user') || (!isRoot && props.row.roleSlug === 'root')
          "
        >
          {{ $t('admin.acl.reset_password') }}
        </button>
      </template>
      <template #body>
        <p class="text-left">
          {{ $t('admin.acl.users.want_to_reset_password') }}
        </p>
        <AppButton
          type="button"
          color="error"
          size="xs"
          classes="mt-2"
          :loading="loading.key === 'redefine-user-password'"
          :disabled="
            !checkPermission('admin-acl-reset-user') || (!isRoot && props.row.roleSlug === 'root')
          "
          @click="onRedefineUserPassword(props.row.slug, loading)"
        >
          {{ $t('shared.ok_proceed') }}
        </AppButton>
      </template>
    </AppPopover>
  </AppDropdownItem>
  <AppDropdownItem :class="defaultClasses" v-if="!noInactive && props.row.status === 'ACTIVE'">
    <AppPopover :id="'inactivate-user-' + props.row.slug" :title="$t('admin.acl.inactivate')">
      <template #trigger>
        <button
          :class="[
            'w-full h-full text-left',
            {
              'cursor-not-allowed opacity-50':
                !checkPermission('admin-acl-inactive-user') ||
                (!isRoot && props.row.roleSlug === 'root'),
            },
          ]"
          :disabled="
            !checkPermission('admin-acl-inactive-user') ||
            (!isRoot && props.row.roleSlug === 'root')
          "
        >
          {{ $t('admin.acl.inactivate') }}
        </button>
      </template>
      <template #body>
        <p class="text-left">
          {{ $t('admin.acl.users.want_to_deactivate') }}
        </p>

        <AppButton
          type="button"
          color="error"
          size="xs"
          classes="mt-2"
          :loading="loading.key === 'block-user'"
          :disabled="
            !checkPermission('admin-acl-inactive-user') ||
            (!isRoot && props.row.roleSlug === 'root')
          "
          @click="onBlockUser(props.row.slug, loading)"
        >
          {{ $t('shared.ok_proceed') }}
        </AppButton>
      </template>
    </AppPopover>
  </AppDropdownItem>
  <AppDropdownItem :class="defaultClasses" v-if="!noInactive && props.row.status === 'INACTIVE'">
    <AppPopover :id="'activate-user-' + props.row.slug" :title="$t('admin.acl.activate')">
      <template #trigger>
        <button
          data-popover-trigger="click"
          :class="[
            'w-full h-full text-left',
            {
              'cursor-not-allowed opacity-50':
                !checkPermission('admin-acl-active-user') ||
                (!isRoot && props.row.roleSlug === 'root'),
            },
          ]"
          :disabled="!checkPermission('admin-acl-active-user')"
        >
          {{ $t('admin.acl.activate') }}
        </button>
      </template>
      <template #body>
        <p class="text-left">
          {{ $t('admin.acl.users.want_to_activate') }}
        </p>

        <AppButton
          type="button"
          color="error"
          size="xs"
          classes="mt-2"
          :loading="loading.key === 'unblock-user'"
          :disabled="!checkPermission('admin-acl-active-user')"
          @click="onUnblockUser(props.row.slug, loading)"
        >
          {{ $t('shared.ok_proceed') }}
        </AppButton>
      </template>
    </AppPopover>
  </AppDropdownItem>
  <AppDropdownItem :class="defaultClasses">
    <AppPopover :id="'impersonate-user-' + props.row.slug" :title="$t('admin.acl.impersonate')">
      <template #trigger>
        <button
          data-popover-trigger="click"
          :disabled="
            !checkPermission('admin-acl-impersonate-user') || props.row.roleSlug === 'root'
          "
          :class="[
            'w-full h-full text-left',
            {
              'cursor-not-allowed opacity-50':
                !checkPermission('admin-acl-impersonate-user') || props.row.roleSlug === 'root',
            },
          ]"
        >
          {{ $t('admin.acl.impersonate') }}
        </button>
      </template>
      <template #body>
        <p class="text-left">
          {{ $t('admin.acl.users.want_to_impersonate') }}
        </p>

        <AppButton
          type="button"
          color="error"
          size="xs"
          classes="mt-2"
          :loading="loading.key === 'impersonating-user'"
          :disabled="
            !checkPermission('admin-acl-impersonate-user') || props.row.roleSlug === 'root'
          "
          @click="onImpersonateUser(props.row.slug, loading)"
        >
          {{ $t('shared.ok_proceed') }}
        </AppButton>
      </template>
    </AppPopover>
  </AppDropdownItem>
  <AppDropdownItem :class="defaultClasses">
    <AppPopover :id="'remove-user-' + props.row.slug" :title="$t('shared.remove')">
      <template #trigger>
        <button
          :disabled="!checkPermission('admin-acl-delete-user') || props.row.roleSlug === 'root'"
          :class="
            cn([
              'text-red-500 text-left hover:text-red-700 dark:hover:text-red-700 w-full h-full',
              {
                'cursor-not-allowed opacity-50':
                  !checkPermission('admin-acl-delete-user') || props.row.roleSlug === 'root',
              },
            ])
          "
        >
          {{ $t('shared.remove') }}
        </button>
      </template>
      <template #body>
        <p class="text-left">
          {{ $t('shared.want_to_delete') }}
        </p>

        <AppButton
          type="button"
          color="error"
          size="xs"
          classes="mt-2"
          :loading="loading.key === 'remove-user'"
          :disabled="!checkPermission('admin-acl-delete-user') || props.row.roleSlug === 'root'"
          @click="onDeleteUser(props.row.slug, loading)"
        >
          {{ $t('shared.ok_proceed') }}
        </AppButton>
      </template>
    </AppPopover>
  </AppDropdownItem>
</template>
