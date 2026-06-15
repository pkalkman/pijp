<script setup lang="ts">
const { pijpSettings, updateSettings } = usePijpStore();
const { isAuthenticated } = useAuth();

function toInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const startTijd = ref(toInputValue(new Date(pijpSettings.value!.startTijd)));
const minutenPerWedstrijd = ref(pijpSettings.value!.minutenPerWedstrijd);
const aantalTafels = ref(pijpSettings.value!.aantalTafels);
const speelwijze = ref<'tijd' | 'beurten'>(pijpSettings.value!.speelwijze ?? 'tijd');
const vastAantalBeurten = ref(pijpSettings.value!.vastAantalBeurten ?? 20);
const minimumAantalBeurten = ref(pijpSettings.value!.minimumAantalBeurten ?? 5);

const startTijdDisplay = computed(() =>
  new Intl.DateTimeFormat('nl-NL', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(pijpSettings.value!.startTijd),
  ),
);

function onSubmit() {
  updateSettings({
    startTijd: new Date(startTijd.value),
    minutenPerWedstrijd: minutenPerWedstrijd.value,
    aantalTafels: aantalTafels.value,
    speelwijze: speelwijze.value,
    vastAantalBeurten: speelwijze.value === 'beurten' ? vastAantalBeurten.value : undefined,
    minimumAantalBeurten: speelwijze.value === 'beurten' ? minimumAantalBeurten.value : undefined,
  });
}
</script>

<template>
  <div class="w-full sm:w-72 rounded-xl bg-white shadow-md overflow-hidden">
    <div class="bg-blue-400 px-5 py-3 text-yellow-300 font-bold text-lg">Instellingen</div>
    <template v-if="isAuthenticated">
      <form class="px-5 py-4 flex flex-col gap-4" @submit.prevent="onSubmit">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Starttijd</span>
          <input
            v-model="startTijd"
            type="datetime-local"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aantal tafels</span>
          <input
            v-model.number="aantalTafels"
            type="number"
            min="1"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Speelwijze</span>
          <div class="flex gap-4 text-sm text-gray-700">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input v-model="speelwijze" type="radio" value="tijd" class="accent-blue-400" />
              Op tijd
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input v-model="speelwijze" type="radio" value="beurten" class="accent-blue-400" />
              Vast aantal beurten
            </label>
          </div>
        </div>
        <label v-if="speelwijze === 'tijd'" class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minuten per wedstrijd</span>
          <input
            v-model.number="minutenPerWedstrijd"
            type="number"
            min="1"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <template v-else>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aantal beurten</span>
            <input
              v-model.number="vastAantalBeurten"
              type="number"
              min="1"
              class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minimum aantal caramboles</span>
            <input
              v-model.number="minimumAantalBeurten"
              type="number"
              min="0"
              class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
        </template>
        <button
          type="submit"
          class="rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-blue-500 transition-colors"
        >
          Opslaan
        </button>
      </form>
    </template>
    <template v-else>
      <dl class="px-5 py-4 flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Starttijd</span>
          <span class="text-sm text-gray-800">{{ startTijdDisplay }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aantal tafels</span>
          <span class="text-sm text-gray-800">{{ pijpSettings!.aantalTafels }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Speelwijze</span>
          <span class="text-sm text-gray-800">
            {{ pijpSettings!.speelwijze === 'beurten' ? 'Vast aantal beurten' : 'Op tijd' }}
          </span>
        </div>
        <div v-if="pijpSettings!.speelwijze === 'tijd'" class="flex flex-col gap-1">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minuten per wedstrijd</span>
          <span class="text-sm text-gray-800">{{ pijpSettings!.minutenPerWedstrijd }}</span>
        </div>
        <template v-else>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aantal beurten</span>
            <span class="text-sm text-gray-800">{{ pijpSettings!.vastAantalBeurten }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minimum aantal beurten</span>
            <span class="text-sm text-gray-800">{{ pijpSettings!.minimumAantalBeurten }}</span>
          </div>
        </template>
      </dl>
    </template>
  </div>
</template>
