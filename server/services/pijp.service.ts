import type { StandRegel, Wedstrijd } from '#shared/types';
import { ObjectId } from 'mongodb';

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
    { positie: 1, naam: 'Ron IJsselstijn', poule: 'ONA', moyenne: 0.897 },
    { positie: 2, naam: 'Peter Kalkman', poule: 'ONA', moyenne: 0.603 },
    { positie: 3, naam: 'Wim van Wetten', poule: 'ONA', moyenne: 0.544 },
    { positie: 4, naam: 'Henk Statz', poule: 'ONA', moyenne: 0.507 },
    { positie: 5, naam: 'Gerard Mitgenberg', poule: 'ONA', moyenne: 0.475 },
    { positie: 6, naam: 'Marcel van Kooten', poule: 'ONA', moyenne: 0.470 },
    { positie: 1, naam: 'Peter Berger', poule: 'Rheine', moyenne: 0.553 },
    { positie: 2, naam: 'Henry Martinez Ramirez', poule: 'Rheine', moyenne: 0.536 },
    { positie: 3, naam: 'Rainer Brinkers', poule: 'Rheine', moyenne: 0.300 },
    { positie: 4, naam: 'Carsten Kötting', poule: 'Rheine', moyenne: 0.250 },
    { positie: 5, naam: 'André Wiersch', poule: 'Rheine', moyenne: 0.200 },
    { positie: 6, naam: 'Guido Haarmann', poule: 'Rheine', moyenne: 0.150 },
  ]);

  await pijpSettingsTable.insertOne({
    startTijd: new Date(2026, 7, 4, 12, 0, 0, 0),
    minutenPerWedstrijd: 35,
    aantalTafels: 3,
  });
}

async function getPijpSettings(): Promise<PijpSettings> {
  const settings = await pijpSettingsTable.findOne();
  const { _id, ...result } = settings!;
  return result;
}

async function updatePijpSettings(startTijd: Date, minutenPerWedstrijd: number, aantalTafels: number): Promise<PijpSettings> {
  await pijpSettingsTable.updateOne({}, { $set: { startTijd, minutenPerWedstrijd, aantalTafels } });
  const settings = await pijpSettingsTable.findOne();
  const { _id, ...result } = settings!;
  return result;
}

async function getAllWedstrijden(): Promise<Wedstrijd[]> {
  const wedstrijden = await wedstrijdTable.find().toArray();
  return wedstrijden.map((w) => ({
    ...w,
    _id: w._id!.toHexString(),
    ona: { ...w.ona, speler: { ...w.ona.speler, _id: w.ona.speler._id as unknown as string } },
    pijp: { ...w.pijp, speler: { ...w.pijp.speler, _id: w.pijp.speler._id as unknown as string } },
  }));
}

async function generateAndSaveWedstrijden(): Promise<Wedstrijd[]> {
  const spelers = await getAllSpelers();
  const settings = await getPijpSettings();

  const pouleOna = { naam: 'ONA', spelers: spelers.filter((s) => s.poule === 'ONA') };
  const poulePijp = { naam: 'Rheine', spelers: spelers.filter((s) => s.poule === 'Rheine') };

  const wedstrijden = generateWedstrijden(pouleOna, poulePijp, settings);

  await wedstrijdTable.deleteMany({});
  await wedstrijdTable.insertMany(wedstrijden as any);

  return getAllWedstrijden();
}

async function updateWedstrijdUitslag(id: string, data: { onaGemaakt?: number; pijpGemaakt?: number; beurten?: number }): Promise<void> {
  const setFields: Record<string, number> = {};
  if (data.onaGemaakt !== undefined) setFields['ona.gemaakt'] = data.onaGemaakt;
  if (data.pijpGemaakt !== undefined) setFields['pijp.gemaakt'] = data.pijpGemaakt;
  if (data.beurten !== undefined) setFields['beurten'] = data.beurten;

  if (Object.keys(setFields).length) {
    await wedstrijdTable.updateOne({ _id: new ObjectId(id) }, { $set: setFields });
  }
}

async function getStand(): Promise<StandRegel[]> {
  const wedstrijden = await wedstrijdTable.find().toArray();
  const map = new Map<string, StandRegel>();

  for (const w of wedstrijden) {
    const onaId = w.ona.speler._id as unknown as string;
    const pijpId = w.pijp.speler._id as unknown as string;

    if (!map.has(onaId)) map.set(onaId, { speler: { ...w.ona.speler, _id: onaId }, gespeeld: 0, caramboles: 0, beurten: 0, punten: 0 });
    if (!map.has(pijpId)) map.set(pijpId, { speler: { ...w.pijp.speler, _id: pijpId }, gespeeld: 0, caramboles: 0, beurten: 0, punten: 0 });

    if (w.ona.gemaakt === undefined || w.pijp.gemaakt === undefined) continue;

    const ona = map.get(onaId)!;
    const pijp = map.get(pijpId)!;

    ona.gespeeld++;
    pijp.gespeeld++;
    ona.caramboles += w.ona.gemaakt;
    pijp.caramboles += w.pijp.gemaakt;
    if (w.beurten) {
      ona.beurten += w.beurten;
      pijp.beurten += w.beurten;
    }

    if (w.ona.gemaakt > w.pijp.gemaakt) {
      ona.punten += 2;
    } else if (w.ona.gemaakt === w.pijp.gemaakt) {
      ona.punten += 1;
      pijp.punten += 1;
    } else {
      pijp.punten += 2;
    }
  }

  return [...map.values()].sort((a, b) => b.punten - a.punten || b.caramboles - a.caramboles);
}

export const pijpService = {
  getAllSpelers,
  getPijpSettings,
  updatePijpSettings,
  getAllWedstrijden,
  generateAndSaveWedstrijden,
  updateWedstrijdUitslag,
  clearWedstrijdUitslag,
  getStand,
};

async function clearWedstrijdUitslag(id: string): Promise<void> {
  await wedstrijdTable.updateOne({ _id: new ObjectId(id) }, { $unset: { 'ona.gemaakt': '', 'pijp.gemaakt': '', beurten: '' } });
}
