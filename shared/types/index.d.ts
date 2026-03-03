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
  aantalTafels: number;
}

export type Wedstrijd = {
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
