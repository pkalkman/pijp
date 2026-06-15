<script setup lang="ts">
const props = defineProps<{
  poule: Poule;
  titel: string;
}>();

const { isAuthenticated } = useAuth();
const { updateSpeler, pijpSettings } = usePijpStore();

const gesorteerd = computed(() => [...props.poule.spelers].sort((a, b) => a.positie - b.positie));

const spelersEdit = ref<Record<string, { naam: string; moyenne: number }>>({});

watch(
  gesorteerd,
  (spelers) => {
    for (const s of spelers) {
      spelersEdit.value[s._id] = { naam: s.naam, moyenne: s.moyenne };
    }
  },
  { immediate: true, deep: true },
);

function berekenCaramboles(moyenne: number): number | null {
  const s = pijpSettings.value;
  if (!s || s.speelwijze !== 'beurten' || !s.vastAantalBeurten) return null;
  return Math.max(s.minimumAantalBeurten ?? 0, Math.floor(moyenne * s.vastAantalBeurten));
}

const carambolesPerSpeler = computed<Record<string, number> | null>(() => {
  const s = pijpSettings.value;
  if (!s || s.speelwijze !== 'beurten' || !s.vastAantalBeurten) return null;
  const map: Record<string, number> = {};
  for (const speler of gesorteerd.value) {
    map[speler._id] = Math.max(s.minimumAantalBeurten ?? 0, Math.floor(speler.moyenne * s.vastAantalBeurten));
  }
  return map;
});

async function opslaan(speler: Speler) {
  const e = spelersEdit.value[speler._id];
  if (!e) return;
  await updateSpeler(speler._id, e.naam, e.moyenne);
}
</script>

<template>
  <div class="w-full rounded-xl bg-white shadow-md overflow-hidden">
    <div class="bg-blue-400 px-5 py-3 text-yellow-300 font-bold text-lg">
      {{ titel }}
    </div>
    <ul class="divide-y divide-gray-100">
      <li
        v-for="speler in gesorteerd"
        :key="speler.positie"
        class="flex items-center gap-3 px-4 py-3 transition-colors"
      >
        <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center shrink-0">
          {{ speler.positie }}
        </span>
        <template v-if="isAuthenticated">
          <div class="flex flex-col gap-2 flex-1 min-w-0">
            <input
              v-model="spelersEdit[speler._id].naam"
              type="text"
              class="rounded border border-gray-200 px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            />
            <div class="flex items-center gap-2">
              <input
                v-model.number="spelersEdit[speler._id].moyenne"
                type="number"
                step="0.001"
                min="0"
                max="9.999"
                class="rounded border border-gray-200 px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 min-w-0"
              />
              <span
                v-if="berekenCaramboles(spelersEdit[speler._id].moyenne) !== null"
                class="text-blue-600 text-xs font-semibold shrink-0"
              >
                {{ berekenCaramboles(spelersEdit[speler._id].moyenne) }} car.
              </span>
            </div>
          </div>
          <button
            class="shrink-0 rounded bg-blue-400 px-2 py-1 text-xs font-semibold text-yellow-300 hover:bg-blue-500 transition-colors"
            @click="opslaan(speler)"
          >
            Sla op
          </button>
        </template>
        <template v-else>
          <span class="text-gray-800 text-sm flex-1">{{ speler.naam }}</span>
          <div class="flex flex-col items-end shrink-0 gap-0.5">
            <span class="text-gray-400 text-sm">
              <FormattedNumber :input-number="speler.moyenne" :aantal-decimalen="3" />
            </span>
            <span v-if="carambolesPerSpeler" class="text-blue-600 text-xs font-semibold">
              {{ carambolesPerSpeler[speler._id] }} car.
            </span>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>
