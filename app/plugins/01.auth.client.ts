export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth();

  // Check auth status bij app start (alleen client-side)
  await checkAuth();
});
