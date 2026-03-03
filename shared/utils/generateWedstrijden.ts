import type { PijpSettings, Poule, Speler, Wedstrijd } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateWedstrijden(pouleOna: Poule, poulePijp: Poule, settings: PijpSettings): Wedstrijd[] {
  const { startTijd, minutenPerWedstrijd, aantalTafels } = settings;

  // Alle mogelijke combinaties, willekeurig geschud
  type Pair = [Speler, Speler];
  let remaining: Pair[] = shuffle(
    pouleOna.spelers.flatMap((o) => poulePijp.spelers.map((p): Pair => [o, p]))
  );

  // Bijhouden in welke ronde een speler voor het laatst heeft gespeeld
  const lastRound = new Map<number, Map<'ona' | 'pijp', number>>();
  const getLastRound = (speler: Speler, poule: 'ona' | 'pijp') =>
    lastRound.get(speler.positie)?.get(poule) ?? -Infinity;

  const rounds: Pair[][] = [];

  while (remaining.length > 0) {
    // Sorteer op langst wachtende paren (minste max van lastRound van beide spelers)
    remaining.sort((a, b) => {
      const waitA = Math.max(getLastRound(a[0], 'ona'), getLastRound(a[1], 'pijp'));
      const waitB = Math.max(getLastRound(b[0], 'ona'), getLastRound(b[1], 'pijp'));
      return waitA - waitB;
    });

    const round: Pair[] = [];
    const onaInRound = new Set<number>();
    const pijpInRound = new Set<number>();
    const volgendeRonde: Pair[] = [];

    for (const [o, p] of remaining) {
      if (round.length < aantalTafels && !onaInRound.has(o.positie) && !pijpInRound.has(p.positie)) {
        round.push([o, p]);
        onaInRound.add(o.positie);
        pijpInRound.add(p.positie);
      } else {
        volgendeRonde.push([o, p]);
      }
    }

    const roundIdx = rounds.length;
    for (const [o, p] of round) {
      if (!lastRound.has(o.positie)) lastRound.set(o.positie, new Map());
      if (!lastRound.has(p.positie)) lastRound.set(p.positie, new Map());
      lastRound.get(o.positie)!.set('ona', roundIdx);
      lastRound.get(p.positie)!.set('pijp', roundIdx);
    }

    rounds.push(round);
    remaining = volgendeRonde;
  }

  // Omzetten naar Wedstrijd[]
  const wedstrijden: Wedstrijd[] = [];
  for (let r = 0; r < rounds.length; r++) {
    const tijdstip = new Date(startTijd.getTime() + r * minutenPerWedstrijd * 60_000);
    for (const [o, p] of rounds[r]) {
      wedstrijden.push({ tijdstip, ona: { speler: o }, pijp: { speler: p } });
    }
  }
  return wedstrijden;
}
