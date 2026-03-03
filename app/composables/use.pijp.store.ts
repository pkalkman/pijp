export const usePijpStore = () => {
  const pouleOna = useState<Poule | null>('pijp:poule:ona', () => null);
  const poulePijp = useState<Poule | null>('pijp:poule:pijp', () => null);

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
  }

  initPoules();

  return {
    pouleOna,
    poulePijp,
  };
};
