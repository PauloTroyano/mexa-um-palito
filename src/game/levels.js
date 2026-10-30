// Cada fase tem exatamente uma solução movendo um único palito (verificado em logic.test.js).
export const LEVELS = [
  { p: '1+2=4' },
  { p: '1+5=9' },
  { p: '0+3=9' },
  { p: '0-5=4' },
  { p: '9+2-6=9', boss: 'Chefão das unidades', intro: 'Três números menores que 10 e dois sinais.' },
  { p: '3+5=10' },
  { p: '1+1=6' },
  { p: '7+1=5' },
  { p: '4-2=8' },
  { p: '39-72=87', boss: 'Chefão das dezenas', intro: 'Números menores que 100.' },
  { p: '5+3=3' },
  { p: '9+8=3' },
  { p: '3-8=17' },
  { p: '0+6=13' },
  {
    p: '19+28+23=84',
    boss: 'Chefão final',
    intro: 'Números menores que 100, três parcelas e só uma vida. Não tem segunda chance.',
    lives: 1,
  },
];

export const livesFor = (level) => LEVELS[level].lives ?? 3;
