import type { PijpSettings, Wedstrijd } from '#shared/types';
import { generateWedstrijden as _generateWedstrijden } from '#shared/utils/generateWedstrijden';

export const usePijpStore = () => {
  const pouleOna = useState<Poule | null>('pijp:poule:ona', () => null);
  const poulePijp = useState<Poule | null>('pijp:poule:pijp', () => null);
  const wedstrijden = useState<Wedstrijd[]>('pijp:wedstrijden', () => []);
  const pijpSettings = useState<PijpSettings | null>('pijp:settings', () => null);

  const initDone = useState<boolean>('pijp:init-done', () => false);

  function updateSettings(settings: PijpSettings) {
    pijpSettings.value = settings;
  }

  function genereerWedstrijden() {
    if (!pouleOna.value || !poulePijp.value || !pijpSettings.value) return;
    wedstrijden.value = _generateWedstrijden(pouleOna.value, poulePijp.value, pijpSettings.value);
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
