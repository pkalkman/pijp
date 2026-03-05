async function getAllSpelers(): Promise<Speler[]> {
  let spelers = await spelerTable.find().toArray();

  if (!spelers.length) {
    await initDb();
    spelers = await spelerTable.find().toArray();
  }

  return spelers.map((s) => {
    return {
      ...s,
      _id: s._id.toHexString(),
    };
  });
}

async function initDb() {
  await spelerTable.insertMany([
    { positie: 1, naam: 'Ron IJsselstijn', poule: 'ONA' },
    { positie: 2, naam: 'Gerard de Jong', poule: 'ONA' },
    { positie: 3, naam: 'Wim van Wetten', poule: 'ONA' },
    { positie: 4, naam: 'Henk Statz', poule: 'ONA' },
    { positie: 5, naam: 'Gerard Mitgenberg', poule: 'ONA' },
    { positie: 6, naam: 'Peter Kalkman', poule: 'ONA' },
    { positie: 1, naam: 'Bob de Zeeuw', poule: 'De Pijp - N-Surance' },
    { positie: 2, naam: 'Paul de Vos', poule: 'De Pijp - N-Surance' },
    { positie: 3, naam: 'Niels van der Vlist', poule: 'De Pijp - N-Surance' },
    { positie: 4, naam: 'Danny van Leeuwen', poule: 'De Pijp - N-Surance' },
    { positie: 5, naam: 'Rene van Leeuwen', poule: 'De Pijp - N-Surance' },
    { positie: 6, naam: 'Koert Veninga', poule: 'De Pijp - N-Surance' },
  ]);

  await pijpSettingsTable.insertOne({
    startTijd: new Date(2026, 3, 8, 12, 0, 0, 0),
    minutenPerWedstrijd: 20,
    aantalTafels: 2,
  });
}

async function getPijpSettings(): Promise<PijpSettings> {
  const settings = await pijpSettingsTable.findOne();
  const { _id, ...result } = settings!;
  return result;
}

export const pijpService = {
  getAllSpelers,
  getPijpSettings,
};
