let ctx = null;
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

// nota com envelope ADSR simples
function note(c, freq, start, dur, vol = 0.22, type = 'square') {
  const o = c.createOscillator();
  const g = c.createGain();
  // filtro passa-baixa para deixar mais grave/encorpado
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 900;
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.setValueAtTime(vol, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function seq(notes, type = 'square') {
  try {
    const c = getCtx();
    notes.forEach(([freq, start, dur, vol]) => note(c, freq, start, dur, vol ?? 0.22, type));
  } catch { /* sem suporte a áudio */ }
}

// notas base (uma oitava abaixo do anterior)
// C2=65 D2=73 E2=82 F2=87 G2=98 A2=110 B2=123
// C3=131 D3=147 E3=165 F3=175 G3=196 A3=220 B3=247
// C4=262

export const sounds = {
  // pegar palito — bumpo seco grave
  pickup() {
    seq([[110, 0, 0.06], [165, 0.06, 0.08]], 'square');
  },

  // largar palito — click grave descendente
  place() {
    seq([[165, 0, 0.06], [110, 0.06, 0.09]], 'square');
  },

  // acertar — arpejo menor ascendente (C3-E3-G3-C4), estilo Loop Hero vitória
  correct() {
    seq([
      [131, 0,    0.10, 0.20],
      [165, 0.11, 0.10, 0.20],
      [196, 0.22, 0.10, 0.20],
      [131, 0.33, 0.06, 0.15],
      [262, 0.33, 0.22, 0.25],
    ], 'square');
  },

  // errar — descida lenta e pesada
  wrong() {
    seq([
      [165, 0,    0.12, 0.25],
      [138, 0.13, 0.12, 0.22],
      [110, 0.26, 0.20, 0.28],
    ], 'sawtooth');
  },

  // dica — dois bips graves descendentes (alerta de custo)
  hint() {
    seq([[196, 0, 0.08, 0.18], [131, 0.10, 0.12, 0.18]], 'square');
  },

  // nova partida — fanfarra grave de arranque
  newGame() {
    seq([
      [98,  0,    0.08, 0.20],
      [131, 0.09, 0.08, 0.20],
      [165, 0.18, 0.08, 0.20],
      [196, 0.27, 0.08, 0.20],
      [131, 0.36, 0.06, 0.15],
      [262, 0.36, 0.22, 0.28],
    ], 'square');
  },

  // continuar — acorde encorpado de retorno
  continue() {
    seq([
      [98,  0,    0.10, 0.18],
      [131, 0.11, 0.10, 0.20],
      [196, 0.22, 0.18, 0.22],
    ], 'square');
  },

  // menu — bip grave de navegação
  menu() {
    seq([[165, 0, 0.07, 0.18], [110, 0.08, 0.10, 0.18]], 'square');
  },
};
