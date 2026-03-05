<script setup lang="ts">
const props = defineProps<{
  poule: Poule;
  titel: string;
}>();

const gesorteerd = computed(() => [...props.poule.spelers].sort((a, b) => a.positie - b.positie));
</script>

<template>
  <div class="w-full sm:w-72 rounded-xl bg-white shadow-md overflow-hidden">
    <div class="bg-blue-400 px-5 py-3 text-yellow-300 font-bold text-lg">
      {{ titel }}
    </div>
    <ul class="divide-y divide-gray-100">
      <li
        v-for="speler in gesorteerd"
        :key="speler.positie"
        class="flex items-center gap-3 px-4 py-3 cursor-grab select-none transition-colors"
      >
        <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center shrink-0">
          {{ speler.positie }}
        </span>
        <span class="text-gray-800 text-sm">{{ speler.naam }}</span>
      </li>
    </ul>
  </div>
</template>
