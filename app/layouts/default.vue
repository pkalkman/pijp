<script setup lang="ts">
const route = useRoute();
const { isAuthenticated, logout } = useAuth();
const tabs = [
  { label: 'Poules', to: '/' },
  { label: 'Rooster', to: '/rooster' },
  { label: 'Stand', to: '/stand' },
];
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-blue-50">
    <div class="bg-blue-400 flex-shrink-0 px-4 sm:px-8 pt-safe">
      <div class="h-14 flex items-center w-full">
        <div class="w-full flex justify-between">
          <span class="text-yellow-300 font-bold text-lg">De Pijp</span>
          <NuxtLink v-if="!isAuthenticated" to="/login">
            <Button label="Login" severity="secondary" size="small" />
          </NuxtLink>
          <Button v-else label="Logout" severity="secondary" size="small" @click="logout" />
        </div>
      </div>
      <nav class="flex">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="px-4 py-2 text-sm font-semibold border-b-2 transition-colors"
          :class="
            route.path === tab.to
              ? 'text-yellow-300 border-yellow-300'
              : 'text-blue-200 border-transparent hover:text-yellow-200 hover:border-blue-300'
          "
        >
          {{ tab.label }}
        </NuxtLink>
      </nav>
    </div>
    <div class="grow overflow-y-scroll p-4 sm:p-8 pb-safe">
      <slot />
    </div>
  </div>
</template>
