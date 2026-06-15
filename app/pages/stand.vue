<script setup lang="ts">
import FormattedNumber from '~/components/FormattedNumber.vue';

const { stand, pijpSettings } = usePijpStore();

const isBeurten = computed(() => pijpSettings.value?.speelwijze === 'beurten' && !!pijpSettings.value.vastAantalBeurten);

function pct(caramboles: number, teMaken: number | undefined): number {
  if (!teMaken) return 0;
  return (caramboles / teMaken) * 100;
}

const totaal = (poule: string) =>
  stand.value
    .filter((r) => r.speler.poule === poule)
    .reduce(
      (acc, r) => ({
        gespeeld: acc.gespeeld + r.gespeeld,
        caramboles: acc.caramboles + r.caramboles,
        beurten: acc.beurten + r.beurten,
        punten: acc.punten + r.punten,
        teMaken: acc.teMaken + (r.teMaken ?? 0),
      }),
      { gespeeld: 0, caramboles: 0, beurten: 0, punten: 0, teMaken: 0 },
    );

const totaalOna = computed(() => totaal('ONA'));
const totaalPijp = computed(() => totaal('Rheine'));
</script>

<template>
  <div>
    <template v-if="stand.length > 0">
      <div class="overflow-x-auto">
        <table class="border-collapse text-xs w-full">
          <thead>
            <tr>
              <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-left rounded-tl-lg">#</th>
              <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-left">Speler</th>
              <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">Ges</th>
              <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">Gemaakt</th>
              <template v-if="isBeurten">
                <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">Te maken</th>
                <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">%</th>
              </template>
              <template v-else>
                <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">Brt</th>
                <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right">Moy</th>
              </template>
              <th class="bg-blue-400 text-yellow-300 font-bold px-2 py-2 text-right rounded-tr-lg">Pnt</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(regel, idx) in stand"
              :key="regel.speler._id"
              class="border-t border-gray-100"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'"
            >
              <td class="px-2 py-2 text-gray-400 font-mono">{{ idx + 1 }}</td>
              <td class="px-2 py-2 font-medium text-gray-800">{{ regel.speler.naam }}</td>
              <td class="px-2 py-2 text-right! text-gray-600">{{ regel.gespeeld }}</td>
              <td class="px-2 py-2 text-right! text-gray-600">{{ regel.caramboles }}</td>
              <template v-if="isBeurten">
                <td class="px-2 py-2 text-right! text-gray-600">{{ regel.teMaken ?? 0 }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber :input-number="pct(regel.caramboles, regel.teMaken)" :aantal-decimalen="1" />%
                </td>
              </template>
              <template v-else>
                <td class="px-2 py-2 text-right! text-gray-600">{{ regel.beurten }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber v-if="regel.beurten" :input-number="regel.caramboles / regel.beurten" :aantal-decimalen="3" />
                  <FormattedNumber v-else :input-number="0" :aantal-decimalen="3" />
                </td>
              </template>
              <td class="px-2 py-2 text-right! font-bold text-blue-500">{{ regel.punten }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-blue-200 bg-blue-50">
              <td class="px-2 py-2" colspan="2">
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wide">Totaal ONA</span>
              </td>
              <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalOna.gespeeld }}</td>
              <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalOna.caramboles }}</td>
              <template v-if="isBeurten">
                <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalOna.teMaken }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber :input-number="pct(totaalOna.caramboles, totaalOna.teMaken)" :aantal-decimalen="1" />%
                </td>
              </template>
              <template v-else>
                <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalOna.beurten }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber v-if="totaalOna.beurten" :input-number="totaalOna.caramboles / totaalOna.beurten" :aantal-decimalen="3" />
                  <FormattedNumber v-else :input-number="0" :aantal-decimalen="3" />
                </td>
              </template>
              <td class="px-2 py-2 text-right! font-bold text-blue-500">{{ totaalOna.punten }}</td>
            </tr>
            <tr class="border-t border-blue-100 bg-blue-50">
              <td class="px-2 py-2" colspan="2">
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wide">Totaal Rheine</span>
              </td>
              <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalPijp.gespeeld }}</td>
              <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalPijp.caramboles }}</td>
              <template v-if="isBeurten">
                <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalPijp.teMaken }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber :input-number="pct(totaalPijp.caramboles, totaalPijp.teMaken)" :aantal-decimalen="1" />%
                </td>
              </template>
              <template v-else>
                <td class="px-2 py-2 text-right! font-semibold text-gray-700">{{ totaalPijp.beurten }}</td>
                <td class="px-2 py-2 text-right! text-gray-600">
                  <FormattedNumber
                    v-if="totaalPijp.beurten"
                    :input-number="totaalPijp.caramboles / totaalPijp.beurten"
                    :aantal-decimalen="3"
                  />
                  <FormattedNumber v-else :input-number="0" :aantal-decimalen="3" />
                </td>
              </template>
              <td class="px-2 py-2 text-right! font-bold text-blue-500">{{ totaalPijp.punten }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>

    <p v-else class="text-sm text-gray-400">Nog geen uitslagen beschikbaar.</p>
  </div>
</template>
