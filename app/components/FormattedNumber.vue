<script setup lang="ts">
const { inputNumber, aantalDecimalen = 0 } = defineProps<{
  inputNumber: number;
  aantalDecimalen?: number;
}>();

const numberAsString = computed(() => {
  return formatNumber(inputNumber, aantalDecimalen);
});

const formatNumber = (number: number, fractionDigits: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(number || 0);
};
</script>

<template>
  <span>{{ numberAsString }}</span>
</template>
