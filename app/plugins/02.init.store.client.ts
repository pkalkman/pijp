export default defineNuxtPlugin(async () => {
  const { initStore } = usePijpStore();
  await initStore();
});
