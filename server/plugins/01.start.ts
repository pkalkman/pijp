import { auth } from '~~/lib/auth';

export default defineNitroPlugin(async () => {
  try {
    console.log('... connected database name', db.databaseName);

    const newUser = await auth.api.createUser({
      body: {
        email: 'peter.kalkman@pkit.nl', // required
        password: '3Banden!!', // required
        name: 'Peter Kalkman', // required
        role: 'user',
      },
    });

    const newUser2 = await auth.api.createUser({
      body: {
        email: 'm.a.van.kooten@gmail.com', // required
        password: '3Banden!!', // required
        name: 'Marcel van Kooten', // required
        role: 'user',
      },
    });

    //
    // console.log(newUser);
  } catch (error) {
    console.error('Nitro startup error', error);
  }
});
