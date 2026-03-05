export type Speler = {
  _id: string;
  positie: number;
  naam: string;
  poule: string;
};

export type Poule = {
  naam: string;
  spelers: Speler[];
};

export type PijpSettings = {
  startTijd: Date;
  minutenPerWedstrijd: number;
  aantalTafels: number;
}

export type Wedstrijd = {
  _id: string;
  tijdstip: Date;
  ona: {
    speler: Speler;
    gemaakt?: number;
  };
  pijp: {
    speler: Speler;
    gemaakt?: number;
  }
  beurten?: number;
}
