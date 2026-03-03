<script setup lang="ts">
const { pouleOna, poulePijp } = usePijpStore();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between">
      <div>
        <pre>{{ pouleOna }}</pre>
      </div>
      <div>
        <pre>{{ poulePijp }}</pre>
      </div>
    </div>
  </div>
</template>
