import { ObjectId } from 'mongodb';

export type SpelerSchema = {
  _id?: ObjectId;
  positie: number;
  naam: string;
  poule: string;
};

export type PijpSettingsSchema = {
  _id?: ObjectId;
  startTijd: Date;
  minutenPerWedstrijd: number;
  aantalTafels: number;
};

export type WedstrijdSchema = {
  _id?: ObjectId;
  tijdstip: Date;
  ona: {
    speler: SpelerSchema;
    gemaakt?: number;
  };
  pijp: {
    speler: SpelerSchema;
    gemaakt?: number;
  };
  beurten?: number;
};
