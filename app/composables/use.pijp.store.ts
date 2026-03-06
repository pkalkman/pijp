import type { PijpSettings, Wedstrijd } from '#shared/types';

export const usePijpStore = () => {
  const pouleOna = useState<Poule | null>('pijp:poule:ona', () => null);
  const poulePijp = useState<Poule | null>('pijp:poule:pijp', () => null);
  const wedstrijden = useState<Wedstrijd[]>('pijp:wedstrijden', () => []);
  const pijpSettings = useState<PijpSettings | null>('pijp:settings', () => null);

  const initDone = useState<boolean>('pijp:init-done', () => false);

  function updateSettings(settings: PijpSettings) {
    pijpSettings.value = settings;
  }

  async function genereerWedstrijden() {
    const result = await $fetch<Wedstrijd[]>('/api/wedstrijden', { method: 'POST' });
    wedstrijden.value = result.map((w) => ({ ...w, tijdstip: new Date(w.tijdstip) }));
  }

  async function initStore() {
    const spelers = await $fetch<Speler[]>('/api/spelers');

    pouleOna.value = {
      naam: 'ONA',
      spelers: spelers.filter((s) => s.poule === 'ONA'),
    };
    poulePijp.value = {
      naam: 'De Pijp - N-Surance',
      spelers: spelers.filter((s) => s.poule === 'De Pijp - N-Surance'),
    };

    pijpSettings.value = await $fetch<PijpSettings>('/api/settings');

    const savedWedstrijden = await $fetch<Wedstrijd[]>('/api/wedstrijden');
    wedstrijden.value = savedWedstrijden.map((w) => ({ ...w, tijdstip: new Date(w.tijdstip) }));

    initDone.value = true;
  }

  return {
    pouleOna,
    poulePijp,
    wedstrijden,
    pijpSettings,

    initStore,
    initDone,

    updateSettings,
    genereerWedstrijden,
  };
};
