<script setup lang="ts">
const { wedstrijden, pijpSettings, genereerWedstrijden, slaUitslagOp, verwijderUitslag } = usePijpStore();
const { isAuthenticated } = useAuth();

const aantalTafels = computed(() => pijpSettings.value?.aantalTafels ?? 1);
const zoekTerm = ref('');

// Score form state per wedstrijd._id
type ScoreForm = { onaGemaakt: string; pijpGemaakt: string; beurten: string };
const scores = ref<Record<string, ScoreForm>>({});
const opslaanBezig = ref<Record<string, boolean>>({});

watch(
  wedstrijden,
  (ws) => {
    for (const w of ws) {
      scores.value[w._id] = {
        onaGemaakt: w.ona.gemaakt?.toString() ?? '',
        pijpGemaakt: w.pijp.gemaakt?.toString() ?? '',
        beurten: w.beurten?.toString() ?? '',
      };
    }
  },
  { immediate: true },
);

const rondes = computed(() => {
  const map = new Map<number, typeof wedstrijden.value>();
  for (const w of wedstrijden.value) {
    const key = w.tijdstip.getTime();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(w);
  }
  return [...map.entries()].sort(([a], [b]) => a - b).map(([, matches]) => matches);
});

function rondeMatchesZoekterm(ronde: (typeof rondes.value)[number]): boolean {
  if (!zoekTerm.value) return true;
  const term = zoekTerm.value.toLowerCase();
  return ronde.some((w) => w.ona.speler.naam.toLowerCase().includes(term) || w.pijp.speler.naam.toLowerCase().includes(term));
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

async function slaOp(wedstrijdId: string) {
  opslaanBezig.value[wedstrijdId] = true;
  try {
    const s = scores.value[wedstrijdId]!;
    await slaUitslagOp(
      wedstrijdId,
      s.onaGemaakt !== '' ? Number(s.onaGemaakt) : undefined,
      s.pijpGemaakt !== '' ? Number(s.pijpGemaakt) : undefined,
      s.beurten !== '' ? Number(s.beurten) : undefined,
    );
  } finally {
    opslaanBezig.value[wedstrijdId] = false;
  }
}

async function wisUitslag(wedstrijdId: string) {
  opslaanBezig.value[wedstrijdId] = true;
  try {
    await verwijderUitslag(wedstrijdId);
    scores.value[wedstrijdId] = { onaGemaakt: '', pijpGemaakt: '', beurten: '' };
  } finally {
    opslaanBezig.value[wedstrijdId] = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="isAuthenticated" class="flex flex-wrap items-center gap-3">
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

    <template v-if="rondes.length > 0">
      <!-- Mobiel: kaartweergave -->
      <div class="sm:hidden flex flex-col gap-2">
        <div
          v-for="(ronde, idx) in rondes"
          :key="idx"
          class="rounded-xl bg-white shadow-sm overflow-hidden transition-opacity"
          :class="rondeMatchesZoekterm(ronde) ? '' : 'opacity-25'"
        >
          <div class="bg-blue-50 px-3 py-1.5 text-xs font-mono font-semibold text-blue-400">
            {{ formatTijd(ronde[0].tijdstip) }}
          </div>
          <div v-for="w in ronde" :key="w._id" class="border-t border-gray-100 first:border-t-0">
            <div class="flex items-center gap-2 px-3 py-2">
              <span class="text-xs font-semibold text-gray-400 w-6 shrink-0">T{{ ronde.indexOf(w) + 1 }}</span>
              <span class="flex-1 text-sm">
                <span
                  v-for="(part, i) in highlightParts(w.ona.speler.naam)"
                  :key="'o' + i"
                  class="font-medium"
                  :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                  >{{ part.text }}</span
                >
                <span class="mx-1.5 text-gray-300">vs</span>
                <span
                  v-for="(part, i) in highlightParts(w.pijp.speler.naam)"
                  :key="'p' + i"
                  class="font-medium"
                  :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                  >{{ part.text }}</span
                >
              </span>
            </div>
            <div v-if="isAuthenticated && scores[w._id]" class="flex items-center gap-2 px-3 pb-2">
              <input
                v-model="scores[w._id].onaGemaakt"
                type="number"
                min="0"
                placeholder="ONA"
                class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <span class="text-xs text-gray-400">-</span>
              <input
                v-model="scores[w._id].pijpGemaakt"
                type="number"
                min="0"
                placeholder="Pijp"
                class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <span class="text-xs text-gray-400 ml-1">B:</span>
              <input
                v-model="scores[w._id].beurten"
                type="number"
                min="1"
                placeholder="0"
                class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <button
                :disabled="opslaanBezig[w._id]"
                class="rounded bg-green-400 px-2 py-0.5 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
                @click="slaOp(w._id)"
              >
                Opslaan
              </button>
              <button
                v-if="w.ona.gemaakt !== undefined || w.pijp.gemaakt !== undefined"
                :disabled="opslaanBezig[w._id]"
                class="rounded bg-red-400 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                @click="wisUitslag(w._id)"
              >
                Wis
              </button>
            </div>
            <div
              v-else-if="!isAuthenticated && (w.ona.gemaakt !== undefined || w.pijp.gemaakt !== undefined)"
              class="px-3 pb-2 text-xs text-gray-500"
            >
              {{ w.ona.gemaakt ?? '?' }} – {{ w.pijp.gemaakt ?? '?' }}
              <span v-if="w.beurten" class="ml-1 text-gray-400">({{ w.beurten }} b.)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: tabelweergave -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="border-collapse text-sm w-full">
          <thead>
            <tr>
              <th class="bg-blue-400 text-yellow-300 font-bold px-4 py-2 text-left rounded-tl-lg">Tijd</th>
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
              :class="rondeMatchesZoekterm(ronde) ? (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50') : 'opacity-25'"
            >
              <td class="px-4 py-2 font-mono text-gray-500 whitespace-nowrap">
                {{ formatTijd(ronde[0].tijdstip) }}
              </td>
              <td v-for="tafel in aantalTafels" :key="tafel" class="px-4 py-2">
                <template v-for="w in [ronde[tafel - 1]]" :key="tafel">
                  <template v-if="w">
                    <div class="flex flex-col gap-1">
                      <div class="whitespace-nowrap">
                        <span
                          v-for="(part, i) in highlightParts(w.ona.speler.naam)"
                          :key="i"
                          class="font-medium"
                          :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                          >{{ part.text }}</span
                        >
                        <span class="mx-2 text-gray-400">vs</span>
                        <span
                          v-for="(part, i) in highlightParts(w.pijp.speler.naam)"
                          :key="i"
                          class="font-medium"
                          :class="part.match ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : 'text-gray-800'"
                          >{{ part.text }}</span
                        >
                      </div>
                      <div v-if="isAuthenticated && scores[w._id]" class="flex items-center gap-1.5">
                        <input
                          v-model="scores[w._id].onaGemaakt"
                          type="number"
                          min="0"
                          placeholder="ONA"
                          class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                        <span class="text-xs text-gray-400">-</span>
                        <input
                          v-model="scores[w._id].pijpGemaakt"
                          type="number"
                          min="0"
                          placeholder="Pijp"
                          class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                        <span class="text-xs text-gray-400 ml-1">B:</span>
                        <input
                          v-model="scores[w._id].beurten"
                          type="number"
                          min="1"
                          placeholder="0"
                          class="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                        <button
                          :disabled="opslaanBezig[w._id]"
                          class="rounded bg-green-400 px-2 py-0.5 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
                          @click="slaOp(w._id)"
                        >
                          Opslaan
                        </button>
                        <button
                          v-if="w.ona.gemaakt !== undefined || w.pijp.gemaakt !== undefined"
                          :disabled="opslaanBezig[w._id]"
                          class="rounded bg-red-400 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                          @click="wisUitslag(w._id)"
                        >
                          Wis
                        </button>
                      </div>
                      <div
                        v-else-if="!isAuthenticated && (w.ona.gemaakt !== undefined || w.pijp.gemaakt !== undefined)"
                        class="text-xs text-gray-500"
                      >
                        {{ w.ona.gemaakt ?? '?' }} – {{ w.pijp.gemaakt ?? '?' }}
                        <span v-if="w.beurten" class="ml-1 text-gray-400">({{ w.beurten }} b.)</span>
                      </div>
                    </div>
                  </template>
                  <span v-else class="text-gray-300">—</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
