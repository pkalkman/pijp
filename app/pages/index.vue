<script setup lang="ts">
const { initDone, pouleOna, poulePijp } = usePijpStore();
</script>

<template>
  <div v-if="initDone" class="flex flex-wrap gap-4 sm:gap-8">
    <PouleKaart v-if="pouleOna" :poule="pouleOna" titel="Ona" />
    <PouleKaart v-if="poulePijp" :poule="poulePijp" titel="De Pijp - N-Surance" />
    <PijpSettingsForm />
  </div>
</template>
