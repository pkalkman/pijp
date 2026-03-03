<script setup lang="ts">
const { pouleOna, poulePijp, wedstrijden, swapInPouleOna, swapInPoulePijp } = usePijpStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-8">
      <PouleKaart v-if="pouleOna" :poule="pouleOna" titel="Ona" @swap="swapInPouleOna" />
      <PouleKaart v-if="poulePijp" :poule="poulePijp" titel="Pijp" @swap="swapInPoulePijp" />
      <PijpSettingsForm />
    </div>
    <div>
      <span>Wedstrijden</span>
      <pre>{{wedstrijden}}</pre>
    </div>
  </div>
</template>
