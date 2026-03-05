import { PijpSettingsSchema, SpelerSchema, WedstrijdSchema } from '#server/db/schemas';
import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(useRuntimeConfig().mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connection = await client.connect();

const db = connection.db('pijp');

const spelerTable = db.collection<SpelerSchema>('speler');
const wedstrijdTable = db.collection<WedstrijdSchema>('wedstrijd');
const pijpSettingsTable = db.collection<PijpSettingsSchema>('pijp-settings');

export { db, spelerTable, pouleTable, wedstrijdTable, pijpSettingsTable };
