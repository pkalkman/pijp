<script setup lang="ts">
const { wedstrijden, pijpSettings, genereerWedstrijden } = usePijpStore();

const aantalTafels = computed(() => pijpSettings.value?.aantalTafels ?? 1);

const zoekTerm = ref('');

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

function rondeMatchesZoekterm(ronde: (typeof rondes.value)[number]): boolean {
  if (!zoekTerm.value) return true;
  const term = zoekTerm.value.toLowerCase();
  return ronde.some(
    (w) =>
      w.ona.speler.naam.toLowerCase().includes(term) ||
      w.pijp.speler.naam.toLowerCase().includes(term)
  );
}

function highlightParts(naam: string): { text: string; match: boolean }[] {
  const term = zoekTerm.value;
  if (!term) return [{ text: naam, match: false }];
  const idx = naam.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return [{ text: naam, match: false }];
  return [
    { text: naam.slice(0, idx), match: false },
    { text: naam.slice(idx, idx + term.length), match: true },
    { text: naam.slice(idx + term.length), match: false },
  ].filter((p) => p.text.length > 0);
}

function formatTijd(date: Date): string {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <button
        class="rounded-lg bg-blue-400 px-5 py-2 text-sm font-semibold text-yellow-300 hover:bg-blue-500 transition-colors"
        @click="genereerWedstrijden"
      >
        Genereer wedstrijden
      </button>
      <input
        v-if="rondes.length > 0"
        v-model="zoekTerm"
        type="search"
        placeholder="Zoek op speler…"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 w-52"
      />
    </div>

    <div v-if="rondes.length > 0" class="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
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
            class="border-t border-gray-100 transition-opacity"
            :class="[
              rondeMatchesZoekterm(ronde) ? (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50') : 'opacity-25',
            ]"
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
                <span
                  v-for="(part, i) in highlightParts(ronde[tafel - 1].ona.speler.naam)"
                  :key="i"
                  class="font-medium"
                  :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                >{{ part.text }}</span>
                <span class="mx-2 text-gray-400">vs</span>
                <span
                  v-for="(part, i) in highlightParts(ronde[tafel - 1].pijp.speler.naam)"
                  :key="i"
                  class="font-medium"
                  :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                >{{ part.text }}</span>
              </template>
              <span v-else class="text-gray-300">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
