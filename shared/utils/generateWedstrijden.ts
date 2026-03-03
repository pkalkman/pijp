import type { PijpSettings, Poule, Speler, Wedstrijd } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Genereert een wedstrijdrooster via een 1-factorizatie van K_{n,n}.
 *
 * Alle n×n paren worden verdeeld in n perfecte matchings (elke matching
 * dekt alle Ona- en Pijp-spelers precies één keer). Elke matching vormt
 * een blok van ceil(n/aantalTafels) rondes.
 *
 * Binnen een blok kan geen speler twee keer voorkomen (perfecte matching).
 * Aan de blokgrenzen worden pairs gesorteerd zodat spelers die net gespeeld
 * hebben pas ná de eerste subronde van het volgende blok aan de beurt komen.
 * Voor k=2 en n=6 is gegarandeerd dat dit altijd lukt.
 */
export function generateWedstrijden(pouleOna: Poule, poulePijp: Poule, settings: PijpSettings): Wedstrijd[] {
  const { startTijd, minutenPerWedstrijd, aantalTafels } = settings;

  const ona = shuffle([...pouleOna.spelers]);
  const pijp = shuffle([...poulePijp.spelers]);
  const n = ona.length;

  type Pair = [Speler, Speler];

  // n perfecte matchings via cyclische constructie, volgorde geshuffeld
  const matchings: Pair[][] = shuffle(
    Array.from({ length: n }, (_, j) =>
      shuffle(Array.from({ length: n }, (__, i): Pair => [ona[i], pijp[(i + j) % n]]))
    )
  );

  const rounds: Pair[][] = [];

  // Bijhouden welke spelers in de laatste ronde van het vorige blok speelden
  let forbiddenOna = new Set<number>();
  let forbiddenPijp = new Set<number>();

  for (const matching of matchings) {
    // Pairs waarbij geen van beide spelers net gespeeld heeft → eerst plannen
    const available = matching.filter(
      ([o, p]) => !forbiddenOna.has(o.positie) && !forbiddenPijp.has(p.positie)
    );
    const rest = matching.filter(
      ([o, p]) => forbiddenOna.has(o.positie) || forbiddenPijp.has(p.positie)
    );

    // Beschikbare pairs vooraan → eerste subronde bevat geen spelers die net speelden
    const ordered = [...shuffle(available), ...shuffle(rest)];

    const blockRounds: Pair[][] = [];
    for (let r = 0; r < ordered.length; r += aantalTafels) {
      blockRounds.push(ordered.slice(r, r + aantalTafels));
    }

    rounds.push(...blockRounds);

    // Verboden spelers voor het volgende blok = spelers in de laatste subronde van dit blok
    const last = blockRounds[blockRounds.length - 1];
    forbiddenOna = new Set(last.map(([o]) => o.positie));
    forbiddenPijp = new Set(last.map(([, p]) => p.positie));
  }

  return rounds.flatMap((round, r) => {
    const tijdstip = new Date(startTijd.getTime() + r * minutenPerWedstrijd * 60_000);
    return round.map(([o, p]) => ({ tijdstip, ona: { speler: o }, pijp: { speler: p } }));
  });
}
