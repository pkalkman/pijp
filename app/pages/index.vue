<script setup lang="ts">
const { initDone, pouleOna, poulePijp } = usePijpStore();
</script>

<template>
  <div v-if="initDone" class="grid grid-cols-3 gap-2">
    <PouleKaart v-if="pouleOna" :poule="pouleOna" titel="Ona" />
    <PouleKaart v-if="poulePijp" :poule="poulePijp" titel="Rheine" />
    <PijpSettingsForm />
  </div>
</template>
