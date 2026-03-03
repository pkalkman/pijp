import type { PijpSettings, Wedstrijd } from '#shared/types';
import { generateWedstrijden as _generateWedstrijden } from '#shared/utils/generateWedstrijden';

export const usePijpStore = () => {
  const pouleOna = useState<Poule | null>('pijp:poule:ona', () => null);
  const poulePijp = useState<Poule | null>('pijp:poule:pijp', () => null);
  const wedstrijden = useState<Wedstrijd[]>('pijp:wedstrijden', () => []);

  const pijpSettings = useState<PijpSettings | null>('pijp:settings', () => null);

  function initPoules() {
    pouleOna.value = {
      spelers: [
        { positie: 1, naam: 'Ron IJsselstijn' },
        { positie: 2, naam: 'Gerard de Jong' },
        { positie: 3, naam: 'Wim van Wetten' },
        { positie: 4, naam: 'Henk Statz' },
        { positie: 5, naam: 'Gerard Mitgenberg' },
        { positie: 6, naam: 'Peter Kalkman' },
      ],
    };

    poulePijp.value = {
      spelers: [
        { positie: 1, naam: 'Bob de Zeeuw' },
        { positie: 2, naam: 'Paul de Vos' },
        { positie: 3, naam: 'Niels van der Vlist' },
        { positie: 4, naam: 'Danny van Leeuwen' },
        { positie: 5, naam: 'Rene van Leeuwen' },
        { positie: 6, naam: 'Koert Veninga' },
      ],
    };

    pijpSettings.value = {
      startTijd: new Date(2026, 2, 8, 12, 0, 0),
      minutenPerWedstrijd: 20,
      aantalTafels: 2
    };
  }

  function swapSpelers(poule: Ref<Poule | null>, positieA: number, positieB: number) {
    if (!poule.value) return;
    const a = poule.value.spelers.find((s) => s.positie === positieA);
    const b = poule.value.spelers.find((s) => s.positie === positieB);
    if (a && b) {
      a.positie = positieB;
      b.positie = positieA;
    }
  }

  function updateSettings(settings: PijpSettings) {
    pijpSettings.value = settings;
  }

  function genereerWedstrijden() {
    if (!pouleOna.value || !poulePijp.value || !pijpSettings.value) return;
    wedstrijden.value = _generateWedstrijden(pouleOna.value, poulePijp.value, pijpSettings.value);
  }

  initPoules();

  return {
    pouleOna,
    poulePijp,
    wedstrijden,
    pijpSettings,

    swapInPouleOna: (a: number, b: number) => swapSpelers(pouleOna, a, b),
    swapInPoulePijp: (a: number, b: number) => swapSpelers(poulePijp, a, b),
    updateSettings,
    genereerWedstrijden,
  };
};
