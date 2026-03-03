<script setup lang="ts">
const { wedstrijden, pijpSettings, genereerWedstrijden } = usePijpStore();

const aantalTafels = computed(() => pijpSettings.value?.aantalTafels ?? 1);

// Groepeer wedstrijden per tijdstip, gesorteerd op tijd
const rondes = computed(() => {
  const map = new Map<number, typeof wedstrijden.value>();
  for (const w of wedstrijden.value) {
    const key = w.tijdstip.getTime();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(w);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, matches]) => matches);
});

function formatTijd(date: Date): string {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <button
        class="rounded-lg bg-blue-400 px-5 py-2 text-sm font-semibold text-yellow-300 hover:bg-blue-500 transition-colors"
        @click="genereerWedstrijden"
      >
        Genereer wedstrijden
      </button>
    </div>

    <div v-if="rondes.length > 0" class="overflow-auto">
      <table class="border-collapse text-sm w-full">
        <thead>
          <tr>
            <th class="bg-blue-400 text-yellow-300 font-bold px-4 py-2 text-left rounded-tl-lg">
              Tijd
            </th>
            <th
              v-for="tafel in aantalTafels"
              :key="tafel"
              class="bg-blue-400 text-yellow-300 font-bold px-4 py-2 text-left"
              :class="{ 'rounded-tr-lg': tafel === aantalTafels }"
            >
              Tafel {{ tafel }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ronde, idx) in rondes"
            :key="idx"
            class="border-t border-gray-100"
            :class="idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'"
          >
            <td class="px-4 py-2 font-mono text-gray-500 whitespace-nowrap">
              {{ formatTijd(ronde[0].tijdstip) }}
            </td>
            <td
              v-for="tafel in aantalTafels"
              :key="tafel"
              class="px-4 py-2"
            >
              <template v-if="ronde[tafel - 1]">
                <span class="font-medium text-gray-800">{{ ronde[tafel - 1].ona.speler.naam }}</span>
                <span class="mx-2 text-gray-400">vs</span>
                <span class="font-medium text-gray-800">{{ ronde[tafel - 1].pijp.speler.naam }}</span>
              </template>
              <span v-else class="text-gray-300">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
