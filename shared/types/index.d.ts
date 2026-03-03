export type Speler = {
  positie: number;
  naam: string;
};

export type Poule = {
  spelers: Speler[];
};

export type PijpSettings = {
  startTijd: Date;
  minutenPerWedstrijd: number;
}
