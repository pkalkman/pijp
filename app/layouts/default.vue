<script setup lang="ts"></script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-blue-50">
    <div class="h-14 bg-blue-400 align-middle py-4 px-8 text-yellow-300 font-bold">De Pijp</div>
    <div class="grow py-4 px-8 overflow-scroll">
      <slot />
    </div>
  </div>
</template>
