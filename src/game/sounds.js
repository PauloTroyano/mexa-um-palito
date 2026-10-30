let ctx = null;
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

function chip(notes, type = 'square', vol = 0.18) {
  try {
    const c = getCtx();
    notes.forEach(([freq, start, dur]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, c.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.005);
      g.gain.setValueAtTime(vol, c.currentTime + start + dur - 0.01);
      g.gain.linearRampToValueAtTime(0, c.currentTime + start + dur);
      o.start(c.currentTime + start);
      o.stop(c.currentTime + start + dur + 0.01);
    });
  } catch { /* sem suporte a áudio */ }
}

export const sounds = {
  // pegar palito — blip curto pra cima
  pickup() {
    chip([[330, 0, 0.04], [440, 0.04, 0.04]]);
  },

  // largar palito — blip curto pra baixo
  place() {
    chip([[440, 0, 0.04], [330, 0.04, 0.05]]);
  },

  // acertar — fanfarra ascendente 8-bit
  correct() {
    chip([
      [262, 0,    0.08],
      [330, 0.09, 0.08],
      [392, 0.18, 0.08],
      [523, 0.27, 0.18],
      [659, 0.27, 0.18],
    ]);
  },

  // errar — descida triste 8-bit
  wrong() {
    chip([
      [330, 0,    0.08],
      [277, 0.09, 0.08],
      [220, 0.18, 0.15],
    ], 'square', 0.2);
  },

  // dica — dois bips descendentes (custa uma vida)
  hint() {
    chip([[523, 0, 0.06], [392, 0.08, 0.09]]);
  },

  // nova partida — jingle de arranque
  newGame() {
    chip([
      [262, 0,    0.07],
      [330, 0.08, 0.07],
      [392, 0.16, 0.07],
      [523, 0.24, 0.07],
      [392, 0.32, 0.07],
      [523, 0.40, 0.14],
    ]);
  },

  // continuar — acorde suave de retorno
  continue() {
    chip([
      [392, 0,    0.07],
      [494, 0.08, 0.07],
      [587, 0.16, 0.12],
    ]);
  },

  // menu — bip neutro de navegação
  menu() {
    chip([[440, 0, 0.05], [330, 0.06, 0.07]]);
  },
};
