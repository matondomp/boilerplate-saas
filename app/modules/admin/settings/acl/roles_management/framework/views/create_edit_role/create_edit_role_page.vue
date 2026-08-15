<script lang="ts" setup>
import { computed, onMounted } from 'vue'

import {
  AppAccordion,
  AppButton,
  AppInput,
  AppTextarea,
  AppAlertStandalone,
} from '@core/components/index.js'
import { useHasPermission } from '@core/composables/has_permission.js'

import { useRoleForm } from './composables/use_role_form.js'
import { AccountLayout } from '@core/layouts/index.js'
import { RoleProp, UserProp } from '@core/types/index.js'

const { t, roleForm, v$, permissionsGroup, state, clearForm } = useRoleForm()
const { checkPermission } = useHasPermission()

type PageProps = {
  role: RoleProp
  user: UserProp
}

const props = defineProps<PageProps>()

const role = computed(() => props.role)
const isRoot = computed(() => props.user.role.isRoot)

const onSubmit = async (redirect: boolean) => {
  if (state.loading) {
    return
  }

  roleForm.value.setBaseUrl('/account/admin/settings/acl/roles')

  if (!role.value) {
    state.loading = redirect ? 'create_redirect' : 'create_continue'

    roleForm.value
      .post('create', {
        redirect,
      })
      .then(() => {
        clearForm()
      })
      .finally(() => {
        state.loading = null
      })

    return
  }

  state.loading = 'update'

  roleForm.value
    .put('edit', {
      roleSlug: role.value.slug,
    })
    .finally(() => {
      state.loading = null
    })
}

onMounted(() => {
  if (role.value) {
    roleForm.value.setValue({
      name: role.value.internal ? t(role.value.name) : role.value.name,
      description: role.value.internal ? t(role.value.description) : role.value.description,
      permissions: role.value.permissions || [],
    })
  }
})
</script>

<template>
  <AccountLayout
    :title="
      !role
        ? $t('menu.admin.setting.acl.roles.new_role')
        : $t('menu.admin.setting.acl.roles.edit_role')
    "
    :b-t="
      !role
        ? $t('menu.admin.setting.acl.roles.new_role')
        : $t('menu.admin.setting.acl.roles.edit_role')
    "
    :b-d="
      !role
        ? $t('menu.admin.setting.acl.roles.new_role_description')
        : $t('menu.admin.setting.acl.roles.edit_role_description')
    "
  >
    <template #body>
      <div>
        <AppAlertStandalone v-if="role" type="warning" icon border>
          {{ $t('admin.acl.role.edit', { name: role.name }) }}
        </AppAlertStandalone>

        <form ref="roleFormRef" class="mt-8" @submit.prevent="onSubmit(true)">
          <div class="mb-6">
            <AppInput
              v-model="roleForm.model.name"
              :label="$t('acl.role.name')"
              required
              :disabled="role && role.internal"
              name="name"
              :v="v$.name"
            />
          </div>

          <div class="mb-6">
            <AppTextarea
              name="description"
              v-model="roleForm.model.description"
              :rows="4"
              placeholder=""
              required
              :label="$t('shared.description')"
              :disabled="role && role.internal"
              :v="v$.description"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {{ $t('shared.permissions') }}
            </label>
            <AppAccordion
              v-model:selected="roleForm.model.permissions"
              :groups="permissionsGroup"
              type="checkbox"
              :disabled="role && role.internal && !isRoot"
            />
          </div>

          <div :class="['flex mx-4 mt-4', { 'justify-end': !role, 'justify-between': role }]">
            <div v-if="role" class="text-gray-900 dark:text-gray-300">
              <span>
                {{ $t('shared.updated_at_with_date', { date: role.updatedAtText }) }}
              </span>
            </div>

            <div>
              <AppButton
                v-if="!role"
                type="button"
                size="md"
                class="mr-5"
                :color="'alternative'"
                :loading="state.loading === 'create_continue'"
                :disabled="
                  !checkPermission('admin-acl-create-role') || !!state.loading || v$.$invalid
                "
                @click.prevent="onSubmit(false)"
              >
                {{ $t('admin.acl.roles.create') }}
              </AppButton>
              &nbsp;
              <AppButton
                v-if="!role"
                type="submit"
                size="md"
                :loading="state.loading === 'create_redirect'"
                :disabled="
                  !checkPermission('admin-acl-create-role') || !!state.loading || v$.$invalid
                "
              >
                {{ $t('admin.acl.roles.create_and_redirect') }}
              </AppButton>
              <AppButton
                v-if="role"
                type="submit"
                size="md"
                :loading="state.loading === 'update'"
                :disabled="
                  !checkPermission('admin-acl-modify-role') ||
                  (role && role.internal && !isRoot) ||
                  !!state.loading ||
                  v$.$invalid
                "
              >
                {{ $t('admin.acl.role.update') }}
              </AppButton>
            </div>
          </div>
        </form>
      </div>
    </template>
  </AccountLayout>
</template>
