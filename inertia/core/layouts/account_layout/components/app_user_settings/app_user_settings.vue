<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

import { useLogout } from './services.js'
import { RouterLink, AppDropdown, AppDropdownItem, AppAvatar } from '@core/components/index.js'
import emitter from '@core/event_bus.js'
import { UserProp } from '@core/types/user.js'
import { useAvatar } from '@core/composables/use_avatar.js'

emitter.on('logout', () => useLogout())

const { initials } = useAvatar()

const user = computed(() => usePage().props.user as UserProp)
</script>

<template>
  <AppDropdown id="user-menu-button">
    <template #header>
      <AppAvatar
        classes="w-6"
        :source="user.avatar"
        :initials="initials(user.fullName)"
        no-fallback
      />
    </template>
    <template #highlight>
      <div class="px-2 py-3" role="none">
        <p class="text-sm font-bold text-gray-800 dark:text-white" role="none">
          {{ user.fullName }}
        </p>
        <small
          class="text-sm text-ellipsis truncate text-gray-400 w-36"
          role="none"
          :title="user.email"
        >
          {{ user.email }}
        </small>
      </div>
    </template>
    <template #default>
      <AppDropdownItem class="py-1">
        <RouterLink href="/account/profile">
          <span>{{ $t('menu.user.profile') }}</span>
        </RouterLink>
      </AppDropdownItem>
      <AppDropdownItem class="py-1">
        <RouterLink href="/account/settings">
          <span>{{ $t('menu.settings') }}</span>
        </RouterLink>
      </AppDropdownItem>
      <AppDropdownItem class="py-1">
        <a id="button-logout" class="cursor-pointer" @click="useLogout()">
          {{ $t('shared.logout') }}
        </a>
      </AppDropdownItem>
    </template>
  </AppDropdown>
</template>
