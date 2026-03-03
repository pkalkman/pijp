<script setup lang="ts">
const { pouleOna, poulePijp, swapInPouleOna, swapInPoulePijp } = usePijpStore();
</script>

<template>
  <div class="flex flex-wrap gap-4 sm:gap-8">
    <PouleKaart v-if="pouleOna" :poule="pouleOna" titel="Ona" @swap="swapInPouleOna" />
    <PouleKaart v-if="poulePijp" :poule="poulePijp" titel="Pijp" @swap="swapInPoulePijp" />
    <PijpSettingsForm />
  </div>
</template>
