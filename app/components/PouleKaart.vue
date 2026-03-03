<script setup lang="ts">
const props = defineProps<{
  poule: Poule;
  titel: string;
}>();

const emit = defineEmits<{
  swap: [positieA: number, positieB: number];
}>();

const gesorteerd = computed(() => [...props.poule.spelers].sort((a, b) => a.positie - b.positie));

const dragVan = ref<number | null>(null);
const dragOver = ref<number | null>(null);

function onDragStart(positie: number) {
  dragVan.value = positie;
}

function onDragEnter(positie: number) {
  dragOver.value = positie;
}

function onDragEnd() {
  dragVan.value = null;
  dragOver.value = null;
}

function onDrop(positie: number) {
  if (dragVan.value !== null && dragVan.value !== positie) {
    emit('swap', dragVan.value, positie);
  }
  dragVan.value = null;
  dragOver.value = null;
}
</script>

<template>
  <div class="w-72 rounded-xl bg-white shadow-md overflow-hidden">
    <div class="bg-blue-400 px-5 py-3 text-yellow-300 font-bold text-lg">
      {{ titel }}
    </div>
    <ul class="divide-y divide-gray-100">
      <li
        v-for="speler in gesorteerd"
        :key="speler.positie"
        draggable="true"
        @dragstart="onDragStart(speler.positie)"
        @dragenter.prevent="onDragEnter(speler.positie)"
        @dragover.prevent
        @dragleave="dragOver = null"
        @drop.prevent="onDrop(speler.positie)"
        @dragend="onDragEnd"
        class="flex items-center gap-3 px-4 py-3 cursor-grab select-none transition-colors"
        :class="{
          'opacity-40': dragVan === speler.positie,
          'bg-blue-50 ring-1 ring-inset ring-blue-300': dragOver === speler.positie && dragVan !== speler.positie,
        }"
      >
        <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center shrink-0">
          {{ speler.positie }}
        </span>
        <span class="text-gray-800 text-sm">{{ speler.naam }}</span>
      </li>
    </ul>
  </div>
</template>
