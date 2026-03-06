import { auth } from '~~/lib/auth';

export default defineNitroPlugin(async () => {
  try {
    console.log('... connected database name', db.databaseName);

    await auth.api.createUser({
      body: {
        email: 'peter.kalkman@pkit2.nl',
        password: 'Pijp2026!!',
        name: 'Peter Kalkman',
      },
    });
  } catch (error) {
    console.error('Nitro startup error', error);
  }
});
