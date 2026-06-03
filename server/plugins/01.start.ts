export default defineNitroPlugin(async () => {
  try {
    console.log('... connected database name', db.databaseName);
  } catch (error) {
    console.error('Nitro startup error', error);
  }
});
