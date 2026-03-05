<script setup lang="ts">
const { pouleOna, poulePijp, swapInPouleOna, swapInPoulePijp } = usePijpStore();

const { data, error } = await useFetch('/api/version');
</script>

<template>
  <div class="flex flex-wrap gap-4 sm:gap-8">
    <PouleKaart v-if="pouleOna" :poule="pouleOna" titel="Ona" @swap="swapInPouleOna" />
    <PouleKaart v-if="poulePijp" :poule="poulePijp" titel="Pijp" @swap="swapInPoulePijp" />
    <PijpSettingsForm />
    <div>
      <h1>Database Version</h1>
      <p v-if="data">{{ data.version }}</p>
      <p v-else-if="error">Error fetching version</p>
    </div>
  </div>
</template>
