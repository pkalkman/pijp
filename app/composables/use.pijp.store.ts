import type { PijpSettings, StandRegel, Wedstrijd } from '#shared/types';

export const usePijpStore = () => {
  const pouleOna = useState<Poule | null>('pijp:poule:ona', () => null);
  const poulePijp = useState<Poule | null>('pijp:poule:pijp', () => null);
  const wedstrijden = useState<Wedstrijd[]>('pijp:wedstrijden', () => []);
  const pijpSettings = useState<PijpSettings | null>('pijp:settings', () => null);

  const initDone = useState<boolean>('pijp:init-done', () => false);

  const stand = computed<StandRegel[]>(() => {
    const map = new Map<string, StandRegel>();
    for (const w of wedstrijden.value) {
      const onaId = w.ona.speler._id;
      const pijpId = w.pijp.speler._id;
      if (!map.has(onaId)) map.set(onaId, { speler: w.ona.speler, gespeeld: 0, caramboles: 0, beurten: 0, punten: 0 });
      if (!map.has(pijpId)) map.set(pijpId, { speler: w.pijp.speler, gespeeld: 0, caramboles: 0, beurten: 0, punten: 0 });
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
  });

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

    if (import.meta.client) {
      const eventSource = new EventSource('/api/events');

      eventSource.addEventListener('uitslag-bijgewerkt', (e) => {
        const data = JSON.parse(e.data) as { id: string; onaGemaakt?: number; pijpGemaakt?: number; beurten?: number };
        const w = wedstrijden.value.find((w) => w._id === data.id);
        if (w) {
          w.ona.gemaakt = data.onaGemaakt;
          w.pijp.gemaakt = data.pijpGemaakt;
          w.beurten = data.beurten;
        }
      });

      eventSource.addEventListener('uitslag-gewist', (e) => {
        const data = JSON.parse(e.data) as { id: string };
        const w = wedstrijden.value.find((w) => w._id === data.id);
        if (w) {
          w.ona.gemaakt = undefined;
          w.pijp.gemaakt = undefined;
          w.beurten = undefined;
        }
      });
    }
  }

  async function verwijderUitslag(wedstrijdId: string) {
    await $fetch(`/api/wedstrijden/${wedstrijdId}`, { method: 'DELETE' });
    const w = wedstrijden.value.find((w) => w._id === wedstrijdId);
    if (w) {
      w.ona.gemaakt = undefined;
      w.pijp.gemaakt = undefined;
      w.beurten = undefined;
    }
  }

  async function slaUitslagOp(wedstrijdId: string, onaGemaakt?: number, pijpGemaakt?: number, beurten?: number) {
    await $fetch(`/api/wedstrijden/${wedstrijdId}`, {
      method: 'PUT',
      body: { onaGemaakt, pijpGemaakt, beurten },
    });
    const w = wedstrijden.value.find((w) => w._id === wedstrijdId);
    if (w) {
      w.ona.gemaakt = onaGemaakt;
      w.pijp.gemaakt = pijpGemaakt;
      w.beurten = beurten;
    }
  }

  return {
    pouleOna,
    poulePijp,
    wedstrijden,
    pijpSettings,

    initStore,
    initDone,

    updateSettings,
    stand,
    genereerWedstrijden,
    slaUitslagOp,
    verwijderUitslag,
  };
};
